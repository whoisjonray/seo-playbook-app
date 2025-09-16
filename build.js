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

// Base path - no longer using subdirectory
const BASE_PATH = '';

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
    'enterprise': 'Enterprise SEO'
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

    return 'technical';
}

// Extract the actual title from markdown content
function extractTitleFromMarkdown(content) {
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
        return h1Match[1].trim();
    }

    const boldMatch = content.match(/\*\*Strategy:\*\*\s*(.+)/);
    if (boldMatch) {
        return boldMatch[1].trim();
    }

    const headingMatch = content.match(/^#{1,3}\s+(.+)$/m);
    if (headingMatch) {
        return headingMatch[1].trim();
    }

    return null;
}

async function convertMarkdownToHTML(mdContent, title = 'SEO Strategy', fileName = '') {
    // Clean up the markdown content
    let cleanedContent = mdContent;

    // Remove the title if it appears as the first H1 (to avoid duplication)
    const titleRegex = new RegExp(`^#\\s*${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'mi');
    cleanedContent = cleanedContent.replace(titleRegex, '');

    // Also remove if it appears without the # markdown
    const plainTitleRegex = new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'mi');
    cleanedContent = cleanedContent.replace(plainTitleRegex, '');

    // Remove keyword lists that appear at the beginning
    cleanedContent = cleanedContent.replace(/^###?\s*Keywords[\s\S]*?^---$/gm, '');
    cleanedContent = cleanedContent.replace(/^###?\s*Keywords[\s\S]*?(?=^##|^\*\*|^\d+\.)/gm, '');

    // Remove standalone keyword bullet points
    cleanedContent = cleanedContent.replace(/^\s*[-•]\s*(seo|ranking|google|keyword|link|content|local|review|youtube|ai|domain|backlink|optimization|serp)\s*$/gmi, '');

    // Process headers for better formatting
    cleanedContent = cleanedContent.replace(/^(Execution Steps:)$/gm, '### $1');
    cleanedContent = cleanedContent.replace(/^(Pitfalls & Limits:)$/gm, '### $1');
    cleanedContent = cleanedContent.replace(/^(What It Is:)$/gm, '### $1');
    cleanedContent = cleanedContent.replace(/^(Why It Works:)$/gm, '### $1');
    cleanedContent = cleanedContent.replace(/^(When To Use:)$/gm, '### $1');

    // Fix duplicate numbering in lists (e.g., "2. Identify" becomes just "Identify")
    cleanedContent = cleanedContent.replace(/^\d+\.\s+(\d+\.\s+)/gm, '$1');

    // Clean up excessive line breaks
    cleanedContent = cleanedContent.replace(/\n{4,}/g, '\n\n\n');
    cleanedContent = cleanedContent.replace(/^\n+/, ''); // Remove leading newlines
    cleanedContent = cleanedContent.replace(/\n+$/, ''); // Remove trailing newlines

    // Configure marked for better list handling
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: false,
        mangle: false
    });

    // Convert to HTML
    const htmlContent = marked(cleanedContent);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Awaken Local SEO Strategies</title>
    <link rel="stylesheet" href="${BASE_PATH}/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <meta name="description" content="${title} - Professional SEO strategy guide from Awaken Local. Proven techniques for improving search rankings.">
    <link rel="icon" type="image/png" href="${BASE_PATH}/images/awaken-local-logo.png">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="${BASE_PATH}/" class="nav-brand">
                <img src="${BASE_PATH}/images/awaken-local-logo.png" alt="Awaken Local" class="nav-logo">
                <span class="nav-text">SEO Strategy Directory</span>
            </a>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="/strategies">Strategies</a>
                <a href="/search">Search</a>
            </div>
        </div>
    </nav>
    <div class="container">
        <div class="content-wrapper">
            <aside class="sidebar">
                <h3>Quick Links</h3>
                <ul class="sidebar-links">
                    ${Object.entries(categories).map(([key, name]) => {
                        const catKey = key.toLowerCase().replace(/[^a-z0-9]/g, '-');
                        return `<li><a href="/strategies#${catKey}">${name}</a></li>`;
                    }).join('')}
                </ul>
                <div class="sidebar-cta">
                    <h4>Need Help?</h4>
                    <p>Get professional SEO services from Awaken Local</p>
                    <a href="/application" class="btn btn-primary btn-small">Get Started</a>
                </div>
            </aside>
            <main class="main-content">
                <div class="breadcrumb">
                    <a href="/">Home</a> / <a href="/strategies">Strategies</a> / <span>${fileName}</span>
                </div>
                <div class="strategy-content">
                    <h1 class="strategy-title">${title}</h1>
                    <div class="strategy-body">
                        ${htmlContent}
                    </div>
                </div>
                <div class="navigation-buttons">
                    <a href="/strategies" class="btn btn-secondary">← Back to Strategies</a>
                    <a href="/search" class="btn btn-primary">Search All Strategies</a>
                </div>
            </main>
        </div>
    </div>
    <footer class="footer-simple">
        <div class="footer-content">
            <p>&copy; 2025 Jon Ray, Awaken Local. All rights reserved.</p>
            <p>Professional SEO & Digital Marketing</p>
        </div>
    </footer>
</body>
</html>`;
}

async function buildSite() {
    console.log('🚀 Building Awaken Local SEO Strategy Director...');

    // Create output directories
    await fs.ensureDir(outputDir);
    await fs.ensureDir(strategiesOutputDir);
    await fs.ensureDir(path.join(outputDir, 'images'));

    // Read all strategy files
    const strategyFiles = await fs.readdir(strategiesDir);
    const strategies = [];

    // Convert each strategy to HTML
    for (const file of strategyFiles) {
        if (file.endsWith('.md')) {
            const mdContent = await fs.readFile(path.join(strategiesDir, file), 'utf-8');
            const strategyName = file.replace('.md', '');

            let fullTitle = extractTitleFromMarkdown(mdContent);

            if (!fullTitle) {
                fullTitle = strategyName
                    .replace(/^\d+-/, '')
                    .replace(/-/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }

            fullTitle = fullTitle
                .replace(/\*\*/g, '')
                .replace(/^Strategy:\s*/i, '')
                .replace(/^\d+\.\s*/, '')
                .trim();

            const html = await convertMarkdownToHTML(mdContent, fullTitle, strategyName);
            const htmlFile = file.replace('.md', '.html');

            await fs.writeFile(path.join(strategiesOutputDir, htmlFile), html);

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
    <title>SEO Strategy Directory - 234 Proven Strategies | Awaken Local</title>
    <link rel="stylesheet" href="${BASE_PATH}/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <meta name="description" content="Professional SEO strategy directory from Awaken Local. 234 proven strategies for dominating search rankings in 2025.">
    <link rel="icon" type="image/png" href="${BASE_PATH}/images/awaken-local-logo.png">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="${BASE_PATH}/" class="nav-brand">
                <img src="${BASE_PATH}/images/awaken-local-logo.png" alt="Awaken Local" class="nav-logo">
                <span class="nav-text">SEO Strategy Directory</span>
            </a>
            <div class="nav-links">
                <a href="${BASE_PATH}/" class="active">Home</a>
                <a href="#strategies">Strategies</a>
                <a href="${BASE_PATH}/search.html">Search</a>
            </div>
        </div>
    </nav>

    <header class="hero">
        <div class="hero-content">
            <div class="hero-logo">
                <img src="${BASE_PATH}/images/awaken-local-logo.png" alt="Awaken Local" class="hero-logo-img">
            </div>
            <h1>SEO Strategy Directory</h1>
            <p class="hero-subtitle">234 Proven Strategies for Dominating Search Rankings in 2025</p>
            <p class="hero-credit">Curated by <strong>Awaken Local</strong> - Your Digital Marketing Partner</p>
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
                <a href="${BASE_PATH}/search.html" class="btn btn-secondary">Search Directory</a>
            </div>
        </div>
    </header>

    <div class="container">
        <section class="features">
            <h2>Professional SEO Strategies from Awaken Local</h2>
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
                    <h3>Expert Insights</h3>
                    <p>Proven techniques from Awaken Local's experience</p>
                </div>
            </div>
        </section>

        <section id="strategies" class="strategies-section">
            <h2>All ${strategies.length} SEO Strategies</h2>
            <p class="section-subtitle">Organized by category for easy navigation</p>

            ${Object.entries(categories).map(([catKey, catName]) => {
                const catStrategies = strategies.filter(s => s.category === catKey);
                if (catStrategies.length === 0) return '';

                const categoryId = catKey.toLowerCase().replace(/[^a-z0-9]/g, '-');
                return `
                <div class="category-section" id="${categoryId}">
                    <h3 class="category-title">
                        <span class="category-icon">${getCategoryIcon(catKey)}</span>
                        ${catName}
                        <span class="category-count">${catStrategies.length} strategies</span>
                    </h3>
                    <div class="strategy-grid">
                        ${catStrategies.map(strategy => `
                            <a href="${BASE_PATH}/strategies/${strategy.file}" class="strategy-card">
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

        <section class="cta-section">
            <div class="cta-content">
                <h2>Ready to Dominate Search Rankings?</h2>
                <p>Let Awaken Local implement these strategies for your business</p>
                <div class="cta-actions">
                    <a href="/application" class="btn btn-primary btn-large">Get Professional SEO Help</a>
                    <a href="https://awakenlocal.com" target="_blank" class="btn btn-secondary btn-large">Learn About Awaken Local</a>
                </div>
            </div>
        </section>

        <section id="about" class="about-section">
            <h2>About This SEO Strategy Directory</h2>
            <p>This comprehensive SEO strategy directory contains ${strategies.length} proven strategies collected and curated by <strong>Awaken Local</strong>. Each strategy has been carefully documented with implementation steps, difficulty ratings, and expected outcomes to help businesses improve their search rankings.</p>

            <h3>How to Use This Directory</h3>
            <ol>
                <li>Browse strategies by category or use search to find specific techniques</li>
                <li>Review the difficulty and time requirements for each strategy</li>
                <li>Follow the step-by-step implementation guides</li>
                <li>Track your results and iterate on what works</li>
            </ol>

            <h3>About Awaken Local</h3>
            <p>Awaken Local is a full-service digital marketing agency specializing in SEO, local search optimization, and digital growth strategies. We help businesses increase their online visibility and drive more qualified traffic to their websites.</p>
            <p>Visit <a href="https://awakenlocal.com" target="_blank">awakenlocal.com</a> to learn more about our services.</p>
        </section>
    </div>

    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-column">
                    <img src="${BASE_PATH}/images/awaken-local-logo.png" alt="Awaken Local" class="footer-logo">
                    <p>Professional SEO & Digital Marketing</p>
                </div>
                <div class="footer-column">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/strategies">Strategy Directory</a></li>
                        <li><a href="/search">Search Strategies</a></li>
                        <li><a href="/application">Get Started</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4>Connect</h4>
                    <p>Ready to improve your search rankings?</p>
                    <a href="/application" class="btn btn-primary">Apply Now</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 Jon Ray, Awaken Local. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="${BASE_PATH}/app.js"></script>
</body>
</html>`;

    await fs.writeFile(path.join(outputDir, 'strategies.html'), indexHTML);

    // Create search page with Awaken Local branding
    const searchHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search SEO Strategies - Awaken Local</title>
    <link rel="stylesheet" href="${BASE_PATH}/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="${BASE_PATH}/images/awaken-local-logo.png">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="${BASE_PATH}/" class="nav-brand">
                <img src="${BASE_PATH}/images/awaken-local-logo.png" alt="Awaken Local" class="nav-logo">
                <span class="nav-text">SEO Strategy Directory</span>
            </a>
            <div class="nav-links">
                <a href="${BASE_PATH}/">Home</a>
                <a href="${BASE_PATH}/#strategies">Strategies</a>
                <a href="${BASE_PATH}/search.html" class="active">Search</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="search-container">
            <h1>Search ${strategies.length} SEO Strategies</h1>
            <p class="search-subtitle">Find the perfect strategy for your SEO needs</p>
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

        <div class="search-cta">
            <h3>Need Professional Implementation?</h3>
            <p>Awaken Local can help you implement these strategies effectively</p>
            <a href="/application" class="btn btn-primary">Get Expert Help</a>
        </div>
    </div>

    <footer class="footer-simple">
        <div class="footer-content">
            <p>&copy; 2025 Jon Ray, Awaken Local. All rights reserved.</p>
            <p>Professional SEO & Digital Marketing</p>
        </div>
    </footer>

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
                            <a href="${BASE_PATH}/strategies/\${s.file}" class="strategy-card">
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

        document.getElementById('searchInput').addEventListener('keyup', function(event) {
            searchStrategies();
        });

        document.querySelectorAll('.search-filters input').forEach(input => {
            input.addEventListener('change', searchStrategies);
        });
    </script>
</body>
</html>`;

    await fs.writeFile(path.join(outputDir, 'search.html'), searchHTML);

    // Enhanced CSS with Awaken Local branding
    const css = `/* Awaken Local SEO Strategy Director Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary: #FF6B35;
    --primary-dark: #E55A2B;
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

/* Navigation with Logo */
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
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    color: var(--dark);
}

.nav-logo {
    height: 40px;
    width: auto;
}

.nav-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--dark);
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

/* Hero Section with Awaken Local Branding */
.hero {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    padding: 4rem 0;
    text-align: center;
}

.hero-logo {
    margin-bottom: 2rem;
}

.hero-logo-img {
    height: 80px;
    width: auto;
    filter: brightness(0) invert(1);
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.95;
    margin-bottom: 1rem;
}

.hero-credit {
    font-size: 1rem;
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
    opacity: 0.9;
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
    background: var(--primary);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
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

.btn-small {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
}

.btn-large {
    padding: 1rem 2rem;
    font-size: 1.125rem;
}

/* Features */
.features {
    padding: 4rem 0;
}

.features h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--dark);
}

.section-subtitle {
    text-align: center;
    color: var(--text-light);
    margin-bottom: 3rem;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
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
    margin-bottom: 0.5rem;
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
    border: 1px solid var(--primary);
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
    line-height: 1.3;
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
.tag-authority { background: #fff7ed; color: #9a3412; }
.tag-conversion { background: #ecfdf5; color: #047857; }

/* CTA Section */
.cta-section {
    padding: 4rem 0;
    text-align: center;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    border-radius: 1rem;
    margin: 4rem 0;
}

.cta-content h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.cta-content p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.95;
}

.cta-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

/* Sidebar */
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
    margin-bottom: 2rem;
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

.sidebar-cta {
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
}

.sidebar-cta h4 {
    color: var(--dark);
    margin-bottom: 0.5rem;
}

.sidebar-cta p {
    color: var(--text-light);
    font-size: 0.875rem;
    margin-bottom: 1rem;
}

/* Content Layout */
.content-wrapper {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    margin-top: 2rem;
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

.navigation-buttons {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 1rem;
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
    margin-bottom: 0.5rem;
}

.search-subtitle {
    text-align: center;
    color: var(--text-light);
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

.search-cta {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 1rem;
    margin-top: 3rem;
}

.search-cta h3 {
    color: var(--dark);
    margin-bottom: 0.5rem;
}

.search-cta p {
    color: var(--text-light);
    margin-bottom: 1rem;
}

/* Footer */
.footer {
    background: var(--dark);
    color: white;
    padding: 4rem 0 2rem;
    margin-top: 4rem;
}

.footer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 3rem;
    margin-bottom: 3rem;
}

.footer-column h4 {
    margin-bottom: 1rem;
}

.footer-column ul {
    list-style: none;
}

.footer-column ul li {
    margin-bottom: 0.5rem;
}

.footer-column a {
    color: white;
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.3s;
}

.footer-column a:hover {
    opacity: 1;
}

.footer-logo {
    height: 50px;
    width: auto;
    filter: brightness(0) invert(1);
    margin-bottom: 1rem;
}

.footer-bottom {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.1);
}

.footer-simple {
    background: var(--dark);
    color: white;
    text-align: center;
    padding: 2rem 0;
    margin-top: 4rem;
}

.footer-content p {
    margin-bottom: 0.5rem;
}

.footer-content a {
    color: var(--primary);
    text-decoration: none;
}

.footer-content a:hover {
    text-decoration: underline;
}

/* About Section */
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

.about-section a {
    color: var(--primary);
    text-decoration: none;
}

.about-section a:hover {
    text-decoration: underline;
}

/* Breadcrumb */
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

    .footer-grid {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .cta-actions {
        flex-direction: column;
    }

    .nav-logo {
        height: 30px;
    }

    .hero-logo-img {
        height: 60px;
    }
}`;

    await fs.writeFile(path.join(outputDir, 'styles.css'), css);

    // Update server.js for subdirectory routing
    const serverJS = `const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Base path - no longer using subdirectory
const BASE_PATH = '';

// Serve static files from public directory
app.use(BASE_PATH, express.static(path.join(__dirname, 'public')));

// Routes with subdirectory support
app.get(BASE_PATH, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get(\`\${BASE_PATH}/search\`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.get(\`\${BASE_PATH}/search.html\`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.get(\`\${BASE_PATH}/strategies/:file\`, (req, res) => {
    const filePath = path.join(__dirname, 'public', 'strategies', req.params.file);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Strategy not found');
    }
});

// Redirect root to strategies subdirectory
app.get('/', (req, res) => {
    res.redirect(BASE_PATH);
});

// Start server
app.listen(PORT, () => {
    console.log(\`🚀 Awaken Local SEO Strategy Director running at http://localhost:\${PORT}\${BASE_PATH}\`);
    console.log(\`   Ready for deployment at awakenlocal.com\${BASE_PATH}\`);
});`;

    await fs.writeFile(path.join(__dirname, 'server.js'), serverJS);

    console.log('\n✅ Build complete with Awaken Local branding!');
    console.log(`  - ${strategies.length} strategies converted`);
    console.log('  - Awaken Local branding applied');
    console.log('  - Configured for /strategies subdirectory');
    console.log('  - Ready for deployment at awakenlocal.com/strategies');

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