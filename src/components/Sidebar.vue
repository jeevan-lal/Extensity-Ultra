<script setup lang="ts">
import { ref } from 'vue'

// Icons
import PuzzleOutlineIcon from "@src/components/svg/PuzzleOutline-Icon.vue"
import UsersIcon from "@src/components/svg/Users-Icon.vue"
import CogIcon from "@src/components/svg/Cog-Icon.vue"
import InfoIcon from "@src/components/svg/Info-Icon.vue"

// Components
import ExtensionsManagement from "@src/components/ExtensionsManagement.vue"
import Profiles from "@src/components/Profiles.vue"
import Settings from "@src/components/Settings.vue"
import About from "@src/components/About.vue"

const props = defineProps({
  ex: {
    type: Object,
    required: true
  }
})

// Active sidebar item
const activeSection = ref('extensions')

const setActiveSection = (section: string) => {
  activeSection.value = section
}
</script>

<template>
  <!-- Sidebar -->
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="logo-container">
        <img src="/icons/48x48.png" alt="Extensity Ultra" class="logo" />
        <h3>Extensity Ultra</h3>
      </div>
    </div>
    <div class="sidebar-menu">
      <div class="sidebar-item" :class="{ active: activeSection === 'extensions' }" @click="setActiveSection('extensions')">
        <PuzzleOutlineIcon width="20" height="20" />
        <span>Extensions</span>
      </div>
      <div class="sidebar-item" :class="{ active: activeSection === 'profile' }" @click="setActiveSection('profile')">
        <UsersIcon width="20" height="20" />
        <span>Profile</span>
      </div>
      <div class="sidebar-item" :class="{ active: activeSection === 'settings' }" @click="setActiveSection('settings')">
        <CogIcon width="20" height="20" />
        <span>Settings</span>
      </div>
    </div>
    
    <!-- Bottom section for About -->
    <div class="sidebar-bottom">
      <div class="sidebar-item" :class="{ active: activeSection === 'about' }" @click="setActiveSection('about')">
        <InfoIcon width="20" height="20" />
        <span>About</span>
      </div>
    </div>
  </div>

  <!-- Content Area -->
  <div class="content-area">
    <div v-if="activeSection === 'extensions'">
      <ExtensionsManagement :ex="props.ex" />
    </div>
    <div v-if="activeSection === 'profile'">
      <Profiles :ex="props.ex" />
    </div>
    <div v-if="activeSection === 'settings'">
      <Settings :ex="props.ex" />
    </div>
    <div v-if="activeSection === 'about'">
      <About />
    </div>
  </div>
</template>