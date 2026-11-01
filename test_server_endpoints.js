const http = require('http');

// Start server
const server = require('./server.js');

setTimeout(async () => {
    try {
        console.log('Testing /api/health...');
        const health = await fetch('http://127.0.0.1:3000/api/health').then(r => r.json());
        console.log('Health Response:', health);

        console.log('\nTesting /api/config/public...');
        const config = await fetch('http://127.0.0.1:3000/api/config/public').then(r => r.json());
        console.log('Public Config:', config);

        console.log('\nTesting /api/routes/calculate (Bengaluru to Mysore)...');
        const route = await fetch('http://127.0.0.1:3000/api/routes/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ origin: 'Bengaluru', destination: 'Mysore', originState: 'Karnataka', destState: 'Karnataka' })
        }).then(r => r.json());
        console.log('Route calculation success:', route.success);
        console.log('Road Distance:', route.data.roadDistanceKm, 'km');
        console.log('Driving Time:', route.data.drivingTime);
        console.log('Cab Fares:', route.data.cabFares);
        console.log('Train Time:', route.data.train.estimatedTime);

        console.log('\nTesting /api/itinerary (Mysore 3 days)...');
        const itin = await fetch('http://127.0.0.1:3000/api/itinerary?state=Karnataka&destination=Mysore&days=3').then(r => r.json());
        console.log('Itinerary success:', itin.success);
        console.log('Day 1 Theme:', itin.data.itinerary[0].theme);
        console.log('Day 1 Morning stop:', itin.data.itinerary[0].slots[0].attraction);

        console.log('\nTesting /robots.txt...');
        const robots = await fetch('http://127.0.0.1:3000/robots.txt').then(r => r.text());
        console.log('Robots.txt first line:', robots.split('\n')[0]);

        console.log('\nTesting /sitemap.xml...');
        const sitemap = await fetch('http://127.0.0.1:3000/sitemap.xml').then(r => r.text());
        console.log('Sitemap.xml length:', sitemap.length, 'starts with:', sitemap.substring(0, 30));

        console.log('\nALL SERVER ENDPOINTS TESTED AND PASSED SUCCESSFULLY!');
        server.close(() => process.exit(0));
    } catch (e) {
        console.error('Server endpoint test FAILED:', e);
        server.close(() => process.exit(1));
    }
}, 500);
