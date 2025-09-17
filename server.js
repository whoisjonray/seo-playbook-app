const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Specific routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/application', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'application.html'));
});

app.get('/strategies', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'strategies.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// Strategy pages route
app.get('/strategies/:file', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'strategies', req.params.file);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        // Try adding .html extension if not present
        const filePathWithExt = filePath.endsWith('.html') ? filePath : filePath + '.html';
        if (fs.existsSync(filePathWithExt)) {
            res.sendFile(filePathWithExt);
        } else {
            res.status(404).send('Strategy not found');
        }
    }
});

// Catch-all for any other routes - try to serve corresponding HTML file
app.get('*', (req, res) => {
    const requestPath = req.path.substring(1); // Remove leading slash

    // Try direct path
    let filePath = path.join(__dirname, 'public', requestPath);

    // If no extension, try adding .html
    if (!path.extname(requestPath) && !requestPath.endsWith('/')) {
        filePath = path.join(__dirname, 'public', requestPath + '.html');
    }

    // If path ends with /, try index.html
    if (requestPath.endsWith('/')) {
        filePath = path.join(__dirname, 'public', requestPath, 'index.html');
    }

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Page not found');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Awaken Local SEO Strategy Director running at http://localhost:${PORT}`);
    console.log(`   Ready for deployment at seo.awakenlocal.com`);
});