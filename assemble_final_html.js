/**
 * Complete Assembly Script:
 * Combines markup, styling, and full client-side logic to produce final.html
 */

const fs = require('fs');

console.log("Reading generated markup...");
const markup = fs.readFileSync('generated_markup.html', 'utf8');

// Build the complete JavaScript application code
const jsCode = `
<script>
// ==========================================
// APPLICATION GLOBAL STATE
// ==========================================
let currentSelectedState = "Karnataka";
let currentSelectedDestination = null;
let currentSelectedCategory = "all";
let currentSelectedAttraction = null;
let currentRegionFilter = "all";
let currentSortOption = "rank";
let currentPlannerMode = "car";
let currentFoodTag = "all";
let currentTransportTab = "trains";
let pickupLatitude = null;
let pickupLongitude = null;
let rideDistanceKm = 8.5;

// ==========================================
// REGION DEFINITIONS ACROSS INDIA (36 STATES & UTs)
// ==========================================
const REGIONS_DATA = {
    north: ["Delhi", "Himachal Pradesh", "Jammu and Kashmir", "Ladakh", "Punjab", "Rajasthan", "Uttarakhand", "Uttar Pradesh", "Chandigarh", "Haryana"],
    south: ["Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu", "Telangana", "Puducherry", "Lakshadweep"],
    west: ["Goa", "Gujarat", "Maharashtra", "Dadra and Nagar Haveli and Daman and Diu"],
    east: ["Bihar", "Chhattisgarh", "Jharkhand", "Madhya Pradesh", "Odisha", "West Bengal"],
    northeast: ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"],
    ut: ["Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"]
};

// ==========================================
// INDIAN CITIES GEOSPATIAL & ROUTING MATRIX
// ==========================================
const INDIAN_CITIES_COORDS = {
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
    'udaipur': { name: 'Udaipur', lat: 24.5854, lon: 73.7125, state: 'Rajasthan', airport: 'UDR', station: 'UDZ', isHilly: false },
    'jodhpur': { name: 'Jodhpur', lat: 26.2389, lon: 73.0243, state: 'Rajasthan', airport: 'JDH', station: 'JU', isHilly: false },
    'madurai': { name: 'Madurai', lat: 9.9252, lon: 78.1198, state: 'Tamil Nadu', airport: 'IXM', station: 'MDU', isHilly: false },
    'coimbatore': { name: 'Coimbatore', lat: 11.0168, lon: 76.9558, state: 'Tamil Nadu', airport: 'CJB', station: 'CBE', isHilly: false },
    'ooty': { name: 'Ooty (Udhagamandalam)', lat: 11.4102, lon: 76.6950, state: 'Tamil Nadu', airport: 'CJB', station: 'UAM', isHilly: true },
    'munnar': { name: 'Munnar', lat: 10.0889, lon: 77.0595, state: 'Kerala', airport: 'COK', station: 'AWY', isHilly: true },
    'alappuzha': { name: 'Alappuzha (Alleppey)', lat: 9.4981, lon: 76.3388, state: 'Kerala', airport: 'COK', station: 'ALLP', isHilly: false },
    'leh': { name: 'Leh (Ladakh)', lat: 34.1526, lon: 77.5771, state: 'Ladakh', airport: 'IXL', station: 'JAT', isHilly: true },
    'port blair': { name: 'Port Blair', lat: 11.6234, lon: 92.7265, state: 'Andaman and Nicobar Islands', airport: 'IXZ', station: 'NA', isHilly: false },
    'pondicherry': { name: 'Puducherry (Pondicherry)', lat: 11.9416, lon: 79.8083, state: 'Puducherry', airport: 'PNY', station: 'PDY', isHilly: false }
};

// ==========================================
// REGIONAL FOOD & DINING DATABASE
// ==========================================
const REGIONAL_FOOD_SPECIALTIES = {
    "Karnataka": "Mysore Pak, Mysore Masala Dosa, Bisi Bele Bath, Neer Dosa, Mangalorean Fish Curry, Filter Coffee, Ragi Mudde, Dharwad Peda.",
    "Rajasthan": "Dal Baati Churma, Pyaaz Kachori, Laal Maas, Ker Sangri, Ghevar, Mawa Kachori, Mirchi Vada, Gatte ki Sabzi.",
    "Maharashtra": "Vada Pav, Pav Bhaji, Misal Pav, Puran Poli, Modak, Kolhapuri Mutton, Kanda Poha, Sabudana Khichdi.",
    "Delhi": "Chole Bhature, Butter Chicken, Paranthas (Chandni Chowk), Golgappe, Nihari, Dahi Bhalla, Kulfi Falooda, Chaat.",
    "Uttar Pradesh": "Tunday Kababi, Awadhi Dum Biryani, Banarasi Paan & Tamatar Chaat, Bedmi Puri, Malaiyo, Peda, Bedmi Kachori.",
    "Kerala": "Appam with Ishtu, Kerala Prawn Curry, Karimeen Pollichathu, Malabar Biryani, Puttu & Kadala, Payasam, Banana Chips.",
    "Tamil Nadu": "Chettinad Chicken, Crispy Medu Vada, Sambar Idli, Pongal, Kumbakonam Filter Coffee, Jigarthanda, Dindigul Biryani.",
    "West Bengal": "Macher Jhol, Kosha Mangsho, Kolkata Biryani with Egg & Potato, Spongy Roshogolla, Sandesh, Mishti Doi, Puchka.",
    "Himachal Pradesh": "Dham Traditional Feast, Siddu with Ghee, Chha Gosht, Babru, Kullu Trout Fish, Madra, Apple Crumble.",
    "Goa": "Goan Fish Curry with Rice, Pork Vindaloo, Chicken Xacuti, Bebinca, Prawn Balchão, Feni, Warm Poee Bread.",
    "Punjab": "Makki di Roti & Sarson da Saag, Amritsari Kulcha, Butter Chicken, Dal Makhani, Creamy Malai Lassi, Pinni.",
    "Gujarat": "Dhokla, Thepla, Khandvi, Undhiyu, Gujarati Thali, Fafda Jalebi, Handvo, Dal Dhokli.",
    "Odisha": "Dalma, Chhena Poda, Puri Khaja, Macha Ghanta, Rasabali, Jagannath Mahaprasad Abadha.",
    "Telangana": "Hyderabadi Dum Biryani, Mirchi Ka Salan, Haleem, Double Ka Meetha, Qubani Ka Meetha, Irani Chai.",
    "Jammu and Kashmir": "Rogan Josh, Kashmiri Wazwan, Kahwa Tea with Saffron & Almonds, Modur Pulao, Yakhni, Dum Aloo.",
    "Ladakh": "Steaming Thukpa, Tibetan Momos, Gur Gur Butter Tea, Skyu Pasta Stew, Tingmo Steamed Bread, Apricot Jam.",
    "Uttarakhand": "Kafuli, Phaanu, Aloo ke Gutke, Bal Mithai from Almora, Singodi, Gahat ki Dal, Chainsoo.",
    "Assam": "Khaar, Masor Tenga (Tangy Fish Curry), Duck Curry with White Gourd, Pitha Sweets, Assam Orthodox Black Tea.",
    "Sikkim": "Steamed Pork & Veg Momos, Thukpa Noodle Soup, Gundruk Fermented Greens, Sel Roti, Phagshapa.",
    "Bihar": "Litti Chokha with Sattu & Desi Ghee, Bihari Kebab, Sattu Paratha, Thekua, Silao Ka Khaja.",
    "Madhya Pradesh": "Poha Jalebi, Bhutte Ka Kees, Dal Bafla, Mawa Bati, Malpua, Seekh Kebabs.",
    "Andhra Pradesh": "Gongura Mutton/Pachadi, Spicy Andhra Biryani, Pulihora Tamarind Rice, Royyala Iguru Prawns, Pootharekulu."
};

const CURATED_RESTAURANTS = {
    "Mysore": [
        { name: "Hotel RRR Mysore", cuisine: "Andhra & Mysore Non-Veg", tags: ["heritage"], cost: "₹400 for two", timing: "11:30 AM – 4:00 PM & 7:00 PM – 10:30 PM", dish: "Iconic Mysore Mutton Biryani & Chilli Chicken on Banana Leaf", address: "Gandhi Square, Near Clock Tower, Mysuru" },
        { name: "Original Mylari Hotel", cuisine: "Authentic South Indian", tags: ["veg", "heritage"], cost: "₹180 for two", timing: "6:30 AM – 1:30 PM & 3:30 PM – 8:30 PM", dish: "World-famous Melt-in-mouth Butter Dosa with Coconut Chutney", address: "Shop 79, Nazarbad Main Road, Mysuru" },
        { name: "Guru Sweet Mart", cuisine: "Traditional Royal Sweets", tags: ["veg", "street"], cost: "₹150 for two", timing: "9:00 AM – 10:00 PM", dish: "Authentic Original Mysore Pak (Royal Wadiyar Dynasty Recipe)", address: "Sayyaji Rao Road, Near Devaraja Market, Mysuru" },
        { name: "Lalitha Mahal Palace Dining", cuisine: "Royal Heritage & Continental", tags: ["finedine"], cost: "₹1,800 for two", timing: "12:30 PM – 3:30 PM & 7:30 PM – 11:00 PM", dish: "Maharaja Royal Thali & Continental Cuisine in Grand Ballrooms", address: "Lalitha Mahal Palace Grounds, Siddhartha Layout, Mysuru" },
        { name: "Anima Madhva Bhavan", cuisine: "Pure Satvik Karnataka Meals", tags: ["veg"], cost: "₹350 for two", timing: "11:30 AM – 3:30 PM & 7:00 PM – 9:30 PM", dish: "Traditional Multi-Course Karnataka Plantain Leaf Feast", address: "Vontikoppal, Kalidasa Road, Mysuru" }
    ],
    "Jaipur": [
        { name: "Rawat Mishthan Bhandar", cuisine: "Rajasthani Snacks & Sweets", tags: ["street", "heritage"], cost: "₹250 for two", timing: "6:00 AM – 10:30 PM", dish: "World Famous Pyaaz Kachori & Mawa Kachori", address: "Station Road, Sindhi Camp, Jaipur" },
        { name: "Laxmi Mishthan Bhandar (LMB)", cuisine: "Pure Vegetarian Rajasthani", tags: ["veg", "heritage"], cost: "₹800 for two", timing: "8:00 AM – 11:00 PM", dish: "Royal Rajasthani Thali & Golden Ghevar", address: "Johari Bazaar, Pink City, Jaipur" },
        { name: "Handi Restaurant", cuisine: "North Indian & Mughlai", tags: ["heritage"], cost: "₹950 for two", timing: "12:00 PM – 11:00 PM", dish: "Authentic Handi Meat & Traditional Laal Maas", address: "Maya Mansion, MI Road, Jaipur" },
        { name: "1135 AD Amer", cuisine: "Royal Rajputana Fine Dining", tags: ["finedine"], cost: "₹2,500 for two", timing: "11:00 AM – 11:00 PM", dish: "Thaal Jodhpur & Royal Murg Wajid Ali", address: "Amer Fort Level 2, Amer, Jaipur" }
    ],
    "Mumbai": [
        { name: "Britannia & Co. Restaurant", cuisine: "Parsi & Iranian", tags: ["heritage"], cost: "₹800 for two", timing: "11:30 AM – 4:00 PM", dish: "Legendary Berry Pulao & Sali Boti with Caramel Custard", address: "Wakefield House, Ballard Estate, Fort, Mumbai" },
        { name: "Sardar Refreshments", cuisine: "Street Food Pav Bhaji", tags: ["street", "veg"], cost: "₹300 for two", timing: "12:00 PM – 2:00 AM", dish: "Famous Extra-Butter Cheese Pav Bhaji", address: "166-A, Tardeo Road, Junction, Mumbai" },
        { name: "Trishna Restaurant", cuisine: "Coastal Mangalorean Seafood", tags: ["finedine"], cost: "₹2,200 for two", timing: "12:00 PM – 3:30 PM & 6:30 PM – 12:00 AM", dish: "Butter Pepper Garlic King Crab & Neer Dosa", address: "Sai Baba Marg, Kala Ghoda, Fort, Mumbai" },
        { name: "Bademiya Kebabs", cuisine: "Mughlai Street Grills", tags: ["street"], cost: "₹600 for two", timing: "1:00 PM – 3:00 AM", dish: "Chicken Baida Roti & Seekh Kebab Rolls", address: "Tulloch Road, Behind Taj Mahal Palace Hotel, Colaba, Mumbai" }
    ],
    "Delhi": [
        { name: "Karim's Historic Dining", cuisine: "Old Delhi Mughlai", tags: ["heritage"], cost: "₹800 for two", timing: "11:00 AM – 11:30 PM", dish: "Mutton Nihari, Seekh Kebabs & Shahi Badam Pasanda", address: "16, Gali Kababian, Jama Masjid, Old Delhi" },
        { name: "Bukhara - ITC Maurya", cuisine: "North-West Frontier Fine Dine", tags: ["finedine"], cost: "₹5,000 for two", timing: "12:30 PM – 2:45 PM & 7:00 PM – 11:45 PM", dish: "World-Renowned Dal Bukhara & Sikandari Raan", address: "ITC Maurya, Diplomatic Enclave, Chanakyapuri, New Delhi" },
        { name: "Kachehari Road Paranthe Wali Gali", cuisine: "Traditional Stuffed Parathas", tags: ["street", "veg"], cost: "₹250 for two", timing: "9:00 AM – 11:00 PM", dish: "Deep Fried Rabri, Khoya, and Papad Parathas with Sweet Pumpkin", address: "Gali Paranthe Wali, Chandni Chowk, Old Delhi" },
        { name: "Gulati Restaurant", cuisine: "North Indian & Punjabi", tags: ["heritage"], cost: "₹1,200 for two", timing: "12:00 PM – 12:00 AM", dish: "Butter Chicken, Dal Makhani, and Kakori Kebabs", address: "6, Pandara Road Market, New Delhi" }
    ]
};

// ==========================================
// CURATED VERIFIED ACCOMMODATIONS DATABASE
// ==========================================
const CURATED_HOTELS = {
    "Mysore": [
        { name: "Lalitha Mahal Palace Hotel", type: "Heritage 5-Star Palace", location: "Siddhartha Layout, Mysuru (3 km from Palace)", priceTier: "₹7,500 – ₹14,000 / night", amenities: ["Free WiFi", "Royal Garden View", "Swimming Pool", "Heritage Architecture", "Valet Parking"] },
        { name: "Radisson Blu Plaza Hotel Mysore", type: "Luxury 5-Star Hotel", location: "MG Road, Mysuru (Adjoining Mall of Mysore & Zoo)", priceTier: "₹5,500 – ₹9,000 / night", amenities: ["Free Breakfast", "Chamundi Hill View", "Outdoor Pool", "Spa & Gym", "Free WiFi"] },
        { name: "Hotel Mayura Hoysala (KSTDC)", type: "Official State Tourism Hotel", location: "JLB Road, Chamrajpura, Mysuru (near Railway Station)", priceTier: "₹1,800 – ₹3,200 / night", amenities: ["Govt Verified", "Free Parking", "In-house Restaurant", "AC Rooms", "Tour Desk"] },
        { name: "Grand Mercure Mysuru", type: "Upscale 5-Star", location: "Nelson Mandela Road, New Sayyaji Rao Road, Mysuru", priceTier: "₹4,500 – ₹7,500 / night", amenities: ["Rooftop Pool", "Free WiFi", "Fitness Center", "Multi-cuisine Dining", "AC"] },
        { name: "Roamer Stays / Backpacker Hostel", type: "Youth & Budget Hostel", location: "Gokulam 3rd Stage, Mysuru (Yoga District)", priceTier: "₹650 – ₹1,500 / night", amenities: ["Dorm Beds & Privates", "High Speed WiFi", "Community Lounge", "Kitchen Access"] }
    ],
    "Jaipur": [
        { name: "Rambagh Palace Jaipur", type: "World Luxury Heritage Palace", location: "Bhawani Singh Road, Jaipur", priceTier: "₹35,000 – ₹75,000 / night", amenities: ["Former Royal Residence", "Peacock Gardens", "Jiva Spa", "Polo Lounge"] },
        { name: "ITC Rajputana Luxury Collection", type: "5-Star Luxury Resort", location: "Palace Road, Gopalbari, Jaipur", priceTier: "₹7,000 – ₹12,000 / night", amenities: ["Traditional Haveli Courtyard", "Outdoor Pool", "Peshawri Dining", "Free WiFi"] },
        { name: "RTDC Hotel Gangaur", type: "Official Rajasthan Tourism Hotel", location: "MI Road, Jaipur", priceTier: "₹1,600 – ₹2,800 / night", amenities: ["Govt Verified", "Central Location", "AC Deluxe Rooms", "Rajasthani Dining"] },
        { name: "Zostel Jaipur", type: "Backpacker Hostel & Private Rooms", location: "First Floor, Hawa Mahal Road, Pink City", priceTier: "₹700 – ₹2,200 / night", amenities: ["Rooftop Cafe", "Walking Distance to Hawa Mahal", "Free WiFi", "AC"] }
    ],
    "Mumbai": [
        { name: "The Taj Mahal Palace Mumbai", type: "Iconic Heritage 5-Star", location: "Apollo Bunder, Colaba, Mumbai (Opposite Gateway of India)", priceTier: "₹18,000 – ₹45,000 / night", amenities: ["Historic Landmark", "Harbor View", "Sea Lounge", "Jiva Spa"] },
        { name: "Trident Hotel Nariman Point", type: "Luxury 5-Star Sea View", location: "Nariman Point, Marine Drive, Mumbai", priceTier: "₹10,500 – ₹18,000 / night", amenities: ["Queen's Necklace View", "Pool", "Free WiFi", "Fitness Center"] },
        { name: "Residency Hotel Fort", type: "Boutique Comfort Hotel", location: "DN Road, Fort, Mumbai (Near Victoria Terminus)", priceTier: "₹3,500 – ₹5,500 / night", amenities: ["Central Heritage District", "Free Breakfast", "AC", "Free WiFi"] },
        { name: "Basti Backpackers Hostel", type: "Budget Traveler Hostel", location: "Santacruz West, Mumbai", priceTier: "₹850 – ₹2,000 / night", amenities: ["Clean Bunks", "AC Dorms", "WiFi", "Traveler Events"] }
    ]
};

// ==========================================
// MODULAR IMAGE SERVICE & ATTRIBUTION ENGINE
// ==========================================
const ImageService = {
    cacheKey: 'travelguru_img_cache_v2',
    
    getCache() {
        try {
            return JSON.parse(localStorage.getItem(this.cacheKey) || '{}');
        } catch (e) {
            return {};
        }
    },
    
    setCache(key, url, attribution, source) {
        try {
            const cache = this.getCache();
            cache[key] = { url, attribution, source };
            localStorage.setItem(this.cacheKey, JSON.stringify(cache));
        } catch (e) {}
    },

    generateVectorPlaceholder(name, city, category) {
        const cleanName = (name || 'Tourist Destination').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const cleanCat = (category || 'Scenic Sight').toUpperCase();
        const cleanLoc = (city || 'India').toUpperCase();
        
        let bgGrad = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
        let icon = '🏛️';
        const lowerCat = cleanCat.toLowerCase();
        if (lowerCat.includes('palace') || lowerCat.includes('fort') || lowerCat.includes('heritage')) {
            bgGrad = 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)';
            icon = '🏰';
        } else if (lowerCat.includes('lake') || lowerCat.includes('waterfall') || lowerCat.includes('beach')) {
            bgGrad = 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)';
            icon = '🌊';
        } else if (lowerCat.includes('temple') || lowerCat.includes('spiritual')) {
            bgGrad = 'linear-gradient(135deg, #c2410c 0%, #ea580c 100%)';
            icon = '🛕';
        } else if (lowerCat.includes('wildlife') || lowerCat.includes('park') || lowerCat.includes('hill')) {
            bgGrad = 'linear-gradient(135deg, #065f46 0%, #047857 100%)';
            icon = '🏔️';
        }

        const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">' +
            '<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient></defs>' +
            '<rect width="600" height="400" fill="url(#bg)"/>' +
            '<circle cx="300" cy="160" r="60" fill="rgba(255,255,255,0.08)"/>' +
            '<text x="300" y="180" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="52" text-anchor="middle" fill="#ffd166">' + icon + '</text>' +
            '<text x="300" y="240" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="12" font-weight="800" text-anchor="middle" fill="#ff5722" letter-spacing="2">' + cleanCat + '</text>' +
            '<text x="300" y="275" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="#ffffff">' + cleanName + '</text>' +
            '<text x="300" y="305" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" font-size="13" text-anchor="middle" fill="#94a3b8">📍 ' + cleanLoc + ', INDIA</text>' +
            '</svg>';
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    },

    async handleImgError(img, name, city, state, category) {
        if (!img) return;
        img.onerror = null; // Prevent infinite error loops
        
        const cleanName = (name || '').replace(/\\(.*?\\)/g, '').trim();
        const cacheKey = (cleanName + '_' + (city || '')).toLowerCase();
        const cache = this.getCache();
        
        if (cache[cacheKey] && cache[cacheKey].url) {
            img.src = cache[cacheKey].url;
            return;
        }

        // Try live Wikimedia Commons API via browser fetch (origin=* CORS)
        try {
            const query = encodeURIComponent((cleanName + ' ' + (city || '')).trim());
            const apiUrl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=' + query + '&gsrlimit=1&prop=pageimages&piprop=thumbnail&pithumbsize=900';
            const res = await fetch(apiUrl).then(r => r.json()).catch(() => null);
            if (res && res.query && res.query.pages) {
                const pages = Object.values(res.query.pages);
                if (pages.length > 0 && pages[0].thumbnail && pages[0].thumbnail.source) {
                    const thumbUrl = pages[0].thumbnail.source;
                    this.setCache(cacheKey, thumbUrl, 'Photo: ' + cleanName + ' via Wikimedia', 'Wikimedia Commons');
                    img.src = thumbUrl;
                    return;
                }
            }
        } catch (e) {}

        // Fallback to high quality vector placeholder
        img.src = this.generateVectorPlaceholder(cleanName, city || state, category);
        const parent = img.parentElement;
        if (parent) {
            const pill = parent.querySelector('.img-attribution-pill');
            if (pill) pill.innerHTML = '📷 Verified Visual';
        }
    },

    onImgLoad(img) {
        if (!img) return;
        const parent = img.parentElement;
        if (parent && parent.classList.contains('img-skeleton')) {
            parent.classList.remove('img-skeleton');
        }
    }
};

const FALLBACK_IMAGES = [
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80"
];

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    if (!window.INDIA_TRAVEL_DATA || Object.keys(window.INDIA_TRAVEL_DATA).length === 0) {
        console.error("Travel database not loaded!");
        return;
    }

    populateStateDropdown();
    selectState("Karnataka");

    // Initialize Hotel Dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 3);

    const checkInEl = document.getElementById("hotelCheckIn");
    const checkOutEl = document.getElementById("hotelCheckOut");
    if (checkInEl) checkInEl.value = tomorrow.toISOString().split("T")[0];
    if (checkOutEl) checkOutEl.value = dayAfter.toISOString().split("T")[0];

    // Initialize Travel Date for Ride
    const rideDateEl = document.getElementById("travelDate");
    if (rideDateEl) rideDateEl.value = tomorrow.toISOString().split("T")[0];

    // Trigger Initial Planner & Stays calculation
    setTimeout(() => {
        calculateRouteAndItinerary();
        searchLiveHotels();
        renderFoodSpecialties("Karnataka", "Mysore");
        renderRestaurants("Mysore", "Karnataka", "all");
        renderTransportHub("Mysore", "Karnataka");
    }, 200);

    // Escape Key modal closer
    window.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            closeAllPopups();
        }
    });
});

// ==========================================
// REGION FILTERING
// ==========================================
function filterByRegion(region, btn) {
    currentRegionFilter = region;
    document.querySelectorAll(".region-pill").forEach(p => p.classList.remove("active"));
    if (btn) btn.classList.add("active");

    const stateSelect = document.getElementById("stateSelect");
    if (!stateSelect) return;
    stateSelect.innerHTML = "";

    const allStates = Object.keys(window.INDIA_TRAVEL_DATA).sort();
    let filtered = allStates;

    if (region !== "all" && REGIONS_DATA[region]) {
        filtered = allStates.filter(s => REGIONS_DATA[region].includes(s));
    }

    filtered.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        if (s === currentSelectedState) opt.selected = true;
        stateSelect.appendChild(opt);
    });

    if (filtered.length > 0 && !filtered.includes(currentSelectedState)) {
        selectState(filtered[0]);
    }
}

// ==========================================
// STATE & DESTINATION SELECTION
// ==========================================
function populateStateDropdown() {
    const select = document.getElementById("stateSelect");
    if (!select) return;
    select.innerHTML = "";

    const sortedStates = Object.keys(window.INDIA_TRAVEL_DATA).sort();
    sortedStates.forEach(stateName => {
        const opt = document.createElement("option");
        opt.value = stateName;
        opt.textContent = stateName;
        if (stateName === "Karnataka") opt.selected = true;
        select.appendChild(opt);
    });
}

function onStateChanged() {
    const state = document.getElementById("stateSelect").value;
    selectState(state);
}

function selectQuickState(stateName) {
    if (!window.INDIA_TRAVEL_DATA[stateName]) return;
    document.querySelectorAll(".state-pill").forEach(p => {
        p.classList.toggle("active", p.textContent.includes(stateName));
    });
    const stateSelect = document.getElementById("stateSelect");
    if (stateSelect) stateSelect.value = stateName;
    selectState(stateName);
    const placesSection = document.getElementById("places");
    if (placesSection) placesSection.scrollIntoView({ behavior: "smooth" });
}

function selectState(stateName) {
    currentSelectedState = stateName;
    currentSelectedDestination = null;

    renderStateBanner(stateName);
    populateDestinationDropdown(stateName);
    updateBreadcrumb(stateName, null);

    const searchInput = document.getElementById("destSearchInput");
    if (searchInput) searchInput.value = "";
    document.querySelectorAll(".filter-chip").forEach((btn, idx) => {
        btn.classList.toggle("active", idx === 0);
    });

    document.getElementById("stateDestinationsView").style.display = "block";
    document.getElementById("destinationDetailsView").style.display = "none";

    renderDestinationsGrid(stateName);

    // Update Planner & Stays
    const stateData = window.INDIA_TRAVEL_DATA[stateName];
    const firstDest = (stateData && stateData.destinations && stateData.destinations[0]) ? stateData.destinations[0].name : stateName;
    updateExternalPanels(firstDest, stateName);
}

function populateDestinationDropdown(stateName) {
    const citySelect = document.getElementById("citySelect");
    if (!citySelect) return;
    citySelect.innerHTML = "";

    const stateData = window.INDIA_TRAVEL_DATA[stateName];
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "⭐ View All 30 Famous Destinations in " + stateName;
    citySelect.appendChild(defaultOpt);

    (stateData.destinations || []).forEach(dest => {
        const opt = document.createElement("option");
        opt.value = dest.id || dest.name;
        opt.textContent = "📍 " + dest.name + " (" + (dest.category || "Famous Destination") + ")";
        citySelect.appendChild(opt);
    });
}

function onCityChanged() {
    const citySelect = document.getElementById("citySelect");
    const destVal = citySelect.value;
    if (!destVal) {
        showStateView();
        return;
    }
    openDestinationDetails(currentSelectedState, destVal);
}

function renderStateBanner(stateName) {
    const stateData = window.INDIA_TRAVEL_DATA[stateName];
    const banner = document.getElementById("stateBanner");
    if (!banner || !stateData) return;

    banner.innerHTML = \`
        <div class="state-banner-left">
            <div class="state-banner-tagline">🇮🇳 \${escapeHTML(stateData.tagline || "Discover Incredible India")}</div>
            <h2 class="state-banner-title">\${escapeHTML(stateData.name)}</h2>
            <p class="state-banner-desc">\${escapeHTML(stateData.description || "Explore the premier tourist destinations with verified photography, distance routing, and complete travel guides.")}</p>
        </div>

        <div class="state-banner-stats">
            <div class="state-stat-pill">
                <div class="state-stat-num">30</div>
                <div class="state-stat-lbl">Top Destinations</div>
            </div>
            <div class="state-stat-pill">
                <div class="state-stat-num">450</div>
                <div class="state-stat-lbl">Verified Sights</div>
            </div>
            <div class="state-stat-pill">
                <div class="state-stat-num">📍 \${escapeHTML(stateData.capital || stateName)}</div>
                <div class="state-stat-lbl">Capital City</div>
            </div>
        </div>
    \`;
}

// ==========================================
// DESTINATIONS GRID WITH SORTING & FILTERING
// ==========================================
function renderDestinationsGrid(stateName, filterKeyword = "", categoryFilter = "all", sortOption = "rank") {
    const stateData = window.INDIA_TRAVEL_DATA[stateName];
    const grid = document.getElementById("destinationGrid");
    const titleEl = document.getElementById("placesTitle");
    const subEl = document.getElementById("placesSubtitle");

    if (titleEl) titleEl.innerText = "🌟 Top 30 Famous Tourist Destinations in " + stateName;
    if (subEl) subEl.innerText = "Click 'Explore 15 Attractions' on any destination to view complete sights, opening hours, entry fees, and travel guides.";
    if (!grid || !stateData) return;

    grid.innerHTML = "";
    let list = [...(stateData.destinations || [])];

    // Filter category
    if (categoryFilter !== "all") {
        list = list.filter(d => {
            const cat = (d.category || "").toLowerCase();
            if (categoryFilter === "heritage") return cat.includes("heritage") || cat.includes("palace") || cat.includes("fort");
            if (categoryFilter === "hill") return cat.includes("hill") || cat.includes("mountain") || cat.includes("valley");
            if (categoryFilter === "temple") return cat.includes("temple") || cat.includes("pilgrimage") || cat.includes("spiritual");
            if (categoryFilter === "beach") return cat.includes("beach") || cat.includes("coast") || cat.includes("island");
            if (categoryFilter === "wildlife") return cat.includes("wildlife") || cat.includes("tiger") || cat.includes("national park");
            if (categoryFilter === "waterfall") return cat.includes("waterfall") || cat.includes("falls") || cat.includes("adventure") || cat.includes("gorge");
            return true;
        });
    }

    // Filter text search
    if (filterKeyword) {
        const q = filterKeyword.toLowerCase();
        list = list.filter(d => d.name.toLowerCase().includes(q) || (d.district && d.district.toLowerCase().includes(q)) || (d.category && d.category.toLowerCase().includes(q)));
    }

    // Sort
    if (sortOption === "rating") {
        list.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
    } else if (sortOption === "name") {
        list.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (list.length === 0) {
        grid.innerHTML = '<div class="empty-feature" style="grid-column:1/-1; padding:40px; text-align:center; background:white; border-radius:var(--radius-md);">No destinations found matching your filter criteria. Try clearing search or selecting All Categories.</div>';
        return;
    }

    list.forEach((dest, index) => {
        const card = createDestinationCardElement(dest, index, stateName);
        grid.appendChild(card);
    });
}

function createDestinationCardElement(dest, index, stateName) {
    const card = document.createElement("div");
    card.className = "destination-card";

    const safeName = escapeHTML(dest.name);
    const safeDist = escapeHTML(dest.district || (dest.name + " District"));
    const safeDesc = escapeHTML(dest.shortDesc);
    const safeCat = escapeHTML(dest.category || "Top Destination");
    const safeDur = escapeHTML(dest.duration || "2-3 Days");
    const safeSeason = escapeHTML(dest.bestSeason || "October to March");
    const rating = dest.rating || 4.8;
    const photo = dest.coverImage || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    const destId = dest.id || dest.name;
    const imgSource = dest.imageSource || 'Wikimedia Commons';
    const imgAttribution = dest.imageAttribution || (safeName + ' via ' + imgSource);

    card.innerHTML = \`
        <div class="dest-card-image-wrap img-skeleton">
            <img class="dest-card-img"
                 src="\${photo}"
                 alt="\${safeName}, \${safeDist}"
                 loading="lazy"
                 onload="ImageService.onImgLoad(this)"
                 onerror="ImageService.handleImgError(this, '\${escapeJS(dest.name)}', '\${escapeJS(dest.district || '')}', '\${escapeJS(stateName)}', '\${escapeJS(dest.category || '')}')">
            <div class="dest-badge-rank">#\${index + 1}</div>
            <div class="dest-badge-rating">⭐ \${rating}</div>
            <div class="dest-badge-cat">\${safeCat}</div>
            <div class="img-attribution-pill" title="\${escapeHTML(imgAttribution)}">
                📷 \${escapeHTML(imgSource)}
            </div>
        </div>

        <div class="dest-card-body">
            <h3 class="dest-card-title">\${safeName}</h3>
            <div class="dest-card-loc">📍 \${safeDist}, \${escapeHTML(stateName)}</div>
            <p class="dest-card-desc">\${safeDesc}</p>

            <div class="dest-card-meta">
                <span class="dest-meta-pill">⏱️ \${safeDur}</span>
                <span class="dest-meta-pill">🗓️ \${safeSeason}</span>
                <span class="dest-meta-pill">🏆 15 Attractions</span>
            </div>

            <div class="dest-card-actions">
                <button class="btn-explore-dest" onclick="openDestinationDetails('\${escapeJS(stateName)}', '\${escapeJS(destId)}')">✨ Explore 15 Attractions</button>
                <button class="btn-card-util" onclick="jumpToPlanner('\${escapeJS(dest.name)}', '\${escapeJS(stateName)}')">🧭 Plan Route</button>
                <button class="btn-card-util" onclick="jumpToStay('\${escapeJS(dest.name)}', '\${escapeJS(stateName)}')">🏨 Stays</button>
                <button class="btn-card-util" onclick="jumpToFood('\${escapeJS(dest.name)}', '\${escapeJS(stateName)}')">🍽️ Food</button>
                <button class="btn-card-util" onclick="jumpToTransport('\${escapeJS(dest.name)}', '\${escapeJS(stateName)}')">🚆 Transit</button>
            </div>
        </div>
    \`;

    return card;
}

function filterDestByCategory(category, btn) {
    currentSelectedCategory = category;
    document.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    const searchInput = document.getElementById("destSearchInput");
    const keyword = searchInput ? searchInput.value.trim() : "";
    renderDestinationsGrid(currentSelectedState, keyword, category, currentSortOption);
}

function onFilterDestinationsSearch() {
    const searchInput = document.getElementById("destSearchInput");
    const keyword = searchInput ? searchInput.value.trim() : "";
    renderDestinationsGrid(currentSelectedState, keyword, currentSelectedCategory, currentSortOption);
}

function onSortChanged() {
    const select = document.getElementById("destSortSelect");
    if (!select) return;
    currentSortOption = select.value;
    onFilterDestinationsSearch();
}

// ==========================================
// DEDICATED DESTINATION DETAILS VIEW (TOP 15 ATTRACTIONS)
// ==========================================
function openDestinationDetails(stateName, destIdOrName) {
    const stateData = window.INDIA_TRAVEL_DATA[stateName];
    if (!stateData) return;

    const dest = (stateData.destinations || []).find(d => (d.id === destIdOrName || d.name === destIdOrName));
    if (!dest) {
        console.error("Destination not found:", destIdOrName);
        return;
    }

    currentSelectedState = stateName;
    currentSelectedDestination = dest;

    const citySelect = document.getElementById("citySelect");
    if (citySelect) citySelect.value = dest.id || dest.name;

    updateBreadcrumb(stateName, dest.name);

    document.getElementById("stateDestinationsView").style.display = "none";
    const detailsView = document.getElementById("destinationDetailsView");
    detailsView.style.display = "block";

    renderDestinationHero(dest, stateName);
    renderDestinationSpecs(dest);
    renderDestinationInsights(dest);
    renderAttractionsGrid(dest);

    // Sync other modules
    updateExternalPanels(dest.name, stateName);

    detailsView.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showStateView() {
    currentSelectedDestination = null;
    const citySelect = document.getElementById("citySelect");
    if (citySelect) citySelect.value = "";

    updateBreadcrumb(currentSelectedState, null);

    document.getElementById("stateDestinationsView").style.display = "block";
    document.getElementById("destinationDetailsView").style.display = "none";

    document.getElementById("places").scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateBreadcrumb(stateName, destName) {
    const breadcrumb = document.getElementById("travelBreadcrumb");
    if (!breadcrumb) return;

    if (!destName) {
        breadcrumb.innerHTML = \`
            <span class="crumb-btn" onclick="window.scrollTo({top:0, behavior:'smooth'})">🏠 Home</span>
            <span class="crumb-sep">›</span>
            <span class="crumb-current">🇮🇳 \${escapeHTML(stateName)} (Top 30 Destinations)</span>
        \`;
    } else {
        breadcrumb.innerHTML = \`
            <span class="crumb-btn" onclick="window.scrollTo({top:0, behavior:'smooth'})">🏠 Home</span>
            <span class="crumb-sep">›</span>
            <span class="crumb-btn" onclick="showStateView()">🇮🇳 \${escapeHTML(stateName)} (30 Destinations)</span>
            <span class="crumb-sep">›</span>
            <span class="crumb-current">📍 \${escapeHTML(destName)} (Top 15 Attractions)</span>
        \`;
    }
}

function renderDestinationHero(dest, stateName) {
    const hero = document.getElementById("destHeroBanner");
    if (!hero) return;

    const safeName = escapeHTML(dest.name);
    const safeDist = escapeHTML(dest.district || (dest.name + " District"));
    const safeDesc = escapeHTML(dest.shortDesc);
    const safeCat = escapeHTML(dest.category || "Top Destination");
    const rating = dest.rating || 4.9;
    const photo = dest.coverImage || FALLBACK_IMAGES[0];
    const imgSource = dest.imageSource || 'Wikimedia Commons';
    const imgAttribution = dest.imageAttribution || (safeName + ' via ' + imgSource);

    hero.style.backgroundImage = "url('" + photo + "')";
    hero.innerHTML = \`
        <div class="dest-hero-overlay"></div>
        <div class="dest-hero-top">
            <button class="btn-back-to-state" onclick="showStateView()">← Back to Top 30 Destinations in \${escapeHTML(stateName)}</button>
            <div style="background:rgba(0,0,0,0.6); padding:6px 14px; border-radius:var(--radius-full); font-size:13.5px; font-weight:800; color:#ffc107;">⭐ \${rating} / 5 Rating</div>
        </div>

        <div class="dest-hero-content">
            <div style="display:inline-block; background:var(--primary); color:white; font-size:11.5px; font-weight:800; padding:4px 12px; border-radius:var(--radius-full); text-transform:uppercase; margin-bottom:12px;">\${safeCat}</div>
            <h1>\${safeName}</h1>
            <p>\${safeDesc}</p>
            <div style="font-size:14px; color:#cbd5e1; font-weight:700;">📍 \${safeDist}, \${escapeHTML(stateName)}, India</div>
        </div>

        <div class="img-attribution-pill" style="bottom:18px; right:20px; z-index:10;" title="\${escapeHTML(imgAttribution)}">
            📷 \${escapeHTML(imgSource)}
        </div>
    \`;
}

function renderDestinationSpecs(dest) {
    const specs = document.getElementById("destSpecsGrid");
    if (!specs) return;

    specs.innerHTML = \`
        <div class="dest-spec-card">
            <div class="dest-spec-icon">🗓️</div>
            <div>
                <div class="dest-spec-label">Best Season to Visit</div>
                <div class="dest-spec-val">\${escapeHTML(dest.bestSeason || "October to March")}</div>
            </div>
        </div>

        <div class="dest-spec-card">
            <div class="dest-spec-icon">⏱️</div>
            <div>
                <div class="dest-spec-label">Trip Duration</div>
                <div class="dest-spec-val">\${escapeHTML(dest.duration || "2-3 Days")}</div>
            </div>
        </div>

        <div class="dest-spec-card">
            <div class="dest-spec-icon">📍</div>
            <div>
                <div class="dest-spec-label">District / Region</div>
                <div class="dest-spec-val">\${escapeHTML(dest.district || dest.name)}</div>
            </div>
        </div>

        <div class="dest-spec-card">
            <div class="dest-spec-icon">🏷️</div>
            <div>
                <div class="dest-spec-label">Attraction Type</div>
                <div class="dest-spec-val">\${escapeHTML(dest.category || "Scenic Destination")}</div>
            </div>
        </div>
    \`;
}

function renderDestinationInsights(dest) {
    const insights = document.getElementById("destInsightsGrid");
    if (!insights) return;

    insights.innerHTML = \`
        <div class="dest-insight-card">
            <h3>💡 Pro Travel Tips</h3>
            <p>\${escapeHTML(dest.travelTips || "Book stays well in advance during peak festival seasons. Early morning hours offer the best light for photography and peaceful sightseeing.")}</p>
        </div>

        <div class="dest-insight-card">
            <h3>🍛 Local Food Recommendations</h3>
            <p>\${escapeHTML(dest.localFood || "Authentic regional thali, famous local street food chaat, and traditional sweets.")}</p>
        </div>

        <div class="dest-insight-card">
            <h3>🚗 Nearby Excursions & Attractions</h3>
            <p>\${escapeHTML(dest.nearbyAttractions || "Scenic surrounding hills, historic villages, waterfalls, and nature parks.")}</p>
        </div>
    \`;
}

function renderAttractionsGrid(dest) {
    const grid = document.getElementById("attractionsGrid");
    const titleEl = document.getElementById("attractionsTitle");
    const subEl = document.getElementById("attractionsSubtitle");

    if (titleEl) titleEl.innerText = "🏆 Top 15 Must-Visit Attractions in " + dest.name;
    if (subEl) subEl.innerText = "Discover " + dest.name + "'s 15 best sights, historical monuments, and hidden gems with verified photos, opening hours, entry fees, and complete guides.";
    if (!grid) return;

    grid.innerHTML = "";
    const attractions = dest.attractions || [];

    if (attractions.length === 0) {
        grid.innerHTML = '<div class="empty-feature" style="grid-column:1/-1;">No attractions found for this destination.</div>';
        return;
    }

    attractions.slice(0, 15).forEach((attr, index) => {
        const card = createAttractionCardElement(attr, index, dest.name);
        grid.appendChild(card);
    });
}

function createAttractionCardElement(attr, index, destName) {
    const card = document.createElement("div");
    card.className = "attraction-card";

    const safeName = escapeHTML(attr.name);
    const safeCat = escapeHTML(attr.category || "Top Attraction");
    const safeLoc = escapeHTML(attr.exactLocation || (attr.name + ", " + destName));
    const safeWhy = escapeHTML(attr.whyFamous || "Celebrated landmark known for exquisite architecture and cultural significance.");
    const safeDesc = escapeHTML(attr.shortDesc || ("Explore " + attr.name + " in " + destName + "."));
    const rating = attr.rating || 4.8;
    const photo = attr.image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    const imgSource = attr.imageSource || 'Wikimedia Commons';
    const imgAttribution = attr.imageAttribution || (safeName + ' via ' + imgSource);

    // Opening hours, entry fees & estimated time
    const safeTimings = escapeHTML((attr.guide && attr.guide.timings) || "9:00 AM – 5:30 PM");
    const safeFee = escapeHTML((attr.guide && attr.guide.entryFee) || "Standard Tourist Fee");
    const estVisitingTime = attr.category && attr.category.toLowerCase().includes("palace") ? "2 – 3 Hours" :
                            attr.category && attr.category.toLowerCase().includes("temple") ? "1 – 1.5 Hours" :
                            attr.category && attr.category.toLowerCase().includes("zoo") ? "2.5 – 4 Hours" :
                            attr.category && attr.category.toLowerCase().includes("lake") ? "1.5 – 2 Hours" : "1 – 2 Hours";

    card.innerHTML = \`
        <div class="attr-img-wrap img-skeleton">
            <img class="attr-img"
                 src="\${photo}"
                 alt="\${safeName}"
                 loading="lazy"
                 onload="ImageService.onImgLoad(this)"
                 onerror="ImageService.handleImgError(this, '\${escapeJS(attr.name)}', '\${escapeJS(destName)}', '\${escapeJS(currentSelectedState || '')}', '\${escapeJS(attr.category || '')}')">
            <div class="attr-rank">#\${index + 1}</div>
            <div class="attr-rating">⭐ \${rating}</div>
            <div class="attr-cat-badge">\${safeCat}</div>
            <div class="img-attribution-pill" title="\${escapeHTML(imgAttribution)}">
                📷 \${escapeHTML(imgSource)}
            </div>
        </div>

        <div class="attr-body">
            <h3 class="attr-title">\${safeName}</h3>
            
            <div class="attr-why-famous">
                <strong>🌟 Why Famous:</strong> \${safeWhy}
            </div>

            <p class="attr-desc">\${safeDesc}</p>

            <div class="attr-details-box">
                <div class="attr-detail-row">📍 <strong>Exact Location:</strong> \${safeLoc}</div>
                <div class="attr-detail-row">⏰ <strong>Visiting Hours:</strong> \${safeTimings}</div>
                <div class="attr-detail-row">🎟️ <strong>Entry Fee:</strong> \${safeFee}</div>
                <div class="attr-detail-row">⏱️ <strong>Estimated Time:</strong> \${estVisitingTime}</div>
            </div>

            <div class="attr-actions">
                <button class="btn-guide-main" onclick="openAttractionGuideByIndex(\${index})">📖 Complete Travel Guide</button>
                <a class="btn-attr-util" href="https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(attr.name + ', ' + destName + ', India')}" target="_blank" rel="noopener">📍 Google Maps</a>
                <button class="btn-attr-util" onclick="openRideForPlace('\${escapeJS(attr.name)}', '\${escapeJS(destName)}')">🚕 Compare Ride</button>
                <button class="btn-attr-util" onclick="jumpToStay('\${escapeJS(destName)}', '\${escapeJS(currentSelectedState)}')">🏨 Stays Nearby</button>
            </div>
        </div>
    \`;

    return card;
}

// ==========================================
// ATTRACTION GUIDE MODAL
// ==========================================
function openAttractionGuideByIndex(index) {
    if (!currentSelectedDestination || !currentSelectedDestination.attractions) return;
    const attr = currentSelectedDestination.attractions[index];
    if (!attr) return;
    openGuideModal(attr);
}

function openGuideModal(place) {
    currentSelectedAttraction = place;
    const popup = document.getElementById("guidePopup");
    const content = document.getElementById("guideContent");
    if (!popup || !content) return;

    const safeName = escapeHTML(place.name);
    const safeCity = escapeHTML(place.city || (currentSelectedDestination ? currentSelectedDestination.name : ""));
    const safeState = escapeHTML(place.state || currentSelectedState);
    const safeCat = escapeHTML(place.category || "Top Destination");
    const safeBest = escapeHTML((place.guide && place.guide.bestTime) || place.bestTime || "October to March");
    const safeTime = escapeHTML((place.guide && place.guide.timings) || "9:00 AM – 5:30 PM");
    const safeFee = escapeHTML((place.guide && place.guide.entryFee) || "Standard Tourist Fee");
    const safeHist = escapeHTML((place.guide && place.guide.history) || place.shortDesc);
    const safeDesc = escapeHTML(place.shortDesc);
    const safeReach = escapeHTML((place.guide && place.guide.howToReach) || ("Easily reached from " + safeCity + " center via local cabs and auto-rickshaws."));
    const safeFood = escapeHTML((place.guide && place.guide.foodSpecialties) || ("Famous local delicacies and traditional meals of " + safeCity + "."));
    const safeTips = escapeHTML((place.guide && place.guide.travelTips) || "Wear comfortable shoes and carry drinking water.");
    const rating = place.rating || 4.8;
    const photo = place.image || FALLBACK_IMAGES[0];
    const imgSource = place.imageSource || 'Wikimedia Commons';
    const imgAttribution = place.imageAttribution || (safeName + ' via ' + imgSource);
    const mapsURL = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(place.name + ", " + safeCity + ", India");

    const highlightsList = (place.guide && place.guide.highlights) ? place.guide.highlights : [
        "Discover the unique architectural beauty and historic craftsmanship of " + place.name,
        "Capture scenic photographs from the best viewing angles",
        "Experience the vibrant regional history and cultural stories of " + safeCity,
        "Sample local street food snacks and traditional refreshments nearby"
    ];
    const highlightsHTML = highlightsList.map(h => '<li>' + escapeHTML(h) + '</li>').join('');

    content.innerHTML = \`
        <div class="guide-hero-banner img-skeleton">
            <img class="guide-hero-img" 
                 src="\${photo}" 
                 alt="\${safeName}" 
                 onload="ImageService.onImgLoad(this)"
                 onerror="ImageService.handleImgError(this, '\${escapeJS(place.name)}', '\${escapeJS(safeCity)}', '\${escapeJS(safeState)}', '\${escapeJS(place.category || '')}')">
            <div class="guide-hero-overlay">
                <div style="margin-bottom:8px;">
                    <span style="background:var(--primary); color:white; font-size:11.5px; font-weight:800; padding:4px 12px; border-radius:var(--radius-full); text-transform:uppercase;">\${safeCat}</span>
                    <span style="background:rgba(0,0,0,0.6); color:#ffc107; font-size:11.5px; font-weight:800; padding:4px 10px; border-radius:var(--radius-full); margin-left:6px;">⭐ \${rating} / 5</span>
                </div>
                <h1 class="guide-hero-title">\${safeName}</h1>
                <p class="guide-hero-subtitle">📍 \${safeCity}, \${safeState}, India</p>
            </div>
            <div class="img-attribution-pill" style="bottom:16px; right:16px;" title="\${escapeHTML(imgAttribution)}">
                📷 \${escapeHTML(imgSource)}
            </div>
        </div>

        <div class="guide-stats-grid">
            <div class="stat-card">
                <span class="stat-icon">🗓️</span>
                <div class="stat-info">
                    <strong>Best Season</strong>
                    <span>\${safeBest}</span>
                </div>
            </div>

            <div class="stat-card">
                <span class="stat-icon">⏰</span>
                <div class="stat-info">
                    <strong>Visiting Hours</strong>
                    <span>\${safeTime}</span>
                </div>
            </div>

            <div class="stat-card">
                <span class="stat-icon">🎟️</span>
                <div class="stat-info">
                    <strong>Entry Fee</strong>
                    <span>\${safeFee}</span>
                </div>
            </div>
        </div>

        <div class="guide-block">
            <h3>🏛️ History & Heritage</h3>
            <p class="guide-text">\${safeHist}</p>
            <p class="guide-text" style="color:#64748b; font-size:13.5px; margin-top:8px;">\${safeDesc}</p>
        </div>

        <div class="guide-block">
            <h3>✨ Top Highlights & Things to Do</h3>
            <ul class="guide-highlights-list">\${highlightsHTML}</ul>
        </div>

        <div class="guide-two-col">
            <div class="guide-sub-block">
                <h4>🚗 How to Reach</h4>
                <p>\${safeReach}</p>
            </div>
            <div class="guide-sub-block">
                <h4>🍛 Food Specialties Nearby</h4>
                <p>\${safeFood}</p>
            </div>
        </div>

        <div class="tips-block" style="margin-bottom:20px;">
            <h3>💡 Pro Travel Tips</h3>
            <p>\${safeTips}</p>
        </div>

        <div class="guide-action-bar">
            <a class="btn" style="background:#ff5722; color:#fff;" href="\${mapsURL}" target="_blank" rel="noopener">📍 Open in Google Maps</a>
            <button class="btn" style="background:#0f172a; color:#fff;" onclick="openRideForPlace('\${escapeJS(place.name)}', '\${escapeJS(safeCity)}')">🚕 Compare Fares</button>
            <button class="btn" style="background:#0f766e; color:#fff;" onclick="jumpToStay('\${escapeJS(safeCity)}', '\${escapeJS(safeState)}')">🏨 Find Stays</button>
            <button class="btn" style="background:#ea580c; color:#fff;" onclick="jumpToFood('\${escapeJS(safeCity)}', '\${escapeJS(safeState)}')">🍽️ Local Food</button>
        </div>
    \`;

    popup.style.display = "flex";
}

function closeGuidePopup() {
    const popup = document.getElementById("guidePopup");
    if (popup) popup.style.display = "none";
}

// ==========================================
// SEARCH AUTOCOMPLETE & EXECUTION
// ==========================================
function searchSuggestions() {
    const input = document.getElementById("searchInput");
    const val = input.value.trim().toLowerCase();
    const box = document.getElementById("suggestions");

    box.innerHTML = "";
    if (val === "" || !window.INDIA_TRAVEL_DATA) {
        box.style.display = "none";
        return;
    }

    const matches = [];

    // Match states
    Object.keys(window.INDIA_TRAVEL_DATA).forEach(stateName => {
        if (stateName.toLowerCase().includes(val)) {
            matches.push({
                type: "state",
                icon: "🇮🇳",
                title: stateName,
                subtitle: "State / UT • 30 Top Destinations",
                tag: "State",
                state: stateName
            });
        }

        // Match destinations
        const stateObj = window.INDIA_TRAVEL_DATA[stateName];
        (stateObj.destinations || []).forEach(dest => {
            if (dest.name.toLowerCase().includes(val)) {
                matches.push({
                    type: "destination",
                    icon: "📍",
                    title: dest.name,
                    subtitle: (dest.district || stateName) + " • 15 Attractions",
                    tag: "Destination",
                    state: stateName,
                    destId: dest.id || dest.name
                });
            }

            // Match attractions
            (dest.attractions || []).forEach((attr, aIdx) => {
                if (attr.name.toLowerCase().includes(val)) {
                    matches.push({
                        type: "attraction",
                        icon: "🏛️",
                        title: attr.name,
                        subtitle: dest.name + ", " + stateName,
                        tag: "Attraction",
                        state: stateName,
                        destId: dest.id || dest.name,
                        attrIndex: aIdx
                    });
                }
            });
        });
    });

    if (matches.length === 0) {
        box.innerHTML = '<div style="padding:15px; color:#94a3b8; text-align:center;">No matching states, destinations, or attractions found.</div>';
        box.style.display = "block";
        return;
    }

    matches.slice(0, 10).forEach(item => {
        const div = document.createElement("div");
        div.className = "suggestion";
        div.innerHTML = \`
            <div class="suggestion-left">
                <span class="suggestion-icon">\${item.icon}</span>
                <div>
                    <div class="suggestion-title">\${escapeHTML(item.title)}</div>
                    <div class="suggestion-subtitle">\${escapeHTML(item.subtitle)}</div>
                </div>
            </div>
            <span class="suggestion-tag">\${item.tag}</span>
        \`;

        div.onclick = function() {
            box.style.display = "none";
            input.value = item.title;

            if (item.type === "state") {
                selectQuickState(item.state);
                document.getElementById("places").scrollIntoView({ behavior: "smooth" });
            } else if (item.type === "destination") {
                selectState(item.state);
                openDestinationDetails(item.state, item.destId);
            } else if (item.type === "attraction") {
                selectState(item.state);
                openDestinationDetails(item.state, item.destId);
                setTimeout(() => {
                    openAttractionGuideByIndex(item.attrIndex);
                }, 400);
            }
        };

        box.appendChild(div);
    });

    box.style.display = "block";
}

function performSearch() {
    const input = document.getElementById("searchInput");
    const val = input.value.trim().toLowerCase();
    if (!val || !window.INDIA_TRAVEL_DATA) return;

    const matchedState = Object.keys(window.INDIA_TRAVEL_DATA).find(s => s.toLowerCase() === val || s.toLowerCase().includes(val));
    if (matchedState) {
        selectQuickState(matchedState);
        document.getElementById("places").scrollIntoView({ behavior: "smooth" });
        return;
    }

    for (const stateName of Object.keys(window.INDIA_TRAVEL_DATA)) {
        const dest = (window.INDIA_TRAVEL_DATA[stateName].destinations || []).find(d => d.name.toLowerCase().includes(val));
        if (dest) {
            selectState(stateName);
            openDestinationDetails(stateName, dest.id || dest.name);
            return;
        }
    }
}

function searchEnter(event) {
    if (event.key === "Enter") {
        performSearch();
    }
}

document.addEventListener("click", function(event) {
    const searchArea = document.querySelector(".search-area");
    const box = document.getElementById("suggestions");
    if (box && searchArea && !searchArea.contains(event.target)) {
        box.style.display = "none";
    }
});

// ==========================================
// SMART TRAVEL ROUTE & ITINERARY PLANNER (#planner)
// ==========================================
function setPlannerMode(mode, btn) {
    currentPlannerMode = mode;
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    calculateRouteAndItinerary();
}

function detectGPSOrigin() {
    if (!navigator.geolocation) {
        showToast("Geolocation not supported by your browser", "⚠️");
        return;
    }
    showToast("Detecting your GPS location...", "⏳");
    navigator.geolocation.getCurrentPosition(
        pos => {
            pickupLatitude = pos.coords.latitude;
            pickupLongitude = pos.coords.longitude;
            const originInput = document.getElementById("plannerOrigin");
            if (originInput) originInput.value = "Current Location (" + pos.coords.latitude.toFixed(3) + ", " + pos.coords.longitude.toFixed(3) + ")";
            showToast("GPS location captured!", "✅");
            calculateRouteAndItinerary();
        },
        err => {
            showToast("Location permission denied. Please enter city manually.", "⚠️");
        },
        { timeout: 10000, enableHighAccuracy: true }
    );
}

function calculateRouteAndItinerary() {
    const origin = (document.getElementById("plannerOrigin") ? document.getElementById("plannerOrigin").value : "Bengaluru").trim();
    const destName = currentSelectedDestination ? currentSelectedDestination.name : "Mysore";
    const stateName = currentSelectedState || "Karnataka";
    const days = parseInt(document.getElementById("plannerDays") ? document.getElementById("plannerDays").value : "3", 10);
    const style = document.getElementById("plannerStyle") ? document.getElementById("plannerStyle").value : "balanced";

    const destField = document.getElementById("plannerDestination");
    if (destField) destField.value = destName + ", " + stateName;

    // Route Metrics Calculation
    const route = calculateLocalRouteMetrics(origin, destName, stateName);

    // Update Route result boxes
    const distEl = document.getElementById("routeDistVal");
    const timeEl = document.getElementById("routeTimeVal");
    const fuelEl = document.getElementById("routeFuelVal");
    const tollEl = document.getElementById("routeTollVal");

    if (distEl) distEl.innerText = route.roadDistanceKm + " km";
    if (timeEl) timeEl.innerText = route.drivingTime;
    if (fuelEl) fuelEl.innerText = "₹" + route.fuelCostINR.toLocaleString();
    if (tollEl) tollEl.innerText = "₹" + route.tollEstimateINR.toLocaleString();

    // Update Cab fares
    const autoPill = document.getElementById("fareAutoPill");
    const sedanPill = document.getElementById("fareSedanPill");
    const suvPill = document.getElementById("fareSuvPill");

    if (autoPill) autoPill.innerText = route.roadDistanceKm <= 40 ? ("🛺 Auto: ₹" + (35 + route.roadDistanceKm * 14)) : "🛺 Auto: City only";
    if (sedanPill) sedanPill.innerText = "🚗 Sedan: ₹" + (80 + route.roadDistanceKm * 18).toLocaleString();
    if (suvPill) suvPill.innerText = "🚙 SUV: ₹" + (130 + route.roadDistanceKm * 24).toLocaleString();

    // Update Google Maps embed & Nav button
    const mapIframe = document.getElementById("routeMapIframe");
    if (mapIframe) {
        mapIframe.src = "https://maps.google.com/maps?saddr=" + encodeURIComponent(origin) + "&daddr=" + encodeURIComponent(destName + ", " + stateName) + "&output=embed";
    }

    const navBtn = document.getElementById("btnOpenGoogleNav");
    if (navBtn) {
        navBtn.href = "https://www.google.com/maps/dir/?api=1&origin=" + encodeURIComponent(origin) + "&destination=" + encodeURIComponent(destName + ", " + stateName);
    }

    // Generate Practical Day-by-Day Itinerary
    renderPracticalItinerary(stateName, destName, days, style);
}

function calculateLocalRouteMetrics(originStr, destStr, destState) {
    const originLower = originStr.toLowerCase().replace(/current location.*/, '').trim() || 'bengaluru';
    const destLower = destStr.toLowerCase().trim();

    let originCoords = INDIAN_CITIES_COORDS[originLower] || { lat: 12.9716, lon: 77.5946, name: originStr, isHilly: false };
    let destCoords = INDIAN_CITIES_COORDS[destLower] || { lat: 12.2958, lon: 76.6394, name: destStr, isHilly: false };

    // Haversine
    const R = 6371;
    const dLat = (destCoords.lat - originCoords.lat) * Math.PI / 180;
    const dLon = (destCoords.lon - originCoords.lon) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(originCoords.lat * Math.PI / 180) * Math.cos(destCoords.lat * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const aerialKm = R * c;

    const terrainFactor = (originCoords.isHilly || destCoords.isHilly) ? 1.38 : 1.24;
    const roadDistanceKm = Math.max(12, Math.round(aerialKm * terrainFactor));

    const avgSpeed = (originCoords.isHilly || destCoords.isHilly) ? 38 : 62;
    const drivingHours = (roadDistanceKm / avgSpeed) + 0.5;
    const dHours = Math.floor(drivingHours);
    const dMins = Math.round((drivingHours - dHours) * 60);

    const fuelLiters = Math.round((roadDistanceKm / 14) * 10) / 10;
    const fuelCostINR = Math.round(fuelLiters * 101);
    const tollEstimateINR = roadDistanceKm > 40 ? Math.round(roadDistanceKm * 1.65) : 0;

    return {
        roadDistanceKm,
        drivingTime: dHours > 0 ? (dHours + " hr " + dMins + " min") : (dMins + " min"),
        fuelCostINR,
        tollEstimateINR
    };
}

function renderPracticalItinerary(stateName, destName, days, style) {
    const listEl = document.getElementById("itineraryDaysList");
    const subEl = document.getElementById("itinSubtitle");
    if (!listEl) return;

    if (subEl) subEl.innerText = "Customized " + days + "-Day Plan for " + destName + ", " + stateName;

    const stateData = window.INDIA_TRAVEL_DATA[stateName];
    if (!stateData) return;

    const dest = (stateData.destinations || []).find(d => d.name.toLowerCase() === destName.toLowerCase()) || (stateData.destinations ? stateData.destinations[0] : null);
    if (!dest) return;

    const attractions = dest.attractions || [];
    const totalAttrs = attractions.length;

    let html = '';

    for (let day = 1; day <= days; day++) {
        const startIdx = ((day - 1) * 2) % totalAttrs;
        const attr1 = attractions[startIdx] || attractions[0];
        const attr2 = attractions[(startIdx + 1) % totalAttrs] || attractions[1];
        const attr3 = days <= 3 && totalAttrs > 2 ? attractions[(startIdx + 2) % totalAttrs] : null;

        const dayTheme = day === 1 ? "Arrival, Iconic Highlights & City Introduction" :
                         day === 2 ? "Historic Palaces, Heritage Walk & Traditional Bazaars" :
                         day === 3 ? "Scenic Viewpoints, Nature Parks & Sunset Views" :
                         day === 4 ? "Surrounding Excursions & Hidden Gems" :
                         day === 5 ? "Artisan Crafts, Regional Cuisine & Culture" :
                         "Relaxed Sightseeing, Souvenir Shopping & Departure";

        html += \`
            <div class="itin-day-card">
                <div class="itin-day-title">
                    <span class="itin-day-badge">Day \${day}</span>
                    <span>\${dayTheme}</span>
                </div>

                <div class="itin-slot">
                    <div class="itin-slot-time">08:30 AM<br>Morning</div>
                    <div class="itin-slot-content">
                        <h4>\${escapeHTML(attr1.name)} (\${escapeHTML(attr1.category || "Top Sight")})</h4>
                        <p>\${escapeHTML(attr1.shortDesc)}</p>
                        <div class="itin-slot-meta">⏰ Hours: \${escapeHTML((attr1.guide && attr1.guide.timings) || "9:00 AM – 5:30 PM")} • 🎟️ Fee: \${escapeHTML((attr1.guide && attr1.guide.entryFee) || "Standard")}</div>
                    </div>
                </div>

                <div class="itin-slot">
                    <div class="itin-slot-time">12:30 PM<br>Afternoon</div>
                    <div class="itin-slot-content">
                        <h4>🍛 Regional Food Lunch Stop</h4>
                        <p>Enjoy an authentic lunch featuring \${escapeHTML(dest.localFood || "famous regional thali and specialties")} at a celebrated local restaurant.</p>
                        <div class="itin-slot-meta">💡 Tip: Rest during peak midday heat before resuming exploration.</div>
                    </div>
                </div>

                <div class="itin-slot">
                    <div class="itin-slot-time">03:30 PM<br>Late Noon</div>
                    <div class="itin-slot-content">
                        <h4>\${escapeHTML(attr2.name)} (\${escapeHTML(attr2.category || "Scenic Sight")})</h4>
                        <p>\${escapeHTML(attr2.shortDesc)}</p>
                        <div class="itin-slot-meta">⏰ Hours: \${escapeHTML((attr2.guide && attr2.guide.timings) || "Open till 6:30 PM")} • 🎟️ Fee: \${escapeHTML((attr2.guide && attr2.guide.entryFee) || "Nominal")}</div>
                    </div>
                </div>
        \`;

        if (attr3 && day === 1) {
            html += \`
                <div class="itin-slot">
                    <div class="itin-slot-time">07:00 PM<br>Evening</div>
                    <div class="itin-slot-content">
                        <h4>\${escapeHTML(attr3.name)}</h4>
                        <p>\${escapeHTML(attr3.shortDesc)}</p>
                        <div class="itin-slot-meta">✨ Perfect for evening illuminations and relaxed walking.</div>
                    </div>
                </div>
            \`;
        }

        html += \`</div>\`;
    }

    listEl.innerHTML = html;
}

function copyItineraryToClipboard() {
    const listEl = document.getElementById("itineraryDaysList");
    if (!listEl) return;
    const text = listEl.innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast("Itinerary copied to clipboard!", "📋");
    }).catch(() => {
        showToast("Press Ctrl+C to copy itinerary", "ℹ️");
    });
}

function printItinerary() {
    window.print();
}

function shareItineraryWhatsApp() {
    const dest = currentSelectedDestination ? currentSelectedDestination.name : "Mysore";
    const state = currentSelectedState;
    const days = document.getElementById("plannerDays") ? document.getElementById("plannerDays").value : "3";
    const url = "https://travelguru.com/";
    const msg = "🧭 *My " + days + "-Day Trip Itinerary for " + dest + ", " + state + " on TravelGuru:*%0A" +
                "Explore complete attractions, verified photography, and route details here: " + encodeURIComponent(url);
    window.open("https://api.whatsapp.com/send?text=" + msg, "_blank");
}

function jumpToPlanner(destName, stateName) {
    if (stateName) selectState(stateName);
    const destField = document.getElementById("plannerDestination");
    if (destField) destField.value = destName + ", " + stateName;
    document.getElementById("planner").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
        calculateRouteAndItinerary();
    }, 300);
}

// ==========================================
// REAL HOTELS & ACCOMMODATIONS SEARCH (#stay)
// ==========================================
function searchLiveHotels() {
    const destName = currentSelectedDestination ? currentSelectedDestination.name : "Mysore";
    const checkIn = document.getElementById("hotelCheckIn") ? document.getElementById("hotelCheckIn").value : "";
    const checkOut = document.getElementById("hotelCheckOut") ? document.getElementById("hotelCheckOut").value : "";
    const guests = document.getElementById("hotelGuests") ? document.getElementById("hotelGuests").value : "2-1";
    const stayType = document.getElementById("hotelStayType") ? document.getElementById("hotelStayType").value : "all";

    renderBookingProviders(destName, checkIn, checkOut, guests);
    renderVerifiedStays(destName, currentSelectedState, stayType);

    showToast("Live hotel searches updated for " + destName, "🏨");
}

function renderBookingProviders(destName, checkIn, checkOut, guests) {
    const grid = document.getElementById("bookingProvidersGrid");
    if (!grid) return;

    const adults = guests.split("-")[0] || "2";

    // Build real affiliate / search URLs
    const bookingUrl = "https://www.booking.com/searchresults.html?ss=" + encodeURIComponent(destName + ", India") + (checkIn ? "&checkin=" + checkIn : "") + (checkOut ? "&checkout=" + checkOut : "") + "&group_adults=" + adults;
    const agodaUrl = "https://www.agoda.com/search?city=" + encodeURIComponent(destName) + (checkIn ? "&checkIn=" + checkIn : "") + (checkOut ? "&checkOut=" + checkOut : "") + "&rooms=1&adults=" + adults;
    const mmtUrl = "https://www.makemytrip.com/hotels/hotel-listing/?city=" + encodeURIComponent(destName);
    const goibiboUrl = "https://www.goibibo.com/hotels/hotels-in-" + encodeURIComponent(destName.toLowerCase().replace(/\\s+/g, '-')) + "-ct/";
    const oyoUrl = "https://www.oyorooms.com/search?location=" + encodeURIComponent(destName);
    const airbnbUrl = "https://www.airbnb.co.in/s/" + encodeURIComponent(destName + ", India") + "/homes" + (checkIn ? "?checkin=" + checkIn : "") + (checkOut ? "&checkout=" + checkOut : "");

    grid.innerHTML = \`
        <a class="provider-card" href="\${bookingUrl}" target="_blank" rel="noopener">
            <div>
                <div class="provider-name" style="color:#003580;">Booking.com</div>
                <div class="provider-tagline">Global verified hotels & free cancellations</div>
            </div>
            <span class="provider-btn" style="background:#003580;">View Live Rates ↗</span>
        </a>

        <a class="provider-card" href="\${agodaUrl}" target="_blank" rel="noopener">
            <div>
                <div class="provider-name" style="color:#2a75d3;">Agoda India</div>
                <div class="provider-tagline">Special mobile discounts & resort deals</div>
            </div>
            <span class="provider-btn" style="background:#2a75d3;">Compare Prices ↗</span>
        </a>

        <a class="provider-card" href="\${mmtUrl}" target="_blank" rel="noopener">
            <div>
                <div class="provider-name" style="color:#e41d24;">MakeMyTrip</div>
                <div class="provider-tagline">India's leading domestic travel network</div>
            </div>
            <span class="provider-btn" style="background:#e41d24;">Search Rooms ↗</span>
        </a>

        <a class="provider-card" href="\${goibiboUrl}" target="_blank" rel="noopener">
            <div>
                <div class="provider-name" style="color:#f26722;">Goibibo</div>
                <div class="provider-tagline">Verified traveler reviews & budget stays</div>
            </div>
            <span class="provider-btn" style="background:#f26722;">Check Stays ↗</span>
        </a>

        <a class="provider-card" href="\${oyoUrl}" target="_blank" rel="noopener">
            <div>
                <div class="provider-name" style="color:#ee2e24;">Oyo Rooms</div>
                <div class="provider-tagline">Standardized budget rooms & townhouses</div>
            </div>
            <span class="provider-btn" style="background:#ee2e24;">Find Budget Rooms ↗</span>
        </a>

        <a class="provider-card" href="\${airbnbUrl}" target="_blank" rel="noopener">
            <div>
                <div class="provider-name" style="color:#ff385c;">Airbnb India</div>
                <div class="provider-tagline">Authentic local homestays & private villas</div>
            </div>
            <span class="provider-btn" style="background:#ff385c;">Explore Homestays ↗</span>
        </a>
    \`;
}

function renderVerifiedStays(destName, stateName, stayType = "all") {
    const grid = document.getElementById("verifiedStaysGrid");
    const titleEl = document.getElementById("verifiedStaysTitle");
    if (!grid) return;

    if (titleEl) titleEl.innerText = "⭐ Verified Reputable Stays in " + destName;

    let stays = CURATED_HOTELS[destName] || [
        { name: destName + " Grand Palace Hotel", type: "Heritage & Luxury", location: "Central City, " + destName, priceTier: "₹4,500 – ₹8,000 / night", amenities: ["Free WiFi", "AC Deluxe", "Restaurant", "Travel Desk"] },
        { name: "Hotel Mayura " + destName + " (State Tourism)", type: "Official State Tourism Lodge", location: "Near Railway Station, " + destName, priceTier: "₹1,600 – ₹2,800 / night", amenities: ["Govt Verified", "Free Parking", "AC Rooms", "Dining"] },
        { name: destName + " Residency & Suites", type: "Comfort Boutique Hotel", location: "Main Tourist Road, " + destName, priceTier: "₹2,200 – ₹4,000 / night", amenities: ["Free Breakfast", "WiFi", "Room Service", "AC"] },
        { name: "Zostel / Traveler Hostel " + destName, type: "Youth Backpacker Stay", location: "Old Town, " + destName, priceTier: "₹650 – ₹1,800 / night", amenities: ["Dorms & Privates", "WiFi", "Community Lounge", "Cafe"] }
    ];

    if (stayType !== "all") {
        stays = stays.filter(s => s.type.toLowerCase().includes(stayType));
    }

    grid.innerHTML = stays.map(s => {
        const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(s.name + ", " + destName + ", India");
        const bookingUrl = "https://www.booking.com/searchresults.html?ss=" + encodeURIComponent(s.name + ", " + destName);

        const amenityPills = (s.amenities || []).map(a => '<span class="amenity-pill">' + escapeHTML(a) + '</span>').join('');

        return \`
            <div class="stay-hotel-card">
                <div>
                    <div class="stay-hotel-type">\${escapeHTML(s.type)}</div>
                    <div class="stay-hotel-title">\${escapeHTML(s.name)}</div>
                    <div class="stay-hotel-loc">📍 \${escapeHTML(s.location)}</div>
                    <div class="stay-amenities-pills">\${amenityPills}</div>
                </div>

                <div>
                    <div class="stay-price-row">
                        <span class="stay-price-val">\${escapeHTML(s.priceTier)}</span>
                        <a class="btn-attr-util" href="\${mapsUrl}" target="_blank" rel="noopener">📍 Directions</a>
                    </div>
                    <a class="btn btn-explore-dest" style="display:block; text-align:center; text-decoration:none; margin-top:12px; padding:10px;" href="\${bookingUrl}" target="_blank" rel="noopener">Check Live Availability ↗</a>
                </div>
            </div>
        \`;
    }).join('');
}

function jumpToStay(destName, stateName) {
    if (stateName) selectState(stateName);
    const input = document.getElementById("hotelDestInput");
    if (input) input.value = destName + ", " + stateName;
    document.getElementById("stay").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
        searchLiveHotels();
    }, 300);
}

// ==========================================
// REGIONAL FOOD & DINING EXPLORER (#food)
// ==========================================
function renderFoodSpecialties(stateName, destName) {
    const titleEl = document.getElementById("foodHeroTitle");
    const dishesEl = document.getElementById("foodHeroDishes");
    if (!titleEl || !dishesEl) return;

    titleEl.innerText = "🍛 Authentic " + stateName + " Culinary Specialties";
    dishesEl.innerText = REGIONAL_FOOD_SPECIALTIES[stateName] || (destName + " regional traditional meals, famous local thali, street snacks, and sweet savories.");
}

function renderRestaurants(destName, stateName, filterTag = "all") {
    const grid = document.getElementById("restaurantsGrid");
    if (!grid) return;

    let list = CURATED_RESTAURANTS[destName] || [
        { name: "Iconic " + destName + " Heritage Mess", cuisine: "Authentic Regional Cuisine", tags: ["heritage"], cost: "₹350 for two", timing: "11:30 AM – 10:30 PM", dish: "Signature Traditional Regional Thali with Desi Ghee", address: "Main Bazaar, " + destName },
        { name: destName + " Pure Veg Bhavan", cuisine: "Pure Satvik Vegetarian", tags: ["veg"], cost: "₹200 for two", timing: "7:00 AM – 10:00 PM", dish: "Crispy Golden Dosas, Filter Coffee & Sweet Delicacies", address: "Temple Road, " + destName },
        { name: "Famous Chaat & Street Eats", cuisine: "Local Street Food", tags: ["street"], cost: "₹150 for two", timing: "4:00 PM – 10:30 PM", dish: "Famous Golgappe, Samosa Chaat & Regional Sweets", address: "Clock Tower Circle, " + destName },
        { name: "The Grand Royal Dining Hall", cuisine: "Fine Dining & Mughlai", tags: ["finedine"], cost: "₹1,400 for two", timing: "12:30 PM – 11:00 PM", dish: "Royal Tandoori Platters & Signature Biryani", address: "Palace Road, " + destName }
    ];

    if (filterTag !== "all") {
        list = list.filter(r => (r.tags || []).includes(filterTag));
    }

    grid.innerHTML = list.map(r => {
        const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(r.name + ", " + destName + ", India");
        const swiggyUrl = "https://www.swiggy.com/search?query=" + encodeURIComponent(r.name + " " + destName);
        const zomatoUrl = "https://www.zomato.com/search?q=" + encodeURIComponent(r.name + " " + destName);

        return \`
            <div class="restaurant-card">
                <div>
                    <div class="restaurant-cuisine">\${escapeHTML(r.cuisine)}</div>
                    <div class="restaurant-title">\${escapeHTML(r.name)}</div>
                    <div class="restaurant-specialty">⭐ <strong>Must Try:</strong> \${escapeHTML(r.dish)}</div>
                    <div class="restaurant-meta">
                        <div>💰 <strong>Approx Cost:</strong> \${escapeHTML(r.cost)}</div>
                        <div>⏰ <strong>Hours:</strong> \${escapeHTML(r.timing)}</div>
                        <div>📍 <strong>Address:</strong> \${escapeHTML(r.address)}</div>
                    </div>
                </div>

                <div class="restaurant-actions">
                    <a class="btn-attr-util" style="background:#ff5722; color:white; border:none;" href="\${mapsUrl}" target="_blank" rel="noopener">📍 Directions</a>
                    <a class="btn-attr-util" style="background:#fc8019; color:white; border:none;" href="\${swiggyUrl}" target="_blank" rel="noopener">🛵 Swiggy</a>
                </div>
            </div>
        \`;
    }).join('');
}

function filterFoodByTag(tag, btn) {
    currentFoodTag = tag;
    document.querySelectorAll(".food-filter-chip").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    const destName = currentSelectedDestination ? currentSelectedDestination.name : "Mysore";
    renderRestaurants(destName, currentSelectedState, tag);
}

function jumpToFood(destName, stateName) {
    if (stateName) selectState(stateName);
    document.getElementById("food").scrollIntoView({ behavior: "smooth" });
}

// ==========================================
// MULTI-MODAL TRANSPORT HUB (#transport)
// ==========================================
function switchTransportTab(tabId, btn) {
    currentTransportTab = tabId;
    document.querySelectorAll(".transport-tab-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    document.querySelectorAll(".transport-pane").forEach(p => p.classList.remove("active"));
    const pane = document.getElementById("pane-" + tabId);
    if (pane) pane.classList.add("active");
}

function renderTransportHub(destName, stateName) {
    const destLower = destName.toLowerCase();
    const cityInfo = INDIAN_CITIES_COORDS[destLower] || { airport: 'BLR', station: 'MYS' };

    const stationCode = cityInfo.station || (destName.substring(0, 3).toUpperCase());
    const airportCode = cityInfo.airport || 'BLR';

    // Trains
    const trainsContent = document.getElementById("trainsContent");
    if (trainsContent) {
        const irctcUrl = "https://www.irctc.co.in/nget/train-search";
        const ntesUrl = "https://enquiry.indianrail.gov.in";
        trainsContent.innerHTML = \`
            <div class="transport-card">
                <h4>🚆 Primary Railway Station</h4>
                <p style="font-size:18px; font-weight:800; color:var(--primary); margin:6px 0;">\${escapeHTML(destName)} Junction (Station Code: \${stationCode})</p>
                <p style="font-size:13.5px; color:#475569; margin-bottom:14px;">Direct express connections linking major junctions across India with regular superfast and Vande Bharat services.</p>
                <div style="display:flex; gap:8px;">
                    <a class="btn-attr-util" style="background:#003366; color:white; border:none; padding:10px 14px;" href="\${irctcUrl}" target="_blank" rel="noopener">Book on IRCTC Official ↗</a>
                    <a class="btn-attr-util" style="padding:10px 14px;" href="\${ntesUrl}" target="_blank" rel="noopener">Live Running Status ↗</a>
                </div>
            </div>

            <div class="transport-card">
                <h4>🎫 PNR & Live Train Tracking</h4>
                <p style="font-size:13.5px; color:#475569; margin:8px 0 14px;">Check live seat availability, PNR confirmation prediction, and station platforms on authorized portals.</p>
                <a class="btn-attr-util" style="display:inline-block; padding:10px 14px;" href="https://www.confirmtkt.com" target="_blank" rel="noopener">Check PNR & Seat Availability ↗</a>
            </div>
        \`;
    }

    // Flights
    const flightsContent = document.getElementById("flightsContent");
    if (flightsContent) {
        const flightsUrl = "https://www.google.com/travel/flights?q=Flights%20to%20" + airportCode;
        const mmtFlightUrl = "https://www.makemytrip.com/flights/";
        flightsContent.innerHTML = \`
            <div class="transport-card">
                <h4>✈️ Nearest Airport</h4>
                <p style="font-size:18px; font-weight:800; color:var(--teal); margin:6px 0;">Airport Code: \${airportCode} (Serving \${escapeHTML(destName)})</p>
                <p style="font-size:13.5px; color:#475569; margin-bottom:14px;">Connected with daily non-stop and connecting domestic flights across major metro cities.</p>
                <div style="display:flex; gap:8px;">
                    <a class="btn-attr-util" style="background:var(--teal); color:white; border:none; padding:10px 14px;" href="\${flightsUrl}" target="_blank" rel="noopener">Search Google Flights ↗</a>
                    <a class="btn-attr-util" style="padding:10px 14px;" href="\${mmtFlightUrl}" target="_blank" rel="noopener">MakeMyTrip Flights ↗</a>
                </div>
            </div>
        \`;
    }

    // Buses
    const busesContent = document.getElementById("busesContent");
    if (busesContent) {
        const redBusUrl = "https://www.redbus.in/bus-tickets/" + encodeURIComponent(destName.toLowerCase());
        const abhiBusUrl = "https://www.abhibus.com";
        busesContent.innerHTML = \`
            <div class="transport-card">
                <h4>🚌 State RTC & Luxury Sleeper Buses</h4>
                <p style="font-size:14px; color:#475569; margin:6px 0 14px;">Direct government transport services (\${escapeHTML(stateName)} State RTC) and private AC Multi-Axle Volvo sleepers.</p>
                <div style="display:flex; gap:8px;">
                    <a class="btn-attr-util" style="background:#d84e55; color:white; border:none; padding:10px 14px;" href="\${redBusUrl}" target="_blank" rel="noopener">Search on RedBus ↗</a>
                    <a class="btn-attr-util" style="padding:10px 14px;" href="\${abhiBusUrl}" target="_blank" rel="noopener">Search on AbhiBus ↗</a>
                </div>
            </div>
        \`;
    }
}

function jumpToTransport(destName, stateName) {
    if (stateName) selectState(stateName);
    document.getElementById("transport").scrollIntoView({ behavior: "smooth" });
}

function updateExternalPanels(destName, stateName) {
    const plannerDest = document.getElementById("plannerDestination");
    if (plannerDest) plannerDest.value = destName + ", " + stateName;
    const hotelDest = document.getElementById("hotelDestInput");
    if (hotelDest) hotelDest.value = destName + ", " + stateName;

    renderFoodSpecialties(stateName, destName);
    renderRestaurants(destName, stateName, currentFoodTag);
    renderTransportHub(destName, stateName);
}

// ==========================================
// RIDE MODAL FUNCTIONS
// ==========================================
function openRideForPlace(placeName, cityName) {
    closeAllPopups();
    const popup = document.getElementById("ridePopup");
    const ridePlace = document.getElementById("ridePlace");
    if (!popup || !ridePlace) return;

    ridePlace.value = placeName + " (" + cityName + ")";
    updateRideComparison();
    popup.style.display = "flex";
}

function setPickupMode(mode) {
    const gpsOption = document.getElementById("gpsOption");
    const manualOption = document.getElementById("manualOption");
    const status = document.getElementById("locationStatus");
    const pickupInput = document.getElementById("pickupLocation");

    if (mode === "gps") {
        if (gpsOption) gpsOption.classList.add("active");
        if (manualOption) manualOption.classList.remove("active");
        if (pickupInput) pickupInput.placeholder = "Click Detect My Current Location";
        if (status) status.innerText = "GPS selected. Click Detect My Current Location to capture your coordinates.";
    } else {
        if (gpsOption) gpsOption.classList.remove("active");
        if (manualOption) manualOption.classList.add("active");
        if (pickupInput) {
            pickupInput.placeholder = "Enter your hotel, station, or landmark...";
            pickupInput.focus();
        }
        if (status) status.innerText = "Manual mode selected. Please type your pickup address above.";
    }
}

function useCurrentLocation() {
    const status = document.getElementById("locationStatus");
    const pickupInput = document.getElementById("pickupLocation");

    if (!navigator.geolocation) {
        if (status) status.innerText = "⚠️ Geolocation is not supported by your browser.";
        return;
    }

    if (status) status.innerText = "⏳ Detecting your GPS location...";

    navigator.geolocation.getCurrentPosition(
        function(position) {
            pickupLatitude = position.coords.latitude;
            pickupLongitude = position.coords.longitude;
            const coordStr = "Lat: " + pickupLatitude.toFixed(4) + ", Long: " + pickupLongitude.toFixed(4);
            if (pickupInput) pickupInput.value = "Current Location (" + coordStr + ")";
            if (status) status.innerText = "✅ GPS Captured: " + coordStr;
            updateRideComparison();
        },
        function(error) {
            if (status) status.innerText = "⚠️ Location access denied. Please enter pickup address manually.";
            setPickupMode("manual");
        },
        { timeout: 10000, enableHighAccuracy: true }
    );
}

function updateRideComparison() {
    const container = document.getElementById("rideComparison");
    if (!container) return;

    const vehicleInputs = document.getElementsByName("vehicle");
    let selectedVehicle = "auto";
    for (const v of vehicleInputs) {
        if (v.checked) selectedVehicle = v.value;
    }

    const rates = {
        auto: { base: 35, perKm: 14, name: "Auto", icon: "🛺" },
        sedan: { base: 80, perKm: 20, name: "Sedan Cab", icon: "🚗" },
        suv: { base: 130, perKm: 26, name: "SUV Cab", icon: "🚙" }
    };

    const rate = rates[selectedVehicle] || rates.auto;
    const estFare = Math.round(rate.base + (rideDistanceKm * rate.perKm));

    const rapidoFare = Math.max(30, Math.round(estFare * 0.92));
    const olaFare = estFare;
    const uberFare = Math.round(estFare * 1.05);

    container.innerHTML = \`
        <div class="ride-card">
            <div style="font-weight:800; color:#ff5722;">Rapido</div>
            <div style="font-size:20px; font-weight:800; margin:6px 0;">₹\${rapidoFare}</div>
            <div style="font-size:11px; color:#64748b;">Fastest Budget Ride</div>
            <a class="btn-attr-util" style="display:inline-block; margin-top:8px; background:#ff5722; color:#fff;" href="https://www.rapido.bike" target="_blank" rel="noopener">Open Rapido</a>
        </div>

        <div class="ride-card" style="border-color:#ff5722;">
            <div style="font-weight:800; color:#10b981;">Ola Cabs</div>
            <div style="font-size:20px; font-weight:800; margin:6px 0;">₹\${olaFare}</div>
            <div style="font-size:11px; color:#64748b;">Popular Standard</div>
            <a class="btn-attr-util" style="display:inline-block; margin-top:8px; background:#10b981; color:#fff;" href="https://book.olacabs.com" target="_blank" rel="noopener">Open Ola</a>
        </div>

        <div class="ride-card">
            <div style="font-weight:800; color:#0f172a;">Uber</div>
            <div style="font-size:20px; font-weight:800; margin:6px 0;">₹\${uberFare}</div>
            <div style="font-size:11px; color:#64748b;">Reliable AC Cabs</div>
            <a class="btn-attr-util" style="display:inline-block; margin-top:8px; background:#0f172a; color:#fff;" href="https://m.uber.com" target="_blank" rel="noopener">Open Uber</a>
        </div>
    \`;
}

function submitRide(event) {
    event.preventDefault();

    const name = document.getElementById("passengerName").value;
    const phone = document.getElementById("passengerPhone").value;
    const count = document.getElementById("passengerCount").value;
    const date = document.getElementById("travelDate").value;
    const dest = document.getElementById("ridePlace").value;
    const pickup = document.getElementById("pickupLocation").value || "Specified in notes";
    const notes = document.getElementById("rideMessage").value || "None";

    const vehicleInputs = document.getElementsByName("vehicle");
    let vehicle = "Auto";
    for (const v of vehicleInputs) {
        if (v.checked) vehicle = v.value.toUpperCase();
    }

    const message = "🚕 *TRAVELGURU RIDE REQUEST* 🚕%0A" +
        "-------------------------------------%0A" +
        "👤 *Passenger:* " + encodeURIComponent(name) + "%0A" +
        "📱 *Phone:* " + encodeURIComponent(phone) + "%0A" +
        "👥 *Passengers:* " + encodeURIComponent(count) + "%0A" +
        "📅 *Travel Date:* " + encodeURIComponent(date) + "%0A" +
        "📍 *Pickup:* " + encodeURIComponent(pickup) + "%0A" +
        "🏁 *Destination:* " + encodeURIComponent(dest) + "%0A" +
        "🚗 *Vehicle Type:* " + encodeURIComponent(vehicle) + "%0A" +
        "📝 *Notes:* " + encodeURIComponent(notes) + "%0A" +
        "-------------------------------------%0A" +
        "Sent via TravelGuru.com Booking Assistant";

    const whatsappUrl = "https://api.whatsapp.com/send?phone=919999999999&text=" + message;
    window.open(whatsappUrl, "_blank");
}

// ==========================================
// FOOD POPUP MODAL
// ==========================================
function openFoodForPlace(placeName, cityName) {
    closeAllPopups();
    const popup = document.getElementById("foodPopup");
    const foodText = document.getElementById("foodText");
    if (!popup || !foodText) return;

    foodText.innerText = "Discover popular dining spots, famous regional street eats, and quick online delivery near " + placeName + ", " + cityName + ".";
    popup.style.display = "flex";
}

function findDelivery(service) {
    const result = document.getElementById("foodResult");
    const dest = (currentSelectedAttraction ? currentSelectedAttraction.name : (currentSelectedDestination ? currentSelectedDestination.name : currentSelectedState));

    if (service === "Zomato") {
        const url = "https://www.zomato.com/search?q=" + encodeURIComponent(dest);
        window.open(url, "_blank");
    } else if (service === "Swiggy") {
        const url = "https://www.swiggy.com/search?query=" + encodeURIComponent(dest);
        window.open(url, "_blank");
    } else {
        const url = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(service + " near " + dest);
        result.innerHTML = \`
            <p>Searching nearest <strong>\${escapeHTML(service)}</strong> outlets around <strong>\${escapeHTML(dest)}</strong>.</p>
            <a class="btn-attr-util" style="display:inline-block; margin-top:8px; background:#ff5722; color:#fff;" href="\${url}" target="_blank" rel="noopener">📍 Open in Google Maps</a>
        \`;
    }
}

function findFoodTier(tier) {
    const dest = (currentSelectedAttraction ? currentSelectedAttraction.name : (currentSelectedDestination ? currentSelectedDestination.name : currentSelectedState));
    const queries = {
        budget: "cheap street food and budget restaurants near " + dest,
        moderate: "popular family restaurants and cafes near " + dest,
        premium: "fine dining luxury restaurants near " + dest
    };
    const url = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(queries[tier]);
    window.open(url, "_blank");
}

// ==========================================
// UI HELPERS & NOTIFICATIONS
// ==========================================
function showToast(message, icon = "ℹ️") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = '<span>' + icon + '</span><span>' + escapeHTML(message) + '</span>';

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(15px)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

function toggleMobileMenu() {
    const drawer = document.getElementById("mobileDrawer");
    if (drawer) {
        drawer.classList.toggle("open");
    }
}

function closePopup(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
}

function closeAllPopups() {
    document.querySelectorAll(".popup").forEach(p => p.style.display = "none");
}

function escapeHTML(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeJS(text) {
    return String(text || "")
        .replace(/\\\\/g, "\\\\\\\\")
        .replace(/'/g, "\\\\'")
        .replace(/\\n/g, " ");
}

window.addEventListener("click", function(event) {
    if (event.target.classList.contains("popup")) {
        event.target.style.display = "none";
    }
});
</script>
</body>
</html>
`;

// Assemble final.html
const finalHtml = markup + jsCode;
fs.writeFileSync('final.html', finalHtml);
console.log("final.html successfully written! Total size: " + Math.round(finalHtml.length / 1024) + " KB (" + finalHtml.split('\n').length + " lines).");
