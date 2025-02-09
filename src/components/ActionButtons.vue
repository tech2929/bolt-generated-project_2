<script setup lang="ts">
import { ref } from 'vue'
import { downloadCurrentProject } from '../services/fileService'

const exportMenu = ref(false)
const isDownloading = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const downloadProject = async () => {
  try {
    isDownloading.value = true;
    const response = await fetch('/download-zip');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    // Use window.open with data URL for download
    window.open(url, '_blank');
    URL.revokeObjectURL(url);
    showError.value = false;
  } catch (error) {
    console.error('Failed to download project:', error);
    errorMessage.value = 'Failed to download project. Please try again.';
    showError.value = true;
  } finally {
    isDownloading.value = false;
    exportMenu.value = false;
  }
}

const openInStackBlitz = () => {
  window.open('https://stackblitz.com/', '_blank')
}

const connectToSupabase = () => {
  window.open('https://supabase.com/dashboard/sign-in?returnTo=%2Fprojects', '_blank');
}

const deploy = () => {
  window.open('https://app.netlify.com/', '_blank');
}
</script>

<template>
  <div class="d-flex align-center gap-2">
    <!-- Export Button with Menu -->
    <v-menu
      v-model="exportMenu"
      :close-on-content-click="true"
      location="bottom"
      offset="5"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          class="rounded-sm"
          color="rgb(32, 32, 32)"
          variant="flat"
          height="32"
        >
          <v-icon size="16" icon="mdi-export" class="mr-1"></v-icon>
          Export
          <v-icon size="14" icon="mdi-chevron-down" class="ml-1"></v-icon>
        </v-btn>
      </template>

      <v-list class="custom-menu" bg-color="rgb(32, 32, 32)">
        <v-list-item
          @click="downloadProject"
          :disabled="isDownloading"
          class="custom-menu-item"
          height="36"
        >
          <template v-slot:prepend>
            <v-icon
              v-if="!isDownloading"
              size="18"
              class="mr-2"
              icon="mdi-download"
            ></v-icon>
            <v-progress-circular
              v-else
              indeterminate
              size="16"
              width="2"
              color="white"
              class="mr-2"
            />
          </template>
          <v-list-item-title class="text-body-2">
            Download Project
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          @click="openInStackBlitz"
          class="custom-menu-item"
          height="36"
        >
          <template v-slot:prepend>
            <v-icon size="18" class="mr-2" icon="mdi-lightning-bolt"></v-icon>
          </template>
          <v-list-item-title class="text-body-2">
            Open in StackBlitz
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Connect to Supabase Button -->
    <v-btn
      class="rounded-sm"
      color="rgb(32, 32, 32)"
      variant="flat"
      height="32"
      @click="connectToSupabase"
    >
      <v-icon size="16" icon="mdi-database" class="mr-1"></v-icon>
      Connect to Supabase
    </v-btn>

    <!-- Deploy Button -->
    <v-btn
      class="rounded-sm"
      color="#1565C0"
      variant="flat"
      height="32"
      @click="deploy"
    >
      <v-icon size="16" icon="mdi-rocket-launch" class="mr-1"></v-icon>
      Deploy
    </v-btn>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showError"
      color="error"
      timeout="3000"
      location="bottom"
    >
      {{ errorMessage }}
    </v-snackbar>
  </div>
</template>

<style scoped>
.custom-btn {
  color: white !important;
  border: none !important;
}

.export-btn {
}

.supabase-btn {
}

.deploy-btn {
  background-color: #1565C0;
}

.custom-menu {
  border-radius: 6px;
}

.custom-menu-item {
  color: white !important;
  font-size: 14px;
  font-weight: 400;
}
</style>
