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
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :width="width" :height="height" :style="style"><path d="M13.04 19.61C12.67 18.55 11.68 17.8 10.5 17.8C9 17.8 7.8 19 7.8 20.5V22H4C2.9 22 2 21.11 2 20V16.2H3.5C5 16.2 6.2 15 6.2 13.5S5 10.8 3.5 10.8H2V7C2 5.9 2.9 5 4 5H8V3.5C8 2.12 9.12 1 10.5 1S13 2.12 13 3.5V5H17C18.1 5 19 5.89 19 7V11H20.5C21.88 11 23 12.12 23 13.5C23 13.82 22.94 14.12 22.83 14.39C21.79 13.53 20.46 13 19 13C15.69 13 13 15.69 13 19C13 19.2 13 19.41 13.04 19.61M21.12 15.46L19 17.59L16.88 15.46L15.47 16.88L17.59 19L15.47 21.12L16.88 22.54L19 20.41L21.12 22.54L22.54 21.12L20.41 19L22.54 16.88L21.12 15.46Z" /></svg>
</template>