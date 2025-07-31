<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '@src/store/appStore'

// Icons
import UsersIcon from "@src/components/svg/Users-Icon.vue"
import PlusIcon from "@src/components/svg/Plus-Icon.vue"
import TrashIcon from "@src/components/svg/Trash-Icon.vue"
import EditIcon from "@src/components/svg/Edit-Icon.vue"
import EyeOpenIcon from "@src/components/svg/EyeOpen-Icon.vue"
import EyeClosIcon from "@src/components/svg/EyeClose-Icon.vue"

// Store
const appStore = useAppStore()

const props = defineProps({
  ex: {
    type: Object,
    required: true
  }
})

const showModal = ref(false)
const profiles = ref<any[]>([])
const selectedExtensions = ref<string[]>([])
const expandedProfiles = ref<Set<string>>(new Set())
const editingProfileId = ref<string | null>(null)

// Drag and drop functionality
const draggedProfile = ref<any>(null)
const draggedIndex = ref<number>(-1)
const isDragging = ref(false)

// Form data
const formData = ref({
  name: '',
  icon: '',
  isActive: true,
  extensions: [] as string[]
})

const availableExtensions = computed(() => {
  if (!appStore.extensions || !Array.isArray(appStore.extensions)) {
    return []
  }
  return appStore.extensions.map(ext => ({
    id: ext.id,
    name: ext.name,
    enabled: ext.enabled,
    version: ext.version,
    icons: ext.icons
  }))
})

const getExtensionName = (extId: string) => {
  if (!appStore.extensions || !Array.isArray(appStore.extensions)) {
    return extId
  }
  const extension = appStore.extensions.find(ext => ext.id === extId)
  return extension?.name || extId
}

const getExtensionVersion = (extId: string) => {
  if (!appStore.extensions || !Array.isArray(appStore.extensions)) {
    return 'Unknown'
  }
  const extension = appStore.extensions.find(ext => ext.id === extId)
  return extension?.version || 'Unknown'
}

const getExtensionCount = (profile: any) => {
  if (!profile.extensions) return 0
  if (Array.isArray(profile.extensions)) {
    return profile.extensions.length
  }
  if (typeof profile.extensions === 'object') {
    return Object.keys(profile.extensions).length
  }
  return 0
}

const getExtensionIcon = (extension: any) => {
  if (extension.icons && extension.icons.length > 0) {
    const icon = extension.icons.find((icon: any) => icon.size === 48) ||
      extension.icons.find((icon: any) => icon.size === 32) ||
      extension.icons.find((icon: any) => icon.size === 24) ||
      extension.icons[0]
    return icon.url
  }
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEw0IDlMMTAuOTEgOC4yNkwxMiAyWiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K'
}

const openModal = () => {
  showModal.value = true
  editingProfileId.value = null
  resetForm()
}

const closeModal = () => {
  showModal.value = false
  editingProfileId.value = null
  resetForm()
}

const resetForm = () => {
  formData.value = {
    name: '',
    icon: '',
    isActive: true,
    extensions: []
  }
  selectedExtensions.value = []
  extensionSearchQuery.value = ''
}

// Drag and drop functions
const startDrag = (event: DragEvent, profile: any, index: number) => {
  if (!event.dataTransfer) return

  draggedProfile.value = profile
  draggedIndex.value = index
  isDragging.value = true

  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', profile.id)

  // Add dragging class to the element
  const target = event.target as HTMLElement
  if (target) {
    target.classList.add('dragging')
  }
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'

  // Add visual feedback for drop zones
  const target = event.currentTarget as HTMLElement
  if (target && !target.classList.contains('dragging')) {
    target.classList.add('drag-over')
  }
}

const onDrop = async (event: DragEvent, dropIndex: number) => {
  event.preventDefault()

  if (draggedProfile.value && draggedIndex.value !== dropIndex) {
    // Reorder the profiles array
    const newProfiles = [...profiles.value]
    const draggedItem = newProfiles.splice(draggedIndex.value, 1)[0]
    newProfiles.splice(dropIndex, 0, draggedItem)

    // Update the profiles array
    profiles.value = newProfiles

    // Save the new order to storage
    await saveProfilesToStorage(newProfiles)
  }

  // Reset drag state
  draggedProfile.value = null
  draggedIndex.value = -1
  isDragging.value = false

  // Remove dragging class from all elements
  document.querySelectorAll('.profile-container').forEach(el => {
    el.classList.remove('dragging', 'drag-over')
  })
}

const onDragLeave = (event: DragEvent) => {
  const target = event.currentTarget as HTMLElement
  if (target) {
    target.classList.remove('drag-over')
  }
}

const onDragEnd = () => {
  draggedProfile.value = null
  draggedIndex.value = -1
  isDragging.value = false

  // Remove dragging class from all elements
  document.querySelectorAll('.profile-container').forEach(el => {
    el.classList.remove('dragging', 'drag-over')
  })
}

const saveProfile = async () => {
  if (!formData.value.name.trim()) {
    alert('Please enter a profile name')
    return
  }

  try {
    const extensionsArray = Array.isArray(selectedExtensions.value) ? [...selectedExtensions.value] : []
    if (editingProfileId.value) {
      const existingProfile = profiles.value.find(p => p.id === editingProfileId.value)
      if (existingProfile) {
        const updatedProfile = {
          ...existingProfile,
          name: formData.value.name,
          icon: formData.value.icon || '📁',
          isActive: formData.value.isActive,
          extensions: extensionsArray,
          updatedAt: new Date().toISOString()
        }
        await updateProfileInStorage(updatedProfile)
        const index = profiles.value.findIndex(p => p.id === editingProfileId.value)
        if (index !== -1) {
          profiles.value[index] = updatedProfile
        }
      }
    } else {
      const profile = {
        id: Date.now().toString(),
        name: formData.value.name,
        icon: formData.value.icon || '📁',
        isActive: formData.value.isActive,
        extensions: extensionsArray,
        createdAt: new Date().toISOString()
      }

      await saveProfileToStorage(profile)
      profiles.value.push(profile)
    }

    closeModal()
  } catch (error) {
    console.error('Error saving profile:', error)
    alert('Error saving profile')
  }
}

const deleteProfile = async (profileId: string) => {
  if (confirm('Are you sure you want to delete this profile?')) {
    try {
      await deleteProfileFromStorage(profileId)
      profiles.value = profiles.value.filter(p => p.id !== profileId)
      expandedProfiles.value.delete(profileId)
    } catch (error) {
      console.error('Error deleting profile:', error)
      alert('Error deleting profile')
    }
  }
}

const toggleProfile = async (profile: any) => {
  try {
    profile.isActive = !profile.isActive
    await updateProfileInStorage(profile)
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Error updating profile')
  }
}

const toggleProfileDetails = (profileId: string) => {
  if (expandedProfiles.value.has(profileId)) {
    expandedProfiles.value.delete(profileId)
  } else {
    expandedProfiles.value.add(profileId)
  }
}

const editProfile = (profile: any) => {
  editingProfileId.value = profile.id
  formData.value = {
    name: profile.name,
    icon: profile.icon,
    isActive: profile.isActive,
    extensions: []
  }

  let extensionsArray: string[] = []
  if (profile.extensions) {
    if (Array.isArray(profile.extensions)) {
      extensionsArray = [...profile.extensions]
    } else if (typeof profile.extensions === 'object') {
      extensionsArray = Object.values(profile.extensions).filter((ext: any) => typeof ext === 'string')
    }
  }

  selectedExtensions.value = extensionsArray
  showModal.value = true
}

const toggleExtensionSelection = (extensionId: string) => {
  const index = selectedExtensions.value.indexOf(extensionId)
  if (index > -1) {
    selectedExtensions.value.splice(index, 1)
  } else {
    selectedExtensions.value.push(extensionId)
  }
}

const selectAllExtensions = () => {
  selectedExtensions.value = availableExtensions.value.map(ext => ext.id)
}

const clearAllExtensions = () => {
  selectedExtensions.value = []
}

const extensionSearchQuery = ref('')
const filteredExtensions = computed(() => {
  return availableExtensions.value.filter(ext =>
    ext.name.toLowerCase().includes(extensionSearchQuery.value.toLowerCase())
  )
})

const saveProfileToStorage = async (profile: any) => {
  const existingProfiles = await getProfilesFromStorage()
  existingProfiles.push(profile)
  return new Promise(async (resolve) => {
    await props.ex?.storage?.local.set('profiles', existingProfiles)
    resolve(true)
  })
}

const getProfilesFromStorage = async (): Promise<any[]> => {
  return new Promise(async (resolve) => {
    let result = await props.ex?.storage?.local.get('profiles');
    if (result && result.profiles && result.profiles.length > 0) {
      resolve(result.profiles)
    }
    resolve([])
  })
}

const deleteProfileFromStorage = async (profileId: string) => {
  const existingProfiles = await getProfilesFromStorage()
  const updatedProfiles = existingProfiles.filter(p => p.id !== profileId)
  return new Promise(async (resolve) => {
    await props.ex?.storage?.local.set('profiles', updatedProfiles)
    resolve(true)
  })
}

const updateProfileInStorage = async (profile: any) => {
  const existingProfiles = await getProfilesFromStorage()
  const updatedProfiles = existingProfiles.map(p =>
    p.id === profile.id ? profile : p
  )
  return new Promise(async (resolve) => {
    await props.ex?.storage?.local.set('profiles', updatedProfiles)
    resolve(true)
  })
}

const saveProfilesToStorage = async (profilesArray: any[]) => {
  return new Promise(async (resolve) => {
    await props.ex?.storage?.local.set('profiles', profilesArray)
    resolve(true)
  })
}

onMounted(async () => {
  try {
    profiles.value = await getProfilesFromStorage()
  } catch (error) {
    console.error('Error loading profiles:', error)
  }
})
</script>

<template>
  <div class="profiles-section">
    <!-- Header -->
    <div class="profiles-header">
      <h2 class="profiles-header-title">
        <UsersIcon width="30" height="30" />
        <span>Profiles</span>
      </h2>
      <button @click="openModal" class="add-profile-btn">
        <PlusIcon width="20" height="20" />
        <span>Add Profile</span>
      </button>
    </div>

    <!-- Profiles List -->
    <div class="profiles-list">
      <div v-if="profiles.length === 0" class="empty-state">
        <p>No profiles created yet. Create your first profile to get started.</p>
      </div>

      <div v-for="(profile, index) in profiles" :key="profile.id" class="profile-container" draggable="true" @dragstart="startDrag($event, profile, index)" @dragover="onDragOver($event)" @dragleave="onDragLeave($event)" @drop="onDrop($event, index)" @dragend="onDragEnd()">
        <div class="profile-item" @click="toggleProfileDetails(profile.id)">
          <div class="profile-info">
            <div class="profile-icon">{{ profile.icon }}</div>
            <div class="profile-details">
              <h3 class="profile-name">{{ profile.name }}</h3>
              <span class="profile-extensions">{{ getExtensionCount(profile) }} extensions</span>
            </div>
          </div>

          <div class="profile-status">
            <span class="status-badge" :class="{ 'active': profile.isActive, 'inactive': !profile.isActive }">
              {{ profile.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>

        <!-- Profile Details Panel -->
        <div v-if="expandedProfiles.has(profile.id)" class="profile-details-panel">
          <div class="details-content">
            <div class="detail-section">
              <h4>Selected Extensions</h4>
              <div class="extensions-preview">
                <div v-for="extId in (Array.isArray(profile.extensions) ? profile.extensions : Object.values(profile.extensions || {}))" :key="extId" class="extension-preview-item">
                  <div class="extension-preview-info">
                    <div class="extension-preview-icon">
                      <img :src="getExtensionIcon(appStore.extensions.find(ext => ext.id === extId))" width="20" height="20" :alt="getExtensionName(extId)" />
                    </div>
                    <div class="extension-preview-details">
                      <div class="extension-preview-name-row">
                        <span class="extension-preview-name">{{ getExtensionName(extId) }}</span>
                        <span class="extension-preview-version">{{ getExtensionVersion(extId) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="getExtensionCount(profile) === 0" class="no-extensions">
                  No extensions selected
                </div>
              </div>
            </div>
          </div>

          <div class="actions-grid">
            <button @click="editProfile(profile)" class="action-btn">
              <EditIcon width="16" height="16" />
              <span>Edit</span>
            </button>
            <button @click="toggleProfile(profile)" class="action-btn" :class="{ 'active': profile.isActive }">
              <EyeOpenIcon v-if="profile.isActive" width="16" height="16" />
              <EyeClosIcon v-else width="16" height="16" />
              <span>{{ profile.isActive ? 'Active' : 'Inactive' }}</span>
            </button>
            <button @click="deleteProfile(profile.id)" class="action-btn danger">
              <TrashIcon width="16" height="16" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingProfileId ? 'Edit Profile' : 'Create New Profile' }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Profile Name -->
          <div class="form-group">
            <label for="profileName">Profile Name</label>
            <input id="profileName" v-model="formData.name" type="text" placeholder="Enter profile name" class="form-input" />
          </div>

          <!-- Profile Icon -->
          <div class="form-group">
            <label for="profileIcon">Profile Icon (Emoji)</label>
            <input id="profileIcon" v-model="formData.icon" type="text" placeholder="Enter emoji or leave empty for default" class="form-input" />
          </div>

          <!-- Active Status -->
          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="formData.isActive" type="checkbox" class="form-checkbox" />
              <span>Active Profile</span>
            </label>
          </div>

          <!-- Extensions Selection -->
          <div class="form-group">
            <div class="extensions-header">
              <label>Select Extensions</label>
              <div class="extension-controls">
                <button @click="selectAllExtensions" class="control-btn">Select All</button>
                <button @click="clearAllExtensions" class="control-btn">Clear All</button>
              </div>
            </div>

            <!-- Search Input -->
            <div class="extension-search">
              <input v-model="extensionSearchQuery" type="search" placeholder="Search extensions..." class="search-input" />
            </div>

            <div class="extensions-list">
              <div v-for="extension in filteredExtensions" :key="extension.id" class="extension-option" :class="{ 'selected': selectedExtensions.includes(extension.id) }" @click="toggleExtensionSelection(extension.id)">
                <input type="checkbox" :checked="selectedExtensions.includes(extension.id)" @change="toggleExtensionSelection(extension.id)" class="extension-checkbox" />
                <div class="extension-info">
                  <div class="extension-icon">
                    <img :src="getExtensionIcon(extension)" width="24" height="24" :alt="extension.name" />
                  </div>
                  <div class="extension-details">
                    <div class="extension-name-row">
                      <span class="extension-name">{{ extension.name }}</span>
                      <span class="extension-version">{{ extension.version || 'Unknown' }}</span>
                    </div>
                  </div>
                </div>
                <span class="extension-status" :class="{ 'enabled': extension.enabled }">
                  {{ extension.enabled ? 'Active' : 'Disabled' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">Cancel</button>
          <button @click="saveProfile" class="btn btn-primary">{{ editingProfileId ? 'Update Profile' : 'Save Profile' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@src/assets/css/profiles.css';
</style>