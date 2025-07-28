<script setup lang="ts">
// Lib
import { truncate } from "@ctechhindi/tiny-js-library/src/String"
// Extension Lib
import { detectBrowser, detectVersion } from "@src/lib/lib.ts";
import { ExtensionDriver } from '@ctechhindi/core-browser-extension/src/ExtensionDriver'
const ex = new ExtensionDriver(detectBrowser(), detectVersion());
// Store
import { useAppStore } from '@src/store/appStore'
// Icons
import OpenInNewIcon from "@src/components/svg/OpenInNew-Icon.vue"
// import PinIcon from "@src/components/svg/Pin-Icon.vue"
import PuzzleOutlineIcon from "@src/components/svg/PuzzleOutline-Icon.vue"
import CogIcon from "@src/components/svg/Cog-Icon.vue"
import SecurityIcon from "@src/components/svg/Security-Icon.vue"
import ApplicationCogOutlineIcon from "@src/components/svg/ApplicationCogOutline-Icon.vue"
import ContentCopyIcon from "@src/components/svg/ContentCopy-Icon.vue"
import PuzzleRemoveIcon from "@src/components/svg/PuzzleRemove-Icon.vue"

// Store
const app = useAppStore()

defineProps<{ extensions: ExtensionInfo[] }>();
</script>

<template>
  <div class="accordion" id="accordion-extensions">
    <div v-if="extensions && extensions.length > 0" class="accordion-item ps-2" v-for="(item) in extensions" :key="item.id">
      <div class="accordion-header">
        <div class="d-flex">
          <div>
            <input class="form-check-input me-1" type="checkbox" @click="app.toggleExtensionOn(ex, item.id, !item.enabled)" :checked="item.enabled">
          </div>
          <div class="">
            <img class="extension-icon" v-if="item.icons" :src="item.icons[0].url" :alt="item.name">
            <PuzzleOutlineIcon v-else width="17" height="17" />
            {{ truncate(item.name, 35) }}
            <span v-if="item.installType === 'development'" class="badge development-extension-badge">{{ item.version }}</span>
            <span v-else class="badge normal-extension-badge">{{ item.version }}</span>
          </div>
          <div class="ms-auto">
            <button class="accordion-button collapsed extension-action-accordion" type="button" data-bs-toggle="collapse" :data-bs-target="'#' + item.id" aria-expanded="false" :aria-controls="item.id">
            </button>
          </div>
        </div>
      </div>
      <div :id="item.id" class="accordion-collapse collapse" data-bs-parent="#accordion-extensions">
        <div class="accordion-body" style="padding: 8px 0px 7px;">
          <div class="btn-group btn-group-sm" role="group" aria-label="Group one">
            <!-- Open Extension Link -->
            <a target="_blank" :href="item.homepageUrl" :class="{ disabled: item.installType == 'development' }" data-bs-toggle="tooltip" data-bs-title="Open Link" type="button" class="btn btn-secondary open-link-btn">
              <OpenInNewIcon width="19" height="19" style="fill: white;" />
            </a>
            <!-- Copy Extension Link URL -->
            <button @click="app.setCopyValueOnce(item.id)" :class="{ disabled: item.installType == 'development' }" data-bs-toggle="tooltip" data-bs-title="Copy Link" type="button" class="btn btn-secondary copy-link-btn">
              <ContentCopyIcon width="18" height="18" style="fill: white;" />
            </button>
          </div>
          <div class="btn-group btn-group-sm ms-2" role="group" aria-label="Group Second">
            <!-- Options Page -->
            <button @click="app.openOptionPage(ex, item)" :class="{ disabled: !item.optionsUrl }" data-bs-toggle="tooltip" data-bs-title="Option Page" type="button" class="btn btn-secondary option-page-btn">
              <ApplicationCogOutlineIcon width="20" height="20" style="fill: white;" />
            </button>
            <!-- Open Manage Extension Page -->
            <button @click="app.openManageExtensionPage(ex, item)" data-bs-toggle="tooltip" data-bs-title="Manage Extension Page" type="button" class="btn btn-secondary manage-extension-page-btn">
              <CogIcon width="20" height="20" style="fill: white;" />
            </button>
            <!-- Open Web Permissions Page -->
            <button @click="app.openPermissionPage(ex, item)" data-bs-toggle="tooltip" data-bs-title="Web Permissions Page" type="button" class="btn btn-secondary permissions-extension-page-btn">
              <SecurityIcon width="20" height="20" style="fill: white;" />
            </button>
          </div>
          <div class="btn-group btn-group-sm ms-2" role="group" aria-label="Group Third">
            <!-- Pin -->
            <!-- <button @click="app.pinExtension(ex, item)" data-bs-toggle="tooltip" data-bs-title="Pin"
              type="button" class="btn btn-secondary pin-btn">
              <PinIcon width="20" height="20" style="fill: white;" />
            </button> -->
            <!-- Remove Extension -->
            <button data-bs-toggle="tooltip" data-bs-title="Remove Extension" type="button" class="btn btn-secondary btn-danger">
              <PuzzleRemoveIcon width="20" height="20" style="fill: white;" />
            </button>
            <!-- <div class="btn-group" role="group">
              <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
                aria-expanded="false">
                More
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Move</a></li>
                <li><a class="dropdown-item" href="#">Share</a></li>
                <li><a class="dropdown-item" href="#">Archive</a></li>
              </ul>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="text-center" v-else>
      <div class="alert alert-danger" role="alert">Extension and App Not Found</div>
    </div>
  </div>
</template>