import { ExtensionBrowsers } from "@ctechhindi/core-browser-extension/src/utils/enums";

export function detectBrowser() {
  if (_env.BROWSER_TYPE === "chrome") return ExtensionBrowsers.chrome
  else if (_env.BROWSER_TYPE === "firefox") return ExtensionBrowsers.firefox
  else if (_env.BROWSER_TYPE === "edge") return ExtensionBrowsers.edge
  else return ExtensionBrowsers.chrome
}

export function detectVersion() {
  if (_env.MANIFEST_VERSION == "1") return _env.MANIFEST_VERSION
  else if (_env.MANIFEST_VERSION == "2") return _env.MANIFEST_VERSION
  else return "1"
}