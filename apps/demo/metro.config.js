const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch the entire monorepo so Metro picks up the local package
config.watchFolders = [workspaceRoot];

// Resolve modules from both the demo's node_modules and the workspace root's node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Block Metro from resolving through workspace package node_modules so that
// singleton modules (react, react-native) are always sourced from the app's
// dependency tree, not from devDependency trees of library packages.
config.resolver.blockList = [
  new RegExp(
    path.resolve(workspaceRoot, 'packages').replace(/\\/g, '\\\\') +
      '/[^/]+/node_modules/.*'
  ),
];

module.exports = config;
