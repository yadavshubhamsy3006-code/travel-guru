/**
 * Build Script: Upgrades final.html into a complete, professional, real-world
 * travel planning platform for Incredible India.
 */

const fs = require('fs');
const path = require('path');

console.log("Reading existing final.html...");
const originalHtml = fs.readFileSync('final.html', 'utf8');

// Load travel database to verify structure
global.window = {};
require('./travel_database.js');
const db = window.INDIA_TRAVEL_DATA;
const statesList = Object.keys(db).sort();
console.log(`Database verified: ${statesList.length} states loaded.`);

// Build enhanced HTML
// 1. Enhanced Head with SEO, Favicon, OpenGraph, Twitter, JSON-LD Schema
const enhancedHead = `<!DOCTYPE html>
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
`;

console.log("Head template generated.");
