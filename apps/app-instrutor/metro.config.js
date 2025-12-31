// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Encontrar o diretório raiz do workspace (onde está o pnpm-lock.yaml)
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// Adicionar a raiz do workspace para o Metro observar alterações em pacotes compartilhados
config.watchFolders = [workspaceRoot];

// Configurar resolução de node_modules para suportar pnpm workspaces e hoisting
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Resolver dependências de pacotes compartilhados
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
