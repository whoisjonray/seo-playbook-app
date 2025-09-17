#!/bin/bash

# Navigate to strategies directory
cd /Users/user/Documents/Cursor\ Clients/seo-playbook-app/public/strategies

echo "Removing edward and compact keywords references..."

# Remove specific example sections mentioning Edward
find . -name "*.html" -exec sed -i '' '/<h3>Example<\/h3>.*[Ee]dward.*<\/p>/d' {} \;
find . -name "*.html" -exec sed -i '' '/<p>.*[Ee]dward\.com.*<\/p>/d' {} \;
find . -name "*.html" -exec sed -i '' '/<p>.*[Ee]dward [Ss]turm.*<\/p>/d' {} \;
find . -name "*.html" -exec sed -i '' '/<p>.*[Ee]dwardstrom\.com.*<\/p>/d' {} \;
find . -name "*.html" -exec sed -i '' '/<p>.*[Ee]dwards\.com.*<\/p>/d' {} \;

# Replace "Compact Keywords" with "Awaken Keywords" in titles and content
find . -name "*.html" -exec sed -i '' 's/Compact Keywords/Awaken Keywords/g' {} \;
find . -name "*.html" -exec sed -i '' 's/compact keywords/Awaken Keywords/g' {} \;
find . -name "*.html" -exec sed -i '' 's/COMPACT KEYWORDS/AWAKEN KEYWORDS/g' {} \;
find . -name "*.html" -exec sed -i '' 's/CompactKeywords/AwakenKeywords/g' {} \;
find . -name "*.html" -exec sed -i '' 's/compactkeywords\.com/awakenlocal.com/g' {} \;

# Remove entire example paragraphs that mention Edward
find . -name "093-*.html" -exec sed -i '' '/<p>.*speaker uses edward.*<\/p>/d' {} \;

# Fix file names
if [ -f "049-compact-keywords-strategy-focused-pages-targeting-.html" ]; then
  mv "049-compact-keywords-strategy-focused-pages-targeting-.html" "049-awaken-keywords-strategy-focused-pages-targeting-.html"
fi

if [ -f "126-compact-keywords-targeting.html" ]; then
  mv "126-compact-keywords-targeting.html" "126-awaken-keywords-targeting.html"
fi

if [ -f "167-compact-keywords-seo-strategy.html" ]; then
  mv "167-compact-keywords-seo-strategy.html" "167-awaken-keywords-seo-strategy.html"
fi

echo "Cleanup complete!"