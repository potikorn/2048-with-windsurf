#!/bin/bash

# Load environment variables from .env file
export $(cat .env | xargs)

# Check if VITE_GITHUB_USERNAME is set
if [ -z "$VITE_GITHUB_USERNAME" ]; then
    echo "Error: VITE_GITHUB_USERNAME is not set in .env file"
    exit 1
fi

# Deploy to GitHub Pages
npx gh-pages -d dist -b gh-pages -r https://github.com/$VITE_GITHUB_USERNAME/2048-with-windsurf.git -m "Deploy to GitHub pages [skip ci]"
