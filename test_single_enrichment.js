const { fetchWikiImage } = require('./generator_data/image_enricher');

async function test() {
    console.log("Testing Wikimedia Commons enrichment for sample destinations & attractions...");
    const samples = [
        { name: "Mysore Palace", city: "Mysuru", state: "Karnataka" },
        { name: "Chamundi Hills", city: "Mysuru", state: "Karnataka" },
        { name: "Hawa Mahal", city: "Jaipur", state: "Rajasthan" },
        { name: "Gateway of India", city: "Mumbai", state: "Maharashtra" },
        { name: "Eravikulam National Park", city: "Munnar", state: "Kerala" },
        { name: "Meenakshi Amman Temple", city: "Madurai", state: "Tamil Nadu" },
        { name: "Kashi Vishwanath Temple", city: "Varanasi", state: "Uttar Pradesh" },
        { name: "Golden Temple", city: "Amritsar", state: "Punjab" },
        { name: "Victoria Memorial", city: "Kolkata", state: "West Bengal" },
        { name: "Dal Lake", city: "Srinagar", state: "Jammu and Kashmir" }
    ];

    for (const item of samples) {
        const start = Date.now();
        const res = await fetchWikiImage(item.name, item.city, item.state);
        const elapsed = Date.now() - start;
        console.log(`[${elapsed}ms] ${item.name} -> ${res ? res.url : 'FAILED'} (${res ? res.title : ''})`);
    }
}

test();
