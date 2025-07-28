<template>
  <svg :width="width" :height="height" :style="style" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg">
    <path d="M26,4H6A2,2,0,0,0,4,6V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6A2,2,0,0,0,26,4ZM6,26V6H26V26Z" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  width?: string | number
  height?: string | number
  style?: string
}>()
</script>