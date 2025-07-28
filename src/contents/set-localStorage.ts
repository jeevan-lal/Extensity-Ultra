import { _store } from "@src/lib/constants";
import { detectBrowser, detectVersion } from "@src/lib/lib.ts";
import { ExtensionDriver } from '@ctechhindi/core-browser-extension/src/ExtensionDriver'

(async () => {
  try {
    const ex = new ExtensionDriver(detectBrowser(), detectVersion());

    // [STORAGE]
    var on = await ex.storage?.local.get(_store.keys.status, true)
    if (on === true || (on[_store.keys.status] && on[_store.keys.status] === true)) {
      localStorage.setItem(_store.keys.status, "1")
    } else {
      localStorage.removeItem(_store.keys.status)
    }

  } catch (e) {
    console.error(e)
  }
})();