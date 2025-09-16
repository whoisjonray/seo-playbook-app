const express = require('express');
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
    res.send(`
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
    `);
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
    console.log(`🚀 SEO Playbook running at http://localhost:${PORT}`);
});