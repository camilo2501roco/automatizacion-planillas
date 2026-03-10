<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- Logo simulado o título -->
        <q-btn flat dense round icon="shield" aria-label="Logo" />

        <q-toolbar-title>
          Certificados de Seguridad Social
        </q-toolbar-title>

        <div>V1.0.0</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <!-- Transition for smooth navigation -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Layout base
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
