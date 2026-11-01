const fs = require('fs');
const { fetchWikiImage, imageCache, CACHE_FILE } = require('./generator_data/image_enricher');

// Load current travel_database.js
global.window = {};
require('./travel_database.js');
const data = window.INDIA_TRAVEL_DATA;

const TARGET_STATES = [
    "Karnataka",
    "Rajasthan",
    "Maharashtra",
    "Kerala",
    "Tamil Nadu",
    "Uttar Pradesh",
    "Delhi",
    "Goa",
    "Punjab",
    "West Bengal",
    "Odisha",
    "Assam",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Ladakh"
];

async function enrichStates() {
    console.log(`Starting image enrichment for ${TARGET_STATES.length} target states...`);

    let enrichedDests = 0;
    let enrichedAttrs = 0;

    for (const stateName of TARGET_STATES) {
        const stateObj = data[stateName];
        if (!stateObj || !stateObj.destinations) continue;

        console.log(`\n==============================================`);
        console.log(`Enriching ${stateName} (30 Destinations)...`);
        console.log(`==============================================`);

        for (const dest of stateObj.destinations) {
            // Enrich destination cover
            const destImg = await fetchWikiImage(dest.name, dest.district, stateName);
            if (destImg) {
                dest.coverImage = destImg.url;
                dest.imageSource = destImg.source;
                dest.imageAttribution = destImg.attribution;
                enrichedDests++;
                console.log(`  [DEST] ${dest.name} -> ${destImg.title}`);
            }

            // Enrich top 15 attractions
            if (dest.attractions) {
                for (let i = 0; i < dest.attractions.length; i++) {
                    const attr = dest.attractions[i];
                    const attrImg = await fetchWikiImage(attr.name, dest.name, stateName);
                    if (attrImg) {
                        attr.image = attrImg.url;
                        attr.imageSource = attrImg.source;
                        attr.imageAttribution = attrImg.attribution;
                        enrichedAttrs++;
                        console.log(`    [ATTR ${i + 1}] ${attr.name} -> ${attrImg.title}`);
                    }
                }
            }

            // Save cache periodically
            fs.writeFileSync(CACHE_FILE, JSON.stringify(imageCache, null, 2), 'utf8');
        }
    }

    console.log(`\n==============================================`);
    console.log(`Enrichment complete!`);
    console.log(`Enriched destinations: ${enrichedDests}`);
    console.log(`Enriched attractions:  ${enrichedAttrs}`);
    console.log(`Total cached images:    ${Object.keys(imageCache).length}`);
    console.log(`==============================================`);

    // Write updated database
    const jsContent = `// =========================================================================
// TravelGuru Master Database: All 36 Indian States & UTs (Enriched Images)
// =========================================================================
var INDIA_TRAVEL_DATA = ${JSON.stringify(data)};
if (typeof window !== 'undefined') { window.INDIA_TRAVEL_DATA = INDIA_TRAVEL_DATA; }
if (typeof module !== 'undefined') { module.exports = INDIA_TRAVEL_DATA; }
`;
    fs.writeFileSync('travel_database.js', jsContent, 'utf8');
    fs.writeFileSync('india_travel_database.json', JSON.stringify(data, null, 2), 'utf8');
    console.log("Updated travel_database.js and india_travel_database.json successfully.");
}

enrichStates();
