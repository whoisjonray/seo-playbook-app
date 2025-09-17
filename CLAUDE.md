# CLAUDE.md - SEO Awaken Local Platform Documentation

This file provides comprehensive guidance for maintaining and deploying the SEO Awaken Local platform (seo.awakenlocal.com).

## 🚀 Platform Overview

**URL**: https://seo.awakenlocal.com
**Repository**: https://github.com/whoisjonray/seo-playbook-app
**Deployment**: Railway (auto-deploys from main branch)
**Technology Stack**: Node.js, Express, HTML/CSS/JS, Marked.js

## 📁 Project Structure

```
seo-playbook-app/
├── server.js                    # Express server with routing
├── build.js                     # Converts markdown strategies to HTML
├── package.json                 # Dependencies and scripts
├── public/                      # All static files
│   ├── index.html              # Landing page
│   ├── application.html        # Application form page
│   ├── strategies.html         # Strategy directory page
│   ├── search.html             # Search functionality page
│   ├── styles.css              # Global styles
│   ├── images/                 # All images including logos
│   └── strategies/             # Individual strategy HTML files
└── strategies/                  # Source markdown files (if any)
```

## 🔧 Common Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Run locally (port 3000)
npm start

# Build strategies from markdown
node build.js
```

### Deployment to Railway
```bash
# All changes auto-deploy when pushed to GitHub
git add .
git commit -m "Your commit message"
git push

# Railway will automatically deploy within 2-3 minutes
```

## 🚨 CRITICAL: Server Routing

The `server.js` file handles all routing. **IMPORTANT**: The order of routes matters!

```javascript
// CORRECT ORDER (specific routes before catch-all):
app.get('/', ...);                    // Landing page
app.get('/application', ...);         // Application form
app.get('/strategies', ...);          // Strategy directory
app.get('/search', ...);              // Search page
app.get('/strategies/:file', ...);    // Individual strategy pages
app.get('*', ...);                    // Catch-all (MUST BE LAST)
```

### Common Routing Issues & Fixes

1. **"Cannot GET /page" errors**: Add specific route before catch-all
2. **Static files not loading**: Ensure `express.static` middleware is configured
3. **Strategy pages 404**: Check file exists in `/public/strategies/`

## 📝 Content Management

### Adding New Strategies

1. Add markdown file to `/strategies/` directory (if using markdown)
2. Run `node build.js` to convert to HTML
3. Or directly create HTML in `/public/strategies/`

### Updating Existing Content

1. Edit HTML files directly in `/public/` directory
2. For global changes (like rebranding), use search/replace across all files
3. Always test locally before pushing

## 🎨 Branding Updates

### Current Branding
- **Primary Color**: #FF6B35 (Awaken Local orange)
- **Logo Path**: `/images/awaken-local-logo.png`
- **Favicon**: `/favicon.png`

### Rebranding Checklist
When changing terminology (e.g., "Compact Keywords" → "Awaken Keywords"):

1. Update all HTML files in `/public/strategies/`
2. Update search data in `/public/search.html`
3. Update strategy listings in `/public/strategies.html`
4. Rename files if needed (update all references)
5. Update URLs in all markdown reports
6. Test all links thoroughly

## 📧 Form Submissions

The application form uses Formspree:
- **Form ID**: xldwyjkn
- **Email Recipient**: whoisjonray@gmail.com
- **Endpoint**: https://formspree.io/f/xldwyjkn

To change recipient:
1. Create new form at formspree.io
2. Update form action in `/public/application.html`

## 🐛 Troubleshooting

### Page Not Loading
```bash
# Check if route exists in server.js
grep "'/yourpage'" server.js

# If missing, add route before catch-all:
app.get('/yourpage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'yourpage.html'));
});
```

### Changes Not Appearing Live
```bash
# Ensure changes are committed and pushed
git status
git add .
git commit -m "Fix: description"
git push

# Check Railway deployment logs
# Wait 2-3 minutes for deployment
```

### Local Testing Issues
```bash
# Port already in use
lsof -i :3000
kill -9 <PID>

# Then restart
npm start
```

## 🚀 Deployment Process

1. **Make changes locally**
2. **Test thoroughly**: `npm start` and check http://localhost:3000
3. **Commit changes**:
   ```bash
   git add .
   git commit -m "Descriptive message"
   ```
4. **Push to GitHub**: `git push`
5. **Railway auto-deploys** from main branch
6. **Verify live**: Check https://seo.awakenlocal.com

## 📋 Recent Updates Log

### September 16, 2025
- Complete rebrand from "Compact Keywords" to "Awaken Keywords"
- Fixed server routing for all pages
- Added Jon Ray's photo and bio to application thank you page
- Fixed responsive text wrapping issues

## 🔒 Security Notes

- Never commit `.env` files
- Keep Formspree API keys secure
- Regularly update dependencies: `npm audit fix`

## 📞 Support Contacts

- **Developer**: Jon Ray (whoisjonray@gmail.com)
- **Platform**: Railway
- **Repository**: GitHub (whoisjonray/seo-playbook-app)

## ⚠️ Important Reminders

1. **Always test locally before deploying**
2. **Keep server.js routes in correct order**
3. **Backup before major changes**
4. **Document all significant updates in this file**
5. **Check Railway deployment logs after pushing**

---

*Last updated: September 16, 2025*