const fs = require('fs');

global.window = {};
require('./travel_database.js');
const db = window.INDIA_TRAVEL_DATA;
const states = Object.keys(db).sort();
const today = '2026-11-01';

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

// Homepage
xml += '  <url>\n    <loc>https://travelguru.com/</loc>\n    <lastmod>' + today + '</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n';

// States & top destinations
states.forEach(state => {
  const slug = encodeURIComponent(state.toLowerCase().replace(/\s+/g, '-'));
  xml += '  <url>\n    <loc>https://travelguru.com/state/' + slug + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n';
  
  const dests = db[state].destinations || [];
  dests.slice(0, 5).forEach(d => {
    const destSlug = encodeURIComponent(d.name.toLowerCase().replace(/\s+/g, '-'));
    xml += '  <url>\n    <loc>https://travelguru.com/destination/' + slug + '/' + destSlug + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n';
  });
});

xml += '</urlset>\n';
fs.writeFileSync('sitemap.xml', xml);
console.log('sitemap.xml successfully generated with ' + (1 + states.length * 6) + ' URLs');
