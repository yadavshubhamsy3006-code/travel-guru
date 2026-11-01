// Simulation of the browser runtime for final.html
const fs = require('fs');
const vm = require('vm');

console.log("Setting up simulated browser DOM environment...");

// Mock DOM elements
class MockElement {
    constructor(tag, id = '') {
        this.tagName = tag.toUpperCase();
        this.id = id;
        this._innerHTML = '';
        this.innerText = '';
        this.value = '';
        this.style = {};
        this.classList = {
            classes: new Set(),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            toggle(c, force) {
                if (force === undefined) {
                    if (this.classes.has(c)) this.classes.delete(c);
                    else this.classes.add(c);
                } else if (force) this.classes.add(c);
                else this.classes.delete(c);
            },
            contains(c) { return this.classes.has(c); }
        };
        this.children = [];
    }

    set innerHTML(val) {
        this._innerHTML = val;
        if (val === '') this.children = [];
    }

    get innerHTML() {
        return this._innerHTML || '';
    }

    appendChild(child) {
        this.children.push(child);
        return child;
    }

    scrollIntoView() {}
}

const domElements = {
    stateSelect: new MockElement('select', 'stateSelect'),
    citySelect: new MockElement('select', 'citySelect'),
    searchInput: new MockElement('input', 'searchInput'),
    suggestions: new MockElement('div', 'suggestions'),
    travelBreadcrumb: new MockElement('div', 'travelBreadcrumb'),
    stateBanner: new MockElement('div', 'stateBanner'),
    stateDestinationsView: new MockElement('div', 'stateDestinationsView'),
    destinationDetailsView: new MockElement('div', 'destinationDetailsView'),
    placesTitle: new MockElement('h2', 'placesTitle'),
    placesSubtitle: new MockElement('p', 'placesSubtitle'),
    destSearchInput: new MockElement('input', 'destSearchInput'),
    destinationGrid: new MockElement('div', 'destinationGrid'),
    destHeroBanner: new MockElement('div', 'destHeroBanner'),
    destSpecsGrid: new MockElement('div', 'destSpecsGrid'),
    destInsightsGrid: new MockElement('div', 'destInsightsGrid'),
    attractionsTitle: new MockElement('h2', 'attractionsTitle'),
    attractionsSubtitle: new MockElement('p', 'attractionsSubtitle'),
    attractionsGrid: new MockElement('div', 'attractionsGrid'),
    guidePopup: new MockElement('div', 'guidePopup'),
    guideContent: new MockElement('div', 'guideContent'),
    ridePopup: new MockElement('div', 'ridePopup'),
    ridePlace: new MockElement('input', 'ridePlace'),
    travelDate: new MockElement('input', 'travelDate'),
    rideComparison: new MockElement('div', 'rideComparison'),
    foodPopup: new MockElement('div', 'foodPopup'),
    foodText: new MockElement('p', 'foodText'),
    foodResult: new MockElement('div', 'foodResult'),
    stayResult: new MockElement('div', 'stayResult'),
    stay: new MockElement('section', 'stay'),
    places: new MockElement('section', 'places')
};

const mockDocument = {
    getElementById(id) {
        if (!domElements[id]) {
            domElements[id] = new MockElement('div', id);
        }
        return domElements[id];
    },
    createElement(tag) {
        return new MockElement(tag);
    },
    getElementsByName(name) {
        return [{ checked: true, value: 'auto' }];
    },
    querySelectorAll(selector) {
        return [];
    },
    querySelector(selector) {
        return new MockElement('div');
    },
    addEventListener(event, handler) {}
};

const mockWindow = {
    scrollTo() {},
    addEventListener(event, handler) {},
    open() {},
    location: { href: '' }
};

// Load travel_database.js
const dbCode = fs.readFileSync('travel_database.js', 'utf8');

// Extract script 1 from final.html
const htmlContent = fs.readFileSync('final.html', 'utf8');
const scriptMatch = htmlContent.match(/<script>([\s\S]*?)<\/script>/);
const appJsCode = scriptMatch[1];

const sandbox = {
    window: mockWindow,
    document: mockDocument,
    navigator: { geolocation: {} },
    console: console,
    setTimeout: (fn) => fn(),
    encodeURIComponent: encodeURIComponent,
    Math: Math,
    Date: Date,
    String: String,
    Object: Object,
    Array: Array
};

vm.createContext(sandbox);

// 1. Run database code
vm.runInContext(dbCode, sandbox);
console.log("Sandbox database loaded. States:", Object.keys(sandbox.window.INDIA_TRAVEL_DATA).length);

// 2. Run app code
vm.runInContext(appJsCode, sandbox);
console.log("Sandbox app JS loaded successfully.");

// 3. Test selectState('Karnataka')
sandbox.selectState('Karnataka');
console.log("selectState('Karnataka') executed successfully.");
console.log("destinationGrid children count:", domElements.destinationGrid.children.length);
if (domElements.destinationGrid.children.length !== 30) {
    throw new Error("Expected 30 destination cards, got " + domElements.destinationGrid.children.length);
}

// 4. Test openDestinationDetails('Karnataka', 'mysore')
sandbox.openDestinationDetails('Karnataka', 'mysore');
console.log("openDestinationDetails('Karnataka', 'mysore') executed successfully.");
console.log("attractionsGrid children count:", domElements.attractionsGrid.children.length);
if (domElements.attractionsGrid.children.length !== 15) {
    throw new Error("Expected 15 attraction cards, got " + domElements.attractionsGrid.children.length);
}

// 5. Test openAttractionGuideByIndex(0) (Mysore Palace)
sandbox.openAttractionGuideByIndex(0);
console.log("openAttractionGuideByIndex(0) executed successfully.");
console.log("guidePopup style.display:", domElements.guidePopup.style.display);
if (domElements.guidePopup.style.display !== 'flex') {
    throw new Error("Guide popup did not open!");
}
if (!domElements.guideContent.innerHTML.includes("Mysore Palace")) {
    throw new Error("Guide content does not contain Mysore Palace!");
}

// 6. Test selectState('Rajasthan')
sandbox.selectState('Rajasthan');
console.log("selectState('Rajasthan') executed successfully. Cards:", domElements.destinationGrid.children.length);
sandbox.openDestinationDetails('Rajasthan', 'jaipur');
console.log("openDestinationDetails('Rajasthan', 'jaipur') executed. Attractions:", domElements.attractionsGrid.children.length);

// 7. Test ride compare
sandbox.openRideForPlace('Mysore Palace', 'Mysore');
console.log("openRideForPlace executed successfully. Popup display:", domElements.ridePopup.style.display);

// 8. Test food popup
sandbox.openFoodForPlace('Mysore Palace', 'Mysore');
console.log("openFoodForPlace executed successfully. Popup display:", domElements.foodPopup.style.display);

console.log("\n>>> ALL RUNTIME SIMULATION TESTS COMPLETED WITH 100% SUCCESS! <<<");
