<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@src/store/appStore'

// Icons
import PuzzleOutlineIcon from "@src/components/svg/PuzzleOutline-Icon.vue"
import CheckAllIcon from "@src/components/svg/CheckAll-Icon.vue"
import CodeIcon from "@src/components/svg/Code-Icon.vue"
import SearchIcon from "@src/components/svg/Search-Icon.vue"
import EyeCloseIcon from "@src/components/svg/EyeClose-Icon.vue"
import EyeOpenIcon from "@src/components/svg/EyeOpen-Icon.vue"
import OpenInNewIcon from "@src/components/svg/OpenInNew-Icon.vue"
import CogIcon from "@src/components/svg/Cog-Icon.vue"
import SecurityIcon from "@src/components/svg/Security-Icon.vue"

// Store
const appStore = useAppStore()

const props = defineProps({
  ex: {
    type: Object,
    required: true
  }
})

// Local reactive data
const searchQuery = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')
const expandedExtensions = ref<Set<string>>(new Set())

const stats = computed(() => ({
  total: appStore.extensions.length,
  active: appStore.enabledExtensions.length,
  disabled: appStore.disabledExtensions.length,
  dev: appStore.devExtensions.length
}))

const filteredExtensions = computed(() => {
  let extensions = appStore.extensions

  // Apply status filter
  if (statusFilter.value !== 'all') {
    if (statusFilter.value === 'active') {
      extensions = extensions.filter(ext => ext.enabled)
    } else if (statusFilter.value === 'disabled') {
      extensions = extensions.filter(ext => !ext.enabled)
    }
  }

  // Apply type filter
  if (typeFilter.value !== 'all') {
    if (typeFilter.value === 'dev') {
      extensions = extensions.filter(ext => ext.installType === 'development')
    } else if (typeFilter.value === 'user') {
      extensions = extensions.filter(ext => ext.installType !== 'development')
    }
  }

  // Apply search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    extensions = extensions.filter(ext =>
      ext.name.toLowerCase().includes(query) ||
      (ext.description && ext.description.toLowerCase().includes(query))
    )
  }

  return extensions
})

const getStatusColor = (enabled: boolean) => {
  return enabled ? '#10b981' : '#6b7280'
}

const getStatusText = (enabled: boolean) => {
  return enabled ? 'Active' : 'Disabled'
}

const getExtensionIcon = (extension: any) => {
  if (extension.icons && extension.icons.length > 0) {
    return extension.icons[0].url
  }
  return '🧩'
}

const getExtensionType = (installType: string) => {
  return installType === 'development' ? 'dev' : 'user'
}

// Toggle extension details
const toggleExtensionDetails = (extensionId: string) => {
  if (expandedExtensions.value.has(extensionId)) {
    expandedExtensions.value.delete(extensionId)
  } else {
    expandedExtensions.value.add(extensionId)
  }
}

// Extension actions
const toggleExtension = async (extension: any) => {
  await appStore.toggleExtensionOn(props.ex, extension.id, !extension.enabled)
}

const openOptionsPage = (extension: any) => {
  appStore.openOptionPage(props.ex, extension)
}

const openManagePage = (extension: any) => {
  appStore.openManageExtensionPage(props.ex, extension)
}

const openPermissionsPage = (extension: any) => {
  appStore.openPermissionPage(props.ex, extension)
}

onMounted(async () => {
  await appStore.getExtensions(props.ex)
})

// Watch for search query changes and update store
const updateSearchQuery = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target) {
    searchQuery.value = target.value
    appStore.setSearchQuery(target.value)
  }
}

// Watch for filter changes and update store
const updateStatusFilter = (event: Event) => {
  const target = event.target as HTMLSelectElement
  if (target) {
    statusFilter.value = target.value
    if (target.value === 'active') {
      appStore.setFilterBy('enabled')
    } else if (target.value === 'disabled') {
      appStore.setFilterBy('disabled')
    } else if (target.value === 'dev') {
      appStore.setFilterBy('development')
    } else {
      appStore.setFilterBy('all')
    }
  }
}
</script>

<template>
  <div class="extensions-management-section">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card total">
        <div class="stat-icon">
          <PuzzleOutlineIcon width="24" height="24" />
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ stats.total }}</h3>
          <p class="stat-label">Total Extensions</p>
        </div>
      </div>

      <div class="stat-card active">
        <div class="stat-icon">
          <CheckAllIcon width="24" height="24" />
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ stats.active }}</h3>
          <p class="stat-label">Active Extensions</p>
        </div>
      </div>

      <div class="stat-card disabled">
        <div class="stat-icon">
          <EyeCloseIcon width="24" height="24" />
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ stats.disabled }}</h3>
          <p class="stat-label">Disabled Extensions</p>
        </div>
      </div>

      <div class="stat-card dev">
        <div class="stat-icon">
          <CodeIcon width="24" height="24" />
        </div>
        <div class="stat-content">
          <h3 class="stat-number">{{ stats.dev }}</h3>
          <p class="stat-label">Dev Extensions</p>
        </div>
      </div>
    </div>

    <!-- Extensions List Section -->
    <div class="extensions-section">
      <div class="extensions-header">
        <h3>All Extensions ({{ filteredExtensions.length }})</h3>
        <div class="extensions-controls">
          <!-- Search -->
          <div class="search-container">
            <SearchIcon width="18" height="18" class="search-icon" />
            <input v-model="searchQuery" @input="updateSearchQuery" type="text" placeholder="Search extensions..." class="search-input" />
          </div>
          <!-- Filters -->
          <div class="filters">
            <select v-model="statusFilter" @change="updateStatusFilter" class="filter-select">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>

            <select v-model="typeFilter" class="filter-select">
              <option value="all">All Types</option>
              <option value="user">User</option>
              <option value="dev">Developer</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Extensions List -->
      <div class="extensions-list">
        <div v-for="extension in filteredExtensions" :key="extension.id" class="extension-container">
          <!-- Extension Item -->
          <div class="extension-item" @click="toggleExtensionDetails(extension.id)">
            <div class="extension-info">
              <div class="extension-icon">
                <img :src="getExtensionIcon(extension)" width="24" height="24" :alt="extension.name" />
              </div>
              <div class="extension-details">
                <h4 class="extension-name">{{ extension.name }}</h4>
                <span class="extension-type">{{ getExtensionType(extension.installType) }}</span>
              </div>
            </div>

            <div class="extension-status">
              <span class="status-badge" :style="{ backgroundColor: getStatusColor(extension.enabled) }">
                {{ getStatusText(extension.enabled) }}
              </span>
            </div>
          </div>

          <!-- Extension Details Panel -->
          <div v-if="expandedExtensions.has(extension.id)" class="extension-details-panel">
            <div class="details-content">
              <!-- Description -->
              <div class="detail-section">
                <h5>Description</h5>
                <p>{{ extension.description || 'No description available' }}</p>
              </div>

              <!-- Extension Info -->
              <div class="detail-section">
                <h5>Extension Information</h5>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Version:</span>
                    <span class="info-value">{{ extension.version || 'N/A' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">ID:</span>
                    <span class="info-value">{{ extension.id }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="detail-section">
                <h5>Actions</h5>
                <div class="actions-grid">
                  <button @click="toggleExtension(extension)" class="action-btn primary" :class="{ 'danger': extension.enabled }">
                    <EyeCloseIcon v-if="extension.enabled" width="16" height="16" />
                    <EyeOpenIcon v-else width="16" height="16" />
                    {{ extension.enabled ? 'Disable' : 'Enable' }} Extension
                  </button>

                  <button v-if="extension.optionsUrl" @click="openOptionsPage(extension)" class="action-btn secondary">
                    <CogIcon width="16" height="16" />
                    Options
                  </button>

                  <button @click="openManagePage(extension)" class="action-btn secondary">
                    <OpenInNewIcon width="16" height="16" />
                    Manage
                  </button>

                  <button @click="openPermissionsPage(extension)" class="action-btn secondary">
                    <SecurityIcon width="16" height="16" />
                    Permissions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredExtensions.length === 0" class="empty-state">
        <p>No extensions found matching your criteria.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@src/assets/css/extensions-management.css';
</style>