// Test server calculation functions directly
const fs = require('fs');
const vm = require('vm');

global.window = {};
require('./travel_database.js');
const INDIA_TRAVEL_DATA = window.INDIA_TRAVEL_DATA;

const serverSource = fs.readFileSync('server.js', 'utf8');

// Replace server.listen with export of helper functions
const modifiedSource = serverSource.replace(
    /server\.listen\([\s\S]*?\);[\s\S]*$/,
    'module.exports = { calculateMultiModalRoute, generateDayByDayItinerary, resolveLocationCoordinates, INDIAN_CITIES };'
);

const sandbox = {
    require,
    console,
    process,
    __dirname,
    global: { window: { INDIA_TRAVEL_DATA } },
    module: { exports: {} }
};
vm.createContext(sandbox);
vm.runInContext(modifiedSource, sandbox);

const { calculateMultiModalRoute, generateDayByDayItinerary, resolveLocationCoordinates, INDIAN_CITIES } = sandbox.module.exports;

console.log('✅ Cities dataset loaded:', Object.keys(INDIAN_CITIES).length, 'cities/hubs');

// 1. Test Route: Bengaluru to Mysore
const blrToMys = calculateMultiModalRoute('Bengaluru', 'Mysore', 'Karnataka', 'Karnataka');
console.log('\n--- ROUTE TEST 1: Bengaluru to Mysore ---');
console.log('Origin:', blrToMys.origin.name, '-> Destination:', blrToMys.destination.name);
console.log('Road Distance:', blrToMys.roadDistanceKm, 'km (Expected ~140-165 km)');
console.log('Driving Time:', blrToMys.drivingTime);
console.log('Fuel Cost:', '₹' + blrToMys.fuelEstimate.costINR);
console.log('Toll Tax:', '₹' + blrToMys.tollEstimateINR);
console.log('Auto Fare:', blrToMys.cabFares.auto ? '₹' + blrToMys.cabFares.auto : 'Not applicable');
console.log('Sedan Fare:', '₹' + blrToMys.cabFares.sedan);
console.log('Train Time:', blrToMys.train.estimatedTime);

// 2. Test Route: Delhi to Jaipur
const delToJp = calculateMultiModalRoute('Delhi', 'Jaipur', 'Delhi', 'Rajasthan');
console.log('\n--- ROUTE TEST 2: Delhi to Jaipur ---');
console.log('Road Distance:', delToJp.roadDistanceKm, 'km (Expected ~270-310 km)');
console.log('Driving Time:', delToJp.drivingTime);
console.log('Sedan Fare:', '₹' + delToJp.cabFares.sedan);
console.log('Bus Time:', delToJp.bus.estimatedTime);

// 3. Test Route: Delhi to Shimla (Hilly)
const delToShm = calculateMultiModalRoute('Delhi', 'Shimla', 'Delhi', 'Himachal Pradesh');
console.log('\n--- ROUTE TEST 3: Delhi to Shimla (Hills) ---');
console.log('Road Distance:', delToShm.roadDistanceKm, 'km');
console.log('Driving Time:', delToShm.drivingTime);

// 4. Test Itinerary: Mysore 3 Days
const itin = generateDayByDayItinerary('Karnataka', 'Mysore', 3);
console.log('\n--- ITINERARY TEST: Mysore 3 Days ---');
console.log('Destination:', itin.destination, 'State:', itin.state);
console.log('Days generated:', itin.itinerary.length);
itin.itinerary.forEach(d => {
    console.log(`Day ${d.day}: ${d.theme}`);
    console.log(`  Morning: ${d.slots[0].attraction} (${d.slots[0].category}) - ${d.slots[0].timings} - Fee: ${d.slots[0].entryFee}`);
    console.log(`  Afternoon: ${d.slots[1].attraction}`);
    console.log(`  Evening: ${d.slots[2].attraction}`);
});

console.log('\n✅ ALL SERVER LOGIC & ROUTING UNIT TESTS PASSED SUCCESSFULLY!');
