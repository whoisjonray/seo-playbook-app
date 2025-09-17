#!/bin/bash

cd /Users/user/Documents/Cursor\ Clients/seo-playbook-app/public/strategies

echo "Removing Example sections from all strategy pages..."

# Remove Example heading and the paragraph that follows it
for file in *.html; do
    if grep -q "<h3>Example</h3>" "$file"; then
        # Use perl for multi-line replacement to remove Example heading and its content paragraph
        perl -i -pe 'BEGIN{undef $/;} s/<h3>Example<\/h3>\s*\n<p>.*?<\/p>//smg' "$file"
        echo "Processed: $file"
    fi
done

echo "Example sections removed from all strategy pages!"