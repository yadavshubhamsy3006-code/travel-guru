const fs = require('fs');
const content = fs.readFileSync('final.html', 'utf8');

// Check script tags
const scriptMatches = content.match(/<script[\s\S]*?<\/script>/gi);
console.log('Script tags count:', scriptMatches ? scriptMatches.length : 0);

// Check if ImageService is present
console.log('Has ImageService:', content.includes('const ImageService = {'));
console.log('Has onImgLoad:', content.includes('ImageService.onImgLoad(this)'));
console.log('Has img-skeleton:', content.includes('img-skeleton'));
console.log('Has img-attribution-pill:', content.includes('img-attribution-pill'));

// Check CSS
console.log('Has tgShimmerSweep:', content.includes('tgShimmerSweep'));

// Check travel_database.js link
console.log('Links travel_database.js:', content.includes('src="travel_database.js"'));
