<template>
  <svg :width="width" :height="height" :style="style" viewBox="0 -1.5 27 27" xmlns="http://www.w3.org/2000/svg">
    <path d="m24 24h-24v-24h18.4v2.4h-16v19.2h20v-8.8h2.4v11.2zm-19.52-12.42 1.807-1.807 5.422 5.422 13.68-13.68 1.811 1.803-15.491 15.491z" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  width?: string | number
  height?: string | number
  style?: string
}>()
</script>