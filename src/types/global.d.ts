declare global {

  // "Window" is typescript type, "window" is variable
  interface Window {
    CustomAlertStyle: any
  }

  // Chrome API declarations
  declare var chrome: {
    runtime: {
      id: string;
    };
    management: {
      getAll: (callback: (extensions: ExtensionInfo[]) => void) => void;
      setEnabled: (id: string, enabled: boolean) => void;
    };
    storage: {
      local: {
        get: (key: string) => Promise<any>;
        set: (key: string, value: any) => Promise<void>;
        remove: (key: string) => Promise<void>;
      };
    };
    tabs: {
      create: (options: { url: string }) => void;
    };
  };

  declare var _env: {
    NODE_ENV: string;
    MANIFEST_VERSION: string;
    BROWSER_TYPE: string;
    EXTENSION_TYPE: string;
    IS_ENCODE_SCRIPTS: string;
  };

  interface _env {
    NODE_ENV: string;
    EXTENSION_TYPE: string;
    MANIFEST_VERSION: string;
    BROWSER_TYPE: string;
    IS_ENCODE_SCRIPTS: string;
  }

  interface ManifestJSON {
    name: string;
    short_name: string;
    description: string;
    icons: typeIcon;
    browser_action: {
      default_icon: typeIcon
    };
    action: {
      default_icon: typeIcon
    };
    externally_connectable: {
      ids: string[]
      matches: string[]
    }
  }

  interface typeIcon {
    "16": string;
    "24": string;
    "32": string;
    "48": string;
    "128": string;
  }
}

/*~ If your module exports nothing, you'll need this line. Otherwise, delete it */
export { };
