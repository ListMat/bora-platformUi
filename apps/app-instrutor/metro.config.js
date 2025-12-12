// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Find copy-anything in pnpm workspace
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
const pnpmStorePath = path.join(workspaceRoot, "node_modules", ".pnpm");

// Function to find package in pnpm store
function findPnpmPackage(packageName) {
  try {
    if (!fs.existsSync(pnpmStorePath)) {
      return null;
    }
    const entries = fs.readdirSync(pnpmStorePath);
    const packageDir = entries.find((entry) => entry.startsWith(`${packageName}@`));
    if (packageDir) {
      const packagePath = path.join(pnpmStorePath, packageDir, "node_modules", packageName);
      if (fs.existsSync(packagePath)) {
        return packagePath;
      }
    }
  } catch (error) {
    console.warn(`[Metro] Error finding ${packageName}:`, error.message);
  }
  return null;
}

// Find is-what (dependency of copy-anything)
const isWhatPath = findPnpmPackage("is-what");
const resolvedIsWhatPath = isWhatPath || 
  (() => {
    const localPath = path.resolve(projectRoot, "node_modules", "is-what");
    if (fs.existsSync(localPath)) return localPath;
    return null;
  })();

// Get copy-anything path - try version 4 first (superjson needs it), then fallback to 3
const v4Path = path.join(workspaceRoot, "node_modules", ".pnpm", "copy-anything@4.0.5", "node_modules", "copy-anything");
const v3Path = path.join(workspaceRoot, "node_modules", ".pnpm", "copy-anything@3.0.5", "node_modules", "copy-anything");
const copyAnythingPath = findPnpmPackage("copy-anything") || 
  (fs.existsSync(v4Path) ? v4Path : null) ||
  (fs.existsSync(v3Path) ? v3Path : null);

// Verify path exists
const resolvedCopyAnythingPath = fs.existsSync(copyAnythingPath) ? copyAnythingPath : null;

if (resolvedCopyAnythingPath) {
  console.log(`[Metro] Resolved copy-anything to: ${resolvedCopyAnythingPath}`);
} else {
  console.warn(`[Metro] Warning: copy-anything not found at expected paths`);
}

// Fix for Windows path issues with node:sea shims
// This prevents Metro from trying to create invalid directory names on Windows
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: false,
  unstable_conditionNames: ["browser", "require", "react-native"],
  // Add node_modules resolution for pnpm workspace
  nodeModulesPaths: [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
  ],
  // Resolve copy-anything and is-what - critical for superjson nested dependencies
  // Metro needs to resolve this from ANY location, including nested node_modules
  extraNodeModules: (() => {
    const extra = {};
    
    // Resolve copy-anything
    const localCopyAnything = path.resolve(projectRoot, "node_modules", "copy-anything");
    if (fs.existsSync(localCopyAnything)) {
      console.log(`[Metro] Using local copy-anything from: ${localCopyAnything}`);
      extra["copy-anything"] = localCopyAnything;
    } else if (resolvedCopyAnythingPath) {
      console.log(`[Metro] Using pnpm store copy-anything from: ${resolvedCopyAnythingPath}`);
      extra["copy-anything"] = resolvedCopyAnythingPath;
    }
    
    // Resolve is-what (dependency of copy-anything)
    const localIsWhat = path.resolve(projectRoot, "node_modules", "is-what");
    if (fs.existsSync(localIsWhat)) {
      console.log(`[Metro] Using local is-what from: ${localIsWhat}`);
      extra["is-what"] = localIsWhat;
    } else if (resolvedIsWhatPath) {
      console.log(`[Metro] Using pnpm store is-what from: ${resolvedIsWhatPath}`);
      extra["is-what"] = resolvedIsWhatPath;
    }
    
    return extra;
  })(),
  // Custom resolver to handle nested dependencies in pnpm
  // This intercepts ALL copy-anything and is-what imports, including from nested node_modules
  resolveRequest: (context, moduleName, platform) => {
    // Intercept copy-anything resolution from ANYWHERE
    if (moduleName === "copy-anything") {
      // Try local first
      const localPath = path.resolve(projectRoot, "node_modules", "copy-anything");
      if (fs.existsSync(localPath)) {
        const entryFile = path.join(localPath, "dist", "index.js");
        if (fs.existsSync(entryFile)) {
          return {
            filePath: entryFile,
            type: "sourceFile",
          };
        }
      }
      
      // Try version 4 (superjson needs it)
      const v4Path = path.join(workspaceRoot, "node_modules", ".pnpm", "copy-anything@4.0.5", "node_modules", "copy-anything");
      if (fs.existsSync(v4Path)) {
        const entryFile = path.join(v4Path, "dist", "index.js");
        if (fs.existsSync(entryFile)) {
          return {
            filePath: entryFile,
            type: "sourceFile",
          };
        }
      }
      
      // Try resolved path
      if (resolvedCopyAnythingPath) {
        const entryFile = path.join(resolvedCopyAnythingPath, "dist", "index.js");
        if (fs.existsSync(entryFile)) {
          return {
            filePath: entryFile,
            type: "sourceFile",
          };
        }
      }
    }
    
    // Intercept is-what resolution (dependency of copy-anything)
    if (moduleName === "is-what") {
      const localPath = path.resolve(projectRoot, "node_modules", "is-what");
      if (fs.existsSync(localPath)) {
        // Check for different entry points
        const entryFiles = [
          path.join(localPath, "dist", "index.js"),
          path.join(localPath, "index.js"),
          path.join(localPath, "index.cjs"),
        ];
        for (const entryFile of entryFiles) {
          if (fs.existsSync(entryFile)) {
            return {
              filePath: entryFile,
              type: "sourceFile",
            };
          }
        }
      }
      
      if (resolvedIsWhatPath) {
        const entryFiles = [
          path.join(resolvedIsWhatPath, "dist", "index.js"),
          path.join(resolvedIsWhatPath, "index.js"),
          path.join(resolvedIsWhatPath, "index.cjs"),
        ];
        for (const entryFile of entryFiles) {
          if (fs.existsSync(entryFile)) {
            return {
              filePath: entryFile,
              type: "sourceFile",
            };
          }
        }
      }
    }
    
    // Default resolution for other modules
    return context.resolveRequest(context, moduleName, platform);
  },
};

// Disable node shims that cause issues on Windows
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return middleware;
  },
};

module.exports = config;
