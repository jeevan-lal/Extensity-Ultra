<script setup lang="ts">
import { onMounted, computed, ref } from "vue"
// @ts-ignore
import { detectBrowser, detectVersion } from "@src/lib/lib.ts";
import { ExtensionDriver } from '@ctechhindi/core-browser-extension/src/ExtensionDriver'
const ex = new ExtensionDriver(detectBrowser(), detectVersion());
import { useAppStore } from '@src/store/appStore'

// Icons
import SearchIcon from "@src/components/svg/Search-Icon.vue"
import CodeIcon from "@src/components/svg/Code-Icon.vue"
import CheckboxActiveIcon from "@src/components/svg/CheckboxActive-Icon.vue"
import CheckboxIcon from "@src/components/svg/Checkbox-Icon.vue"

// Components
import ExtensionItems from '@components/ExtensionItems.vue'
import PopupHeader from '@components/PopupHeader.vue'

// Store
const app = useAppStore()
const searchInAll = ref("")
const searchInDev = ref("")
const profiles = ref<any[]>([])
const popupSettings = ref({ profileDisplay: 'landscape' })

// Load profiles from storage
const loadProfilesFromStorage = async () => {
  return new Promise(async (resolve) => {
    let result = await ex?.storage?.local.get('profiles')
    if (result && result.profiles && result.profiles.length > 0) {
      resolve(result.profiles)
    }
    resolve([])
  })
}

// Load popup settings from storage
const loadPopupSettings = async () => {
  try {
    const result = await ex?.storage?.local.get('popupSettings')
    if (result && result.popupSettings) {
      popupSettings.value.profileDisplay = result.popupSettings.profileDisplay || 'landscape'
    }
  } catch (error) {
    console.error('Error loading popup settings:', error)
  }
}

// Get extensions for a specific profile
const getProfileExtensions = (profile: any) => {
  if (!app.extensions || !Array.isArray(app.extensions)) return []

  let profileExtensions: string[] = []
  if (profile.extensions) {
    if (Array.isArray(profile.extensions)) {
      profileExtensions = [...profile.extensions]
    } else if (typeof profile.extensions === 'object') {
      profileExtensions = Object.values(profile.extensions).filter((ext: any) => typeof ext === 'string')
    }
  }

  return app.extensions.filter(ext => profileExtensions.includes(ext.id))
}

// Activate all extensions in a profile
const activateAllProfileExtensions = async (profile: any) => {
  const profileExtensions = getProfileExtensions(profile)
  for (const extension of profileExtensions) {
    if (!extension.enabled) {
      try {
        ex.management?.setEnabled(extension.id, true)
      } catch (error) {
        console.error(`Error enabling extension ${extension.id}:`, error)
      }
    }
  }
  // Refresh extensions list
  await app.getExtensions(ex)
}

// Deactivate all extensions in a profile
const deactivateAllProfileExtensions = async (profile: any) => {
  const profileExtensions = getProfileExtensions(profile)
  for (const extension of profileExtensions) {
    if (extension.enabled) {
      try {
        ex.management?.setEnabled(extension.id, false)
      } catch (error) {
        console.error(`Error disabling extension ${extension.id}:`, error)
      }
    }
  }
  // Refresh extensions list
  await app.getExtensions(ex)
}

// All Extensions
const allExtensionsItems = computed(() => {
  if (!app.extensions || app.extensions.length <= 0) return [];

  let extensions = app.enabledDisabledExtensions;

  if (searchInAll.value.trim()) {
    const query = searchInAll.value.toLowerCase();
    extensions = extensions.filter(ext =>
      ext.name.toLowerCase().includes(query) ||
      ext.description.toLowerCase().includes(query)
    );
  }
  return extensions;
});

// Developer Extensions
const devExtensionsItems = computed(() => {
  if (!app.extensions || app.extensions.length <= 0) return [];

  let extensions = app.devEnabledDisabledExtensions;

  if (searchInDev.value.trim()) {
    const query = searchInDev.value.toLowerCase();
    extensions = extensions.filter(ext =>
      ext.name.toLowerCase().includes(query) ||
      ext.description.toLowerCase().includes(query)
    );
  }
  return extensions;
});

onMounted(async () => {
  await app.getExtensions(ex)
  // Load profiles and settings from storage
  try {
    const [profilesData] = await Promise.all([
      loadProfilesFromStorage(),
      loadPopupSettings()
    ])
    profiles.value = Array.isArray(profilesData) ? profilesData : []
  } catch (error) {
    console.error('Error loading profiles:', error)
    profiles.value = []
  }
})

</script>

<template>
  <div class="popup">
    <PopupHeader :ex="ex" />
    <div class="categories-list" :class="popupSettings.profileDisplay">
      <ul class="nav nav-underline border-bottom" id="js-tabs-1" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">All</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="account-tab" data-bs-toggle="tab" data-bs-target="#account-tab-pane" type="button" role="tab" aria-controls="account-tab-pane" aria-selected="false">
            <CodeIcon width="15" height="15" />
            Dev
          </button>
        </li>
        <!-- Profile tabs -->
        <li v-for="profile in profiles" :key="profile.id" class="nav-item" role="presentation">
          <button class="nav-link" :id="'profile-' + profile.id + '-tab'" data-bs-toggle="tab" :data-bs-target="'#profile-' + profile.id + '-tab-pane'" type="button" role="tab" :aria-controls="'profile-' + profile.id + '-tab-pane'" aria-selected="false">
            <span class="profile-icon">{{ profile.icon || '📁' }}</span>
            {{ profile.name }}
          </button>
        </li>
      </ul>
    </div>
    <div class="tab-content pt-2" id="js-tabs-content-1">
      <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
        <section>
          <div class="input-group input-group-sm mb-2">
            <span class="input-group-text">
              <SearchIcon />
            </span>
            <input v-model="searchInAll" type="search" class="form-control" placeholder="Search.." aria-label="Search Extension" autofocus>
          </div>
        </section>
        <section class="extensions">
          <ExtensionItems :extensions="allExtensionsItems" />
        </section>
      </div>
      <div class="tab-pane fade" id="account-tab-pane" role="tabpanel" aria-labelledby="account-tab" tabindex="0">
        <section>
          <div class="input-group input-group-sm mb-2">
            <span class="input-group-text">
              <SearchIcon />
            </span>
            <input v-model="searchInDev" type="search" class="form-control" placeholder="Search.." aria-label="Search Extension" autofocus>
          </div>
        </section>
        <section>
          <ExtensionItems :extensions="devExtensionsItems" />
        </section>
      </div>
      <!-- Profile tab panes -->
      <div v-for="profile in profiles" :key="profile.id" class="tab-pane fade" :id="'profile-' + profile.id + '-tab-pane'" role="tabpanel" :aria-labelledby="'profile-' + profile.id + '-tab'" tabindex="0">
        <section>
          <div class="profile-actions mb-2 d-flex justify-content-end">
            <div class="btn-group btn-group-sm" role="group">
              <button type="button" class="btn btn-outline-success" @click="activateAllProfileExtensions(profile)" title="Activate All">
                <CheckboxActiveIcon width="20" height="20" />
              </button>
              <button type="button" class="btn btn-outline-danger" @click="deactivateAllProfileExtensions(profile)" title="Deactivate All">
                <CheckboxIcon width="20" height="20" />
              </button>
            </div>
          </div>
        </section>
        <section>
          <ExtensionItems :extensions="getProfileExtensions(profile)" />
        </section>
      </div>
    </div>
  </div>
</template>