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
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" :style="style" viewBox="0 0 24 24"><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
</template>