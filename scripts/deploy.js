import ghpages from 'gh-pages';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const username = process.env.VITE_GITHUB_USERNAME;

if (!username) {
  console.error('Error: VITE_GITHUB_USERNAME environment variable is not set');
  process.exit(1);
}

const options = {
  branch: 'gh-pages',
  repo: `https://github.com/${username}/2048-with-windsurf.git`,
  dest: '.',
  message: 'Auto-generated commit'
};

// Get the absolute path to the dist directory
const distPath = path.resolve(__dirname, '../dist');

ghpages.publish(distPath, options, function(err) {
  if (err) {
    console.error('Error deploying to GitHub Pages:', err);
    process.exit(1);
  } else {
    console.log('Successfully deployed to GitHub Pages!');
  }
});
