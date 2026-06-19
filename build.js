const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'content', 'posts');
let combinedFeed = [];

// Check if you have published any articles yet
if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir);
    
    files.forEach(file => {
        if (file.endsWith('.md')) {
            const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
            
            // Sveltia CMS saves files with "---" separating settings from body text
            const parts = content.split('---');
            
            if (parts.length >= 3) {
                const frontmatter = parts[1];
                const bodyText = parts.slice(2).join('---').trim();
                
                let post = { 
                    date: new Date().toISOString(), 
                    text: bodyText || "Tap to read more..." 
                };
                
                // Read the hidden settings block
                const lines = frontmatter.split('\n');
                lines.forEach(line => {
                    if (line.includes(':')) {
                        const [key, ...rest] = line.split(':');
                        const value = rest.join(':').trim().replace(/^['"]|['"]$/g, ''); // Clean up quotes
                        
                        if (key.trim() === 'headline') post.label = value;
                        if (key.trim() === 'image') post.image = value;
                        if (key.trim() === 'category') post.category = value;
                    }
                });
                
                // Fallback if no category is selected
                if (!post.category) post.category = 'all';
                
                combinedFeed.push(post);
            }
        }
    });
}

// Write the final master feed for the website to display
fs.writeFileSync(path.join(__dirname, 'feed.json'), JSON.stringify(combinedFeed));
console.log("Successfully generated live feed from your content repository!");
