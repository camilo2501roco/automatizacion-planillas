<template>
  <div class="dashboard-page">
    <!-- Contenido de la Página -->
    <main class="page-main">
      <section class="hero-section">
        <div class="hero-left">
          <div class="brand-container-dash q-mb-lg">
            <img src="@/assets/logo-sena.png" alt="SENA Logo" class="dash-logo" />
            <span class="brand-name-dash">SENA</span>
          </div>
          <h1 class="hero-title">Panel de Control de <br><span class="accent-text">Seguridad Social</span></h1>
          <p class="hero-desc">Gestione sus certificados y supervisiones de manera eficiente desde una <br>plataforma centralizada y segura.</p>
        </div>
      </section>



      <!-- Sección de Tarjetas de Acción -->
      <section class="action-cards-grid">
        <div class="action-card form-card">
          <div class="card-visual-side green">
            <div class="visual-icon-box green">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14.5 2 14.5 8 20 8"/><path d="M10 13l2 2 4-4"/></svg>
            </div>
          </div>
          <div class="card-body">
            <h2 class="card-title">Llenar Formulario</h2>
            <p class="card-text">Complete nuevas solicitudes de certificados de seguridad social de forma digital.</p>
            
            <!-- Lista de Características por Defecto -->
            <ul v-if="!showPlatforms" class="feature-list">
              <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> Validación automática de datos</li>
              <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> Guardado automático de borradores</li>
            </ul>

            <!-- Lista de Selección de Plataforma -->
            <div v-else class="platform-mini-list">
              <div 
                v-for="platform in platforms" 
                :key="platform.id"
                class="platform-item"
                :class="{ active: selectedPlatform === platform.id }"
                @click="selectedPlatform = platform.id"
              >
                <img :src="platform.image" :alt="platform.name" class="platform-mini-logo" />
                <span class="platform-mini-name">{{ platform.name }}</span>
                <div class="check-circle" v-if="selectedPlatform === platform.id">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
              </div>
            </div>

            <div class="card-footer-btns">
              <button class="btn-action primary" @click="handleFormAction" :disabled="showPlatforms && !selectedPlatform">
                {{ showPlatforms ? 'Continuar' : 'Nueva Solicitud' }} 
                <svg v-if="!showPlatforms" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
              <button v-if="showPlatforms" class="btn-back-icon" @click="showPlatforms = false">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="action-card supervisor-card">
          <div class="card-visual-side dark">
            <div class="visual-icon-box dark">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
          </div>
          <div class="card-body">
            <h2 class="card-title">Módulo Supervisor</h2>
            <p class="card-text">Revisión y aprobación de solicitudes pendientes. Control de calidad y seguimiento de procesos para personal autorizado.</p>
            <ul class="feature-list">
              <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> Gestión de colas de aprobación</li>
              <li><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> Firma digital centralizada</li>
            </ul>
            <button class="btn-action secondary" @click="router.push('/certificados')">
              Panel de Supervisión <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 16h10"/><path d="M7 12h10"/><path d="M7 8h10"/></svg>
            </button>
          </div>
        </div>
      </section>

      <section v-if="activeForm" class="form-embedded-container">
        <SoiForm v-if="activeForm === 'soi'" @cancel="activeForm = null" />
        <AsopagosForm v-if="activeForm === 'asopagos'" @cancel="activeForm = null" />
        <CompensarForm v-if="activeForm === 'compensar'" @cancel="activeForm = null" />
        <AportesForm v-if="activeForm === 'aportes'" @cancel="activeForm = null" />
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SoiForm from '../components/SoiForm.vue';
import AsopagosForm from '../components/AsopagosForm.vue';
import CompensarForm from '../components/CompensarForm.vue';
import AportesForm from '../components/AportesForm.vue';
import soiLogo from '../assets/platforms/soi_logo.png';
import asopagosLogo from '../assets/platforms/asopagos_logo.png';
import compensarLogo from '../assets/platforms/compensar_logo.png';
import aportesLogo from '../assets/platforms/aportes_logo.png';
import { notify } from '../plugins/notify';

const router = useRouter();
const activeForm = ref(null);
const showPlatforms = ref(false);
const selectedPlatform = ref(null);

const platforms = [
  { id: 'soi', name: 'Plataforma SOI', image: soiLogo },
  { id: 'asopagos', name: 'Plataforma ASOPAGOS', image: asopagosLogo },
  { id: 'compensar', name: 'Plataforma COMPENSAR', image: compensarLogo },
  { id: 'aportes', name: 'APORTES EN LÍNEA', image: aportesLogo }
];

const handleFormAction = () => {
  if (!showPlatforms.value) {
    showPlatforms.value = true;
  } else if (selectedPlatform.value) {
    activeForm.value = selectedPlatform.value;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.dashboard-container {
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
  min-height: 125vh; /* Compensates for zoom: 0.8 (100 / 0.8) */
  color: #0f172a;
  display: flex;
  flex-direction: column;
  zoom: 0.8;
}

/* Estilo de la Barra de Navegación */
.navbar {
  height: 52px; /* Reduced from 64px */
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem; /* Reduced from 4rem */
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-logo {
  width: 24px;
  height: 24px;
  background-color: #2e7d32;
  border-radius: 6px;
}

.brand-name {
  font-weight: 800;
  font-size: 1rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  font-size: 0.85rem; /* Reduced */
  transition: color 0.2s;
}

.nav-link:hover { color: #0f172a; }
.nav-link.active {
  color: #2e7d32;
  position: relative;
}
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 24px;
  height: 2px;
  background-color: #2e7d32;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f1f5f9;
  padding: 0.4rem 1rem;
  border-radius: 10px;
  width: 240px;
}

.search-bar input {
  background: none;
  border: none;
  font-size: 0.9rem;
  outline: none;
  width: 100%;
}

.nav-icons {
  display: flex;
  gap: 0.75rem;
  border-right: 1px solid #e2e8f0;
  padding-right: 1.5rem;
}

.icon-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.icon-btn:hover { background-color: #f1f5f9; color: #0f172a; }

.user-container {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  transition: background 0.2s;
}

.user-info:hover {
  background-color: #f1f5f9;
}

.user-text {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f172a;
}

.user-role {
  font-size: 0.75rem;
  color: #64748b;
}

/* Estilo del Menú Desplegable de Usuario */
.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 180px;
  background-color: white;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  padding: 0.5rem;
  z-index: 2000;
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  background: none;
  border: none;
  border-radius: 10px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background-color: #fef2f2;
}

.dropdown-divider {
  height: 1px;
  background-color: #f1f5f9;
  margin: 0.4rem 0.5rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: #ffedd5;
  color: #f97316;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Estilo de la Sección Hero */
.page-main {
  padding: 1.5rem 2rem; /* Reduced from 2rem 4rem */
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* Changed from center to align with logo */
  margin-bottom: 2rem;
}

.brand-container-dash {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dash-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
  background: white;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
}

.brand-name-dash {
  font-size: 1.25rem;
  font-weight: 900;
  color: #2e7d32;
  letter-spacing: 0.05em;
}

.hero-title {
  font-size: 1.6rem; /* Reduced from 2.25rem */
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.accent-text { color: #2e7d32; }

.hero-desc {
  color: #64748b;
  font-size: 0.85rem; /* Reduced */
  line-height: 1.6;
}

.hero-right {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.1rem; /* Reduced */
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.8rem; /* Reduced */
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-green { background-color: #2e7d32; color: white; }
.btn-green:hover { background-color: #2d7a34; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(57, 169, 0, 0.2); }

.btn-white { background-color: white; color: #0f172a; border: 1px solid #e2e8f0; }
.btn-white:hover { border-color: #cbd5e1; background-color: #f8fafc; transform: translateY(-2px); }



/* Estilo de las Tarjetas de Acción */
.action-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem; /* Reduced from 2.5rem */
  margin-bottom: 2rem; /* Reduced from 4.5rem */
}

.action-card {
  background-color: white;
  border-radius: 32px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
  border: 1px solid #e2e8f0;
  transition: transform 0.3s ease;
}

.action-card:hover { transform: translateY(-8px); }

.card-visual-side {
  flex: 0 0 100px; /* Reduced from 140px */
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-visual-side.green { background-color: #ecfdf5; }
.card-visual-side.dark { background-color: #f1f5f9; }

.visual-icon-box {
  width: 70px; /* Reduced from 110px */
  height: 70px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.visual-icon-box.green { background-color: #10b981; color: white; }
.visual-icon-box.dark { background-color: #0f172a; color: white; }

.card-body {
  padding: 1.25rem; /* Reduced from 2rem */
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.25rem; /* Reduced from 1.75rem */
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.card-text {
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 1rem;
  font-size: 0.85rem; /* Reduced */
}

.feature-list {
  list-style: none;
  padding: 0;
  margin-bottom: 1rem; /* Reduced */
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Reduced */
}

/* Mini Lista de Plataformas */
.platform-mini-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.platform-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.platform-item:hover {
  border-color: #2e7d32;
  background-color: #f0fdf4;
}

.platform-item.active {
  border-color: #2e7d32;
  background-color: #f0fdf4;
  box-shadow: 0 0 0 1px #2e7d32;
}

.platform-mini-logo {
  width: 24px;
  height: 24px;
  object-fit: contain;
  border-radius: 4px;
}

.platform-mini-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #334155;
}

.check-circle {
  position: absolute;
  right: 0.75rem;
  width: 18px;
  height: 18px;
  background-color: #2e7d32;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-footer-btns {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-back-icon {
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #64748b;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back-icon:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: #334155;
}

.btn-action {
  padding: 0.6rem 1.25rem; /* Reduced */
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.85rem; /* Reduced */
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  border: none;
  width: fit-content;
  transition: all 0.2s;
}

.btn-action.primary { background-color: #2e7d32; color: white; }
.btn-action.primary:hover { background-color: #2d7a34; box-shadow: 0 10px 25px rgba(57, 169, 0, 0.25); }

.btn-action.secondary { background-color: #0f172a; color: white; }
.btn-action.secondary:hover { background-color: #1e293b; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.25); }

/* Contenedor de Formulario Embebido */
.form-embedded-container {
  background-color: white;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
  padding: 0;
  overflow: hidden;
}

/* Estilo del Pie de Página */
.page-footer {
  margin-top: auto;
  padding: 3rem 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-top: 1px solid #f1f5f9;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-links a {
  text-decoration: none;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s;
}

.footer-links a:hover { color: #0f172a; }

@media (max-width: 1200px) {
  .hero-title { font-size: 2.5rem; }
  .action-cards-grid { grid-template-columns: 1fr; }
}

@media (max-width: 900px) {
  .stats-grid { grid-template-columns: 1fr; }
  .navbar { padding: 0 2rem; }
  .page-main { padding: 2rem; }
  .hero-section { flex-direction: column; gap: 2rem; }
  .nav-links { display: none; }
}
</style>
