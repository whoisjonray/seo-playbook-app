const express = require('express');
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

app.get(`${BASE_PATH}/search`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.get(`${BASE_PATH}/search.html`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.get(`${BASE_PATH}/application`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'application.html'));
});

app.get(`${BASE_PATH}/application.html`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'application.html'));
});

app.get(`${BASE_PATH}/strategies`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'strategies.html'));
});

app.get(`${BASE_PATH}/strategies.html`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'strategies.html'));
});

app.get(`${BASE_PATH}/strategies/:file`, (req, res) => {
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
    console.log(`🚀 Awaken Local SEO Strategy Director running at http://localhost:${PORT}${BASE_PATH}`);
    console.log(`   Ready for deployment at awakenlocal.com${BASE_PATH}`);
});