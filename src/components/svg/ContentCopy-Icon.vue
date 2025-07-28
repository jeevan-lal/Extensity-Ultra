<script setup lang="ts">

// https://vuejs.org/guide/typescript/composition-api#typescript-with-composition-api
// defineProps<{ width: string }>();
defineProps({
  width: { type: String, required: false, default: "20" },
  height: { type: String, required: false, default: "20"},
  style: { type: Object, required: false },
})

</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" :style="style" viewBox="0 0 24 24"><path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" /></svg>
</template>