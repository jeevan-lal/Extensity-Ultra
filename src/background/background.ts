// // @ts-ignore
// import { _store } from "@src/lib/constants";
// import { detectBrowser, detectVersion } from "@src/lib/lib.ts";
// import { ExtensionDriver } from '@ctechhindi/core-browser-extension/src/ExtensionDriver'

// const ex = new ExtensionDriver(detectBrowser(), detectVersion());

// /**
//  * Change Extension Icon/Storage
//  * @param isChange 
//  */
// async function icon(isChange: Boolean = false) {

//   // CHECK: Extension is ON/OFF
//   const on = await ex.storage?.local.get(_store.keys.status, true)
//   if (on === true || (on[_store.keys.status] && on[_store.keys.status] === true)) {

//     // Is Change Icon
//     if (isChange) {

//       // Action: OFF
//       await ex.storage?.local.set(_store.keys.status, false)
//       ex.action?.setIcon({ path: "icons/off/32x32.png" })
//     } else {
//       ex.action?.setIcon({ path: "icons/32x32.png" })
//     }

//   } else {

//     // Is Change Icon
//     if (isChange) {

//       // Action: ON
//       await ex.storage?.local.set(_store.keys.status, true)
//       ex.action?.setIcon({ path: "icons/32x32.png" })
//     } else {
//       ex.action?.setIcon({ path: "icons/off/32x32.png" })
//     }
//   }
// }

// // [EVENT]: Click on extension icon
// ex.action?.onClicked.addListener(async () => {
//   icon(true) // Change Extension Icon/Storage
// });

// // Change Extension Icon/Storage
// icon(false)