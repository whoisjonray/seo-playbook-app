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

// Category mapping for strategies (simplified for better categorization)
function getCategoryForStrategy(title, content) {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();

    if (lowerTitle.includes('youtube') || lowerTitle.includes('video')) return 'youtube';
    if (lowerTitle.includes('ai') || lowerTitle.includes('artificial intelligence') ||
        lowerTitle.includes('llm') || lowerTitle.includes('chatgpt') ||
        lowerTitle.includes('featured snippet') || lowerTitle.includes('voice search')) return 'ai-search';
    if (lowerTitle.includes('link') || lowerTitle.includes('backlink') ||
        lowerTitle.includes('guest post') || lowerTitle.includes('outreach')) return 'link-building';
    if (lowerTitle.includes('local') || lowerTitle.includes('google business') ||
        lowerTitle.includes('citation') || lowerTitle.includes('review')) return 'local-seo';
    if (lowerTitle.includes('content') || lowerTitle.includes('blog') ||
        lowerTitle.includes('article') || lowerTitle.includes('writing')) return 'content';
    if (lowerTitle.includes('e-a-t') || lowerTitle.includes('authority') ||
        lowerTitle.includes('trust')) return 'authority';
    if (lowerTitle.includes('conversion') || lowerTitle.includes('cro') ||
        lowerTitle.includes('landing page')) return 'conversion';
    if (lowerTitle.includes('enterprise') || lowerTitle.includes('scale')) return 'enterprise';

    // Default to technical for anything else
    return 'technical';
}

// Extract the actual title from markdown content
function extractTitleFromMarkdown(content) {
    // Look for the first H1 heading
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
        return h1Match[1].trim();
    }

    // Look for bold title pattern
    const boldMatch = content.match(/\*\*Strategy:\*\*\s*(.+)/);
    if (boldMatch) {
        return boldMatch[1].trim();
    }

    // Look for any heading
    const headingMatch = content.match(/^#{1,3}\s+(.+)$/m);
    if (headingMatch) {
        return headingMatch[1].trim();
    }

    return null;
}

async function convertMarkdownToHTML(mdContent, title = 'SEO Strategy', fileName = '') {
    const htmlContent = marked(mdContent);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - SEO Playbook</title>
    <link rel="stylesheet" href="/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <meta name="description" content="${title} - Comprehensive SEO strategy guide with implementation steps and best practices.">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-brand">📚 SEO Playbook</a>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/#strategies">Categories</a>
                <a href="/search.html">Search</a>
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
                        `<li><a href="/#strategies">${name}</a></li>`
                    ).join('')}
                </ul>
            </aside>
            <main class="main-content">
                <div class="breadcrumb">
                    <a href="/">Home</a> / <a href="/#strategies">Strategies</a> / <span>${fileName}</span>
                </div>
                <div class="strategy-content">
                    <h1 class="strategy-title">${title}</h1>
                    ${htmlContent}
                </div>
                <div class="navigation-buttons">
                    <a href="/" class="btn btn-secondary">← Back to Index</a>
                    <a href="/search.html" class="btn btn-primary">Search Strategies</a>
                </div>
            </main>
        </div>
    </div>
    <footer class="footer-simple">
        <p>© 2025 SEO Strategy Playbook</p>
    </footer>
</body>
</html>`;
}

async function buildSite() {
    console.log('🚀 Building SEO Playbook site with full titles...');

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

            // Extract the real title from the markdown content
            let fullTitle = extractTitleFromMarkdown(mdContent);

            // If we can't extract a title, create one from the filename
            if (!fullTitle) {
                fullTitle = strategyName
                    .replace(/^\d+-/, '') // Remove leading numbers
                    .replace(/-/g, ' ') // Replace hyphens with spaces
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }

            // Clean up the title
            fullTitle = fullTitle
                .replace(/\*\*/g, '') // Remove markdown bold
                .replace(/^Strategy:\s*/i, '') // Remove "Strategy:" prefix
                .replace(/^\d+\.\s*/, '') // Remove numbering
                .trim();

            const html = await convertMarkdownToHTML(mdContent, fullTitle, strategyName);
            const htmlFile = file.replace('.md', '.html');

            await fs.writeFile(path.join(strategiesOutputDir, htmlFile), html);

            // Extract strategy number for categorization
            const strategyNum = file.match(/^(\d+)/)?.[1] || '000';
            const category = getCategoryForStrategy(fullTitle, mdContent);

            strategies.push({
                file: htmlFile,
                title: fullTitle,
                number: strategyNum,
                category,
                mdFile: file
            });

            console.log(`  ✓ ${strategyNum}: ${fullTitle}`);
        }
    }

    // Sort strategies by number
    strategies.sort((a, b) => parseInt(a.number) - parseInt(b.number));

    // Create the main index page
    const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SEO Strategy Playbook - 234 Proven Strategies for 2025</title>
    <link rel="stylesheet" href="/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <meta name="description" content="Comprehensive collection of 234 proven SEO strategies organized by category. Actionable guides for improving search rankings in 2025.">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-brand">📚 SEO Playbook</a>
            <div class="nav-links">
                <a href="/" class="active">Home</a>
                <a href="#strategies">Categories</a>
                <a href="/search.html">Search</a>
                <a href="#about">About</a>
            </div>
        </div>
    </nav>

    <header class="hero">
        <div class="hero-content">
            <h1>🚀 SEO Strategy Playbook</h1>
            <p class="hero-subtitle">234 Proven Strategies for Dominating Search Rankings in 2025</p>
            <div class="hero-stats">
                <div class="stat">
                    <span class="stat-number">${strategies.length}</span>
                    <span class="stat-label">Strategies</span>
                </div>
                <div class="stat">
                    <span class="stat-number">${Object.keys(categories).length}</span>
                    <span class="stat-label">Categories</span>
                </div>
                <div class="stat">
                    <span class="stat-number">2025</span>
                    <span class="stat-label">Updated</span>
                </div>
            </div>
            <div class="hero-actions">
                <a href="#strategies" class="btn btn-primary">Browse Strategies</a>
                <a href="/search.html" class="btn btn-secondary">Search Playbook</a>
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
            <h2>All ${strategies.length} Strategies by Category</h2>

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

        <section id="about" class="about-section">
            <h2>About This Playbook</h2>
            <p>This comprehensive SEO strategy playbook contains ${strategies.length} proven strategies collected from industry experts, case studies, and real-world implementations. Each strategy has been carefully documented with implementation steps, difficulty ratings, and expected outcomes to help you improve your search rankings.</p>

            <h3>How to Use This Playbook</h3>
            <ol>
                <li>Browse strategies by category or use search to find specific techniques</li>
                <li>Review the difficulty and time requirements for each strategy</li>
                <li>Follow the step-by-step implementation guides</li>
                <li>Track your results and iterate on what works</li>
            </ol>
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

    // Create search page with full titles
    const searchHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search SEO Strategies - SEO Playbook</title>
    <link rel="stylesheet" href="/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="nav-brand">📚 SEO Playbook</a>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/#strategies">Categories</a>
                <a href="/search.html" class="active">Search</a>
                <a href="/#about">About</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="search-container">
            <h1>Search ${strategies.length} SEO Strategies</h1>
            <div class="search-box">
                <input type="text" id="searchInput" placeholder="Search for strategies, keywords, or techniques..." class="search-input" autofocus>
                <button onclick="searchStrategies()" class="btn btn-primary">Search</button>
            </div>
            <div class="search-filters">
                <label>
                    <input type="checkbox" id="filterTechnical" checked> Technical SEO
                </label>
                <label>
                    <input type="checkbox" id="filterContent" checked> Content
                </label>
                <label>
                    <input type="checkbox" id="filterLink" checked> Link Building
                </label>
                <label>
                    <input type="checkbox" id="filterLocal" checked> Local SEO
                </label>
                <label>
                    <input type="checkbox" id="filterAI" checked> AI & Search
                </label>
            </div>
            <div id="searchResults" class="search-results">
                <p class="search-hint">Start typing to search through all ${strategies.length} strategies...</p>
            </div>
        </div>
    </div>

    <script>
        const strategies = ${JSON.stringify(strategies.map(s => ({
            ...s,
            searchText: (s.title + ' ' + s.category).toLowerCase()
        })))};

        function searchStrategies() {
            const query = document.getElementById('searchInput').value.toLowerCase();

            if (query.length === 0) {
                document.getElementById('searchResults').innerHTML = '<p class="search-hint">Start typing to search through all strategies...</p>';
                return;
            }

            const filters = {
                technical: document.getElementById('filterTechnical').checked,
                content: document.getElementById('filterContent').checked,
                'link-building': document.getElementById('filterLink').checked,
                'local-seo': document.getElementById('filterLocal').checked,
                'ai-search': document.getElementById('filterAI').checked
            };

            const results = strategies.filter(s => {
                const matchesQuery = s.searchText.includes(query);
                const matchesFilter = filters[s.category] !== false;
                return matchesQuery && matchesFilter;
            });

            const resultsDiv = document.getElementById('searchResults');
            if (results.length === 0) {
                resultsDiv.innerHTML = '<p class="no-results">No strategies found. Try different keywords or adjust filters.</p>';
            } else {
                const categoryNames = {
                    'ai-search': 'AI & Search',
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

                resultsDiv.innerHTML = \`
                    <h3>Found \${results.length} strategies</h3>
                    <div class="strategy-grid">
                        \${results.map(s => \`
                            <a href="/strategies/\${s.file}" class="strategy-card">
                                <div class="strategy-number">#\${s.number}</div>
                                <h4>\${s.title}</h4>
                                <div class="strategy-meta">
                                    <span class="tag tag-\${s.category}">\${categoryNames[s.category] || s.category}</span>
                                </div>
                            </a>
                        \`).join('')}
                    </div>
                \`;
            }
        }

        // Search on Enter key or as user types
        document.getElementById('searchInput').addEventListener('keyup', function(event) {
            searchStrategies();
        });

        // Search when filters change
        document.querySelectorAll('.search-filters input').forEach(input => {
            input.addEventListener('change', searchStrategies);
        });
    </script>
</body>
</html>`;

    await fs.writeFile(path.join(outputDir, 'search.html'), searchHTML);

    // Enhanced CSS with better styling
    const css = await fs.readFile(path.join(outputDir, 'styles.css'), 'utf-8');
    const enhancedCSS = css + `
/* Enhanced styles for better readability */
.breadcrumb {
    padding: 0.5rem 0;
    font-size: 0.875rem;
    color: var(--text-light);
    margin-bottom: 1rem;
}

.breadcrumb a {
    color: var(--primary);
    text-decoration: none;
}

.breadcrumb a:hover {
    text-decoration: underline;
}

.strategy-title {
    font-size: 2.5rem;
    color: var(--dark);
    margin-bottom: 2rem;
    line-height: 1.2;
}

.search-filters {
    display: flex;
    gap: 1.5rem;
    margin: 1rem 0;
    flex-wrap: wrap;
}

.search-filters label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--text);
}

.search-hint {
    text-align: center;
    color: var(--text-light);
    padding: 2rem;
    font-style: italic;
}

.about-section {
    padding: 4rem 0;
    background: white;
    border-radius: 1rem;
    margin-top: 2rem;
}

.about-section h2 {
    color: var(--dark);
    margin-bottom: 1.5rem;
}

.about-section h3 {
    color: var(--dark);
    margin: 2rem 0 1rem;
}

.about-section ol {
    margin-left: 2rem;
    line-height: 1.8;
}

.footer-simple {
    background: var(--dark);
    color: white;
    text-align: center;
    padding: 1rem 0;
    margin-top: 4rem;
}

/* Improve strategy card hover effect */
.strategy-card h4 {
    line-height: 1.3;
    margin-bottom: 1rem;
}

/* Make mobile responsive */
@media (max-width: 640px) {
    .strategy-title {
        font-size: 1.75rem;
    }

    .search-filters {
        flex-direction: column;
        gap: 0.75rem;
    }
}`;

    await fs.writeFile(path.join(outputDir, 'styles.css'), enhancedCSS);

    // Create strategies data JSON for easier access
    const strategiesData = {
        strategies: strategies,
        categories: categories,
        total: strategies.length,
        generated: new Date().toISOString()
    };

    await fs.writeFile(
        path.join(outputDir, 'strategies-data.json'),
        JSON.stringify(strategiesData, null, 2)
    );

    console.log('\n✅ Build complete with full titles!');
    console.log(`  - ${strategies.length} strategies converted`);
    console.log('  - Full titles extracted from markdown content');
    console.log('  - Index page created');
    console.log('  - Search page created with filters');
    console.log('  - Enhanced styles applied');
    console.log('  - Server configured');

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
}

if (require.main === module) {
    buildSite().catch(console.error);
}

module.exports = { buildSite };