import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      app: null as AppInfo | null,
      extensions: [] as ExtensionInfo[],
      selectedExtensions: [] as string[],
      searchQuery: '' as string,
      filterBy: 'all' as 'all' | 'enabled' | 'disabled' | 'development',
      // Settings
      settings: {
        disableAllExtensions: true,
        disableDevExtensions: false,
        disableNormalExtensions: false,
      } as AppSettings,
      // Enable or Disable Extensions
      previouslyEnabledExtensions: [] as string[]
    }
  },
  actions: {

    getExtensions(ex: any) {
      return new Promise(async (resolve) => {

        ex.management?.getAll(async (res: ExtensionInfo[]) => {
          var extensions = [];
          for (let index = 0; index < res.length; index++) {
            const item = res[index];

            // Skip own extension
            let currentExtensionId: string;
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
              currentExtensionId = chrome.runtime.id;
            }

            if (currentExtensionId! === item.id) continue;

            // Push
            extensions.push(item)
          }

          this.extensions = extensions.sort((a, b) => a.name.localeCompare(b.name))
        });

        // Tooltip Activate
        this.bootstrapTooltipActivate()

        // Return 
        return resolve(true)
      })
    },

    async toggleExtensionOn(ex: any, id: string, isEnable: boolean) {
      ex.management?.setEnabled(id, isEnable)
      await this.getExtensions(ex)
    },

    bootstrapTooltipActivate() {
      setTimeout(() => {
        const tooltipTriggerList = document.querySelectorAll("[data-bs-toggle='tooltip']");
        [...tooltipTriggerList].map(
          // @ts-ignore
          (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
        );
      }, 1000);
    },

    toast(msg: string) {

      // Toast HTML
      var tostContent = `
        <div class="toast-container position-fixed p-3 bottom-0 start-50 translate-middle-x">
          <div id="live-toast" class="custom-toast toast fade" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body lead">${msg}</div>
          </div>
        </div>`;

      // @ts-ignore
      document.querySelector('body').insertAdjacentHTML("beforebegin", tostContent)

      var toastElList = [].slice.call(document.querySelectorAll('.toast'))
      toastElList.map(function (toastEl) {
        // @ts-ignore
        return new bootstrap.Toast(toastEl, { animation: true, autohide: true, delay: 1000 })
      })

      const toastLiveExample = document.getElementById("live-toast");
      // @ts-ignore
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
      toastBootstrap.show();
    },

    setCopyValueOnce(val: string) {
      // @ts-ignore
      const setCopyOnce = (event) => {
        this.toast("Copied.")
        event.clipboardData.setData('Text', "https://chrome.google.com/webstore/detail/" + val);
        event.preventDefault();
      }
      document.addEventListener('copy', setCopyOnce);
      // @ts-ignore
      document.execCommand("copy", false, null);
      document.removeEventListener('copy', setCopyOnce);
    },

    openOptionPage(ex: any, item: ExtensionInfo) {
      ex.tabs.create({ url: item.optionsUrl })
    },

    openManageExtensionPage(ex: any, item: ExtensionInfo) {
      // chrome://extensions/?id=extension_id
      ex.tabs.create({ url: "chrome://extensions/?id=" + item.id })
    },

    openPermissionPage(ex: any, item: ExtensionInfo) {
      chrome://settings/content/siteDetails?site=chrome-extension://extension_id
      ex.tabs.create({ url: "chrome://settings/content/siteDetails?site=chrome-extension://" + item.id })
    },

    // pinExtension(ex: any, item: ExtensionInfo) {
    // }

    // New actions for enhanced functionality
    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    setFilterBy(filter: 'all' | 'enabled' | 'disabled' | 'development') {
      this.filterBy = filter;
    },

    toggleExtensionSelection(extensionId: string) {
      const index = this.selectedExtensions.indexOf(extensionId);
      if (index > -1) {
        this.selectedExtensions.splice(index, 1);
      } else {
        this.selectedExtensions.push(extensionId);
      }
    },

    clearSelectedExtensions() {
      this.selectedExtensions = [];
    },

    selectAllExtensions(extensions: ExtensionInfo[]) {
      this.selectedExtensions = extensions.map(ext => ext.id);
    },

    // Smart toggle: Disable all except current extension, or enable previously enabled ones
    async smartToggleExtensions(ex: any) {
      try {
        let currentExtensionId: string;
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
          currentExtensionId = chrome.runtime.id;
        }

        // Check if we should disable all or enable previously enabled
        const hasEnabledExtensions = await this.shouldShowDisableAll(ex);

        if (!hasEnabledExtensions) {

          // DISABLE MODE: Store currently enabled extensions (except current) and disable them
          this.previouslyEnabledExtensions = this.extensions
            .filter(ext => ext.enabled && ext.id !== currentExtensionId)
            .map(ext => ext.id);

          // Disable all extensions except current one
          for (const extension of this.extensions) {
            if (extension.enabled && extension.id !== currentExtensionId!) {
              ex.management?.setEnabled(extension.id, false);
            }
          }

          // Store
          await ex.storage.local.set("previouslyEnabledExtensions", this.previouslyEnabledExtensions);

          // this.toast("All extensions disabled except current extension");
        } else {

          // Store
          let enableEx = await ex.storage.local.get("previouslyEnabledExtensions");

          if (enableEx && enableEx.previouslyEnabledExtensions && enableEx.previouslyEnabledExtensions.length > 0) {
            this.previouslyEnabledExtensions = enableEx.previouslyEnabledExtensions;
            for (const extensionId of this.previouslyEnabledExtensions) {
              // Only enable if the extension still exists and is currently disabled
              const extension = this.extensions.find(ext => ext.id === extensionId);
              if (extension && !extension.enabled) {
                ex.management?.setEnabled(extensionId, true);
              }
            }

            // Store
            await ex.storage.local.remove("previouslyEnabledExtensions");
            // this.toast(`Enabled ${this.previouslyEnabledExtensions.length} previously enabled extensions`);
          } else {
            this.toast("No previously enabled extensions to restore");
          }
        }

        // Small delay to allow the browser to process the changes
        setTimeout(async () => {
          await this.getExtensions(ex);
        }, 200);

      } catch (error) {
        console.error('Error in smartToggleExtensions:', error);
        this.toast("Error toggling extensions");
      }
    },

    async shouldShowDisableAll(ex: any): Promise<boolean> {
      try {
        let isFound = await ex.storage.local.get('previouslyEnabledExtensions')
        return (isFound && isFound.previouslyEnabledExtensions && isFound.previouslyEnabledExtensions.length > 0)
      } catch (error) {
        console.error('Error in shouldShowDisableAll:', error);
        return false;
      }
    },
  },
  getters: {

    // All Extensions
    enabledExtensions: (state): ExtensionInfo[] => state.extensions.filter((item) => item.enabled),
    disabledExtensions: (state): ExtensionInfo[] => state.extensions.filter((item) => !item.enabled),
    enabledDisabledExtensions(): ExtensionInfo[] { return [...this.enabledExtensions, ...this.disabledExtensions] },
    enabledDisabledExtensionsAlpha(state): ExtensionInfo[] {
      const alpha = state.extensions.sort((a, b) => a.name.localeCompare(b.name));
      const enabled = alpha.filter((item) => item.enabled)
      const disabled = alpha.filter((item) => !item.enabled)
      return [...enabled, ...disabled]
    },

    // Developer Extension
    devExtensions: (state): ExtensionInfo[] => state.extensions.filter((item) => item.installType === "development"),
    devEnabledExtensions(): ExtensionInfo[] { return this.devExtensions.filter((item) => item.enabled) },
    devDisabledExtensions(): ExtensionInfo[] { return this.devExtensions.filter((item) => !item.enabled) },
    devEnabledDisabledExtensions(): ExtensionInfo[] { return [...this.devEnabledExtensions, ...this.devDisabledExtensions] },

    // Enhanced filtering getters
    filteredExtensions(): ExtensionInfo[] {
      let extensions = this.enabledDisabledExtensions;

      // Apply filter by status
      switch (this.filterBy) {
        case 'enabled':
          extensions = extensions.filter(ext => ext.enabled);
          break;
        case 'disabled':
          extensions = extensions.filter(ext => !ext.enabled);
          break;
        case 'development':
          extensions = extensions.filter(ext => ext.installType === 'development');
          break;
        case 'all':
        default:
          // No additional filtering needed
          break;
      }

      // Apply search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        extensions = extensions.filter(ext =>
          ext.name.toLowerCase().includes(query) ||
          ext.description.toLowerCase().includes(query)
        );
      }

      return extensions;
    },

    filteredDevExtensions(): ExtensionInfo[] {
      let extensions = this.devEnabledDisabledExtensions;

      // Apply search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        extensions = extensions.filter(ext =>
          ext.name.toLowerCase().includes(query) ||
          ext.description.toLowerCase().includes(query)
        );
      }

      return extensions;
    }
  }
});
