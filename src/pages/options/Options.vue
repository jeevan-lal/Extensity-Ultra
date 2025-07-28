<script setup lang="ts">

// @ts-ignore
import { detectBrowser, detectVersion } from "@src/lib/lib.ts";
import { ExtensionDriver } from '@ctechhindi/core-browser-extension/src/ExtensionDriver'
const ex = new ExtensionDriver(detectBrowser(), detectVersion());

// Components
import Sidebar from '@src/components/Sidebar.vue'

</script>

<template>
  <div class="options-container">
    <Sidebar :ex="ex" />
  </div>
</template>