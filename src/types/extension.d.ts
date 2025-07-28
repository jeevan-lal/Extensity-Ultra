/**
 * Extension
 */

interface ExtensionInfo {
  id: string
  name: string
  description: string
  version: string
  // TODO
  // installType: ExtensionInstallType
  installType: string
  enabled: boolean
  homepageUrl: string
  hostPermissions: string[]
  icons: ExtensionIcon[]
  isApp?: boolean
  mayDisable: boolean
  offlineEnabled: boolean
  optionsUrl?: string
  permissions?: string[]
  shortName: string
  type: string
  updateUrl?: string
  // Custom Data
}

// enum ExtensionInstallType {
//   "development",
//   "normal",
//   "admin",
//   "sideload",
//   "other"
// }

interface ExtensionInstallType {
  development?: ExtensionInfo[]
  normal?: ExtensionInfo[]
  admin?: ExtensionInfo[]
  sideload?: ExtensionInfo[]
  other?: ExtensionInfo[]
}

interface ExtensionIcon {
  size: number
  url: string
}

interface AppInfo {
  name: string
  version: number
}