#!/usr/bin/env node

/**
 * package.json의 버전을 tauri.conf.json에 동기화합니다.
 * npm version 훅에서 자동 실행됩니다.
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

const packagePath = join(rootDir, "package.json");
const tauriConfigPath = join(rootDir, "src-tauri", "tauri.conf.json");

const packageJson = JSON.parse(readFileSync(packagePath, "utf-8"));
const tauriConfig = JSON.parse(readFileSync(tauriConfigPath, "utf-8"));

const newVersion = packageJson.version;

if (tauriConfig.version !== newVersion) {
  tauriConfig.version = newVersion;
  writeFileSync(tauriConfigPath, JSON.stringify(tauriConfig, null, 2) + "\n");
  console.log(`✓ tauri.conf.json 버전 업데이트: ${newVersion}`);
} else {
  console.log(`✓ 버전이 이미 동기화됨: ${newVersion}`);
}
