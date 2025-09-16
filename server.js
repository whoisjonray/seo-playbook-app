const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Main routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Application page
app.get('/application', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'application.html'));
});

// Strategies page (with or without trailing slash)
app.get('/strategies', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'strategies.html'));
});

app.get('/strategies/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'strategies.html'));
});

// Search page
app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// Individual strategy files
app.get('/strategies/:file', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'strategies', req.params.file);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Strategy not found');
    }
});

// Redirects for old routes
app.get('/categories', (req, res) => {
    res.redirect('/strategies#strategies');
});

app.get('/category/:category', (req, res) => {
    res.redirect('/strategies#strategies');
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Awaken Local SEO Platform running at http://localhost:${PORT}`);
    console.log(`   Ready for deployment at seo.awakenlocal.com`);
});