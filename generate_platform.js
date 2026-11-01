/**
 * Complete Generator Script for TravelGuru Platform
 * Upgrades final.html into a full real-world travel planning platform.
 */

const fs = require('fs');

console.log("Reading existing final.html...");
const original = fs.readFileSync('final.html', 'utf8');

// Load travel database
global.window = {};
require('./travel_database.js');
const db = window.INDIA_TRAVEL_DATA;
const statesList = Object.keys(db).sort();
console.log(`Database loaded: ${statesList.length} states/UTs.`);

// Build HTML
const output = [];

// ==========================================
// 1. HEAD & SEO METADATA
// ==========================================
output.push(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TravelGuru.com | Real-World Travel Planning Platform for Incredible India</title>
<meta name="description" content="Discover all 36 Indian States and Union Territories with TravelGuru. Explore 1,080 top tourist destinations, 16,200 attractions, practical trip itineraries, live hotel search, regional food guides, and multi-modal transport comparisons.">
<meta name="keywords" content="TravelGuru, Incredible India, travel planner, India tourism, tourist places in India, hotels in India, IRCTC train booking, India itineraries, trip planner India, road distance calculator, Mysore, Jaipur, Goa, Kerala">
<meta name="author" content="TravelGuru India">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://travelguru.com/">
<link rel="icon" type="image/svg+xml" href="favicon.svg">

<!-- Open Graph / Facebook / WhatsApp -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://travelguru.com/">
<meta property="og:title" content="TravelGuru.com | Real-World Incredible India Travel Planning Platform">
<meta property="og:description" content="Explore all 36 States & UTs, 1,080 destinations, 16,200 attractions, smart distance routing, genuine hotel links, and practical day-by-day itineraries.">
<meta property="og:image" content="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80">
<meta property="og:site_name" content="TravelGuru">
<meta property="og:locale" content="en_IN">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="TravelGuru.com | Incredible India Travel Platform">
<meta name="twitter:description" content="Complete travel planning platform for India: 36 States & UTs, 1,080 Destinations, 16,200 Attractions, Routes & Itineraries.">
<meta name="twitter:image" content="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80">

<!-- JSON-LD Structured Data for Search Engines -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://travelguru.com/#website",
      "url": "https://travelguru.com/",
      "name": "TravelGuru.com",
      "description": "Comprehensive Travel Planning Platform for Incredible India",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://travelguru.com/?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "TravelAgency",
      "@id": "https://travelguru.com/#organization",
      "name": "TravelGuru India",
      "url": "https://travelguru.com/",
      "logo": "https://travelguru.com/favicon.svg",
      "areaServed": "India",
      "serviceType": [
        "Travel Planning",
        "Route Calculation",
        "Hotel Search Aggregation",
        "Practical Itinerary Generation",
        "Attraction Guides",
        "Transport Comparison"
      ]
    }
  ]
}
</script>
`);

// ==========================================
// 2. CSS STYLES (COMPLETE)
// ==========================================
output.push(`
<style>
/* =====================================================
   CORE RESET, DESIGN TOKENS & TYPOGRAPHY
===================================================== */
:root {
    --primary: #ff5722;
    --primary-dark: #e64a19;
    --primary-light: #fff3e0;
    --secondary: #0f172a;
    --secondary-light: #1e293b;
    --accent: #f59e0b;
    --accent-gold: #ffd166;
    --teal: #0f766e;
    --teal-light: #f0fdfa;
    --emerald: #10b981;
    --bg-main: #f5f7fb;
    --card-bg: #ffffff;
    --text-main: #1e293b;
    --text-muted: #64748b;
    --border-light: #e2e8f0;
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
    --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.08);
    --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.12);
    --radius-sm: 8px;
    --radius-md: 14px;
    --radius-lg: 20px;
    --radius-full: 9999px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

html {
    scroll-behavior: smooth;
}

body {
    background: var(--bg-main);
    color: var(--text-main);
    line-height: 1.5;
    overflow-x: hidden;
}

/* =====================================================
   NAVBAR & MOBILE DRAWER
===================================================== */
.navbar {
    position: sticky;
    top: 0;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 6%;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(12px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    border-bottom: 1px solid var(--border-light);
}

.logo-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    text-decoration: none;
}

.logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
}

.logo {
    font-size: 26px;
    font-weight: 800;
    color: var(--primary);
    letter-spacing: -0.5px;
}

.logo span {
    color: var(--secondary);
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 16px;
}

.nav-links a {
    text-decoration: none;
    color: #334155;
    font-weight: 700;
    font-size: 14px;
    padding: 8px 12px;
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
}

.nav-links a:hover,
.nav-links a.active {
    color: var(--primary);
    background: var(--primary-light);
}

.nav-cta-btn {
    background: var(--primary) !important;
    color: white !important;
    padding: 9px 18px !important;
    border-radius: var(--radius-full) !important;
    font-weight: 700 !important;
    box-shadow: 0 4px 14px rgba(255, 87, 34, 0.3) !important;
}

.nav-cta-btn:hover {
    background: var(--primary-dark) !important;
    transform: translateY(-1px);
}

.mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    font-size: 26px;
    cursor: pointer;
    color: var(--secondary);
    padding: 4px;
}

.mobile-nav-drawer {
    display: none;
    position: fixed;
    top: 65px;
    left: 0;
    width: 100%;
    background: white;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    z-index: 999;
    flex-direction: column;
    gap: 10px;
    border-bottom: 2px solid var(--primary);
}

.mobile-nav-drawer a {
    text-decoration: none;
    color: var(--secondary);
    font-weight: 700;
    font-size: 15px;
    padding: 12px 16px;
    border-radius: var(--radius-sm);
    background: #f8fafc;
}

.mobile-nav-drawer a:hover {
    background: var(--primary-light);
    color: var(--primary);
}

@media (max-width: 992px) {
    .nav-links {
        display: none;
    }
    .mobile-menu-btn {
        display: block;
    }
    .mobile-nav-drawer.open {
        display: flex;
    }
}

/* =====================================================
   HERO SECTION & SEARCH AUTOCOMPLETE
===================================================== */
.hero {
    min-height: 580px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    padding: 60px 20px;
    background:
        linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.65)),
        url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1900&q=90");
    background-size: cover;
    background-position: center;
    position: relative;
}

.hero-content {
    width: 100%;
    max-width: 950px;
}

.badge {
    display: inline-block;
    padding: 10px 20px;
    border-radius: var(--radius-full);
    background: rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(10px);
    margin-bottom: 22px;
    font-weight: 700;
    font-size: 14.5px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.hero h1 {
    font-size: 56px;
    margin-bottom: 18px;
    line-height: 1.15;
    font-weight: 800;
    letter-spacing: -1px;
}

.hero h1 span {
    color: var(--accent-gold);
}

.hero p {
    font-size: 18px;
    line-height: 1.6;
    max-width: 780px;
    margin: 0 auto 35px;
    color: #f1f5f9;
}

.search-area {
    position: relative;
    max-width: 850px;
    margin: auto;
}

.search-box {
    display: flex;
    background: white;
    border-radius: var(--radius-full);
    padding: 6px;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
    border: 2px solid rgba(255, 255, 255, 0.8);
}

.search-box input {
    flex: 1;
    border: none;
    outline: none;
    padding: 15px 25px;
    font-size: 17px;
    border-radius: var(--radius-full) 0 0 var(--radius-full);
    color: var(--secondary);
}

.search-box button {
    background: var(--primary);
    border: none;
    outline: none;
    color: white;
    padding: 15px 36px;
    font-size: 17px;
    font-weight: bold;
    border-radius: var(--radius-full);
    cursor: pointer;
    transition: 0.25s;
    box-shadow: 0 4px 12px rgba(255, 87, 34, 0.3);
}

.search-box button:hover {
    background: var(--primary-dark);
}

.suggestions {
    position: absolute;
    width: 100%;
    top: 72px;
    left: 0;
    background: white;
    border-radius: var(--radius-md);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    display: none;
    z-index: 100;
    max-height: 420px;
    overflow-y: auto;
    text-align: left;
    color: #222;
    border: 1px solid var(--border-light);
}

.suggestion {
    padding: 14px 20px;
    cursor: pointer;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background 0.15s;
}

.suggestion:hover {
    background: var(--primary-light);
}

.suggestion-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.suggestion-icon {
    font-size: 22px;
}

.suggestion-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--secondary);
}

.suggestion-subtitle {
    font-size: 12.5px;
    color: var(--text-muted);
    margin-top: 2px;
}

.suggestion-tag {
    font-size: 11px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    background: #f1f5f9;
    color: #475569;
    text-transform: uppercase;
}

/* =====================================================
   SECTIONS COMMON
===================================================== */
.section {
    padding: 70px 6%;
}

.section-alt {
    background: #ffffff;
    border-top: 1px solid var(--border-light);
    border-bottom: 1px solid var(--border-light);
}

.section-title {
    text-align: center;
    margin-bottom: 40px;
}

.section-title h2 {
    font-size: 36px;
    margin-bottom: 12px;
    color: var(--secondary);
    font-weight: 800;
    letter-spacing: -0.5px;
}

.section-title p {
    color: var(--text-muted);
    font-size: 16.5px;
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
}

/* =====================================================
   DESTINATIONS SELECTOR & REGION PILLS
===================================================== */
.city-container {
    max-width: 1050px;
    margin: auto;
    text-align: center;
}

.dual-select-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 22px;
}

@media (max-width: 680px) {
    .dual-select-grid {
        grid-template-columns: 1fr;
    }
}

.select-box-wrap {
    display: flex;
    flex-direction: column;
    text-align: left;
}

.select-label {
    font-size: 13.5px;
    font-weight: 800;
    color: #334155;
    margin-bottom: 8px;
    letter-spacing: 0.3px;
}

select {
    width: 100%;
    padding: 16px 20px;
    border-radius: var(--radius-md);
    border: 2px solid var(--border-light);
    outline: none;
    font-size: 16px;
    font-weight: 600;
    color: var(--secondary);
    background: white;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    transition: all 0.25s ease;
}

select:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(255, 87, 34, 0.15);
}

.region-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 18px;
}

.region-pill {
    padding: 8px 16px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-light);
    background: white;
    color: #475569;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
}

.region-pill:hover,
.region-pill.active {
    background: var(--secondary);
    color: white;
    border-color: var(--secondary);
}

.popular-pills-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 15px;
    flex-wrap: wrap;
    justify-content: center;
}

.pills-lead {
    font-size: 13.5px;
    font-weight: 800;
    color: #475569;
}

.pills-track {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 4px 0;
    max-width: 100%;
    scrollbar-width: thin;
}

.state-pill {
    padding: 8px 18px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-light);
    background: white;
    color: #334155;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
    box-shadow: var(--shadow-sm);
}

.state-pill:hover {
    border-color: var(--primary);
    color: var(--primary);
}

.state-pill.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
    box-shadow: 0 4px 12px rgba(255, 87, 34, 0.3);
}

.india-coverage-banner {
    margin-top: 25px;
    padding: 14px 20px;
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    border-radius: var(--radius-md);
    color: #065f46;
    font-weight: 700;
    font-size: 14px;
}

/* =====================================================
   BREADCRUMBS & STATE BANNER
===================================================== */
.travel-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 25px;
    font-weight: 600;
    flex-wrap: wrap;
}

.crumb-btn {
    cursor: pointer;
    color: var(--primary);
    transition: color 0.15s;
}

.crumb-btn:hover {
    text-decoration: underline;
}

.crumb-sep {
    color: #94a3b8;
}

.crumb-current {
    color: var(--secondary);
    font-weight: 700;
}

.state-banner-card {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: white;
    border-radius: var(--radius-lg);
    padding: 35px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    margin-bottom: 40px;
    box-shadow: var(--shadow-lg);
}

@media (max-width: 850px) {
    .state-banner-card {
        flex-direction: column;
        text-align: center;
        padding: 25px 20px;
    }
}

.state-banner-left {
    flex: 1;
}

.state-banner-tagline {
    font-size: 13.5px;
    font-weight: 800;
    color: var(--accent-gold);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
}

.state-banner-title {
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 10px;
    letter-spacing: -0.5px;
}

.state-banner-desc {
    color: #cbd5e1;
    font-size: 15.5px;
    line-height: 1.6;
    max-width: 650px;
}

.state-banner-stats {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

.state-stat-pill {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 12px 20px;
    border-radius: var(--radius-md);
    text-align: center;
    min-width: 110px;
}

.state-stat-num {
    font-size: 22px;
    font-weight: 800;
    color: var(--accent-gold);
}

.state-stat-lbl {
    font-size: 11.5px;
    color: #94a3b8;
    font-weight: 700;
    margin-top: 2px;
    text-transform: uppercase;
}

/* =====================================================
   DESTINATIONS FILTER & SORTING BAR
===================================================== */
.destination-filter-bar {
    background: white;
    padding: 18px 24px;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    margin-bottom: 35px;
    border: 1px solid var(--border-light);
}

.filter-search-row {
    display: flex;
    gap: 15px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    align-items: center;
}

.dest-search-input-wrap {
    flex: 1;
    min-width: 250px;
    display: flex;
    align-items: center;
    background: #f8fafc;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-full);
    padding: 0 18px;
}

.dest-search-input-wrap input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    padding: 12px 10px;
    font-size: 15px;
    color: var(--secondary);
}

.sort-select-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
}

.sort-label {
    font-size: 13px;
    font-weight: 700;
    color: #64748b;
    white-space: nowrap;
}

.sort-select {
    padding: 10px 16px;
    border-radius: var(--radius-full);
    font-size: 13.5px;
    font-weight: 700;
    border: 1px solid var(--border-light);
    background: white;
    color: var(--secondary);
    outline: none;
    cursor: pointer;
}

.filter-chips-track {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 4px 0;
    scrollbar-width: thin;
}

.filter-chip {
    padding: 8px 16px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-light);
    background: #f8fafc;
    color: #475569;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
}

.filter-chip:hover,
.filter-chip.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

/* =====================================================
   DESTINATIONS GRID & CARDS
===================================================== */
.destination-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 28px;
}

.destination-card {
    background: white;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
    transition: transform 0.25s, box-shadow 0.25s;
    display: flex;
    flex-direction: column;
}

.destination-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
}

.dest-card-image-wrap {
    position: relative;
    width: 100%;
    height: 220px;
    background: #e2e8f0;
    overflow: hidden;
}

.dest-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.destination-card:hover .dest-card-img {
    transform: scale(1.05);
}

.dest-badge-rank {
    position: absolute;
    top: 12px;
    left: 12px;
    background: var(--secondary);
    color: white;
    font-size: 12px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-sm);
}

.dest-badge-rating {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    color: #ffc107;
    font-size: 12px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: var(--radius-full);
}

.dest-badge-cat {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: rgba(255, 255, 255, 0.95);
    color: #0f172a;
    font-size: 11px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: var(--shadow-sm);
}

.img-attribution-pill {
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.65);
    color: #f1f5f9;
    font-size: 10px;
    padding: 3px 8px;
    border-radius: var(--radius-sm);
    white-space: nowrap;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    backdrop-filter: blur(4px);
}

.dest-card-body {
    padding: 22px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.dest-card-title {
    font-size: 21px;
    font-weight: 800;
    color: var(--secondary);
    margin-bottom: 4px;
}

.dest-card-loc {
    font-size: 13px;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 12px;
}

.dest-card-desc {
    font-size: 14px;
    color: #475569;
    line-height: 1.55;
    margin-bottom: 16px;
    flex: 1;
}

.dest-card-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 18px;
}

.dest-meta-pill {
    font-size: 11.5px;
    font-weight: 700;
    background: #f1f5f9;
    color: #475569;
    padding: 4px 10px;
    border-radius: var(--radius-full);
}

.dest-card-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.btn-explore-dest {
    grid-column: 1 / -1;
    background: var(--primary);
    color: white;
    border: none;
    padding: 12px;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
    box-shadow: 0 4px 12px rgba(255, 87, 34, 0.25);
}

.btn-explore-dest:hover {
    background: var(--primary-dark);
}

.btn-card-util {
    background: #f8fafc;
    border: 1px solid var(--border-light);
    color: #334155;
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    transition: all 0.15s;
}

.btn-card-util:hover {
    background: var(--secondary);
    color: white;
    border-color: var(--secondary);
}

/* =====================================================
   DEDICATED DESTINATION DETAILS VIEW
===================================================== */
.destination-details-view {
    display: none;
    margin-bottom: 40px;
}

.dest-hero-banner {
    position: relative;
    min-height: 400px;
    border-radius: var(--radius-lg);
    background-size: cover;
    background-position: center;
    color: white;
    padding: 35px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    margin-bottom: 30px;
    box-shadow: var(--shadow-lg);
}

.dest-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.85) 100%);
}

.dest-hero-top {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn-back-to-state {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: white;
    padding: 10px 20px;
    border-radius: var(--radius-full);
    font-weight: 700;
    font-size: 13.5px;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-back-to-state:hover {
    background: rgba(255, 255, 255, 0.35);
}

.dest-hero-content {
    position: relative;
    z-index: 2;
    max-width: 800px;
}

.dest-hero-content h1 {
    font-size: 44px;
    font-weight: 800;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
}

.dest-hero-content p {
    font-size: 16.5px;
    line-height: 1.6;
    color: #e2e8f0;
    margin-bottom: 14px;
}

.dest-specs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 18px;
    margin-bottom: 25px;
}

.dest-spec-card {
    background: white;
    padding: 20px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
    display: flex;
    align-items: center;
    gap: 15px;
}

.dest-spec-icon {
    font-size: 28px;
}

.dest-spec-label {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
}

.dest-spec-val {
    font-size: 16px;
    font-weight: 800;
    color: var(--secondary);
    margin-top: 2px;
}

.dest-insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.dest-insight-card {
    background: white;
    padding: 24px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
}

.dest-insight-card h3 {
    font-size: 17px;
    font-weight: 800;
    color: var(--secondary);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.dest-insight-card p {
    font-size: 14px;
    color: #475569;
    line-height: 1.6;
}

/* =====================================================
   TOP 15 ATTRACTIONS GRID & CARDS (WITH HOURS & FEES)
===================================================== */
.attraction-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 28px;
}

.attraction-card {
    background: white;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
}

.attraction-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

.attr-img-wrap {
    position: relative;
    width: 100%;
    height: 220px;
    background: #e2e8f0;
    overflow: hidden;
}

.attr-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}

.attraction-card:hover .attr-img {
    transform: scale(1.05);
}

.attr-rank {
    position: absolute;
    top: 12px;
    left: 12px;
    background: var(--primary);
    color: white;
    font-size: 12px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: var(--radius-full);
}

.attr-rating {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    color: #ffc107;
    font-size: 12px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: var(--radius-full);
}

.attr-cat-badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: rgba(255, 255, 255, 0.95);
    color: #0f172a;
    font-size: 11px;
    font-weight: 800;
    padding: 4px 10px;
    border-radius: var(--radius-sm);
    text-transform: uppercase;
}

.attr-body {
    padding: 22px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.attr-title {
    font-size: 20px;
    font-weight: 800;
    color: var(--secondary);
    margin-bottom: 8px;
}

.attr-why-famous {
    background: #fffbeb;
    border-left: 3px solid #f59e0b;
    padding: 10px 14px;
    border-radius: 4px;
    font-size: 13px;
    color: #92400e;
    margin-bottom: 12px;
    line-height: 1.5;
}

.attr-desc {
    font-size: 13.5px;
    color: #475569;
    line-height: 1.55;
    margin-bottom: 16px;
    flex: 1;
}

.attr-details-box {
    background: #f8fafc;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 14px;
    margin-bottom: 16px;
    font-size: 12.5px;
    color: #334155;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.attr-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.btn-guide-main {
    grid-column: 1 / -1;
    background: var(--secondary);
    color: white;
    border: none;
    padding: 12px;
    border-radius: var(--radius-md);
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-guide-main:hover {
    background: #1e293b;
}

.btn-attr-util {
    background: #f1f5f9;
    border: 1px solid var(--border-light);
    color: #334155;
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    transition: all 0.15s;
}

.btn-attr-util:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

/* =====================================================
   TRAVEL ROUTE & SMART ITINERARY PLANNER (#planner)
===================================================== */
.planner-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 35px;
}

@media (max-width: 950px) {
    .planner-grid {
        grid-template-columns: 1fr;
    }
}

.planner-card {
    background: white;
    border-radius: var(--radius-lg);
    padding: 32px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
}

.planner-card h3 {
    font-size: 22px;
    font-weight: 800;
    color: var(--secondary);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.form-group-wrap {
    margin-bottom: 18px;
}

.form-label {
    display: block;
    font-size: 13px;
    font-weight: 800;
    color: #334155;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.input-with-btn {
    display: flex;
    gap: 8px;
}

.input-with-btn input,
.input-with-btn select {
    flex: 1;
    padding: 13px 16px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--border-light);
    font-size: 15px;
    color: var(--secondary);
    outline: none;
}

.btn-gps-detect {
    background: #ecfdf5;
    border: 1px solid #10b981;
    color: #065f46;
    padding: 0 16px;
    border-radius: var(--radius-md);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
}

.btn-gps-detect:hover {
    background: #10b981;
    color: white;
}

.mode-selector {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 20px;
}

@media (max-width: 480px) {
    .mode-selector {
        grid-template-columns: 1fr 1fr;
    }
}

.mode-btn {
    padding: 12px 8px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--border-light);
    background: #f8fafc;
    color: #475569;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
}

.mode-btn:hover,
.mode-btn.active {
    border-color: var(--primary);
    background: var(--primary-light);
    color: var(--primary);
}

.btn-calculate-route {
    width: 100%;
    background: var(--primary);
    color: white;
    border: none;
    padding: 16px;
    border-radius: var(--radius-md);
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
    transition: background 0.2s;
    box-shadow: 0 4px 15px rgba(255, 87, 34, 0.3);
}

.btn-calculate-route:hover {
    background: var(--primary-dark);
}

.route-result-panel {
    margin-top: 25px;
    border-top: 1px solid var(--border-light);
    padding-top: 25px;
}

.route-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
}

.route-stat-box {
    background: #f8fafc;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 14px;
    text-align: center;
}

.route-stat-val {
    font-size: 19px;
    font-weight: 800;
    color: var(--secondary);
}

.route-stat-lbl {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
    margin-top: 3px;
    text-transform: uppercase;
}

.route-cab-fares {
    background: #f0fdfa;
    border: 1px solid #99f6e4;
    border-radius: var(--radius-md);
    padding: 16px;
    margin-bottom: 20px;
}

.route-cab-title {
    font-size: 13px;
    font-weight: 800;
    color: #0f766e;
    margin-bottom: 10px;
}

.route-cab-pills {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.cab-fare-pill {
    background: white;
    padding: 8px 14px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    font-weight: 700;
    color: var(--secondary);
    border: 1px solid #ccfbf1;
}

.map-embed-frame {
    width: 100%;
    height: 250px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
    overflow: hidden;
    margin-bottom: 15px;
}

.itinerary-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-light);
}

.itin-actions {
    display: flex;
    gap: 8px;
}

.btn-itin-action {
    background: #f1f5f9;
    border: 1px solid var(--border-light);
    padding: 8px 14px;
    border-radius: var(--radius-sm);
    font-size: 12.5px;
    font-weight: 700;
    cursor: pointer;
    color: #334155;
    transition: all 0.15s;
}

.btn-itin-action:hover {
    background: var(--secondary);
    color: white;
}

.itin-day-card {
    background: #f8fafc;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
    padding: 20px;
    margin-bottom: 18px;
}

.itin-day-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 800;
    color: var(--secondary);
    margin-bottom: 12px;
}

.itin-day-badge {
    background: var(--primary);
    color: white;
    padding: 3px 10px;
    border-radius: var(--radius-full);
    font-size: 12px;
}

.itin-slot {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px dashed #cbd5e1;
}

.itin-slot:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}

.itin-slot-time {
    font-size: 12px;
    font-weight: 800;
    color: var(--primary);
    width: 90px;
    flex-shrink: 0;
}

.itin-slot-content h4 {
    font-size: 14.5px;
    font-weight: 700;
    color: var(--secondary);
    margin-bottom: 3px;
}

.itin-slot-content p {
    font-size: 13px;
    color: #475569;
    line-height: 1.45;
}

.itin-slot-meta {
    font-size: 11.5px;
    color: var(--text-muted);
    margin-top: 4px;
}

/* =====================================================
   HOTELS & ACCOMMODATIONS SEARCH HUB (#stay)
===================================================== */
.hotel-search-card {
    background: white;
    border-radius: var(--radius-lg);
    padding: 32px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
    margin-bottom: 40px;
}

.hotel-search-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
}

.btn-hotel-search {
    background: var(--teal);
    color: white;
    border: none;
    padding: 16px;
    border-radius: var(--radius-md);
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
    transition: background 0.2s;
    width: 100%;
}

.btn-hotel-search:hover {
    background: #0d9488;
}

.booking-providers-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 35px;
}

.provider-card {
    background: #f8fafc;
    border: 1.5px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 20px;
    text-align: center;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.provider-card:hover {
    border-color: var(--primary);
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
    background: white;
}

.provider-name {
    font-size: 18px;
    font-weight: 800;
    color: var(--secondary);
    margin-bottom: 4px;
}

.provider-tagline {
    font-size: 12.5px;
    color: var(--text-muted);
    margin-bottom: 14px;
}

.provider-btn {
    background: var(--secondary);
    color: white;
    padding: 8px 16px;
    border-radius: var(--radius-full);
    font-size: 12.5px;
    font-weight: 700;
    display: inline-block;
}

.verified-stays-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
}

.stay-hotel-card {
    background: white;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
    padding: 22px;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.stay-hotel-title {
    font-size: 18px;
    font-weight: 800;
    color: var(--secondary);
    margin-bottom: 4px;
}

.stay-hotel-type {
    font-size: 12px;
    font-weight: 800;
    color: var(--teal);
    text-transform: uppercase;
    margin-bottom: 8px;
}

.stay-hotel-loc {
    font-size: 13px;
    color: #475569;
    margin-bottom: 12px;
}

.stay-amenities-pills {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-bottom: 16px;
}

.amenity-pill {
    background: #f1f5f9;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    font-size: 11px;
    font-weight: 700;
    color: #475569;
}

.stay-price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 14px;
    border-top: 1px solid var(--border-light);
}

.stay-price-val {
    font-size: 18px;
    font-weight: 800;
    color: var(--secondary);
}

.trust-disclaimer-box {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: var(--radius-md);
    padding: 20px;
    margin-top: 30px;
    font-size: 13px;
    color: #475569;
    line-height: 1.6;
}

/* =====================================================
   REGIONAL FOOD & DINING EXPLORER (#food)
===================================================== */
.food-hero-banner {
    background: linear-gradient(135deg, #7c2d12 0%, #9a3412 100%);
    color: white;
    border-radius: var(--radius-lg);
    padding: 30px;
    margin-bottom: 35px;
}

.food-hero-title {
    font-size: 26px;
    font-weight: 800;
    margin-bottom: 8px;
}

.food-hero-dishes {
    font-size: 15.5px;
    color: #ffedd5;
    line-height: 1.6;
}

.food-filters-track {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 30px;
    justify-content: center;
}

.food-filter-chip {
    padding: 8px 18px;
    border-radius: var(--radius-full);
    border: 1px solid var(--border-light);
    background: white;
    color: #334155;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
}

.food-filter-chip:hover,
.food-filter-chip.active {
    background: #ea580c;
    color: white;
    border-color: #ea580c;
}

.restaurants-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
}

.restaurant-card {
    background: white;
    border-radius: var(--radius-md);
    border: 1px solid var(--border-light);
    padding: 24px;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.restaurant-title {
    font-size: 19px;
    font-weight: 800;
    color: var(--secondary);
    margin-bottom: 4px;
}

.restaurant-cuisine {
    font-size: 12.5px;
    font-weight: 700;
    color: #ea580c;
    margin-bottom: 10px;
}

.restaurant-specialty {
    background: #fff7ed;
    border-left: 3px solid #ea580c;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 13px;
    color: #9a3412;
    margin-bottom: 12px;
}

.restaurant-meta {
    font-size: 12.5px;
    color: #475569;
    margin-bottom: 16px;
    line-height: 1.5;
}

.restaurant-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

/* =====================================================
   TRANSPORT & RIDES HUB (#transport)
===================================================== */
.transport-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 25px;
    flex-wrap: wrap;
    justify-content: center;
}

.transport-tab-btn {
    padding: 12px 24px;
    border-radius: var(--radius-full);
    border: 1.5px solid var(--border-light);
    background: white;
    color: var(--secondary);
    font-size: 14.5px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
}

.transport-tab-btn:hover,
.transport-tab-btn.active {
    background: var(--secondary);
    color: white;
    border-color: var(--secondary);
}

.transport-pane {
    display: none;
    background: white;
    border-radius: var(--radius-lg);
    padding: 32px;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
}

.transport-pane.active {
    display: block;
}

.transport-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.transport-card {
    background: #f8fafc;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 20px;
}

.transport-card h4 {
    font-size: 17px;
    font-weight: 800;
    color: var(--secondary);
    margin-bottom: 6px;
}

.tariff-matrix {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

.tariff-matrix th,
.tariff-matrix td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid var(--border-light);
    font-size: 14px;
}

.tariff-matrix th {
    background: #f8fafc;
    font-weight: 800;
    color: var(--secondary);
}

/* =====================================================
   FEATURES
===================================================== */
.features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 25px;
}

.feature {
    background: white;
    padding: 30px 25px;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
    text-align: center;
    transition: transform 0.2s;
}

.feature:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
}

.feature-icon {
    font-size: 40px;
    margin-bottom: 16px;
}

.feature h3 {
    font-size: 19px;
    font-weight: 800;
    color: var(--secondary);
    margin-bottom: 10px;
}

.feature p {
    font-size: 14px;
    color: #475569;
    line-height: 1.6;
}

/* =====================================================
   MODAL POPUPS
===================================================== */
.popup {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(8px);
    z-index: 2000;
    justify-content: center;
    align-items: center;
    padding: 20px;
    overflow-y: auto;
}

.popup-box {
    background: white;
    border-radius: var(--radius-lg);
    max-width: 850px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    padding: 32px;
    box-shadow: var(--shadow-lg);
}

.close {
    position: absolute;
    top: 18px;
    right: 22px;
    font-size: 32px;
    font-weight: 800;
    color: #64748b;
    cursor: pointer;
    line-height: 1;
    z-index: 10;
    transition: color 0.15s;
}

.close:hover {
    color: var(--primary);
}

.guide-hero-banner {
    position: relative;
    width: 100%;
    height: 300px;
    border-radius: var(--radius-md);
    overflow: hidden;
    margin-bottom: 25px;
}

.guide-hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.guide-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.85) 100%);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 25px;
    color: white;
}

.guide-hero-title {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 4px;
}

.guide-hero-subtitle {
    font-size: 14.5px;
    color: #e2e8f0;
}

.guide-stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 25px;
}

@media (max-width: 600px) {
    .guide-stats-grid {
        grid-template-columns: 1fr;
    }
}

.stat-card {
    background: #f8fafc;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.stat-icon {
    font-size: 24px;
}

.stat-info strong {
    display: block;
    font-size: 11px;
    color: var(--text-muted);
    text-transform: uppercase;
}

.stat-info span {
    font-size: 14px;
    font-weight: 700;
    color: var(--secondary);
}

.guide-block {
    margin-bottom: 22px;
}

.guide-block h3 {
    font-size: 18px;
    font-weight: 800;
    color: var(--secondary);
    margin-bottom: 8px;
}

.guide-text {
    font-size: 14.5px;
    color: #475569;
    line-height: 1.6;
}

.guide-highlights-list {
    list-style: none;
    padding: 0;
}

.guide-highlights-list li {
    padding: 6px 0 6px 24px;
    position: relative;
    font-size: 14px;
    color: #334155;
    line-height: 1.5;
}

.guide-highlights-list li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: var(--primary);
    font-weight: 800;
}

.guide-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
}

@media (max-width: 650px) {
    .guide-two-col {
        grid-template-columns: 1fr;
    }
}

.guide-sub-block {
    background: #f8fafc;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 18px;
}

.guide-sub-block h4 {
    font-size: 15px;
    font-weight: 800;
    color: var(--secondary);
    margin-bottom: 6px;
}

.guide-sub-block p {
    font-size: 13.5px;
    color: #475569;
    line-height: 1.5;
}

.tips-block {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: var(--radius-md);
    padding: 18px;
}

.tips-block h3 {
    color: #92400e;
}

.tips-block p {
    color: #78350f;
}

.guide-action-bar {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px solid var(--border-light);
}

.guide-action-bar .btn {
    flex: 1;
    min-width: 140px;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    font-size: 13.5px;
    font-weight: 700;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    border: none;
    transition: opacity 0.2s;
}

.guide-action-bar .btn:hover {
    opacity: 0.9;
}

/* =====================================================
   RIDE & FOOD POPUP SPECIFIC
===================================================== */
.form-group {
    margin-bottom: 18px;
}

.form-group label {
    display: block;
    font-size: 13px;
    font-weight: 800;
    color: #334155;
    margin-bottom: 6px;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 12px 16px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--border-light);
    font-size: 15px;
    outline: none;
}

.location-options {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
}

.location-option {
    flex: 1;
    padding: 12px;
    border: 1.5px solid var(--border-light);
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
}

.location-option.active {
    border-color: var(--primary);
    background: var(--primary-light);
    color: var(--primary);
}

.location-option input {
    display: none;
}

.location-help {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 6px;
}

.vehicle-grid {
    display: flex;
    gap: 10px;
}

.vehicle {
    flex: 1;
    padding: 14px;
    border: 1.5px solid var(--border-light);
    border-radius: var(--radius-md);
    cursor: pointer;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
}

.vehicle input {
    margin-right: 6px;
}

.price-box {
    background: #f8fafc;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 16px;
    text-align: center;
    margin: 18px 0;
}

.price-box strong {
    display: block;
    font-size: 24px;
    color: var(--secondary);
    margin: 4px 0;
}

.ride-actions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 18px;
}

.ride-card {
    background: white;
    border: 1.5px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 14px;
    text-align: center;
}

.compare-note {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    font-size: 12px;
    color: #92400e;
    margin-bottom: 18px;
}

.submit-btn {
    width: 100%;
    background: #25d366;
    color: white;
    border: none;
    padding: 16px;
    border-radius: var(--radius-md);
    font-size: 16px;
    font-weight: 800;
    cursor: pointer;
}

.food-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 10px;
    margin-bottom: 18px;
}

.food-service {
    padding: 12px 10px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--border-light);
    background: white;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    transition: all 0.15s;
}

.food-service:hover {
    border-color: var(--primary);
    background: var(--primary-light);
}

.food-result {
    background: #f8fafc;
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 16px;
    font-size: 14px;
    color: #475569;
    text-align: center;
}

/* =====================================================
   TOAST NOTIFICATIONS & SKELETON
===================================================== */
.toast-container {
    position: fixed;
    bottom: 25px;
    right: 25px;
    z-index: 3000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
}

.toast {
    background: var(--secondary);
    color: white;
    padding: 14px 22px;
    border-radius: var(--radius-md);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    font-size: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: auto;
    border-left: 4px solid var(--primary);
}

@keyframes toastSlideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes tgShimmerSweep {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

.img-skeleton {
    background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
    background-size: 200% 100%;
    animation: tgShimmerSweep 1.6s infinite ease-in-out !important;
}

/* =====================================================
   FOOTER
===================================================== */
footer {
    background: var(--secondary);
    color: #cbd5e1;
    padding: 60px 6% 30px;
    border-top: 1px solid #1e293b;
}

.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 40px;
    margin-bottom: 50px;
}

@media (max-width: 850px) {
    .footer-grid {
        grid-template-columns: 1fr;
        gap: 30px;
    }
}

.footer-col h3 {
    color: white;
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 16px;
}

.footer-col p {
    font-size: 14px;
    line-height: 1.6;
    color: #94a3b8;
    margin-bottom: 12px;
}

.footer-col ul {
    list-style: none;
    padding: 0;
}

.footer-col ul li {
    margin-bottom: 10px;
}

.footer-col ul li a {
    color: #94a3b8;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.15s;
}

.footer-col ul li a:hover {
    color: var(--primary);
}

.footer-bottom {
    text-align: center;
    padding-top: 25px;
    border-top: 1px solid #1e293b;
    font-size: 13.5px;
    color: #64748b;
}

/* Print Stylesheet for Itinerary */
@media print {
    body * {
        visibility: hidden;
    }
    #itineraryPrintArea,
    #itineraryPrintArea * {
        visibility: visible;
    }
    #itineraryPrintArea {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
    }
}
</style>
</head>
<body>
`);

// ==========================================
// 3. NAVBAR & MOBILE DRAWER
// ==========================================
output.push(`
<!-- NAVBAR -->
<nav class="navbar">
    <div class="logo-wrap" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">
        <svg class="logo-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="#0f172a" />
            <path d="M50 16 C35 16 23 28 23 43 C23 62 48 84 50 84 C52 84 77 62 77 43 C77 28 65 16 50 16 Z" fill="#ff5722" />
            <circle cx="50" cy="42" r="16" fill="#ffffff" />
            <polygon points="50,30 54,42 50,38 46,42" fill="#0f172a" />
            <polygon points="50,54 54,42 50,46 46,42" fill="#ffd166" />
        </svg>
        <div class="logo">
            Travel<span>Guru.com</span> 🇮🇳
        </div>
    </div>

    <div class="nav-links">
        <a href="#home">Home</a>
        <a href="#destinations">Destinations</a>
        <a href="#places">Attractions</a>
        <a href="#planner">Trip Planner</a>
        <a href="#stay">Stays</a>
        <a href="#food">Food & Dining</a>
        <a href="#transport">Transport</a>
        <a href="#planner" class="nav-cta-btn">🧭 Plan Trip</a>
    </div>

    <button class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Toggle Navigation Menu">☰</button>
</nav>

<!-- MOBILE NAVIGATION DRAWER -->
<div id="mobileDrawer" class="mobile-nav-drawer">
    <a href="#home" onclick="toggleMobileMenu()">🏠 Home</a>
    <a href="#destinations" onclick="toggleMobileMenu()">🗺️ Destinations (All 36 States & UTs)</a>
    <a href="#places" onclick="toggleMobileMenu()">🏆 Sights & Attractions (Top 15 Each)</a>
    <a href="#planner" onclick="toggleMobileMenu()">🧭 Smart Travel Route & Itinerary Planner</a>
    <a href="#stay" onclick="toggleMobileMenu()">🏨 Real Hotel Search & Stays</a>
    <a href="#food" onclick="toggleMobileMenu()">🍽️ Regional Food Specialties & Dining</a>
    <a href="#transport" onclick="toggleMobileMenu()">🚆 Multi-Modal Transport (Trains, Flights, Cabs)</a>
</div>
`);

// ==========================================
// 4. HERO SECTION
// ==========================================
output.push(`
<!-- HERO -->
<section class="hero" id="home">
    <div class="hero-content">
        <div class="badge">
            🇮🇳 Discover Incredible India • 36 States & UTs • 1,080 Destinations • 16,200 Attractions
        </div>

        <h1>
            Welcome to
            <span>TravelGuru.com</span>
        </h1>

        <p>
            Explore all 28 Indian States and 8 Union Territories with verified high-definition photography,
            curated top 30 destinations per state, top 15 attractions for every destination, practical day-by-day itineraries,
            genuine hotel booking links, regional culinary guides, and multi-modal transit comparisons.
        </p>

        <!-- SEARCH -->
        <div class="search-area">
            <div class="search-box">
                <input
                    id="searchInput"
                    type="text"
                    placeholder="Search any state, tourist destination, or attraction across India..."
                    autocomplete="off"
                    oninput="searchSuggestions()"
                    onkeydown="searchEnter(event)"
                >
                <button onclick="performSearch()">
                    🔎 Search
                </button>
            </div>

            <div id="suggestions" class="suggestions"></div>
        </div>
    </div>
</section>
`);

// ==========================================
// 5. DESTINATIONS SELECTOR & REGION PILLS
// ==========================================
output.push(`
<!-- DESTINATIONS SELECTOR -->
<section class="section" id="destinations">
    <div class="section-title">
        <h2>🗺️ Choose Your Destination</h2>
        <p>Select any Indian State or Union Territory to view its Top 30 Famous Tourist Destinations, or choose a destination directly.</p>
    </div>

    <div class="city-container">
        <!-- Region Filter Bar -->
        <div class="region-bar">
            <button type="button" class="region-pill active" onclick="filterByRegion('all', this)">⭐ All India (36)</button>
            <button type="button" class="region-pill" onclick="filterByRegion('north', this)">🏔️ North (9)</button>
            <button type="button" class="region-pill" onclick="filterByRegion('south', this)">☕ South (7)</button>
            <button type="button" class="region-pill" onclick="filterByRegion('west', this)">🏰 West (5)</button>
            <button type="button" class="region-pill" onclick="filterByRegion('east', this)">🎨 East & Central (7)</button>
            <button type="button" class="region-pill" onclick="filterByRegion('northeast', this)">🌿 Northeast (8)</button>
            <button type="button" class="region-pill" onclick="filterByRegion('ut', this)">🏝️ Union Territories (8)</button>
        </div>

        <div class="dual-select-grid">
            <div class="select-box-wrap">
                <label class="select-label" for="stateSelect">1️⃣ Select State / Union Territory</label>
                <select id="stateSelect" onchange="onStateChanged()"></select>
            </div>

            <div class="select-box-wrap">
                <label class="select-label" for="citySelect">2️⃣ Select Tourist Destination (Top 30)</label>
                <select id="citySelect" onchange="onCityChanged()"></select>
            </div>
        </div>

        <!-- Popular State Quick Discovery Pills -->
        <div class="popular-pills-bar">
            <span class="pills-lead">🔥 Popular States:</span>
            <div class="pills-track">
                <button type="button" class="state-pill active" onclick="selectQuickState('Karnataka')">☕ Karnataka</button>
                <button type="button" class="state-pill" onclick="selectQuickState('Rajasthan')">🏰 Rajasthan</button>
                <button type="button" class="state-pill" onclick="selectQuickState('Goa')">🏖️ Goa</button>
                <button type="button" class="state-pill" onclick="selectQuickState('Kerala')">🌴 Kerala</button>
                <button type="button" class="state-pill" onclick="selectQuickState('Himachal Pradesh')">🏔️ Himachal</button>
                <button type="button" class="state-pill" onclick="selectQuickState('Uttar Pradesh')">🏛️ Uttar Pradesh</button>
                <button type="button" class="state-pill" onclick="selectQuickState('Delhi')">🇮🇳 Delhi</button>
                <button type="button" class="state-pill" onclick="selectQuickState('Jammu and Kashmir')">❄️ Kashmir</button>
                <button type="button" class="state-pill" onclick="selectQuickState('Maharashtra')">🌆 Maharashtra</button>
                <button type="button" class="state-pill" onclick="selectQuickState('Uttarakhand')">🌲 Uttarakhand</button>
                <button type="button" class="state-pill" onclick="selectQuickState('Tamil Nadu')">🛕 Tamil Nadu</button>
                <button type="button" class="state-pill" onclick="selectQuickState('Punjab')">🌾 Punjab</button>
                <button type="button" class="state-pill" onclick="selectQuickState('West Bengal')">🎨 West Bengal</button>
                <button type="button" class="state-pill" onclick="selectQuickState('Gujarat')">🦁 Gujarat</button>
                <button type="button" class="state-pill" onclick="selectQuickState('Ladakh')">🏔️ Ladakh</button>
            </div>
        </div>

        <div class="india-coverage-banner">
            🇮🇳 36 States & Union Territories • 30 Destinations Each (1,080 Total) • 15 Attractions Each (16,200 Total)
        </div>
    </div>
</section>
`);

// ==========================================
// 6. PLACES SECTION (TOP 30 DESTINATIONS & TOP 15 ATTRACTIONS)
// ==========================================
output.push(`
<!-- PLACES SECTION -->
<section class="section" id="places">
    <!-- Breadcrumbs -->
    <div id="travelBreadcrumb" class="travel-breadcrumb">
        <span class="crumb-btn" onclick="showStateView()">🏠 All States</span>
        <span class="crumb-sep">›</span>
        <span id="breadcrumbState" class="crumb-current">Karnataka (Top 30 Destinations)</span>
    </div>

    <!-- STATE SUMMARY BANNER -->
    <div id="stateBanner" class="state-banner-card"></div>

    <!-- STATE DESTINATIONS VIEW (TOP 30 DESTINATIONS) -->
    <div id="stateDestinationsView">
        <div class="section-title">
            <h2 id="placesTitle">🌟 Top 30 Famous Tourist Destinations in Karnataka</h2>
            <p id="placesSubtitle">Click "Explore 15 Attractions" on any destination to view its complete sights, travel tips, and full guides.</p>
        </div>

        <!-- Filter & Search Bar for Destinations -->
        <div class="destination-filter-bar">
            <div class="filter-search-row">
                <div class="dest-search-input-wrap">
                    <span>🔎</span>
                    <input id="destSearchInput" type="text" placeholder="Filter destinations by name or district..." oninput="onFilterDestinationsSearch()">
                </div>

                <div class="sort-select-wrap">
                    <span class="sort-label">Sort By:</span>
                    <select id="destSortSelect" class="sort-select" onchange="onSortChanged()">
                        <option value="rank">🏆 Top Ranked (#1-#30)</option>
                        <option value="rating">⭐ Highest Rated</option>
                        <option value="name">🔤 Alphabetical (A-Z)</option>
                    </select>
                </div>
            </div>

            <div class="filter-chips-track">
                <button class="filter-chip active" onclick="filterDestByCategory('all', this)">⭐ All Categories (30)</button>
                <button class="filter-chip" onclick="filterDestByCategory('heritage', this)">🏰 Heritage & Palaces</button>
                <button class="filter-chip" onclick="filterDestByCategory('hill', this)">🏔️ Hill Stations</button>
                <button class="filter-chip" onclick="filterDestByCategory('temple', this)">🛕 Pilgrimage & Temples</button>
                <button class="filter-chip" onclick="filterDestByCategory('beach', this)">🏖️ Coastal & Beaches</button>
                <button class="filter-chip" onclick="filterDestByCategory('wildlife', this)">🦁 Wildlife & Nature</button>
                <button class="filter-chip" onclick="filterDestByCategory('waterfall', this)">🌊 Waterfalls & Adventure</button>
            </div>
        </div>

        <div id="destinationGrid" class="destination-grid"></div>
    </div>

    <!-- DEDICATED DESTINATION DETAILS VIEW (TOP 15 ATTRACTIONS) -->
    <div id="destinationDetailsView" class="destination-details-view">
        <div id="destHeroBanner" class="dest-hero-banner"></div>
        <div id="destSpecsGrid" class="dest-specs-grid"></div>
        <div id="destInsightsGrid" class="dest-insights-grid"></div>

        <div class="section-title" style="margin-top: 40px; margin-bottom: 25px;">
            <h2 id="attractionsTitle">🏆 Top 15 Must-Visit Attractions</h2>
            <p id="attractionsSubtitle">Discover the 15 best sights, monuments, and viewpoints with verified photos, exact locations, opening hours, entry fees, and travel guides.</p>
        </div>

        <div id="attractionsGrid" class="attraction-grid"></div>
    </div>
</section>
`);

// ==========================================
// 7. TRAVEL ROUTE & SMART ITINERARY PLANNER (#planner)
// ==========================================
output.push(`
<!-- TRAVEL ROUTE & SMART ITINERARY PLANNER -->
<section class="section section-alt" id="planner">
    <div class="section-title">
        <h2>🧭 Smart Travel Route & Itinerary Planner</h2>
        <p>Calculate realistic road distances, driving times, multi-modal transport options across India, and generate practical day-by-day itineraries.</p>
    </div>

    <div class="planner-grid">
        <!-- Left Column: Route Calculator -->
        <div class="planner-card">
            <h3>🚗 Travel Route & Distance Calculator</h3>

            <div class="form-group-wrap">
                <label class="form-label">Starting Location (Origin)</label>
                <div class="input-with-btn">
                    <input id="plannerOrigin" type="text" placeholder="Enter starting city (e.g. Bengaluru, Delhi, Mumbai)..." value="Bengaluru">
                    <button type="button" class="btn-gps-detect" onclick="detectGPSOrigin()">📍 Use GPS</button>
                </div>
            </div>

            <div class="form-group-wrap">
                <label class="form-label">Destination</label>
                <input id="plannerDestination" type="text" placeholder="Select destination or state..." readonly value="Mysore, Karnataka">
            </div>

            <div class="form-group-wrap">
                <label class="form-label">Select Preferred Transit Mode</label>
                <div class="mode-selector">
                    <button type="button" class="mode-btn active" onclick="setPlannerMode('car', this)">🚗 Driving / Cab</button>
                    <button type="button" class="mode-btn" onclick="setPlannerMode('train', this)">🚆 Train</button>
                    <button type="button" class="mode-btn" onclick="setPlannerMode('flight', this)">✈️ Flight</button>
                    <button type="button" class="mode-btn" onclick="setPlannerMode('bus', this)">🚌 Bus</button>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom: 20px;">
                <div>
                    <label class="form-label">Trip Duration</label>
                    <select id="plannerDays" onchange="calculateRouteAndItinerary()">
                        <option value="1">1 Day Express</option>
                        <option value="2">2 Days Weekend</option>
                        <option value="3" selected>3 Days Classic</option>
                        <option value="5">5 Days Deep Dive</option>
                        <option value="7">7 Days Grand Tour</option>
                    </select>
                </div>
                <div>
                    <label class="form-label">Travel Style</label>
                    <select id="plannerStyle">
                        <option value="balanced">⭐ Balanced Sightseeing</option>
                        <option value="family">👨‍👩‍👧 Family Friendly</option>
                        <option value="budget">💰 Budget Backpacker</option>
                        <option value="heritage">🏛️ Heritage & Culture</option>
                    </select>
                </div>
            </div>

            <button type="button" class="btn-calculate-route" onclick="calculateRouteAndItinerary()">
                ⚡ Calculate Route & Update Itinerary
            </button>

            <!-- Route Results Box -->
            <div id="routeResultsBox" class="route-result-panel">
                <div class="route-stats-grid">
                    <div class="route-stat-box">
                        <div id="routeDistVal" class="route-stat-val">159 km</div>
                        <div class="route-stat-lbl">Road Distance</div>
                    </div>
                    <div class="route-stat-box">
                        <div id="routeTimeVal" class="route-stat-val">3 hr 4 min</div>
                        <div class="route-stat-lbl">Driving Time</div>
                    </div>
                    <div class="route-stat-box">
                        <div id="routeFuelVal" class="route-stat-val">₹1,150</div>
                        <div class="route-stat-lbl">Est. Fuel Cost</div>
                    </div>
                    <div class="route-stat-box">
                        <div id="routeTollVal" class="route-stat-val">₹260</div>
                        <div class="route-stat-lbl">Est. Toll Taxes</div>
                    </div>
                </div>

                <div class="route-cab-fares">
                    <div class="route-cab-title">🚕 Estimated Cab & Transit Tariffs (Planning Rates):</div>
                    <div class="route-cab-pills">
                        <div id="fareAutoPill" class="cab-fare-pill">🛺 Auto: City only</div>
                        <div id="fareSedanPill" class="cab-fare-pill">🚗 Sedan: ₹2,940</div>
                        <div id="fareSuvPill" class="cab-fare-pill">🚙 SUV: ₹3,950</div>
                    </div>
                </div>

                <!-- Google Maps Directions Embed -->
                <div class="map-embed-frame">
                    <iframe id="routeMapIframe" width="100%" height="100%" frameborder="0" style="border:0;" loading="lazy" src="https://maps.google.com/maps?saddr=Bengaluru&daddr=Mysore&output=embed"></iframe>
                </div>

                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <a id="btnOpenGoogleNav" class="btn btn-card-util" style="flex:1; background:var(--primary); color:white; padding:12px; border-radius:var(--radius-md); font-weight:700;" href="https://www.google.com/maps/dir/?api=1&origin=Bengaluru&destination=Mysore" target="_blank" rel="noopener">
                        📍 Open Turn-by-Turn Navigation in Google Maps
                    </a>
                </div>
            </div>
        </div>

        <!-- Right Column: Day-by-Day Practical Itinerary -->
        <div class="planner-card">
            <div class="itinerary-header-bar">
                <div>
                    <h3 style="margin-bottom:2px;">📋 Practical Day-by-Day Itinerary</h3>
                    <span id="itinSubtitle" style="font-size:13px; color:var(--text-muted);">Customized for Mysore, Karnataka</span>
                </div>

                <div class="itin-actions">
                    <button type="button" class="btn-itin-action" onclick="copyItineraryToClipboard()">📋 Copy</button>
                    <button type="button" class="btn-itin-action" onclick="printItinerary()">🖨️ Print / PDF</button>
                    <button type="button" class="btn-itin-action" onclick="shareItineraryWhatsApp()">📲 Share</button>
                </div>
            </div>

            <div id="itineraryPrintArea">
                <div id="itineraryDaysList"></div>
            </div>
        </div>
    </div>
</section>
`);

// ==========================================
// 8. REAL HOTELS & ACCOMMODATIONS SEARCH HUB (#stay)
// ==========================================
output.push(`
<!-- REAL HOTELS & ACCOMMODATIONS SEARCH HUB -->
<section class="section" id="stay">
    <div class="section-title">
        <h2>🏨 Real Hotels & Accommodations Search</h2>
        <p>Search live rates and actual room availability through authorized booking engines. No fake reservations or false availability.</p>
    </div>

    <!-- Live Hotel Search Form -->
    <div class="hotel-search-card">
        <div class="hotel-search-form">
            <div class="form-group-wrap" style="margin-bottom:0;">
                <label class="form-label">Destination City</label>
                <input id="hotelDestInput" type="text" placeholder="Destination City" value="Mysore, Karnataka" readonly>
            </div>

            <div class="form-group-wrap" style="margin-bottom:0;">
                <label class="form-label">Check-in Date</label>
                <input id="hotelCheckIn" type="date">
            </div>

            <div class="form-group-wrap" style="margin-bottom:0;">
                <label class="form-label">Check-out Date</label>
                <input id="hotelCheckOut" type="date">
            </div>

            <div class="form-group-wrap" style="margin-bottom:0;">
                <label class="form-label">Guests & Rooms</label>
                <select id="hotelGuests">
                    <option value="2-1">2 Adults, 1 Room</option>
                    <option value="1-1">1 Adult (Solo), 1 Room</option>
                    <option value="3-1">3 Adults, 1 Room</option>
                    <option value="4-2">4 Adults (Family), 2 Rooms</option>
                </select>
            </div>

            <div class="form-group-wrap" style="margin-bottom:0;">
                <label class="form-label">Stay Category</label>
                <select id="hotelStayType">
                    <option value="all">⭐ All Accommodations</option>
                    <option value="luxury">🏰 Luxury Heritage & 5-Star</option>
                    <option value="boutique">🏨 Boutique & 3-Star Hotels</option>
                    <option value="budget">💰 Budget Lodges & Rooms</option>
                    <option value="dharamshala">🛕 Dharamshalas & Ashrams</option>
                    <option value="homestay">🏠 Homestays & Hostels</option>
                </select>
            </div>
        </div>

        <button type="button" class="btn-hotel-search" onclick="searchLiveHotels()">
            🔎 Search Live Availability & Compare Real Booking Prices
        </button>
    </div>

    <!-- Direct Legitimate Booking Providers -->
    <div class="section-title" style="margin-bottom:25px;">
        <h3 style="font-size:22px; color:var(--secondary);">🌐 Authorized Booking Providers</h3>
        <p style="font-size:14.5px;">Click any partner below to view instant live availability and discounted member rates for your dates.</p>
    </div>

    <div id="bookingProvidersGrid" class="booking-providers-grid"></div>

    <!-- Curated Verified Stays Directory for the Destination -->
    <div class="section-title" style="margin-top:40px; margin-bottom:25px;">
        <h3 id="verifiedStaysTitle" style="font-size:22px; color:var(--secondary);">⭐ Verified Reputable Stays in Mysore</h3>
        <p style="font-size:14.5px;">Hand-picked iconic heritage hotels, state tourism lodges, and vetted properties near major attractions.</p>
    </div>

    <div id="verifiedStaysGrid" class="verified-stays-grid"></div>

    <!-- Trust & Booking Integrity Guarantee -->
    <div class="trust-disclaimer-box">
        🔒 <strong>TravelGuru Booking Transparency Guarantee:</strong> TravelGuru connects you directly to official, licensed accommodation providers (Booking.com, Agoda, MakeMyTrip, Oyo, and State Tourism Corporations). We never show fake room inventories, simulate completed transactions, or store payment card data. All payments and booking confirmations occur securely on the partner provider's platform.
    </div>
</section>
`);

// ==========================================
// 9. REGIONAL FOOD & DINING EXPLORER (#food)
// ==========================================
output.push(`
<!-- REGIONAL FOOD & DINING EXPLORER -->
<section class="section section-alt" id="food">
    <div class="section-title">
        <h2>🍽️ Regional Food Specialties & Dining Guide</h2>
        <p>Savor authentic culinary heritage, visit legendary local dining institutions, and order swift delivery near your destination.</p>
    </div>

    <!-- Destination Food Specialty Banner -->
    <div id="foodHeroBanner" class="food-hero-banner">
        <div class="food-hero-title" id="foodHeroTitle">🍛 Authentic Karnataka Culinary Specialties</div>
        <div class="food-hero-dishes" id="foodHeroDishes">Mysore Pak, Mysore Masala Dosa, Bisi Bele Bath, Neer Dosa, Mangalorean Fish Curry, Filter Coffee, and Ragi Mudde.</div>
    </div>

    <!-- Dietary Filter Chips -->
    <div class="food-filters-track">
        <button type="button" class="food-filter-chip active" onclick="filterFoodByTag('all', this)">⭐ All Cuisines</button>
        <button type="button" class="food-filter-chip" onclick="filterFoodByTag('veg', this)">🟢 Pure Veg & Satvik</button>
        <button type="button" class="food-filter-chip" onclick="filterFoodByTag('heritage', this)">🏛️ Legendary & Heritage</button>
        <button type="button" class="food-filter-chip" onclick="filterFoodByTag('street', this)">🍢 Street Food & Snacks</button>
        <button type="button" class="food-filter-chip" onclick="filterFoodByTag('finedine', this)">🍷 Fine Dining & Royal</button>
    </div>

    <!-- Restaurants Directory -->
    <div id="restaurantsGrid" class="restaurants-grid"></div>
</section>
`);

// ==========================================
// 10. MULTI-MODAL TRANSPORT & RIDES HUB (#transport)
// ==========================================
output.push(`
<!-- MULTI-MODAL TRANSPORT & RIDES HUB -->
<section class="section" id="transport">
    <div class="section-title">
        <h2>🚆 Multi-Modal Transport & Rides Hub</h2>
        <p>Comprehensive transit guidance connecting Indian Railways, domestic airlines, state transport buses, and local ride tariffs.</p>
    </div>

    <!-- Transport Tabs -->
    <div class="transport-tabs">
        <button type="button" class="transport-tab-btn active" onclick="switchTransportTab('trains', this)">🚆 Indian Railways (Trains)</button>
        <button type="button" class="transport-tab-btn" onclick="switchTransportTab('flights', this)">✈️ Domestic Flights</button>
        <button type="button" class="transport-tab-btn" onclick="switchTransportTab('buses', this)">🚌 Interstate Buses</button>
        <button type="button" class="transport-tab-btn" onclick="switchTransportTab('cabs', this)">🚕 Local Cabs & Rides</button>
    </div>

    <!-- Tab 1: Trains -->
    <div id="pane-trains" class="transport-pane active">
        <h3 style="font-size:22px; color:var(--secondary); margin-bottom:8px;">🚆 Indian Railways (IRCTC Connections)</h3>
        <p style="color:var(--text-muted); font-size:14.5px;">Primary railway stations serving your selected destination with official IRCTC reservation portals and live train status.</p>
        
        <div id="trainsContent" class="transport-cards-grid"></div>
    </div>

    <!-- Tab 2: Flights -->
    <div id="pane-flights" class="transport-pane">
        <h3 style="font-size:22px; color:var(--secondary); margin-bottom:8px;">✈️ Domestic & International Flight Connectivity</h3>
        <p style="color:var(--text-muted); font-size:14.5px;">Nearest commercial airports, IATA airport codes, distance to city center, and real-time flight search engines.</p>

        <div id="flightsContent" class="transport-cards-grid"></div>
    </div>

    <!-- Tab 3: Buses -->
    <div id="pane-buses" class="transport-pane">
        <h3 style="font-size:22px; color:var(--secondary); margin-bottom:8px;">🚌 Interstate & State Road Transport Corporation (RTC) Buses</h3>
        <p style="color:var(--text-muted); font-size:14.5px;">Official government state transport corporations and private luxury AC sleeper buses.</p>

        <div id="busesContent" class="transport-cards-grid"></div>
    </div>

    <!-- Tab 4: Cabs -->
    <div id="pane-cabs" class="transport-pane">
        <h3 style="font-size:22px; color:var(--secondary); margin-bottom:8px;">🚕 Local City Cabs, Auto-Rickshaws & App Rides</h3>
        <p style="color:var(--text-muted); font-size:14.5px;">Standard city tariff guidelines across Auto, Hatchback/Sedan, and SUV, with direct app comparison on Uber, Ola, and Rapido.</p>

        <table class="tariff-matrix">
            <thead>
                <tr>
                    <th>Vehicle Type</th>
                    <th>Base Tariff</th>
                    <th>Per Km Rate</th>
                    <th>Ideal For</th>
                    <th>Direct Booking</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>🛺 Auto Rickshaw</strong></td>
                    <td>₹35 (first 1.5 km)</td>
                    <td>₹14 / km</td>
                    <td>Quick city trips, solo/couple, short distances</td>
                    <td><a href="https://www.rapido.bike" target="_blank" rel="noopener" class="btn-attr-util">Open Rapido</a></td>
                </tr>
                <tr>
                    <td><strong>🚗 Sedan / Prime Cab</strong></td>
                    <td>₹80 (first 4 km)</td>
                    <td>₹20 / km</td>
                    <td>AC comfort, luggage, airport/station transfer</td>
                    <td><a href="https://book.olacabs.com" target="_blank" rel="noopener" class="btn-attr-util">Open Ola Cabs</a></td>
                </tr>
                <tr>
                    <td><strong>🚙 SUV / Ertiga / Innova</strong></td>
                    <td>₹130 (first 4 km)</td>
                    <td>₹26 / km</td>
                    <td>Families (up to 6 passengers), outstation trips</td>
                    <td><a href="https://m.uber.com" target="_blank" rel="noopener" class="btn-attr-util">Open Uber</a></td>
                </tr>
            </tbody>
        </table>

        <div style="text-align:center; margin-top:20px;">
            <button class="btn btn-explore-dest" style="max-width:320px;" onclick="openRideForPlace(currentSelectedDestination ? currentSelectedDestination.name : 'Mysore', currentSelectedState)">
                🚕 Compare Live Fares for Selected Sights
            </button>
        </div>
    </div>
</section>
`);

// ==========================================
// 11. FEATURES SECTION
// ==========================================
output.push(`
<!-- FEATURES -->
<section class="section section-alt" id="features">
    <div class="section-title">
        <h2>✨ Everything For Your Journey</h2>
        <p>TravelGuru brings all essential travel planning tools together on one seamless platform.</p>
    </div>

    <div class="features">
        <div class="feature">
            <div class="feature-icon">📸</div>
            <h3>Real Place Photos</h3>
            <p>Every destination features verified high-resolution photography with proper attribution so you know exactly what to expect.</p>
        </div>

        <div class="feature">
            <div class="feature-icon">🧭</div>
            <h3>Smart Route Planning</h3>
            <p>Accurate road distances, driving times, multi-modal transport comparisons, and dynamic practical day-by-day itineraries.</p>
        </div>

        <div class="feature">
            <div class="feature-icon">🏨</div>
            <h3>Genuine Hotel Links</h3>
            <p>Legitimate search links to Booking.com, Agoda, MakeMyTrip, and state tourism lodges with zero fake confirmations.</p>
        </div>

        <div class="feature">
            <div class="feature-icon">🍛</div>
            <h3>Regional Food & Dining</h3>
            <p>Authentic state food specialties, legendary iconic eateries, Google Maps directions, and quick online delivery.</p>
        </div>
    </div>
</section>
`);

// ==========================================
// 12. MODAL POPUPS (GUIDE, RIDE, FOOD)
// ==========================================
output.push(`
<!-- GUIDE POPUP -->
<div class="popup" id="guidePopup">
    <div class="popup-box">
        <span class="close" onclick="closeGuidePopup()">&times;</span>
        <div id="guideContent"></div>
    </div>
</div>

<!-- RIDE POPUP -->
<div class="popup" id="ridePopup">
    <div class="popup-box">
        <span class="close" onclick="closePopup('ridePopup')">&times;</span>

        <h2>🚕 Compare & Book Your Ride</h2>
        <p style="color:#777; margin:10px 0 20px;">
            Compare estimated tariffs for your chosen vehicle and open Rapido, Ola, or Uber directly.
        </p>

        <form onsubmit="submitRide(event)">
            <div class="form-group">
                <label>Passenger Name</label>
                <input id="passengerName" type="text" required placeholder="Enter your full name">
            </div>

            <div class="form-group">
                <label>Mobile Number</label>
                <input id="passengerPhone" type="tel" required pattern="[0-9]{10}" placeholder="10 digit mobile number">
            </div>

            <div class="form-group">
                <label>Number of Passengers</label>
                <input id="passengerCount" type="number" min="1" max="10" value="1" onchange="updateRideComparison()" required>
            </div>

            <div class="form-group">
                <label>Travel Date</label>
                <input id="travelDate" type="date" required>
            </div>

            <div class="form-group">
                <label>Destination</label>
                <input id="ridePlace" type="text" readonly>
            </div>

            <div class="form-group">
                <label>Pickup Location</label>
                <div class="location-options">
                    <label class="location-option active" id="gpsOption">
                        <input type="radio" name="pickupMode" value="gps" checked onchange="setPickupMode('gps')">
                        📍 Use Current GPS
                    </label>

                    <label class="location-option" id="manualOption">
                        <input type="radio" name="pickupMode" value="manual" onchange="setPickupMode('manual')">
                        ✍️ Enter Manually
                    </label>
                </div>

                <input id="pickupLocation" type="text" placeholder="Click Detect My Current Location">
                <button type="button" class="btn-gps-detect" style="width:100%; margin-top:8px; padding:10px;" onclick="useCurrentLocation()">📍 Detect My Current Location</button>
                <div id="locationStatus" class="location-help">GPS selected. Click the button above to capture your coordinates.</div>
            </div>

            <div class="form-group">
                <label>Select Vehicle</label>
                <div class="vehicle-grid">
                    <label class="vehicle">
                        <input type="radio" name="vehicle" value="auto" checked onchange="updateRideComparison()">
                        🛺 Auto
                    </label>
                    <label class="vehicle">
                        <input type="radio" name="vehicle" value="sedan" onchange="updateRideComparison()">
                        🚗 Sedan
                    </label>
                    <label class="vehicle">
                        <input type="radio" name="vehicle" value="suv" onchange="updateRideComparison()">
                        🚙 SUV
                    </label>
                </div>
            </div>

            <div class="price-box">
                <div>Estimated Travel Distance</div>
                <strong id="rideDistance">8.5 km</strong>
                <span id="priceDescription">Standard City Route • Planning Estimates</span>
            </div>

            <div id="rideComparison" class="ride-actions"></div>

            <div class="compare-note">
                💡 <strong>Fair Pricing Notice:</strong> These estimates are planning approximations calculated on city tariffs. Actual live app fares may vary slightly based on real-time traffic and demand surges.
            </div>

            <div class="form-group">
                <label>Additional Notes / Requests</label>
                <textarea id="rideMessage" placeholder="Any special pickup instructions or timing preferences..."></textarea>
            </div>

            <button class="submit-btn" type="submit">📱 Send Ride Booking Request via WhatsApp</button>
        </form>
    </div>
</div>

<!-- FOOD POPUP -->
<div class="popup" id="foodPopup">
    <div class="popup-box">
        <span class="close" onclick="closePopup('foodPopup')">&times;</span>

        <h2>🍔 Nearby Food & Delivery</h2>
        <p id="foodText" style="color:#777; margin:10px 0 20px;"></p>

        <div class="food-grid">
            <button class="food-service" onclick="findDelivery('Zomato')">🍴 Zomato Delivery</button>
            <button class="food-service" onclick="findDelivery('Swiggy')">🥡 Swiggy Delivery</button>
            <button class="food-service" onclick="findDelivery('McDonalds')">🍔 McDonald's</button>
            <button class="food-service" onclick="findDelivery('Dominos')">🍕 Domino's Pizza</button>
            <button class="food-service" onclick="findDelivery('Burger King')">🍔 Burger King</button>
            <button class="food-service" onclick="findDelivery('KFC')">🍗 KFC</button>
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap; margin:15px 0;">
            <button class="btn btn-attr-util" style="flex:1;" onclick="findFoodTier('budget')">💰 Budget & Street Food</button>
            <button class="btn btn-attr-util" style="flex:1;" onclick="findFoodTier('moderate')">🟡 Popular Restaurants</button>
            <button class="btn btn-attr-util" style="flex:1;" onclick="findFoodTier('premium')">💎 Fine Dining</button>
        </div>

        <div id="foodResult" class="food-result">
            📍 Select any option above to search food around this destination.
        </div>
    </div>
</div>

<!-- TOAST CONTAINER -->
<div id="toastContainer" class="toast-container"></div>
`);

// ==========================================
// 13. FOOTER
// ==========================================
output.push(`
<!-- FOOTER -->
<footer>
    <div class="footer-grid">
        <div class="footer-col">
            <h3>TravelGuru.com 🇮🇳</h3>
            <p>The premier real-world travel planning platform for Incredible India. Empowering travelers with accurate route distances, multi-modal transport comparisons, practical day-by-day itineraries, genuine hotel search links, and authentic regional culinary guides.</p>
            <p>Covering all 28 Indian States & 8 Union Territories • 1,080 Destinations • 16,200 Attractions.</p>
        </div>

        <div class="footer-col">
            <h3>Quick Links</h3>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#destinations">All 36 States & UTs</a></li>
                <li><a href="#places">Top Tourist Sights</a></li>
                <li><a href="#planner">Trip Route Planner</a></li>
                <li><a href="#stay">Hotel Search</a></li>
                <li><a href="#food">Food & Dining</a></li>
                <li><a href="#transport">Transport Hub</a></li>
            </ul>
        </div>

        <div class="footer-col">
            <h3>Top States</h3>
            <ul>
                <li><a href="#places" onclick="selectQuickState('Karnataka')">Karnataka</a></li>
                <li><a href="#places" onclick="selectQuickState('Rajasthan')">Rajasthan</a></li>
                <li><a href="#places" onclick="selectQuickState('Goa')">Goa</a></li>
                <li><a href="#places" onclick="selectQuickState('Kerala')">Kerala</a></li>
                <li><a href="#places" onclick="selectQuickState('Himachal Pradesh')">Himachal Pradesh</a></li>
                <li><a href="#places" onclick="selectQuickState('Uttar Pradesh')">Uttar Pradesh</a></li>
                <li><a href="#places" onclick="selectQuickState('Maharashtra')">Maharashtra</a></li>
            </ul>
        </div>

        <div class="footer-col">
            <h3>Platform Trust</h3>
            <p>🔒 100% Genuine Partner Links</p>
            <p>🛡️ Zero Fake Bookings</p>
            <p>🚆 Official IRCTC & Airline Portals</p>
            <p>📸 Wikimedia & Verified Photos</p>
            <p>Ride & Travel Assistance: +91 99999 99999</p>
        </div>
    </div>

    <div class="footer-bottom">
        <p>© 2026 TravelGuru.com. All rights reserved. Made with ❤️ for Incredible India.</p>
        <p style="margin-top:6px; font-size:12px;">Disclaimer: Train, flight, bus, and hotel reservations are transacted exclusively on authorized third-party provider platforms. TravelGuru provides route guidance and planning tools.</p>
    </div>
</footer>

<!-- MASTER DATABASE LINK -->
<script src="travel_database.js"></script>
`);

console.log("Markup generated successfully. Now generating JavaScript application controller...");

fs.writeFileSync('generated_markup.html', output.join(''));
console.log("Markup written to generated_markup.html");
