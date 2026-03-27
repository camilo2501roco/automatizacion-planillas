<template>
  <Transition name="toast">
    <div v-if="notificationState.show" class="notification-toast-container" style="z-index: 9999">
      <div 
        :class="['alert', notificationState.type === 'success' ? 'alert-success' : 'alert-danger', 'custom-alert-toast', 'shadow-sm']" 
        role="alert"
      >
        <div class="d-flex align-items-center">
          <div class="alert-icon-wrap me-2">
            <svg v-if="notificationState.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <div class="alert-content">
            <span class="alert-message">{{ notificationState.message }}</span>
          </div>
        </div>
        <button type="button" class="btn-close-small" @click.stop="hideNotification" aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { notificationState, hideNotification } from '../plugins/notify';
</script>

<style scoped>
.notification-toast-container {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  max-width: 320px;
  width: auto;
}

.custom-alert-toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.05);
  margin-bottom: 0;
  position: relative;
  min-width: 280px;
}

.alert-success {
  background-color: #ecfdf5;
  border-left: 4px solid #10b981;
  color: #065f46;
}

.alert-danger {
  background-color: #fef2f2;
  border-left: 4px solid #ef4444;
  color: #991b1b;
}

.alert-icon-wrap {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-content {
  flex-grow: 1;
  padding-right: 1.5rem;
}

.alert-message {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.4;
}

.btn-close-small {
  background: transparent;
  border: none;
  padding: 4px;
  color: currentColor;
  opacity: 0.5;
  transition: opacity 0.2s;
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close-small:hover {
  opacity: 1;
}

/* Vue Transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}
</style>
