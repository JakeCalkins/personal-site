// Site and build configuration constants
export const SITE_BASE_URL = 'https://www.jakecalkins.com';
export const SITE_CHANGEFREQ = 'monthly';
export const HOMEPAGE_PRIORITY = '1.0';
export const PAGE_PRIORITY = '0.8';

// File paths and extensions
export const MD_EXTENSION = '.md';
export const EXCLUDED_DIRS = ['scss'];
export const EXCLUDED_EXTENSIONS = ['.scss', '.ts'];

// HTML placeholders for injection
export const PLACEHOLDER_CONTENT = '<!-- MD_CONTENT -->';
export const PLACEHOLDER_PAGE_LINKS = '<!-- PAGE_LINKS -->';
export const PLACEHOLDER_FAB_LINKS = '<!-- FAB_PAGE_LINKS -->';

// Regex patterns
export const HEADING_PATTERN = /^<h[12][\s>]/i;

// HTML minification options
export const MINIFY_OPTIONS = {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: false, // CSS already minified separately
  minifyJS: false,  // JS already minified separately
};
