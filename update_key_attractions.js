const fs = require('fs');
const { makeDestination } = require('./generator_data/helper');

global.window = {};
require('./travel_database.js');
const db = window.INDIA_TRAVEL_DATA;

const varanasiAttrs = [
    'Kashi Vishwanath Temple',
    'Dashashwamedh Ghat & Evening Ganga Aarti',
    'Assi Ghat',
    'Manikarnika Ghat',
    'Sarnath (Deer Park & Dhamek Stupa)',
    'Banaras Hindu University (New Vishwanath Temple)',
    'Ramnagar Fort & Museum',
    'Tulsi Manas Mandir',
    'Bharat Mata Mandir',
    'Sankat Mochan Hanuman Temple',
    'Harishchandra Ghat',
    'Durga Kund & Temple',
    'Alamgir Mosque (Beni Madhav Ka Darera)',
    'Chaukhandi Stupa',
    'Scindia Ghat & Leaning Shiva Temple'
];

const oldDelhiAttrs = [
    'Red Fort (Lal Qila UNESCO)',
    'Jama Masjid (Largest Mosque in India)',
    'Chandni Chowk Market Walk',
    'Paranthe Wali Gali',
    'Gurudwara Sis Ganj Sahib',
    'Fatehpuri Masjid',
    'Mirza Ghalib Ki Haveli (Ballimaran)',
    'Khari Baoli (Asia\'s Largest Spice Market)',
    'Digambar Jain Lal Mandir & Bird Hospital',
    'Dariba Kalan (Silver & Jewelry Lane)',
    'Begum Samru\'s Palace (Bhagirath Palace)',
    'Kinari Bazaar (Bridal & Tinsel Market)',
    'Chunnamal Haveli',
    'Gauri Shankar Temple Chandni Chowk',
    'Sunheri Masjid (Golden Mosque Chandni Chowk)'
];

const shimlaAttrs = [
    'The Mall Road Shimla',
    'The Ridge & Scandal Point',
    'Jakhoo Temple & Colossal Hanuman Statue',
    'Christ Church Shimla (Neo-Gothic 1857)',
    'Kufri Snow Viewpoint & Fun World',
    'Viceregal Lodge (Indian Institute of Advanced Study)',
    'Chadwick Falls',
    'Tara Devi Temple',
    'Summer Hill & Himachal Pradesh University',
    'Annandale Ground & Army Heritage Museum',
    'Kalka-Shimla Toy Train Heritage Railway',
    'Kali Bari Temple Shimla',
    'Green Valley Viewpoint',
    'Mashobra & Craignano Nature Park',
    'Lakkar Bazaar (Wooden Crafts & Antiques)'
];

// Update UP -> Varanasi
const up = db['Uttar Pradesh'];
const vDest = up.destinations.find(d => d.name.toLowerCase().includes('varanasi'));
if (vDest) {
    const updated = makeDestination({
        name: 'Varanasi',
        state: 'Uttar Pradesh',
        district: 'Varanasi District',
        category: 'Sacred Pilgrimage & Spiritual Ghats',
        rating: 4.9,
        duration: '2-3 Days',
        bestSeason: 'October to March',
        shortDesc: 'The spiritual capital of India on the sacred Ganges, celebrated for Kashi Vishwanath, eternal cremation ghats, and mesmerizing evening Ganga aarti.',
        attractionTemplates: varanasiAttrs
    });
    const idx = up.destinations.indexOf(vDest);
    up.destinations[idx] = updated;
    console.log('Updated Varanasi attractions!');
}

// Update Delhi -> Old Delhi
const dl = db['Delhi'];
const odDest = dl.destinations.find(d => d.name.toLowerCase().includes('old delhi'));
if (odDest) {
    const updated = makeDestination({
        name: 'Old Delhi',
        state: 'Delhi',
        district: 'Central Delhi',
        category: 'Mughal Architecture & Street Culture',
        rating: 4.9,
        duration: '1-2 Days',
        bestSeason: 'October to March',
        shortDesc: 'The historic heart of Shahjahanabad, bustling with Mughal masterpieces like Red Fort, Jama Masjid, Khari Baoli spice bazaar, and famous street food.',
        attractionTemplates: oldDelhiAttrs
    });
    const idx = dl.destinations.indexOf(odDest);
    dl.destinations[idx] = updated;
    console.log('Updated Old Delhi attractions!');
}

// Update HP -> Shimla
const hp = db['Himachal Pradesh'];
const shDest = hp.destinations.find(d => d.name.toLowerCase().includes('shimla'));
if (shDest) {
    const updated = makeDestination({
        name: 'Shimla',
        state: 'Himachal Pradesh',
        district: 'Shimla District',
        category: 'Colonial Hill Station & Himalayan Peaks',
        rating: 4.8,
        duration: '2-3 Days',
        bestSeason: 'March to June & December to February (Snow)',
        shortDesc: 'The erstwhile British summer capital nestled among pine forests, renowned for The Mall, Christ Church, Jakhoo Temple, and UNESCO Toy Train.',
        attractionTemplates: shimlaAttrs
    });
    const idx = hp.destinations.indexOf(shDest);
    hp.destinations[idx] = updated;
    console.log('Updated Shimla attractions!');
}

// Save
const jsContent = `// =========================================================================
// TravelGuru Master Database: All 36 Indian States & UTs (100% Real Geographies)
// =========================================================================
var INDIA_TRAVEL_DATA = ${JSON.stringify(db)};
if (typeof window !== 'undefined') { window.INDIA_TRAVEL_DATA = INDIA_TRAVEL_DATA; }
if (typeof module !== 'undefined') { module.exports = INDIA_TRAVEL_DATA; }
`;

fs.writeFileSync('travel_database.js', jsContent, 'utf8');
fs.writeFileSync('india_travel_database.json', JSON.stringify(db, null, 2), 'utf8');
console.log('Saved updated database successfully!');
