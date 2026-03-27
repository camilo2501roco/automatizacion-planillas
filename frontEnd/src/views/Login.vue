<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'

const { login } = useAuth()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  await login(email.value, password.value)
  loading.value = false
}
</script>

<template>
  <div class="login-card fade-in">
    <!-- Lado Izquierdo: Información (Verde) -->
    <div class="login-info">
      <div class="info-overlay"></div>
      <div class="info-content slide-up">
        <div class="status-badge">
          <span class="pulse"></span> Sistema Seguro
        </div>
        <h2 class="info-title">Acceso Seguro para Supervisores</h2>
        <p class="info-description">
          Gestione, valide y audite certificados de seguridad social de manera eficiente dentro del ecosistema institucional.
        </p>
        
        <ul class="features-list">
          <li>
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <span>Encriptación nivel gubernamental</span>
          </li>
          <li>
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
            </div>
            <span>Cumplimiento normativo 2024</span>
          </li>
          <li>
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            </div>
            <span>Auditoría en tiempo real</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Lado Derecho: Formulario (Blanco) -->
    <div class="login-form-container">
      <form @submit.prevent="handleLogin" class="login-form slide-up-delayed">
        <div class="form-header">
          <h2 class="form-title">Bienvenido</h2>
          <p class="form-subtitle">Ingrese sus credenciales de acceso</p>
        </div>

        <div class="login-input-group">
          <label>Correo o Usuario</label>
          <div class="login-input-wrapper">
            <div class="field-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <input 
              v-model="email" 
              type="text" 
              placeholder="ejemplo@organizacion.gob"
              required
            />
          </div>
        </div>

        <div class="login-input-group">
          <label>Contraseña</label>
          <div class="login-input-wrapper">
            <div class="field-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="••••••••••••"
              required
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            </button>
          </div>
        </div>

        <div class="form-actions">
          <label class="checkbox-container">
            <input type="checkbox" v-model="rememberMe">
            <span class="checkmark"></span>
            Recordarme
          </label>
          <a href="#" class="forgot-link">¿Olvidó su contraseña?</a>
        </div>

        <button type="submit" class="submit-btn primary-pulse" :disabled="loading">
          <span>{{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}</span>
          <span v-if="loading" class="spinner-small" style="margin-left: 10px;"></span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>

        <div class="security-disclaimer">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Acceso restringido para personal autorizado.
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-card {
  width: 100%;
  max-width: 820px;
  height: 520px;
  display: flex;
  background: transparent;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-info {
  flex: 4;
  background: linear-gradient(145deg, #1e5223 0%, #2d7a34 100%);
  color: white;
  padding: 2.5rem;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.info-overlay {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(0,0,0,0.1), transparent), radial-gradient(circle at 20% 20%, rgba(255,255,255,0.05), transparent 40%);
}

.info-content {
  position: relative;
  z-index: 2;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.pulse {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4);
  animation: pulse-green 2s infinite;
}

.info-title {
  font-size: 1.85rem;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1.2rem;
  letter-spacing: -0.02em;
}

.info-description {
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 2rem;
  font-weight: 400;
}

.features-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.features-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.95);
}

.feature-icon {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 10px;
  display: flex;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.features-list li:hover .feature-icon {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.2);
}

.login-form-container {
  flex: 6;
  padding: 2.5rem 3.5rem;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(25px);
}

.login-form {
  width: 100%;
}

.form-header {
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.4rem;
  letter-spacing: -0.01em;
}

.form-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.88rem;
  font-weight: 500;
}

.login-input-group {
  margin-bottom: 1.4rem;
}

.login-input-group label {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.6rem;
}

.login-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 1.1rem;
  color: #94a3b8;
  display: flex;
  transition: color 0.3s;
}

.login-input-wrapper input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 3.2rem;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 500;
  background-color: #f8fafc;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #1e293b;
}

.login-input-wrapper input::placeholder {
  color: #cbd5e1;
}

.login-input-wrapper input:focus {
  outline: none;
  border-color: #2d7a34;
  background-color: white;
  box-shadow: 0 0 0 4px rgba(45, 122, 52, 0.08);
}

.login-input-wrapper input:focus + .field-icon,
.login-input-wrapper:focus-within .field-icon {
  color: #2d7a34;
}

.toggle-password {
  position: absolute;
  right: 1.1rem;
  background: none;
  color: #94a3b8;
  display: flex;
  padding: 0.2rem;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #2d7a34;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
}

.checkbox-container input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #2d7a34;
}

.forgot-link {
  font-size: 0.85rem;
  color: #4ade80;
  font-weight: 700;
  transition: all 0.2s;
  text-decoration: none;
}

.forgot-link:hover {
  color: #22c55e;
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background-color: #2d7a34;
  color: white;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.submit-btn:hover {
  background-color: #1e5223;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(45, 122, 52, 0.25);
}

.submit-btn:active {
  transform: translateY(0);
}

.security-disclaimer {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

@media (max-width: 900px) {
  .login-card {
    flex-direction: column;
    height: auto;
    max-width: 450px;
  }
}
</style>
