#!/bin/bash

# Clean previous builds
rm -rf dist

# Load .env file
source .env

# Auto-increment patch version in package.json
echo "🔁 Bumping patch version..."
current_version=$(jq -r '.version' package.json)
IFS='.' read -r major minor patch <<< "$current_version"
new_version="$major.$minor.$((patch + 1))"
jq --arg v "$new_version" '.version = $v' package.json > tmp.$$ && mv tmp.$$ package.json
echo "✅ Updated version: $current_version → $new_version"

# Run the builder with GitHub token available
GH_TOKEN=$GH_TOKEN arch -x86_64 npx electron-builder --win --x64 --ia32 --publish always
