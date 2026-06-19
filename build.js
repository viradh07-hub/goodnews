const fs = require('fs');
const path = require('path');

// Tell the script where to find your new articles
const postsDir = path.join(__dirname, 'content', 'posts');
let combinedFeed = [];

// Scoop up every article and format it for the live feed
if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir);
    
    files.forEach(file => {
        if (file.endsWith('.md')) {
            const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
            const lines = content.split('\n');
            
            // Set defaults so the feed never breaks
            let post = { date: new Date().toISOString(), category: 'all' };
            let isBody = false;
            let bodyText = "";
            
            lines.forEach(line => {
                if (line.startsWith('---')) return;
                
                // Map the CMS fields to the Live Site fields
                if (line.startsWith('headline:')) {
                    post.label = line.replace('headline:', '').trim().replace(/['"]/g, '');
                } else if (line.startsWith('image:')) {
                    post.image = line.replace('image:', '').trim().replace(/['"]/g, '');
                } else if (line.startsWith('body:')) {
                    isBody = true;
                } else if (isBody) {
                    bodyText += line + " ";
                }
            });
            
            post.text = bodyText.trim() || "Tap to read more...";
            combinedFeed.push(post);
        }
    });
}

// Save the assembled magazine feed for the website to read
fs.writeFileSync(path.join(__dirname, 'feed.json'), JSON.stringify(combinedFeed));
console.log("Successfully generated live feed from your content repository!");
