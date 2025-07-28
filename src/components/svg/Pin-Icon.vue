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
  <svg xmlns="http://www.w3.org/2000/svg" :width="width" :height="height" :style="style" viewBox="0 0 24 24"><path d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z" /></svg>
</template>