<template>
  <svg :width="width" :height="height" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  width?: string | number
  height?: string | number
}>()
</script> 