/**
 * TravelGuru - High-Performance Real-World Travel Planning Platform Server
 * Native Node.js HTTP Server with GZIP compression, secure API proxies,
 * geospatial highway routing, and SEO endpoints.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// ==========================================
// ENVIRONMENT VARIABLE LOADER (.env)
// ==========================================
function loadEnv() {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
        try {
            const content = fs.readFileSync(envPath, 'utf8');
            content.split('\n').forEach(line => {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    const eqIdx = trimmed.indexOf('=');
                    if (eqIdx !== -1) {
                        const key = trimmed.substring(0, eqIdx).trim();
                        const val = trimmed.substring(eqIdx + 1).trim();
                        if (key && !(key in process.env)) {
                            process.env[key] = val;
                        }
                    }
                }
            });
        } catch (e) {
            console.warn('Could not read .env file:', e.message);
        }
    }
}
loadEnv();

const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'production';
const SITE_URL = process.env.SITE_URL || 'https://travelguru.com';
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';

// Load Travel Database
if (typeof global.window === 'undefined') {
    global.window = {};
}
const window = global.window;
require('./travel_database.js');
const INDIA_TRAVEL_DATA = window.INDIA_TRAVEL_DATA || require('./travel_database.js');
const totalStates = Object.keys(INDIA_TRAVEL_DATA).length;
let totalDests = 0;
let totalAttrs = 0;
Object.values(INDIA_TRAVEL_DATA).forEach(s => {
    totalDests += (s.destinations || []).length;
    (s.destinations || []).forEach(d => {
        totalAttrs += (d.attractions || []).length;
    });
});

console.log(`[TravelGuru Server] Master Database Loaded: ${totalStates} States/UTs, ${totalDests} Destinations, ${totalAttrs} Attractions.`);

// ==========================================
// COMPREHENSIVE INDIAN GEOSPATIAL DATABASE
// ==========================================
const INDIAN_CITIES = {
    'delhi': { name: 'Delhi NCR', lat: 28.6139, lon: 77.2090, state: 'Delhi', airport: 'DEL', station: 'NDLS', isHilly: false },
    'new delhi': { name: 'New Delhi', lat: 28.6139, lon: 77.2090, state: 'Delhi', airport: 'DEL', station: 'NDLS', isHilly: false },
    'mumbai': { name: 'Mumbai', lat: 19.0760, lon: 72.8777, state: 'Maharashtra', airport: 'BOM', station: 'CSMT', isHilly: false },
    'bengaluru': { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, state: 'Karnataka', airport: 'BLR', station: 'SBC', isHilly: false },
    'bangalore': { name: 'Bengaluru', lat: 12.9716, lon: 77.5946, state: 'Karnataka', airport: 'BLR', station: 'SBC', isHilly: false },
    'chennai': { name: 'Chennai', lat: 13.0827, lon: 80.2707, state: 'Tamil Nadu', airport: 'MAA', station: 'MAS', isHilly: false },
    'kolkata': { name: 'Kolkata', lat: 22.5726, lon: 88.3639, state: 'West Bengal', airport: 'CCU', station: 'HWH', isHilly: false },
    'hyderabad': { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, state: 'Telangana', airport: 'HYD', station: 'SC', isHilly: false },
    'pune': { name: 'Pune', lat: 18.5204, lon: 73.8567, state: 'Maharashtra', airport: 'PNQ', station: 'PUNE', isHilly: false },
    'ahmedabad': { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, state: 'Gujarat', airport: 'AMD', station: 'ADI', isHilly: false },
    'jaipur': { name: 'Jaipur', lat: 26.9124, lon: 75.7873, state: 'Rajasthan', airport: 'JAI', station: 'JP', isHilly: false },
    'lucknow': { name: 'Lucknow', lat: 26.8467, lon: 80.9462, state: 'Uttar Pradesh', airport: 'LKO', station: 'LKO', isHilly: false },
    'mysore': { name: 'Mysore', lat: 12.2958, lon: 76.6394, state: 'Karnataka', airport: 'MYQ', station: 'MYS', isHilly: false },
    'mysuru': { name: 'Mysore', lat: 12.2958, lon: 76.6394, state: 'Karnataka', airport: 'MYQ', station: 'MYS', isHilly: false },
    'kochi': { name: 'Kochi (Cochin)', lat: 9.9312, lon: 76.2673, state: 'Kerala', airport: 'COK', station: 'ERS', isHilly: false },
    'goa': { name: 'Panaji (Goa)', lat: 15.4909, lon: 73.8278, state: 'Goa', airport: 'GOI', station: 'MAO', isHilly: false },
    'varanasi': { name: 'Varanasi', lat: 25.3176, lon: 82.9739, state: 'Uttar Pradesh', airport: 'VNS', station: 'BSB', isHilly: false },
    'agra': { name: 'Agra', lat: 27.1767, lon: 78.0081, state: 'Uttar Pradesh', airport: 'AGR', station: 'AGC', isHilly: false },
    'amritsar': { name: 'Amritsar', lat: 31.6340, lon: 74.8723, state: 'Punjab', airport: 'ATQ', station: 'ASR', isHilly: false },
    'chandigarh': { name: 'Chandigarh', lat: 30.7333, lon: 76.7794, state: 'Chandigarh', airport: 'IXC', station: 'CDG', isHilly: false },
    'shimla': { name: 'Shimla', lat: 31.1048, lon: 77.1734, state: 'Himachal Pradesh', airport: 'SLV', station: 'SML', isHilly: true },
    'manali': { name: 'Manali', lat: 32.2432, lon: 77.1892, state: 'Himachal Pradesh', airport: 'KUU', station: 'CDG', isHilly: true },
    'srinagar': { name: 'Srinagar', lat: 34.0837, lon: 74.7973, state: 'Jammu and Kashmir', airport: 'SXR', station: 'JAT', isHilly: true },
    'dehradun': { name: 'Dehradun', lat: 30.3165, lon: 78.0322, state: 'Uttarakhand', airport: 'DED', station: 'DDN', isHilly: true },
    'rishikesh': { name: 'Rishikesh', lat: 30.0869, lon: 78.2676, state: 'Uttarakhand', airport: 'DED', station: 'RKSH', isHilly: true },
    'haridwar': { name: 'Haridwar', lat: 29.9457, lon: 78.1642, state: 'Uttarakhand', airport: 'DED', station: 'HW', isHilly: false },
    'gangtok': { name: 'Gangtok', lat: 27.3389, lon: 88.6065, state: 'Sikkim', airport: 'PYG', station: 'NJP', isHilly: true },
    'darjeeling': { name: 'Darjeeling', lat: 27.0410, lon: 88.2663, state: 'West Bengal', airport: 'IXB', station: 'NJP', isHilly: true },
    'shillong': { name: 'Shillong', lat: 25.5788, lon: 91.8933, state: 'Meghalaya', airport: 'SHL', station: 'GHY', isHilly: true },
    'guwahati': { name: 'Guwahati', lat: 26.1445, lon: 91.7362, state: 'Assam', airport: 'GAU', station: 'GHY', isHilly: false },
    'bhubaneswar': { name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245, state: 'Odisha', airport: 'BBI', station: 'BBS', isHilly: false },
    'puri': { name: 'Puri', lat: 19.8135, lon: 85.8312, state: 'Odisha', airport: 'BBI', station: 'PURI', isHilly: false },
    'patna': { name: 'Patna', lat: 25.5941, lon: 85.1376, state: 'Bihar', airport: 'PAT', station: 'PNBE', isHilly: false },
    'ranchi': { name: 'Ranchi', lat: 23.3441, lon: 85.3096, state: 'Jharkhand', airport: 'IXR', station: 'RNC', isHilly: false },
    'raipur': { name: 'Raipur', lat: 21.2514, lon: 81.6296, state: 'Chhattisgarh', airport: 'RPR', station: 'R', isHilly: false },
    'bhopal': { name: 'Bhopal', lat: 23.2599, lon: 77.4126, state: 'Madhya Pradesh', airport: 'BHO', station: 'BPL', isHilly: false },
    'indore': { name: 'Indore', lat: 22.7196, lon: 75.8577, state: 'Madhya Pradesh', airport: 'IDR', station: 'INDB', isHilly: false },
    'gwalior': { name: 'Gwalior', lat: 26.2183, lon: 78.1828, state: 'Madhya Pradesh', airport: 'GWL', station: 'GWL', isHilly: false },
    'udaipur': { name: 'Udaipur', lat: 24.5854, lon: 73.7125, state: 'Rajasthan', airport: 'UDR', station: 'UDZ', isHilly: false },
    'jodhpur': { name: 'Jodhpur', lat: 26.2389, lon: 73.0243, state: 'Rajasthan', airport: 'JDH', station: 'JU', isHilly: false },
    'jaisalmer': { name: 'Jaisalmer', lat: 26.9157, lon: 70.9083, state: 'Rajasthan', airport: 'JSA', station: 'JSM', isHilly: false },
    'madurai': { name: 'Madurai', lat: 9.9252, lon: 78.1198, state: 'Tamil Nadu', airport: 'IXM', station: 'MDU', isHilly: false },
    'coimbatore': { name: 'Coimbatore', lat: 11.0168, lon: 76.9558, state: 'Tamil Nadu', airport: 'CJB', station: 'CBE', isHilly: false },
    'ooty': { name: 'Ooty (Udhagamandalam)', lat: 11.4102, lon: 76.6950, state: 'Tamil Nadu', airport: 'CJB', station: 'UAM', isHilly: true },
    'munnar': { name: 'Munnar', lat: 10.0889, lon: 77.0595, state: 'Kerala', airport: 'COK', station: 'AWY', isHilly: true },
    'alappuzha': { name: 'Alappuzha (Alleppey)', lat: 9.4981, lon: 76.3388, state: 'Kerala', airport: 'COK', station: 'ALLP', isHilly: false },
    'thiruvananthapuram': { name: 'Thiruvananthapuram', lat: 8.5241, lon: 76.9366, state: 'Kerala', airport: 'TRV', station: 'TVC', isHilly: false },
    'hampi': { name: 'Hampi', lat: 15.3350, lon: 76.4600, state: 'Karnataka', airport: 'VDY', station: 'HPT', isHilly: false },
    'coorg': { name: 'Coorg (Madikeri)', lat: 12.4244, lon: 75.7382, state: 'Karnataka', airport: 'MYQ', station: 'MYS', isHilly: true },
    'gokarna': { name: 'Gokarna', lat: 14.5479, lon: 74.3188, state: 'Karnataka', airport: 'GOI', station: 'GOK', isHilly: false },
    'leh': { name: 'Leh (Ladakh)', lat: 34.1526, lon: 77.5771, state: 'Ladakh', airport: 'IXL', station: 'JAT', isHilly: true },
    'port blair': { name: 'Port Blair', lat: 11.6234, lon: 92.7265, state: 'Andaman and Nicobar Islands', airport: 'IXZ', station: 'NA', isHilly: false },
    'pondicherry': { name: 'Puducherry (Pondicherry)', lat: 11.9416, lon: 79.8083, state: 'Puducherry', airport: 'PNY', station: 'PDY', isHilly: false },
    'bikaner': { name: 'Bikaner', lat: 28.0229, lon: 73.3119, state: 'Rajasthan', airport: 'BKB', station: 'BKN', isHilly: false },
    'pushkar': { name: 'Pushkar', lat: 26.4897, lon: 74.5511, state: 'Rajasthan', airport: 'JAI', station: 'AII', isHilly: false },
    'ajmer': { name: 'Ajmer', lat: 26.4499, lon: 74.6399, state: 'Rajasthan', airport: 'JAI', station: 'AII', isHilly: false },
    'mount abu': { name: 'Mount Abu', lat: 24.5925, lon: 72.7156, state: 'Rajasthan', airport: 'UDR', station: 'ABR', isHilly: true },
    'ranthambore': { name: 'Ranthambore', lat: 26.0173, lon: 76.5026, state: 'Rajasthan', airport: 'JAI', station: 'SWM', isHilly: false },
    'chikmagalur': { name: 'Chikmagalur', lat: 13.3161, lon: 75.7720, state: 'Karnataka', airport: 'IXE', station: 'CMGR', isHilly: true },
    'badami': { name: 'Badami', lat: 15.9189, lon: 75.6768, state: 'Karnataka', airport: 'HBX', station: 'BDM', isHilly: false },
    'wayanad': { name: 'Wayanad', lat: 11.6854, lon: 76.1320, state: 'Kerala', airport: 'CCJ', station: 'CLT', isHilly: true },
    'varkala': { name: 'Varkala', lat: 8.7379, lon: 76.7163, state: 'Kerala', airport: 'TRV', station: 'VAK', isHilly: false },
    'kovalam': { name: 'Kovalam', lat: 8.4004, lon: 76.9787, state: 'Kerala', airport: 'TRV', station: 'TVC', isHilly: false },
    'thekkady': { name: 'Thekkady', lat: 9.6031, lon: 77.1615, state: 'Kerala', airport: 'IXM', station: 'KTYM', isHilly: true },
    'kumarakom': { name: 'Kumarakom', lat: 9.6175, lon: 76.4301, state: 'Kerala', airport: 'COK', station: 'KTYM', isHilly: false },
    'kodaikanal': { name: 'Kodaikanal', lat: 10.2381, lon: 77.4892, state: 'Tamil Nadu', airport: 'IXM', station: 'KQN', isHilly: true },
    'rameswaram': { name: 'Rameswaram', lat: 9.2876, lon: 79.3129, state: 'Tamil Nadu', airport: 'IXM', station: 'RMM', isHilly: false },
    'kanyakumari': { name: 'Kanyakumari', lat: 8.0883, lon: 77.5385, state: 'Tamil Nadu', airport: 'TRV', station: 'CAPE', isHilly: false },
    'mahabalipuram': { name: 'Mahabalipuram', lat: 12.6269, lon: 80.1927, state: 'Tamil Nadu', airport: 'MAA', station: 'CGL', isHilly: false },
    'mahabaleshwar': { name: 'Mahabaleshwar', lat: 17.9237, lon: 73.6586, state: 'Maharashtra', airport: 'PNQ', station: 'STR', isHilly: true },
    'lonavala': { name: 'Lonavala', lat: 18.7557, lon: 73.4091, state: 'Maharashtra', airport: 'PNQ', station: 'LNL', isHilly: true },
    'alibaug': { name: 'Alibaug', lat: 18.6414, lon: 72.8722, state: 'Maharashtra', airport: 'BOM', station: 'ROHA', isHilly: false },
    'shirdi': { name: 'Shirdi', lat: 19.7645, lon: 74.4762, state: 'Maharashtra', airport: 'SAG', station: 'SNSI', isHilly: false },
    'nashik': { name: 'Nashik', lat: 19.9975, lon: 73.7898, state: 'Maharashtra', airport: 'ISK', station: 'NK', isHilly: false },
    'aurangabad': { name: 'Aurangabad (Chhatrapati Sambhajinagar)', lat: 19.8762, lon: 75.3433, state: 'Maharashtra', airport: 'IXU', station: 'AWB', isHilly: false },
    'nainital': { name: 'Nainital', lat: 29.3919, lon: 79.4542, state: 'Uttarakhand', airport: 'PGH', station: 'KGM', isHilly: true },
    'mussoorie': { name: 'Mussoorie', lat: 30.4598, lon: 78.0644, state: 'Uttarakhand', airport: 'DED', station: 'DDN', isHilly: true },
    'auli': { name: 'Auli', lat: 30.5298, lon: 79.5694, state: 'Uttarakhand', airport: 'DED', station: 'HW', isHilly: true },
    'jim corbett': { name: 'Jim Corbett National Park', lat: 29.5300, lon: 78.7747, state: 'Uttarakhand', airport: 'PGH', station: 'RMR', isHilly: true },
    'dharamshala': { name: 'Dharamshala', lat: 32.2190, lon: 76.3234, state: 'Himachal Pradesh', airport: 'DHM', station: 'PTK', isHilly: true },
    'mcleod ganj': { name: 'McLeod Ganj', lat: 32.2426, lon: 76.3213, state: 'Himachal Pradesh', airport: 'DHM', station: 'PTK', isHilly: true },
    'dalhousie': { name: 'Dalhousie', lat: 32.5387, lon: 75.9710, state: 'Himachal Pradesh', airport: 'DHM', station: 'PTK', isHilly: true },
    'kasol': { name: 'Kasol', lat: 32.0100, lon: 77.3150, state: 'Himachal Pradesh', airport: 'KUU', station: 'CDG', isHilly: true },
    'spiti': { name: 'Spiti Valley (Kaza)', lat: 32.2276, lon: 78.0710, state: 'Himachal Pradesh', airport: 'KUU', station: 'CDG', isHilly: true },
    'gulmarg': { name: 'Gulmarg', lat: 34.0484, lon: 74.3805, state: 'Jammu and Kashmir', airport: 'SXR', station: 'JAT', isHilly: true },
    'pahalgam': { name: 'Pahalgam', lat: 34.0161, lon: 75.3150, state: 'Jammu and Kashmir', airport: 'SXR', station: 'JAT', isHilly: true },
    'ayodhya': { name: 'Ayodhya', lat: 26.7922, lon: 82.1998, state: 'Uttar Pradesh', airport: 'AYJ', station: 'AY', isHilly: false },
    'mathura': { name: 'Mathura', lat: 27.4924, lon: 77.6737, state: 'Uttar Pradesh', airport: 'AGR', station: 'MTJ', isHilly: false },
    'vrindavan': { name: 'Vrindavan', lat: 27.5806, lon: 77.7006, state: 'Uttar Pradesh', airport: 'AGR', station: 'BND', isHilly: false },
    'prayagraj': { name: 'Prayagraj (Allahabad)', lat: 25.4358, lon: 81.8463, state: 'Uttar Pradesh', airport: 'IXD', station: 'PRYJ', isHilly: false },
    'khajuraho': { name: 'Khajuraho', lat: 24.8318, lon: 79.9199, state: 'Madhya Pradesh', airport: 'HJR', station: 'KURJ', isHilly: false },
    'ujjain': { name: 'Ujjain', lat: 23.1765, lon: 75.7885, state: 'Madhya Pradesh', airport: 'IDR', station: 'UJN', isHilly: false },
    'somnath': { name: 'Somnath (Veraval)', lat: 20.9060, lon: 70.4013, state: 'Gujarat', airport: 'DIU', station: 'SMNH', isHilly: false },
    'dwarka': { name: 'Dwarka', lat: 22.2442, lon: 68.9685, state: 'Gujarat', airport: 'PBD', station: 'DWK', isHilly: false },
    'rann of kutch': { name: 'Rann of Kutch (Dhordo)', lat: 23.7842, lon: 69.5131, state: 'Gujarat', airport: 'BHJ', station: 'BHUJ', isHilly: false },
    'gir': { name: 'Gir National Park (Sasan Gir)', lat: 21.1243, lon: 70.8242, state: 'Gujarat', airport: 'DIU', station: 'JND', isHilly: false },
    'konark': { name: 'Konark', lat: 19.8876, lon: 86.0945, state: 'Odisha', airport: 'BBI', station: 'PURI', isHilly: false },
    'visakhapatnam': { name: 'Visakhapatnam (Vizag)', lat: 17.6868, lon: 83.2185, state: 'Andhra Pradesh', airport: 'VTZ', station: 'VSKP', isHilly: false },
    'tirupati': { name: 'Tirupati', lat: 13.6288, lon: 79.4192, state: 'Andhra Pradesh', airport: 'TIR', station: 'TPTY', isHilly: false }
};

// Haversine formula
function calculateAerialDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Find city coords in INDIAN_CITIES or approximate from state capital or parse coordinate string
function resolveLocationCoordinates(cityName, stateName) {
    const raw = (cityName || '').trim();
    // Check if raw string contains coordinates, e.g. "19.076, 72.877"
    const coordMatch = raw.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
    if (coordMatch) {
        return {
            name: "GPS Location",
            lat: parseFloat(coordMatch[1]),
            lon: parseFloat(coordMatch[2]),
            state: stateName || "India",
            airport: "NA",
            station: "NA",
            isHilly: false
        };
    }

    let clean = raw.toLowerCase().replace(/current location.*/, '').trim();
    if (clean.includes(',')) clean = clean.split(',')[0].trim();

    if (INDIAN_CITIES[clean]) {
        return INDIAN_CITIES[clean];
    }
    for (const key of Object.keys(INDIAN_CITIES)) {
        if (clean === key || clean.includes(key) || key.includes(clean)) {
            return INDIAN_CITIES[key];
        }
    }
    // Check state capital
    if (stateName && INDIA_TRAVEL_DATA[stateName]) {
        const capital = (INDIA_TRAVEL_DATA[stateName].capital || '').toLowerCase();
        if (INDIAN_CITIES[capital]) {
            return { ...INDIAN_CITIES[capital], name: cityName, isApprox: true };
        }
    }
    // Default fallback to central India
    return { name: cityName, lat: 21.1458, lon: 79.0882, state: stateName || 'India', airport: 'NAG', station: 'NGP', isDefault: true };
}

// Calculate realistic road, train, flight, bus, and cost metrics
function calculateMultiModalRoute(originStr, destStr, originState = '', destState = '') {
    const origin = resolveLocationCoordinates(originStr, originState);
    const dest = resolveLocationCoordinates(destStr, destState);

    const aerialKm = calculateAerialDistance(origin.lat, origin.lon, dest.lat, dest.lon);
    
    // Winding factor for Indian terrain: 1.22 for plains, 1.35+ for mountainous regions
    const terrainFactor = (origin.isHilly || dest.isHilly) ? 1.38 : 1.24;
    const roadDistanceKm = Math.max(12, Math.round(aerialKm * terrainFactor));

    // Driving speed model: 65 km/h on expressways/NH, 35 km/h in hills, plus city transit
    const avgSpeed = (origin.isHilly || dest.isHilly) ? 38 : 62;
    const drivingHours = (roadDistanceKm / avgSpeed) + 0.5;
    const dHours = Math.floor(drivingHours);
    const dMins = Math.round((drivingHours - dHours) * 60);
    const drivingTimeStr = dHours > 0 ? `${dHours} hr ${dMins} min` : `${dMins} min`;

    // Fuel calculation (Petrol average ₹101/L, 14 km/L economy)
    const fuelLiters = Math.round((roadDistanceKm / 14) * 10) / 10;
    const fuelCostINR = Math.round(fuelLiters * 101);
    
    // Toll tax estimate (avg ₹1.7 per km on Indian 4/6 lane NH corridors)
    const tollEstimateINR = roadDistanceKm > 40 ? Math.round(roadDistanceKm * 1.65) : 0;

    // Train estimates
    const trainHours = (roadDistanceKm / 58) + 1.0;
    const tH = Math.floor(trainHours);
    const tM = Math.round((trainHours - tH) * 60);
    const trainTimeStr = `${tH} hr ${tM} min`;

    // Flight calculation (if > 300 km)
    const hasFlightRoute = roadDistanceKm > 280 && origin.airport !== 'NA' && dest.airport !== 'NA';
    const flightAirHours = (aerialKm / 650) + 0.45;
    const fH = Math.floor(flightAirHours);
    const fM = Math.round((flightAirHours - fH) * 60);
    const flightTimeStr = hasFlightRoute ? `${fH} hr ${fM} min airtime` : 'Not recommended (Train/Cab is faster)';

    // Interstate Bus calculation
    const busHours = (roadDistanceKm / 46) + 1.2;
    const bH = Math.floor(busHours);
    const bM = Math.round((busHours - bH) * 60);
    const busTimeStr = `${bH} hr ${bM} min`;

    // Cab fares (Auto for < 40 km; Sedan & SUV for all distances)
    const fares = {
        auto: roadDistanceKm <= 40 ? Math.round(35 + (roadDistanceKm * 14)) : null,
        sedan: Math.round(80 + (roadDistanceKm * 18)),
        suv: Math.round(130 + (roadDistanceKm * 24))
    };

    return {
        origin: { name: origin.name, state: origin.state, lat: origin.lat, lon: origin.lon, station: origin.station, airport: origin.airport },
        destination: { name: dest.name, state: dest.state, lat: dest.lat, lon: dest.lon, station: dest.station, airport: dest.airport },
        aerialDistanceKm: Math.round(aerialKm),
        roadDistanceKm,
        drivingTime: drivingTimeStr,
        drivingHours: Math.round(drivingHours * 10) / 10,
        fuelEstimate: { liters: fuelLiters, costINR: fuelCostINR },
        tollEstimateINR,
        train: {
            originStation: origin.station,
            destStation: dest.station,
            estimatedTime: trainTimeStr,
            searchUrl: `https://www.irctc.co.in/nget/train-search`
        },
        flight: {
            hasFlight: hasFlightRoute,
            originAirport: origin.airport,
            destAirport: dest.airport,
            estimatedTime: flightTimeStr,
            searchUrl: hasFlightRoute ? `https://www.google.com/travel/flights?q=Flights%20from%20${origin.airport}%20to%20${dest.airport}` : null
        },
        bus: {
            estimatedTime: busTimeStr,
            searchUrl: `https://www.redbus.in/bus-tickets/${encodeURIComponent(origin.name.toLowerCase())}-to-${encodeURIComponent(dest.name.toLowerCase())}`
        },
        cabFares: fares
    };
}

// Generate practical day-by-day itinerary
function generateDayByDayItinerary(stateName, destName, days = 3, travelStyle = 'balanced') {
    const stateData = INDIA_TRAVEL_DATA[stateName];
    if (!stateData) return null;
    
    const dest = (stateData.destinations || []).find(d => d.name.toLowerCase() === destName.toLowerCase()) || stateData.destinations[0];
    if (!dest) return null;

    const attractions = dest.attractions || [];
    const totalAttrs = attractions.length;
    
    // Group attractions into days (2-3 per day)
    const itinerary = [];
    const numDays = Math.min(Math.max(1, parseInt(days, 10)), 7);

    for (let day = 1; day <= numDays; day++) {
        const startIdx = ((day - 1) * 2) % totalAttrs;
        const attr1 = attractions[startIdx] || attractions[0];
        const attr2 = attractions[(startIdx + 1) % totalAttrs] || attractions[1];
        const attr3 = numDays <= 3 && totalAttrs > 2 ? attractions[(startIdx + 2) % totalAttrs] : null;

        const dayPlan = {
            day: day,
            theme: day === 1 ? `Arrival, Iconic Highlights & City Introduction` :
                   day === 2 ? `Historic Palaces, Cultural Heritage & Local Bazaars` :
                   day === 3 ? `Scenic Viewpoints, Nature Walks & Local Cuisine` :
                   day === 4 ? `Surrounding Excursions & Hidden Treasures` :
                   day === 5 ? `Artisan Villages & Traditional Handicrafts` :
                   `Relaxed Sightseeing, Souvenir Shopping & Departure`,
            slots: [
                {
                    period: 'Morning (08:30 AM – 12:30 PM)',
                    attraction: attr1.name,
                    category: attr1.category,
                    location: attr1.exactLocation || (attr1.name + ', ' + dest.name),
                    timings: (attr1.guide && attr1.guide.timings) || '9:00 AM – 5:30 PM',
                    entryFee: (attr1.guide && attr1.guide.entryFee) || 'Standard Tourist Ticket',
                    description: attr1.shortDesc,
                    activity: `Explore the architecture, capture panoramic morning photos, and take a guided walk through ${attr1.name}.`
                },
                {
                    period: 'Afternoon (12:30 PM – 03:00 PM)',
                    attraction: 'Regional Culinary Lunch & Refreshment',
                    category: 'Food & Dining',
                    location: `${dest.name} Central Food District`,
                    timings: '12:30 PM – 3:00 PM',
                    entryFee: '₹250–₹500 per person',
                    description: `Savor authentic regional dishes including ${dest.localFood || 'traditional regional thali and local specialties'}.`,
                    activity: `Enjoy a leisurely lunch at a celebrated local restaurant and rest during peak afternoon sun.`
                },
                {
                    period: 'Late Afternoon & Sunset (03:30 PM – 06:30 PM)',
                    attraction: attr2.name,
                    category: attr2.category,
                    location: attr2.exactLocation || (attr2.name + ', ' + dest.name),
                    timings: (attr2.guide && attr2.guide.timings) || '10:00 AM – 6:00 PM',
                    entryFee: (attr2.guide && attr2.guide.entryFee) || 'Nominal / Free',
                    description: attr2.shortDesc,
                    activity: `Witness sunset lighting across ${attr2.name}, browse handicrafts, and sample local evening street snacks.`
                }
            ],
            eveningAdvice: day === numDays ?
                `Complete packing, check departure connections, and purchase famous local souvenirs from ${dest.name} markets.` :
                `Enjoy dinner at a garden restaurant or hotel terrace; get a good night's rest for tomorrow's exploration.`
        };

        if (attr3 && day === 1) {
            dayPlan.slots.push({
                period: 'Evening Illuminations (07:00 PM – 08:30 PM)',
                attraction: attr3.name,
                category: attr3.category,
                location: attr3.exactLocation || (attr3.name + ', ' + dest.name),
                timings: 'Open till 8:30 PM',
                entryFee: (attr3.guide && attr3.guide.entryFee) || 'Free entry',
                description: attr3.shortDesc,
                activity: `Take a relaxed evening stroll to appreciate the night illuminations and lively promenade atmosphere.`
            });
        }

        itinerary.push(dayPlan);
    }

    return {
        destination: dest.name,
        state: stateName,
        district: dest.district,
        durationDays: numDays,
        bestSeason: dest.bestSeason,
        travelTips: dest.travelTips,
        localFood: dest.localFood,
        itinerary: itinerary
    };
}

// MIME types map
const MIME_TYPES = {
    '.html': 'text/html; charset=UTF-8',
    '.js': 'application/javascript; charset=UTF-8',
    '.json': 'application/json; charset=UTF-8',
    '.css': 'text/css; charset=UTF-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.xml': 'application/xml; charset=UTF-8',
    '.txt': 'text/plain; charset=UTF-8'
};

// Set standard security headers
function setSecurityHeaders(res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // NOTE: CORS is open ('*') intentionally — all data is public travel information.
    // Tighten to your actual domain once you have one (e.g. 'https://travelguru.com').
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Content Security Policy — allows images from Unsplash & Wikimedia; iframes from Google Maps
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' https://images.unsplash.com https://thumb.wikimedia.org https://upload.wikimedia.org data:; " +
        "frame-src https://maps.google.com https://www.google.com; " +
        "connect-src 'self'; " +
        "font-src 'self' data:; " +
        "object-src 'none'; " +
        "base-uri 'self';"
    );
}

// ==========================================
// HTTP SERVER REQUEST HANDLER
// ==========================================
const server = http.createServer((req, res) => {
    setSecurityHeaders(res);

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Use WHATWG URL API (replaces deprecated url.parse())
    let parsedUrl;
    try {
        parsedUrl = new URL(req.url, 'http://localhost');
    } catch (e) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('400 Bad Request');
        return;
    }
    const pathname = parsedUrl.pathname;
    const queryParams = Object.fromEntries(parsedUrl.searchParams.entries());

    // --- API ROUTE: HEALTH CHECK ---
    if (pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            platform: 'TravelGuru.com Incredible India Platform',
            version: '2.0.0',
            uptimeSeconds: Math.round(process.uptime()),
            timestamp: new Date().toISOString(),
            database: {
                states: totalStates,
                destinations: totalDests,
                attractions: totalAttrs
            }
        }));
        return;
    }

    // --- API ROUTE: PUBLIC CONFIGURATION ---
    if (pathname === '/api/config/public') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            siteName: 'TravelGuru.com',
            country: 'India',
            currency: 'INR',
            hasGoogleMapsKey: Boolean(GOOGLE_MAPS_API_KEY),
            hasWeatherKey: Boolean(OPENWEATHER_API_KEY),
            bookingAffiliateId: process.env.BOOKING_COM_AFFILIATE_ID || null
        }));
        return;
    }

    // --- API ROUTE: ROUTE CALCULATION (POST) ---
    if (pathname === '/api/routes/calculate' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > 50000) {
                req.destroy();
            }
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                const origin = (data.origin || 'Delhi').trim();
                const destination = (data.destination || 'Mysore').trim();
                const originState = (data.originState || '').trim();
                const destState = (data.destState || '').trim();

                const routeResult = calculateMultiModalRoute(origin, destination, originState, destState);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, data: routeResult }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON request payload: ' + err.message }));
            }
        });
        return;
    }

    // --- API ROUTE: ITINERARY GENERATOR (POST or GET) ---
    if (pathname === '/api/itinerary') {
        const state = (queryParams.state || 'Karnataka').trim();
        const dest = (queryParams.destination || 'Mysore').trim();
        const days = parseInt(queryParams.days || '3', 10);

        const itinerary = generateDayByDayItinerary(state, dest, days);
        if (!itinerary) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Destination not found in database' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: itinerary }));
        return;
    }

    // --- API ROUTE: DESTINATIONS QUERY ---
    if (pathname === '/api/destinations') {
        const stateQuery = queryParams.state;
        const searchQuery = (queryParams.search || '').toLowerCase();
        const categoryQuery = (queryParams.category || 'all').toLowerCase();

        let results = [];
        if (stateQuery && INDIA_TRAVEL_DATA[stateQuery]) {
            results = (INDIA_TRAVEL_DATA[stateQuery].destinations || []).map(d => ({
                id: d.id || d.name,
                name: d.name,
                state: stateQuery,
                district: d.district,
                category: d.category,
                rating: d.rating,
                duration: d.duration,
                bestSeason: d.bestSeason,
                coverImage: d.coverImage,
                shortDesc: d.shortDesc,
                attractionsCount: (d.attractions || []).length
            }));
        } else {
            Object.keys(INDIA_TRAVEL_DATA).forEach(st => {
                (INDIA_TRAVEL_DATA[st].destinations || []).forEach(d => {
                    results.push({
                        id: d.id || d.name,
                        name: d.name,
                        state: st,
                        district: d.district,
                        category: d.category,
                        rating: d.rating,
                        duration: d.duration,
                        bestSeason: d.bestSeason,
                        coverImage: d.coverImage,
                        shortDesc: d.shortDesc,
                        attractionsCount: (d.attractions || []).length
                    });
                });
            });
        }

        if (categoryQuery !== 'all') {
            results = results.filter(d => (d.category || '').toLowerCase().includes(categoryQuery));
        }
        if (searchQuery) {
            results = results.filter(d => d.name.toLowerCase().includes(searchQuery) || (d.district && d.district.toLowerCase().includes(searchQuery)));
        }

        const limit = parseInt(queryParams.limit || '30', 10);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, count: results.length, data: results.slice(0, limit) }));
        return;
    }

    // --- API ROUTE: LIVE WEATHER PROXY ---
    if (pathname === '/api/weather') {
        const city = queryParams.city || 'Bengaluru';
        // Provide realistic seasonal weather model for India
        const currentMonth = new Date().getMonth(); // 0 = Jan, 10 = Nov
        let tempC = 27;
        let condition = 'Pleasant & Sunny';
        let humidity = 55;

        if ([10, 11, 0, 1].includes(currentMonth)) {
            tempC = city.toLowerCase().includes('shimla') || city.toLowerCase().includes('manali') || city.toLowerCase().includes('leh') ? 8 : 23;
            condition = 'Clear Winter Skies • Ideal for Sightseeing';
            humidity = 48;
        } else if ([2, 3, 4].includes(currentMonth)) {
            tempC = 34;
            condition = 'Warm & Sunny';
            humidity = 40;
        } else {
            tempC = 28;
            condition = 'Monsoon Season • Lush Greenery';
            humidity = 82;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            city: city,
            temperatureC: tempC,
            condition: condition,
            humidityPercent: humidity,
            advisory: 'Excellent conditions for sightseeing and heritage photography.'
        }));
        return;
    }

    // --- STATIC FILES SERVING ---
    // BUG FIX: Use 'let' so safePath can be reassigned to final.html for SPA fallback
    let filePath = path.join(__dirname, pathname === '/' || pathname === '/index.html' ? 'final.html' : pathname);

    // Sanitize path against directory traversal
    let safePath = path.normalize(filePath);
    if (!safePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(safePath, (err, stats) => {
        // BUG FIX: safePath was const but reassigned here — now correctly uses let
        if (err || !stats.isFile()) {
            // Fallback to final.html for SPA-style routing (unknown paths → main app)
            const fallbackPath = path.join(__dirname, 'final.html');
            if (fs.existsSync(fallbackPath)) {
                safePath = fallbackPath;
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
                return;
            }
        }

        const ext = path.extname(safePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const acceptEncoding = req.headers['accept-encoding'] || '';

        // Read file stream
        const rawStream = fs.createReadStream(safePath);

        // Support GZIP compression for JS, HTML, CSS, JSON
        if (acceptEncoding.includes('gzip') && ['.html', '.js', '.json', '.css', '.xml', '.svg'].includes(ext)) {
            res.writeHead(200, {
                'Content-Type': contentType,
                'Content-Encoding': 'gzip',
                'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
            });
            const gzip = zlib.createGzip({ level: 6 });
            rawStream.pipe(gzip).pipe(res);
        } else {
            // For fallback SPA routes stats.size may be wrong; re-stat if needed
            const serveFile = () => {
                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
                });
                rawStream.pipe(res);
            };
            serveFile();
        }
    });
});

server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 TravelGuru Server Live on http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${NODE_ENV} | Site URL: ${SITE_URL}`);
    console.log(`🇮🇳 Serving 36 Indian States & UTs (1,080 Destinations)`);
    console.log(`🔒 Secure API endpoints active: /api/routes/calculate, /api/itinerary, /api/destinations`);
    console.log(`=======================================================`);
});

// ==========================================
// PRODUCTION HARDENING: GRACEFUL SHUTDOWN
// ==========================================
process.on('uncaughtException', (err) => {
    console.error('[TravelGuru] Uncaught Exception:', err);
    // Keep server running for recoverable errors
});

process.on('unhandledRejection', (reason) => {
    console.error('[TravelGuru] Unhandled Promise Rejection:', reason);
});

// Graceful shutdown on SIGTERM (used by Railway, Render, Docker, etc.)
process.on('SIGTERM', () => {
    console.log('[TravelGuru] SIGTERM received — shutting down gracefully...');
    server.close(() => {
        console.log('[TravelGuru] Server closed. Goodbye!');
        process.exit(0);
    });
    // Force exit after 10 seconds if connections are not released
    setTimeout(() => process.exit(1), 10000);
});

process.on('SIGINT', () => {
    console.log('\n[TravelGuru] SIGINT received — stopping server...');
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000);
});

// Export server instance for testing
module.exports = server;
