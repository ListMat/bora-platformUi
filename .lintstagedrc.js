module.exports = {
  // JavaScript/TypeScript files: format first, then lint with cache
  "*.{js,jsx,ts,tsx}": [
    "prettier --write",
    // ESLint with cache enabled for better performance
    // Cache location: .eslintcache (automatically created)
    "eslint --cache --cache-location .eslintcache --fix",
  ],

  // Style files
  "*.{css,scss,sass,less}": ["prettier --write"],

  // Configuration and data files
  "*.{json,md,yml,yaml}": ["prettier --write"],

  // TypeScript: type check only staged files (optional, can be slow)
  // Uncomment if you want type checking on commit
  // "*.{ts,tsx}": [
  //   "prettier --write",
  //   "eslint --cache --cache-location .eslintcache --fix --max-warnings=0",
  //   "bash -c 'tsc --noEmit --pretty'",
  // ],
};

