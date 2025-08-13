#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixLintIssues(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Fix quotes (double to single)
  const newContent = content
    .replace(/"/g, '\'')
    .replace(/''/g, '\'\'') // Fix empty string case
    .replace(/'use strict'/g, '\'use strict\'')
    // Fix basic indentation (4 spaces to 2)
    .replace(/^ {4}/gm, '  ')
    // Fix var to const/let
    .replace(/\bvar\b/g, 'const')
    // Fix == to ===
    .replace(/==/g, '===')
    .replace(/!=/g, '!==')
    // Add semicolons at end of lines that need them
    .replace(/(\w|\)|\])$/gm, '$1;')
    // Fix trailing spaces
    .replace(/\s+$/gm, '')
    // Fix multiple empty lines
    .replace(/\n\n\n+/g, '\n\n');

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Fixed: ${filePath}`);
    changed = true;
  }

  return changed;
}

// Get list of JavaScript files to fix
const serverFiles = [
  'routes/api/users.js',
  'routes/api/system.js',
  'routes/api/meals.js',
  'routes/api/notifications.js',
  'routes/api/chat.js',
  'routes/api/follow.js',
  'routes/api/hungry.js',
  'routes/api/images.js',
  'routes/api/attends.js'
];

console.log('Starting automated lint fixes...');

serverFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  fixLintIssues(fullPath);
});

console.log('Automated fixes completed. Manual review may be needed.');