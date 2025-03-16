
// Simple deployment script for GitHub Pages
const { execSync } = require('child_process');
const fs = require('fs');

// Build the app
console.log('Building the app...');
execSync('npm run build', { stdio: 'inherit' });

// Create a .nojekyll file to prevent Jekyll processing
fs.writeFileSync('./dist/.nojekyll', '');

// Deploy to GitHub Pages
console.log('Deploying to GitHub Pages...');
execSync('npx gh-pages -d dist -t true', { stdio: 'inherit' });

console.log('Deployment complete!');
