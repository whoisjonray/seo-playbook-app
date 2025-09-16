const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Configure marked for better HTML output
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
});

const sourceDir = '/Users/user/Documents/Cursor Clients/**SEO Playbook';
const strategiesDir = path.join(sourceDir, 'strategies');
const outputDir = path.join(__dirname, 'public');
const strategiesOutputDir = path.join(outputDir, 'strategies');

// Categories for organization
const categories = {
    'ai-search': 'AI & Search Features',
    'link-building': 'Link Building',
    'local-seo': 'Local SEO',
    'content': 'Content Strategy',
    'technical': 'Technical SEO',
    'youtube': 'YouTube & Video',
    'authority': 'Authority Building',
    'conversion': 'Conversion Optimization',
    'enterprise': 'Enterprise SEO',
    'tools': 'Tools & Resources'
};

// Category mapping for strategies
const categoryMapping = {
    'youtube': ['001', '036'],
    'ai-search': ['002', '018', '029', '055', '074', '076'],
    'link-building': ['008', '009', '010', '011', '019', '034', '040', '044'],
    'local-seo': ['004', '005', '007', '015', '024', '028', '034', '039'],
    'content': ['006', '016', '023', '030', '041', '048', '051', '053'],
    'technical': ['003', '012', '013', '014', '017', '020', '045', '052', '056', '058', '060', '062', '065', '072', '073'],
    'authority': ['067', '078', '082'],
    'conversion': ['068'],
    'tools': ['040'],
    'enterprise': ['082']
};

async function convertMarkdownToHTML(mdContent, title = 'SEO Strategy') {
    const htmlContent = marked(mdContent);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - SEO Playbook</title>
    <link rel="stylesheet" href="/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-brand">📚 SEO Playbook</a>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/categories">Categories</a>
                <a href="/search">Search</a>
                <a href="/about">About</a>
            </div>
        </div>
    </nav>
    <div class="container">
        <div class="content-wrapper">
            <aside class="sidebar">
                <h3>Quick Links</h3>
                <ul class="sidebar-links">
                    ${Object.entries(categories).map(([key, name]) =>
                        `<li><a href="/category/${key}">${name}</a></li>`
                    ).join('')}
                </ul>
            </aside>
            <main class="main-content">
                <div class="strategy-content">
                    ${htmlContent}
                </div>
                <div class="navigation-buttons">
                    <a href="/" class="btn btn-secondary">← Back to Index</a>
                </div>
            </main>
        </div>
    </div>
</body>
</html>`;
}

async function buildSite() {
    console.log('🚀 Building SEO Playbook site...');

    // Create output directories
    await fs.ensureDir(outputDir);
    await fs.ensureDir(strategiesOutputDir);

    // Read all strategy files
    const strategyFiles = await fs.readdir(strategiesDir);
    const strategies = [];

    // Convert each strategy to HTML
    for (const file of strategyFiles) {
        if (file.endsWith('.md')) {
            const mdContent = await fs.readFile(path.join(strategiesDir, file), 'utf-8');
            const strategyName = file.replace('.md', '');
            const title = strategyName.replace(/^\d+-/, '').replace(/-/g, ' ')
                .split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

            const html = await convertMarkdownToHTML(mdContent, title);
            const htmlFile = file.replace('.md', '.html');

            await fs.writeFile(path.join(strategiesOutputDir, htmlFile), html);

            // Extract strategy number for categorization
            const strategyNum = file.match(/^(\d+)/)?.[1];
            let category = 'technical'; // default

            for (const [cat, nums] of Object.entries(categoryMapping)) {
                if (nums.includes(strategyNum)) {
                    category = cat;
                    break;
                }
            }

            strategies.push({
                file: htmlFile,
                title,
                number: strategyNum,
                category,
                mdFile: file
            });

            console.log(`  ✓ Converted ${file}`);
        }
    }

    // Create the main index page
    const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO Strategy Playbook - 234 Proven Strategies</title>
    <link rel="stylesheet" href="/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-brand">📚 SEO Playbook</a>
            <div class="nav-links">
                <a href="/" class="active">Home</a>
                <a href="/categories">Categories</a>
                <a href="/search">Search</a>
                <a href="/about">About</a>
            </div>
        </div>
    </nav>

    <header class="hero">
        <div class="hero-content">
            <h1>🚀 SEO Strategy Playbook</h1>
            <p class="hero-subtitle">234 Proven Strategies for Dominating Search Rankings</p>
            <div class="hero-stats">
                <div class="stat">
                    <span class="stat-number">234</span>
                    <span class="stat-label">Strategies</span>
                </div>
                <div class="stat">
                    <span class="stat-number">10</span>
                    <span class="stat-label">Categories</span>
                </div>
                <div class="stat">
                    <span class="stat-number">2025</span>
                    <span class="stat-label">Updated</span>
                </div>
            </div>
            <div class="hero-actions">
                <a href="#strategies" class="btn btn-primary">Browse Strategies</a>
                <a href="/search" class="btn btn-secondary">Search Playbook</a>
            </div>
        </div>
    </header>

    <div class="container">
        <section class="features">
            <h2>What's Inside</h2>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <h3>Actionable Strategies</h3>
                    <p>Each strategy includes step-by-step implementation guides</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>Difficulty Ratings</h3>
                    <p>Know exactly what skills and resources you need</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⏱️</div>
                    <h3>Time Estimates</h3>
                    <p>Plan your SEO roadmap with accurate timelines</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">💡</div>
                    <h3>Best Practices</h3>
                    <p>Learn from proven techniques that actually work</p>
                </div>
            </div>
        </section>

        <section id="strategies" class="strategies-section">
            <h2>All Strategies by Category</h2>

            ${Object.entries(categories).map(([catKey, catName]) => {
                const catStrategies = strategies.filter(s => s.category === catKey);
                if (catStrategies.length === 0) return '';

                return `
                <div class="category-section">
                    <h3 class="category-title">
                        <span class="category-icon">${getCategoryIcon(catKey)}</span>
                        ${catName}
                        <span class="category-count">${catStrategies.length} strategies</span>
                    </h3>
                    <div class="strategy-grid">
                        ${catStrategies.map(strategy => `
                            <a href="/strategies/${strategy.file}" class="strategy-card">
                                <div class="strategy-number">#${strategy.number}</div>
                                <h4>${strategy.title}</h4>
                                <div class="strategy-meta">
                                    <span class="tag tag-${catKey}">${catName}</span>
                                </div>
                            </a>
                        `).join('')}
                    </div>
                </div>
                `;
            }).join('')}
        </section>
    </div>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 SEO Strategy Playbook. Built with data-driven insights.</p>
        </div>
    </footer>

    <script src="/app.js"></script>
</body>
</html>`;

    await fs.writeFile(path.join(outputDir, 'index.html'), indexHTML);

    // Create search page
    const searchHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search - SEO Playbook</title>
    <link rel="stylesheet" href="/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-brand">📚 SEO Playbook</a>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/categories">Categories</a>
                <a href="/search" class="active">Search</a>
                <a href="/about">About</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="search-container">
            <h1>Search Strategies</h1>
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="Search for strategies, keywords, or techniques..." class="search-input">
                <button onclick="searchStrategies()" class="btn btn-primary">Search</button>
            </div>
            <div id="searchResults" class="search-results"></div>
        </div>
    </div>

    <script>
        const strategies = ${JSON.stringify(strategies)};

        function searchStrategies() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            const results = strategies.filter(s =>
                s.title.toLowerCase().includes(query) ||
                s.category.includes(query)
            );

            const resultsDiv = document.getElementById('searchResults');
            if (results.length === 0) {
                resultsDiv.innerHTML = '<p class="no-results">No strategies found. Try different keywords.</p>';
            } else {
                resultsDiv.innerHTML = \`
                    <h3>Found \${results.length} strategies</h3>
                    <div class="strategy-grid">
                        \${results.map(s => \`
                            <a href="/strategies/\${s.file}" class="strategy-card">
                                <div class="strategy-number">#\${s.number}</div>
                                <h4>\${s.title}</h4>
                                <div class="strategy-meta">
                                    <span class="tag tag-\${s.category}">\${s.category}</span>
                                </div>
                            </a>
                        \`).join('')}
                    </div>
                \`;
            }
        }

        // Search on Enter key
        document.getElementById('searchInput').addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                searchStrategies();
            }
        });
    </script>
</body>
</html>`;

    await fs.writeFile(path.join(outputDir, 'search.html'), searchHTML);

    // Create CSS file
    const css = `/* SEO Playbook Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #2563eb;
    --primary-dark: #1d4ed8;
    --secondary: #10b981;
    --dark: #1f2937;
    --light: #f9fafb;
    --border: #e5e7eb;
    --text: #374151;
    --text-light: #6b7280;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--text);
    background: var(--light);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Navigation */
.navbar {
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
    text-decoration: none;
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-links a {
    color: var(--text);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
}

.nav-links a:hover,
.nav-links a.active {
    color: var(--primary);
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    padding: 4rem 0;
    text-align: center;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
    margin-bottom: 2rem;
}

.hero-stats {
    display: flex;
    justify-content: center;
    gap: 4rem;
    margin: 3rem 0;
}

.stat {
    display: flex;
    flex-direction: column;
}

.stat-number {
    font-size: 2.5rem;
    font-weight: 700;
}

.stat-label {
    font-size: 0.875rem;
    text-transform: uppercase;
    opacity: 0.8;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

/* Buttons */
.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s;
    display: inline-block;
    border: none;
    cursor: pointer;
}

.btn-primary {
    background: white;
    color: var(--primary);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: var(--primary);
}

/* Features */
.features {
    padding: 4rem 0;
}

.features h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: var(--dark);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    color: var(--dark);
    margin-bottom: 0.5rem;
}

.feature-card p {
    color: var(--text-light);
}

/* Strategies Section */
.strategies-section {
    padding: 4rem 0;
}

.strategies-section h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: var(--dark);
}

.category-section {
    margin-bottom: 3rem;
}

.category-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--border);
    color: var(--dark);
}

.category-icon {
    font-size: 1.5rem;
}

.category-count {
    margin-left: auto;
    font-size: 0.875rem;
    color: var(--text-light);
    font-weight: 400;
}

.strategy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.strategy-card {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    text-decoration: none;
    color: var(--text);
    transition: all 0.3s;
    position: relative;
}

.strategy-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.strategy-number {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: var(--light);
    color: var(--text-light);
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
}

.strategy-card h4 {
    color: var(--dark);
    margin-bottom: 0.5rem;
    font-size: 1.125rem;
}

.strategy-meta {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.tag {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    background: var(--light);
    color: var(--text);
}

.tag-ai-search { background: #dbeafe; color: #1e40af; }
.tag-link-building { background: #fef3c7; color: #92400e; }
.tag-local-seo { background: #d1fae5; color: #065f46; }
.tag-content { background: #ede9fe; color: #5b21b6; }
.tag-technical { background: #fee2e2; color: #991b1b; }
.tag-youtube { background: #ffe4e6; color: #be123c; }

/* Content Layout */
.content-wrapper {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    margin-top: 2rem;
}

.sidebar {
    background: white;
    padding: 1.5rem;
    border-radius: 0.75rem;
    height: fit-content;
    position: sticky;
    top: 100px;
}

.sidebar h3 {
    color: var(--dark);
    margin-bottom: 1rem;
}

.sidebar-links {
    list-style: none;
}

.sidebar-links li {
    margin-bottom: 0.5rem;
}

.sidebar-links a {
    color: var(--text);
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.3s;
}

.sidebar-links a:hover {
    color: var(--primary);
}

.main-content {
    background: white;
    padding: 2rem;
    border-radius: 0.75rem;
    min-height: 600px;
}

.strategy-content {
    prose: true;
    max-width: none;
}

.strategy-content h1 {
    color: var(--dark);
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--border);
}

.strategy-content h2 {
    color: var(--dark);
    margin: 2rem 0 1rem;
}

.strategy-content h3 {
    color: var(--dark);
    margin: 1.5rem 0 0.75rem;
}

.strategy-content p {
    margin-bottom: 1rem;
    line-height: 1.8;
}

.strategy-content ul,
.strategy-content ol {
    margin-left: 2rem;
    margin-bottom: 1rem;
}

.strategy-content li {
    margin-bottom: 0.5rem;
}

.strategy-content code {
    background: var(--light);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
}

.strategy-content pre {
    background: var(--dark);
    color: white;
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin-bottom: 1rem;
}

.strategy-content blockquote {
    border-left: 4px solid var(--primary);
    padding-left: 1rem;
    margin: 1rem 0;
    color: var(--text-light);
    font-style: italic;
}

.navigation-buttons {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
}

/* Search Page */
.search-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
}

.search-container h1 {
    text-align: center;
    color: var(--dark);
    margin-bottom: 2rem;
}

.search-box {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid var(--border);
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.search-input:focus {
    outline: none;
    border-color: var(--primary);
}

.search-results {
    margin-top: 2rem;
}

.no-results {
    text-align: center;
    color: var(--text-light);
    padding: 2rem;
    background: white;
    border-radius: 0.75rem;
}

/* Footer */
.footer {
    background: var(--dark);
    color: white;
    text-align: center;
    padding: 2rem 0;
    margin-top: 4rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-content h1 {
        font-size: 2rem;
    }

    .hero-stats {
        gap: 2rem;
    }

    .content-wrapper {
        grid-template-columns: 1fr;
    }

    .sidebar {
        position: static;
    }

    .strategy-grid {
        grid-template-columns: 1fr;
    }

    .nav-links {
        gap: 1rem;
        font-size: 0.875rem;
    }
}`;

    await fs.writeFile(path.join(outputDir, 'styles.css'), css);

    // Create a simple Express server
    const serverJS = `const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.get('/categories', (req, res) => {
    res.redirect('/#strategies');
});

app.get('/about', (req, res) => {
    res.send(\`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>About - SEO Playbook</title>
            <link rel="stylesheet" href="/styles.css">
        </head>
        <body>
            <nav class="navbar">
                <div class="nav-container">
                    <a href="/" class="nav-brand">📚 SEO Playbook</a>
                    <div class="nav-links">
                        <a href="/">Home</a>
                        <a href="/categories">Categories</a>
                        <a href="/search">Search</a>
                        <a href="/about" class="active">About</a>
                    </div>
                </div>
            </nav>
            <div class="container">
                <div class="main-content" style="margin-top: 2rem;">
                    <h1>About SEO Playbook</h1>
                    <p>This comprehensive SEO strategy playbook contains 234 proven strategies collected from industry experts, case studies, and real-world implementations.</p>
                    <p>Each strategy has been carefully documented with implementation steps, difficulty ratings, and expected outcomes to help you improve your search rankings.</p>
                    <h2>How to Use This Playbook</h2>
                    <ol>
                        <li>Browse strategies by category or use search to find specific techniques</li>
                        <li>Review the difficulty and time requirements for each strategy</li>
                        <li>Follow the step-by-step implementation guides</li>
                        <li>Track your results and iterate on what works</li>
                    </ol>
                    <p style="margin-top: 2rem;"><a href="/" class="btn btn-primary">Start Browsing Strategies</a></p>
                </div>
            </div>
        </body>
        </html>
    \`);
});

app.get('/strategies/:file', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'strategies', req.params.file);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Strategy not found');
    }
});

app.get('/category/:category', (req, res) => {
    res.redirect('/#strategies');
});

// Start server
app.listen(PORT, () => {
    console.log(\`🚀 SEO Playbook running at http://localhost:\${PORT}\`);
});`;

    await fs.writeFile(path.join(__dirname, 'server.js'), serverJS);

    // Helper function for category icons
    function getCategoryIcon(category) {
        const icons = {
            'ai-search': '🤖',
            'link-building': '🔗',
            'local-seo': '📍',
            'content': '✍️',
            'technical': '⚙️',
            'youtube': '📹',
            'authority': '👑',
            'conversion': '💰',
            'enterprise': '🏢',
            'tools': '🛠️'
        };
        return icons[category] || '📄';
    }

    console.log('\n✅ Build complete!');
    console.log(`  - ${strategies.length} strategies converted`);
    console.log('  - Index page created');
    console.log('  - Search page created');
    console.log('  - Styles applied');
    console.log('  - Server configured');
}

if (require.main === module) {
    buildSite().catch(console.error);
}

module.exports = { buildSite };