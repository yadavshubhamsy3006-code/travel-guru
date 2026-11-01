const fs = require('fs');
const { fetchWikiImage, imageCache, CACHE_FILE } = require('./generator_data/image_enricher');

// Load database
global.window = {};
require('./travel_database.js');
const db = window.INDIA_TRAVEL_DATA;

const KEY_DESTINATIONS = [
    { state: "Karnataka", dest: "Mysore" },
    { state: "Rajasthan", dest: "Jaipur" },
    { state: "Maharashtra", dest: "Mumbai" },
    { state: "Kerala", dest: "Munnar" },
    { state: "Tamil Nadu", dest: "Madurai" },
    { state: "Uttar Pradesh", dest: "Varanasi" },
    { state: "Delhi", dest: "Old Delhi" },
    { state: "Goa", dest: "Old Goa" },
    { state: "Punjab", dest: "Amritsar" },
    { state: "West Bengal", dest: "Kolkata" },
    { state: "Himachal Pradesh", dest: "Shimla" },
    { state: "Odisha", dest: "Puri" }
];

async function runEnrichment() {
    console.log("=================================================");
    console.log("STARTING MASTER PHOTO ENRICHMENT FOR TRAVEL GURU");
    console.log("=================================================");

    let destCount = 0;
    let attrCount = 0;

    // Phase 1: Enrich all 15 attractions for the 12 target destinations
    console.log("\n>>> PHASE 1: Enriching All 15 Attractions for 12 Target Destinations across 12 States...");
    for (const item of KEY_DESTINATIONS) {
        const stateObj = db[item.state];
        if (!stateObj) {
            console.log(`State ${item.state} not found!`);
            continue;
        }

        const dest = stateObj.destinations.find(d => 
            d.name.toLowerCase().includes(item.dest.toLowerCase()) ||
            item.dest.toLowerCase().includes(d.name.toLowerCase())
        );

        if (!dest) {
            console.log(`Destination ${item.dest} in ${item.state} not found!`);
            continue;
        }

        console.log(`\n======================================================`);
        console.log(`Enriching 15 Attractions for: ${dest.name} (${item.state})`);
        console.log(`======================================================`);

        // Also enrich destination cover
        const coverImg = await fetchWikiImage(dest.name, dest.district, item.state);
        if (coverImg) {
            dest.coverImage = coverImg.url;
            dest.imageSource = coverImg.source;
            dest.imageAttribution = coverImg.attribution;
            destCount++;
            console.log(`  [COVER] ${dest.name} -> ${coverImg.title}`);
        }

        if (dest.attractions) {
            for (let i = 0; i < dest.attractions.length; i++) {
                const attr = dest.attractions[i];
                const img = await fetchWikiImage(attr.name, dest.name, item.state);
                if (img) {
                    attr.image = img.url;
                    attr.imageSource = img.source;
                    attr.imageAttribution = img.attribution;
                    attrCount++;
                    console.log(`  [ATTR ${i + 1}/15] ${attr.name} -> ${img.title}`);
                }
            }
        }
        fs.writeFileSync(CACHE_FILE, JSON.stringify(imageCache, null, 2), 'utf8');
    }

    // Phase 2: Enrich all 30 destination covers for the 12 target states
    console.log("\n>>> PHASE 2: Enriching Destination Covers for 12 States (30 per state)...");
    for (const item of KEY_DESTINATIONS) {
        const stateObj = db[item.state];
        if (!stateObj || !stateObj.destinations) continue;

        console.log(`\n--- State: ${item.state} (${stateObj.destinations.length} destinations) ---`);
        for (const dest of stateObj.destinations) {
            // Only fetch if not already verified Wikimedia photo
            if (dest.coverImage && dest.coverImage.includes('wikimedia.org')) continue;

            const img = await fetchWikiImage(dest.name, dest.district, item.state);
            if (img) {
                dest.coverImage = img.url;
                dest.imageSource = img.source;
                dest.imageAttribution = img.attribution;
                destCount++;
                console.log(`  [DEST COVER] ${dest.name} -> ${img.title}`);
            }
        }
        fs.writeFileSync(CACHE_FILE, JSON.stringify(imageCache, null, 2), 'utf8');
    }

    console.log("\n=================================================");
    console.log(`Master Enrichment Finished!`);
    console.log(`Enriched Destination Covers: ${destCount}`);
    console.log(`Enriched Attractions:        ${attrCount}`);
    console.log(`Total Cached Images:         ${Object.keys(imageCache).length}`);
    console.log("=================================================");

    // Save updated travel_database.js and india_travel_database.json
    const jsContent = `// =========================================================================
// TravelGuru Master Database: All 36 Indian States & UTs (Verified Real Photos)
// =========================================================================
var INDIA_TRAVEL_DATA = ${JSON.stringify(db)};
if (typeof window !== 'undefined') { window.INDIA_TRAVEL_DATA = INDIA_TRAVEL_DATA; }
if (typeof module !== 'undefined') { module.exports = INDIA_TRAVEL_DATA; }
`;
    fs.writeFileSync('travel_database.js', jsContent, 'utf8');
    fs.writeFileSync('india_travel_database.json', JSON.stringify(db, null, 2), 'utf8');
    console.log("Successfully wrote verified real images to travel_database.js & india_travel_database.json!");
}

runEnrichment();
