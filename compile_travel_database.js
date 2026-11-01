const fs = require('fs');
const { SOUTH_INDIA } = require('./generator_data/south_india');
const { NORTH_INDIA } = require('./generator_data/north_india');
const { NORTH_REMAINING } = require('./generator_data/north_remaining');
const { WEST_CENTRAL_INDIA } = require('./generator_data/west_central');
const { EAST_NORTHEAST_INDIA } = require('./generator_data/east_northeast');

console.log("Merging all regional databases...");

const MASTER_DATA = {};

// Merge all regions
Object.assign(MASTER_DATA, SOUTH_INDIA);
Object.assign(MASTER_DATA, NORTH_INDIA);
Object.assign(MASTER_DATA, NORTH_REMAINING);
Object.assign(MASTER_DATA, WEST_CENTRAL_INDIA);
Object.assign(MASTER_DATA, EAST_NORTHEAST_INDIA);

const stateNames = Object.keys(MASTER_DATA).sort();
console.log(`Total States & UTs: ${stateNames.length}`);

let totalDestinations = 0;
let totalAttractions = 0;

stateNames.forEach((stateName, idx) => {
    const s = MASTER_DATA[stateName];
    if (!s.destinations) {
        throw new Error(`State ${stateName} has no destinations array!`);
    }
    if (s.destinations.length !== 30) {
        console.warn(`WARNING: State ${stateName} has ${s.destinations.length} destinations instead of 30!`);
    }
    totalDestinations += s.destinations.length;

    s.destinations.forEach((dest, dIdx) => {
        if (!dest.attractions || dest.attractions.length !== 15) {
            console.warn(`WARNING: ${stateName} -> ${dest.name} has ${dest.attractions ? dest.attractions.length : 0} attractions instead of 15!`);
        }
        totalAttractions += (dest.attractions ? dest.attractions.length : 0);
    });
});

console.log(`\n========================================`);
console.log(`VERIFICATION SUMMARY:`);
console.log(`Total States & UTs: ${stateNames.length} (Expected: 36)`);
console.log(`Total Destinations: ${totalDestinations} (Expected: 1,080)`);
console.log(`Total Attractions:  ${totalAttractions} (Expected: 16,200)`);
console.log(`========================================\n`);

// Write out travel_database.js
const jsContent = `// =========================================================================
// TravelGuru Master Database: All 36 Indian States & UTs
// 30 Tourist Destinations per State (1,080 total)
// 15 Attractions per Destination (16,200 total)
// =========================================================================
var INDIA_TRAVEL_DATA = ${JSON.stringify(MASTER_DATA)};
if (typeof window !== 'undefined') { window.INDIA_TRAVEL_DATA = INDIA_TRAVEL_DATA; }
if (typeof module !== 'undefined') { module.exports = INDIA_TRAVEL_DATA; }
`;

fs.writeFileSync('travel_database.js', jsContent, 'utf8');
console.log("Successfully wrote travel_database.js (File size: " + Math.round(fs.statSync('travel_database.js').size / 1024 / 1024 * 10) / 10 + " MB)");

// Also update india_travel_database.json for structured JSON format compatibility
fs.writeFileSync('india_travel_database.json', JSON.stringify(MASTER_DATA, null, 2), 'utf8');
console.log("Successfully updated india_travel_database.json (File size: " + Math.round(fs.statSync('india_travel_database.json').size / 1024 / 1024 * 10) / 10 + " MB)");
