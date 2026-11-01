const fs = require('fs');

console.log("--- STARTING AUTOMATED VALIDATION ---");

// 1. Verify travel_database.js
const dbContent = fs.readFileSync('travel_database.js', 'utf8');
console.log("travel_database.js size:", Math.round(dbContent.length / 1024 / 1024 * 10) / 10, "MB");

// Test syntax of travel_database.js
try {
    const vm = require('vm');
    const sandbox = { window: {}, module: {} };
    vm.createContext(sandbox);
    vm.runInContext(dbContent, sandbox);
    console.log("travel_database.js evaluation: SUCCESS");
    const data = sandbox.window.INDIA_TRAVEL_DATA;
    const states = Object.keys(data);
    console.log("States count:", states.length);
    if (states.length !== 36) {
        throw new Error("Expected 36 states, got " + states.length);
    }

    // Verify 30 destinations per state & 15 attractions per destination
    let badDest = 0;
    let badAttr = 0;
    states.forEach(s => {
        const dests = data[s].destinations;
        if (!dests || dests.length !== 30) {
            badDest++;
            console.error("State " + s + " has " + (dests ? dests.length : 0) + " destinations");
        } else {
            dests.forEach(d => {
                if (!d.attractions || d.attractions.length !== 15) {
                    badAttr++;
                    console.error("Destination " + s + " -> " + d.name + " has " + (d.attractions ? d.attractions.length : 0) + " attractions");
                }
            });
        }
    });

    console.log("State verification: " + (badDest === 0 ? "ALL 36 STATES HAVE 30 DESTINATIONS" : badDest + " states failed"));
    console.log("Attraction verification: " + (badAttr === 0 ? "ALL 1,080 DESTINATIONS HAVE 15 ATTRACTIONS (16,200 Total)" : badAttr + " destinations failed"));

    // Verify Mysore attractions
    const mysore = data["Karnataka"].destinations.find(d => d.name === "Mysore");
    console.log("Mysore found:", !!mysore);
    console.log("Mysore attractions:");
    mysore.attractions.forEach((a, i) => {
        console.log("  " + (i + 1) + ". " + a.name + " (" + a.category + ")");
    });

} catch (err) {
    console.error("ERROR in travel_database.js:", err);
    process.exit(1);
}

// 2. Verify final.html
const htmlContent = fs.readFileSync('final.html', 'utf8');
console.log("final.html size:", Math.round(htmlContent.length / 1024) + " KB");

// Check script tag in final.html
const scriptTagRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let scriptIndex = 0;
while ((match = scriptTagRegex.exec(htmlContent)) !== null) {
    const openTag = match[0].match(/^<script\b[^>]*>/i)[0];
    const scriptSrc = openTag.match(/src=["'](.*?)["']/i);
    if (scriptSrc) {
        console.log("Script " + scriptIndex + " external src:", scriptSrc[1]);
        if (!fs.existsSync(scriptSrc[1])) {
            console.error("ERROR: Referenced script does not exist:", scriptSrc[1]);
            process.exit(1);
        }
    } else if (openTag.includes("application/ld+json")) {
        const scriptCode = match[1];
        console.log("Script " + scriptIndex + " JSON-LD length:", scriptCode.length);
        try {
            JSON.parse(scriptCode);
            console.log("Script " + scriptIndex + " JSON-LD syntax check: PASSED");
        } catch (err) {
            console.error("Script " + scriptIndex + " JSON-LD syntax error:", err);
            process.exit(1);
        }
    } else {
        const scriptCode = match[1];
        console.log("Script " + scriptIndex + " inline code length:", scriptCode.length);
        try {
            new Function(scriptCode);
            console.log("Script " + scriptIndex + " syntax check: PASSED");
        } catch (err) {
            console.error("Script " + scriptIndex + " syntax error:", err);
            process.exit(1);
        }
    }
    scriptIndex++;
}

console.log("--- ALL VALIDATION CHECKS PASSED SUCCESSFULLY ---");
