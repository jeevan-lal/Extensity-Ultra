<template>
  <svg :width="width" :height="height" :style="style" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0.41,13.41L6,19L7.41,17.58L1.83,12M22.24,5.58L11.66,16.17L7.5,12L6.07,13.41L11.66,19L23.66,7M18,7L16.59,5.58L10.24,11.93L11.66,13.34L18,7Z" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  width?: string | number
  height?: string | number
  style?: string
}>()
</script>