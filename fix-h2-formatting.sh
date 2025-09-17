#!/bin/bash

# Fix H2 formatting issues in all strategy HTML files
cd /Users/user/Documents/Cursor\ Clients/seo-playbook-app/public/strategies/

# After "What It Is"
find . -name "*.html" -exec sed -i '' '/<h3>What It Is<\/h3>/{n;s/<h2>\(.*\)<\/h2>/<p>\1<\/p>/;}' {} \;

# After "Why It Works"
find . -name "*.html" -exec sed -i '' '/<h3>Why It Works<\/h3>/{n;s/<h2>\(.*\)<\/h2>/<p>\1<\/p>/;}' {} \;

# After "When To Use"
find . -name "*.html" -exec sed -i '' '/<h3>When To Use<\/h3>/{n;s/<h2>\(.*\)<\/h2>/<p>\1<\/p>/;}' {} \;

# After "Pitfalls & Limits"
find . -name "*.html" -exec sed -i '' '/<h3>Pitfalls &amp; Limits<\/h3>/{n;s/<h2>\(.*\)<\/h2>/<p>\1<\/p>/;}' {} \;

echo "Fixed H2 formatting issues in all strategy files"