<template>
  <div class="settings-section">
    <div class="settings-header">
      <h2>Settings</h2>
      <p class="settings-subtitle">Configure Extensity Ultra preferences and manage your data</p>
    </div>

    <div class="settings-content">
      <!-- Import/Export Settings -->
      <div class="settings-card">
        <div class="card-content">
          <div class="settings-row">
            <div class="settings-group">
              <label>Export Settings</label>
              <p class="help-text">Download all your profiles and settings as a JSON file</p>
              <button class="btn btn-primary" @click="exportSettings">
                <DownloadIcon width="16" height="16" />
                Export Settings
              </button>
            </div>
            <div class="settings-group">
              <label>Import Settings</label>
              <p class="help-text">Restore settings from a previously exported file</p>
              <div class="import-section">
                <input type="file" ref="importFileInput" accept=".json" @change="importSettings" style="display: none;" />
                <button class="btn btn-outline-primary" @click="(importFileInput as HTMLInputElement)?.click()">
                  <UploadIcon width="16" height="16" />
                  Choose File
                </button>
                <span v-if="importFileName" class="file-name">{{ importFileName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Popup Page Settings -->
      <div class="settings-card">
        <div class="card-content">
          <div class="settings-row">
            <div class="settings-group">
              <label>Profile Display Design</label>
              <p class="help-text">Choose how profile tabs are displayed in the popup</p>
              <select class="form-select" v-model="popupSettings.profileDisplay" @change="savePopupSettings">
                <option value="landscape">Landscape - Wide layout with more horizontal space</option>
                <option value="portrait">Portrait - Compact layout with vertical orientation</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Extensions -->
      <div class="settings-card">
        <div class="card-content">
          <div class="settings-row">
            <div class="settings-group">
              <label>Export Extensions to CSV</label>
              <p class="help-text">Download a comprehensive list of all extensions with details</p>
              <button class="btn btn-success" @click="exportExtensionsCSV">
                <FileTextIcon width="16" height="16" />
                Export to CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Delete All Profile Data -->
      <div class="settings-card">
        <div class="card-content">
          <div class="settings-row">
            <div class="settings-group">
              <label>Delete All Profile Data</label>
              <p class="help-text">Permanently remove all profiles and their associated data. This action cannot be undone.</p>
              <button class="btn btn-danger" @click="deleteAllProfiles">
                <TrashIcon width="16" height="16" style="fill: #ffffff;" />
                Delete All Profiles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="toast.show" class="toast-container">
      <div class="toast" :class="toast.type">
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click="toast.show = false">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import DownloadIcon from '@src/components/svg/Download-Icon.vue'
import UploadIcon from '@src/components/svg/Upload-Icon.vue'
import FileTextIcon from '@src/components/svg/FileText-Icon.vue'
import TrashIcon from '@src/components/svg/Trash-Icon.vue'

// Reactive data
const importFileName = ref('')
const importFileInput = ref<HTMLInputElement>()

const popupSettings = reactive({
  profileDisplay: 'landscape'
})

const props = defineProps({
  ex: {
    type: Object,
    required: true
  }
})

const toast = reactive({
  show: false,
  message: '',
  type: 'success'
})

onMounted(async () => {
  await loadPopupSettings()
})

const loadPopupSettings = async () => {
  try {
    const result = await props.ex?.storage?.local.get('popupSettings')
    if (result && result.popupSettings) {
      popupSettings.profileDisplay = result.popupSettings.profileDisplay || 'landscape'
    }
  } catch (error) {
    console.error('Error loading popup settings:', error)
  }
}

// Save popup settings to storage
const savePopupSettings = async () => {
  try {
    await props.ex?.storage?.local.set('popupSettings', popupSettings)
    showToast('Popup settings saved successfully!', 'success')
  } catch (error) {
    console.error('Error saving popup settings:', error)
    showToast('Error saving settings', 'error')
  }
}

// Export settings
const exportSettings = async () => {
  try {
    const result = await props.ex?.storage?.local.get(null)
    const dataStr = JSON.stringify(result, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `extensity-ultra-settings-${new Date().toISOString().split('T')[0]}.json`
    link.click()

    showToast('Settings exported successfully!', 'success')
  } catch (error) {
    console.error('Error exporting settings:', error)
    showToast('Error exporting settings', 'error')
  }
}

// Import settings
const importSettings = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  importFileName.value = file.name

  try {
    const text = await file.text()
    const settings = JSON.parse(text)

    if (settings && settings.popupSettings) {
      await props.ex?.storage?.local.set('popupSettings', settings.popupSettings)
    }

    if (settings && settings.profiles) {
      await props.ex?.storage?.local.set('profiles', settings.profiles)
    }

    showToast('Settings imported successfully!', 'success')
    importFileName.value = ''
    target.value = ''
  } catch (error) {
    console.error('Error importing settings:', error)
    showToast('Error importing settings. Please check the file format.', 'error')
    importFileName.value = ''
    target.value = ''
  }
}

// Export extensions to CSV
const exportExtensionsCSV = async () => {
  try {
    const extensions = await props.ex?.management?.getAll()

    // Create CSV content
    const csvHeaders = ['Name', 'Version', 'Is Dev', 'Description', 'Chrome Store URL', 'Enabled', 'Type']
    const csvRows = extensions.map((ext: any) => [
      `"${ext.name}"`,
      `"${ext.version}"`,
      ext.installType === 'development' ? 'Yes' : 'No',
      `"${ext.description || ''}"`,
      ext.homepageUrl || '',
      ext.enabled ? 'Yes' : 'No',
      ext.type
    ])

    const csvContent = [csvHeaders.join(','), ...csvRows.map((row: any[]) => row.join(','))].join('\n')
    const dataBlob = new Blob([csvContent], { type: 'text/csv' })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `extensions-export-${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    showToast('Extensions exported to CSV successfully!', 'success')
  } catch (error) {
    console.error('Error exporting extensions:', error)
    showToast('Error exporting extensions', 'error')
  }
}

// Delete all profiles
const deleteAllProfiles = async () => {
  if (confirm('Are you sure you want to delete all profiles? This action cannot be undone.')) {
    try {
      await props.ex?.storage?.local.remove('profiles')
      showToast('All profiles deleted successfully!', 'success')
    } catch (error) {
      console.error('Error deleting profiles:', error)
      showToast('Error deleting profiles', 'error')
    }
  }
}

// Show toast notification
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true

  setTimeout(() => {
    toast.show = false
  }, 3000)
}
</script>

<style scoped>
.settings-section {
  margin-top: 0px;
}

.settings-header {
  margin-bottom: 40px;
  text-align: center;
}

.settings-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--theme-text-primary, #1a202c);
  margin-bottom: 8px;
  margin-top: 0px;
  letter-spacing: -0.5px;
}

.settings-subtitle {
  font-size: 1.1rem;
  color: var(--theme-text-secondary, #4a5568);
  margin: 0;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.settings-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.settings-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-header {
  padding: 24px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-header h3 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.card-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.card-content {
  padding: 30px;
}

.settings-row {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.settings-group {
  flex: 1;
  min-width: 300px;
}

.settings-group label {
  display: block;
  font-weight: 600;
  color: var(--theme-text-primary, #1a202c);
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.help-text {
  color: var(--theme-text-secondary, #4a5568);
  font-size: 0.9rem;
  margin-bottom: 16px;
  line-height: 1.4;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-outline-primary {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 11px 20px;
}

.btn-outline-primary:hover {
  background: #667eea;
  color: white;
}

.btn-success {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.btn-success:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.4);
}

.import-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-name {
  font-size: 0.9rem;
  color: var(--theme-text-secondary, #4a5568);
  font-style: italic;
}

/* Form Select Styles */
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--theme-text-primary, #1a202c);
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

.form-select:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-select option {
  padding: 8px;
  font-size: 0.95rem;
}

/* Toast Styles */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
}

.toast.success {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.toast.error {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
}

.toast-close {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.toast-close:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .settings-row {
    flex-direction: column;
    gap: 24px;
  }

  .settings-group {
    min-width: auto;
  }

  .card-content {
    padding: 20px;
  }

  .settings-header h2 {
    font-size: 2rem;
  }
}
</style>