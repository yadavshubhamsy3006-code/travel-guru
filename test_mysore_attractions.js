const { fetchWikiImage } = require('./generator_data/image_enricher');

async function testMysore() {
    console.log("Testing Mysore 15 attractions...");
    const mysoreAttractions = [
        "Mysore Palace",
        "Chamundi Hills",
        "Brindavan Gardens",
        "Mysore Zoo",
        "St. Philomena's Church",
        "Karanji Lake",
        "Jaganmohan Palace",
        "Railway Museum Mysore",
        "Sand Sculpture Museum Mysore",
        "Kukkarahalli Lake",
        "Lalitha Mahal Palace",
        "Regional Museum of Natural History Mysore",
        "Ranganathittu Bird Sanctuary",
        "Srirangapatna",
        "Balmuri Falls"
    ];

    for (let i = 0; i < mysoreAttractions.length; i++) {
        const name = mysoreAttractions[i];
        const res = await fetchWikiImage(name, "Mysuru", "Karnataka");
        console.log(`[${i+1}/15] ${name} -> ${res ? res.url : 'FAILED'} (${res ? res.title : ''})`);
    }
}

testMysore();
