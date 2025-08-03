<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useAppStore } from '@src/store/appStore'

// Icons
import PrivacyActiveIcon from "@src/components/svg/Privacy-Active-Icon.vue"
import PrivacyIcon from "@src/components/svg/Privacy-Icon.vue"
import SettingsIcon from "@src/components/svg/Settings-Icon.vue"

const app = useAppStore()
const shouldShowDisable = ref<boolean>(false);

const props = defineProps<{
  ex: any
}>()

const toggleButtonClass = computed(() => {
  return !shouldShowDisable.value ? 'toggle-extension-danger' : 'toggle-extension-success'
})

const toggleButtonIcon = computed(() => {
  return !shouldShowDisable.value ? 'close' : 'check'
})

const handleSmartToggle = async () => {
  await app.smartToggleExtensions(props.ex)
  shouldShowDisable.value = await app.shouldShowDisableAll(props.ex)
}

const handleOpenOptionsPage = () => {
  props.ex.runtime.openOptionsPage()
}

watch(() => app.extensions, async () => {
  if (app.extensions.length > 0) {
    shouldShowDisable.value = await app.shouldShowDisableAll(props.ex)
  }
}, { deep: true })

onMounted(async () => {
  if (app.extensions.length > 0) {
    shouldShowDisable.value = await app.shouldShowDisableAll(props.ex)
  }
})
</script>

<template>
  <div class="popup-header border-bottom pb-2">
    <div class="d-flex align-items-center justify-content-between">
      <div class="header-content">
        <div class="logo-container">
          <img src="/icons/48x48.png" alt="Extensity Ultra" class="logo" />
        </div>
        <div class="title-container">
          <h6 class="mb-0 fw-bold">Extensity Ultra</h6>
          <small class="text-muted">Manage your extensions</small>
        </div>
      </div>
      <div class="d-flex gap-2">
        <div @click="handleSmartToggle" class="" :class="toggleButtonClass" :disabled="app.extensions.length === 0" title="Active/Inactive Privacy Mode">
          <PrivacyActiveIcon v-if="toggleButtonIcon === 'check'" width="25" height="25" />
          <PrivacyIcon v-else width="25" height="25" />
        </div>
        <div @click="handleOpenOptionsPage" class="options-page-button" title="Open Options Page">
          <SettingsIcon width="20" height="20" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.popup-header {
  padding: 0.75rem 1rem;
  background-color: var(--theme-bg-secondary);
  border-bottom: 1px solid var(--theme-border-primary);
  transition: var(--theme-transition-normal);
}

.btn-sm {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.d-flex.gap-2 {
  gap: 0.5rem;
}

h5,
h6 {
  color: var(--theme-text-primary);
  transition: var(--theme-transition-normal);
}

.text-muted {
  color: var(--theme-text-muted) !important;
  transition: var(--theme-transition-normal);
}

.toggle-extension-danger {
  background-color: var(--theme-bg-danger);
  color: var(--theme-text-danger);
  border-color: var(--theme-border-danger);
  cursor: pointer;
}

.toggle-extension-success {
  background-color: var(--theme-bg-success);
  color: var(--theme-text-success);
  cursor: pointer;
}

.options-page-button {
  background-color: var(--theme-bg-primary);
  color: var(--theme-text-primary);
  border-color: var(--theme-border-primary);
  cursor: pointer;
}
</style>