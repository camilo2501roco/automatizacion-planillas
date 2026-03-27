<template>
  <div class="certificates-page">

    <main class="page-main">
      <!-- Fila de Encabezado -->
      <div class="page-header row items-center no-wrap">
        <div class="logo-container-mini q-mr-md">
          <img src="@/assets/logo-sena.png" alt="SENA Logo" class="mini-logo" />
        </div>
        <div class="title-section">
          <h1 class="page-title">Reportes de Cumplimiento</h1>
          <p class="page-subtitle">Gestione, filtre y exporte certificados de seguridad social de contratistas</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-white" @click="handleExportPDF()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Exportar PDF
          </button>
          <button class="btn btn-green" @click="handleExportExcel">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            Exportar Excel
          </button>
          <button class="btn btn-blue" @click="handleExportDrive">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-8 10 8M12 22V12"/></svg>
            Sincronizar Drive
          </button>
        </div>
      </div>      <!-- Barra de Filtros -->
      <div class="filters-bar">
        <div class="filter-group">
          <!-- Filtro de Fecha -->
          <div class="filter-item-wrapper">
            <button class="filter-btn" @click="toggleDateMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              <span>{{ formattedDateRange }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            
            <div v-if="isDateMenuOpen" class="date-picker-dropdown">
              <div class="date-input-group">
                <label>Desde:</label>
                <input type="date" v-model="filterDateStart" class="date-input">
              </div>
              <div class="date-input-group">
                <label>Hasta:</label>
                <input type="date" v-model="filterDateEnd" class="date-input">
              </div>
              <div class="date-picker-footer">
                <button class="btn-clear-date" @click="clearDateRange">Limpiar</button>
                <button class="btn-apply-date" @click="isDateMenuOpen = false">Aplicar</button>
              </div>
            </div>
          </div>

          <!-- Filtro de Contratista -->
          <div class="filter-item-wrapper">
            <button class="filter-btn" @click="toggleContractorMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>{{ selectedContractor || 'Contratista' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron"><path d="m6 9 6 6 6-6"/></svg>
            </button>

            <div v-if="isContractorMenuOpen" class="contractor-picker-dropdown">
              <div class="search-input-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" v-model="searchContractorText" placeholder="Buscar contratista..." class="dropdown-search-input">
              </div>
              <div class="contractor-list">
                <button class="contractor-item" :class="{ active: !selectedContractor }" @click="selectContractor('')">
                  Todos los contratistas
                </button>
                <button 
                  v-for="name in filteredContractorNames" 
                  :key="name" 
                  class="contractor-item"
                  :class="{ active: selectedContractor === name }"
                  @click="selectContractor(name)"
                >
                  {{ name }}
                </button>
              </div>
            </div>
          </div>

          <!-- Filtro de Plataforma -->
          <div class="filter-item-wrapper">
            <button class="filter-btn" @click="togglePlatformMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span>{{ filterPlatform || 'Plataforma: Todas' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron"><path d="m6 9 6 6 6-6"/></svg>
            </button>

            <div v-if="isPlatformMenuOpen" class="platform-picker-dropdown">
              <button class="platform-item" :class="{ active: !filterPlatform }" @click="selectPlatform('')">
                Todas las plataformas
              </button>
              <button 
                v-for="plat in ['SOI', 'Asopagos', 'Compensar', 'Aportes']" 
                :key="plat" 
                class="platform-item"
                :class="{ active: filterPlatform === plat }"
                @click="selectPlatform(plat)"
              >
                {{ plat }}
              </button>
            </div>
          </div>

          <!-- Filtro de Estado -->
          <div class="filter-item-wrapper">
            <button class="filter-btn" @click="toggleStatusMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              <span>{{ filterStatus || 'Estado' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron"><path d="m6 9 6 6 6-6"/></svg>
            </button>

            <div v-if="isStatusMenuOpen" class="status-picker-dropdown">
              <button class="status-item" :class="{ active: !filterStatus }" @click="selectStatus('')">
                Todos los estados
              </button>
              <button 
                v-for="status in ['Aprobado', 'No aprobado']" 
                :key="status" 
                class="status-item"
                :class="{ active: filterStatus === status }"
                @click="selectStatus(status)"
              >
                {{ status }}s
              </button>
            </div>
          </div>
        </div>

        <!-- Barra de Búsqueda Global -->
        <div class="search-bar-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Buscar por nombre, cédula o área..." 
            class="global-search-input"
          >
        </div>

        <button class="btn-text" @click="clearAllFilters">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="14" y1="11" y2="17"/><line x1="14" x2="10" y1="11" y2="17"/></svg>
          Limpiar filtros
        </button>
      </div>

      <!-- Tarjeta de Tabla Principal -->
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>FECHA DE SOLICITUD</th>
              <th>ID (CÉDULA)</th>
              <th>NOMBRE</th>
              <th>CONTRATISTA</th>
              <th>PLATAFORMA</th>
              <th>ESTADO</th>
              <th>VISUALIZAR</th>
              <th>PLANILLA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedCertificates" :key="item.id">
              <td class="date-cell">{{ item.date }}</td>
              <td class="id-cell">{{ item.cedula }}</td>
              <td class="name-cell">{{ item.persona }}</td>
              <td>
                <div class="contractor-cell">
                  <div class="avatar-sm">{{ item.initials }}</div>
                  <span>{{ item.name }}</span>
                </div>
              </td>
              <td>
                <span :class="['platform-badge', item.platform.toLowerCase()]">
                  {{ item.platform }}
                </span>
              </td>
              <td>
                <div :class="['status-cell', item.status === 'Aprobado' ? 'success' : 'danger']">
                  <svg v-if="item.status === 'Aprobado'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {{ item.status }}
                </div>
              </td>
              <td>
                <button class="btn-visualize" @click="handleVisualize(item)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span>Visualizar</span>
                </button>
              </td>
              <td>
                <button class="btn-pdf-download" @click="handleExportPDF(item)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pie de Tabla/Paginación -->
        <div class="table-footer">
          <span class="results-info">
            Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} a {{ Math.min(currentPage * itemsPerPage, filteredCertificates.length) }} de {{ filteredCertificates.length }} resultados
          </span>
          <div class="pagination">
            <button class="pager-btn" :disabled="currentPage === 1" @click="prevPage">Anterior</button>
            <button 
              v-for="page in totalPages" 
              :key="page" 
              class="pager-btn" 
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            <button class="pager-btn" :disabled="currentPage === totalPages" @click="nextPage">Siguiente</button>
          </div>
        </div>
      </div>

      <!-- Cuadrícula de Estadísticas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon green">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">CERTIFICADOS APROBADOS</span>
            <span class="stat-value">{{ totalApproved }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8"/><path d="M8 13h6"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">NO APROBADOS / PENDIENTES</span>
            <span class="stat-value">{{ totalPending }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><polyline points="22 4 15 4 15 11"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">ÚLTIMA SINCRONIZACIÓN</span>
            <span class="stat-value">{{ lastSyncTime || 'No sincronizado' }}</span>
          </div>
        </div>
      </div>

      <!-- Modal de Visualización de Formulario -->
      <div v-if="isViewModalOpen" class="modal-overlay form-modal-overlay" @click.self="isViewModalOpen = false">
        <div class="form-modal-container">
          <SoiForm 
            v-if="selectedItemForView?.platform === 'SOI'" 
            :initialData="selectedItemForView" 
            :readOnly="true"
            @cancel="isViewModalOpen = false"
          />
          <AsopagosForm 
            v-else-if="selectedItemForView?.platform === 'Asopagos'" 
            :initialData="selectedItemForView" 
            :readOnly="true"
            @cancel="isViewModalOpen = false"
          />
          <CompensarForm 
            v-else-if="selectedItemForView?.platform === 'Compensar'" 
            :initialData="selectedItemForView" 
            :readOnly="true"
            @cancel="isViewModalOpen = false"
          />
          <AportesForm 
            v-else-if="selectedItemForView?.platform === 'Aportes'" 
            :initialData="selectedItemForView" 
            :readOnly="true"
            @cancel="isViewModalOpen = false"
          />
        </div>
      </div>

      <!-- Modal de Edición de Perfil -->
      <div v-if="isEditProfileModalOpen" class="modal-overlay" @click.self="closeEditProfileModal">
        <div class="modal-card">
          <div class="modal-header">
            <div class="modal-icon-circle" style="background-color: #fff7ed;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h3>Editar Perfil</h3>
            <p>Actualizar la información de tu cuenta.</p>
          </div>
          
          <div class="modal-body">
            <div class="form-group">
              <label>Nombre de Usuario</label>
              <div class="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" v-model="userName" placeholder="Nombre actual">
              </div>
            </div>

            <div class="form-group" style="margin-top: 1.25rem;">
              <label>Nueva Contraseña</label>
              <div class="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type="password" v-model="profileData.password" placeholder="Ingresa nueva contraseña">
              </div>
            </div>

            <div class="form-group" style="margin-top: 1.25rem;">
              <label>Confirmar Contraseña</label>
              <div class="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type="password" v-model="profileData.confirmPassword" placeholder="Confirma nueva contraseña">
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeEditProfileModal">Cancelar</button>
            <button class="btn-confirm" style="background-color: #f97316; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);" @click="saveProfileChanges">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de Sincronización de Drive -->
      <div v-if="isDriveModalOpen" class="modal-overlay" @click.self="closeDriveModal">
        <div class="modal-card">
          <div class="modal-header">
            <div class="modal-icon-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-8 10 8M12 22V12"/></svg>
            </div>
            <span class="proto-badge">Integración Drive</span>
            <h3>Sincronizar con Google Drive</h3>
            <p>Se generará un reporte consolidado y se subirá automáticamente a tu unidad de Drive.</p>
          </div>

          <div class="modal-body">
            <label>Cuenta de Destino</label>
            <div class="input-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input type="email" v-model="driveEmail" placeholder="correo@ejemplo.com">
            </div>
            <small>El reporte estará disponible en la carpeta "Certificados_SENA".</small>

            <div v-if="isSyncingToDrive" class="sync-progress">
              <div class="progress-bar-container">
                <div class="progress-bar-fill"></div>
              </div>
              <p>Sincronizando archivos...</p>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeDriveModal" :disabled="isSyncingToDrive">Cancelar</button>
            <button class="btn-confirm" @click="confirmDriveExport" :disabled="isSyncingToDrive">
              <span v-if="isSyncingToDrive" class="loading-spinner-small"></span>
              {{ isSyncingToDrive ? 'Sincronizando...' : 'Iniciar Sincronización' }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Pie de Página -->
    <footer class="page-footer">
      <div class="footer-left">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>© 2024 Gestión de Certificados de Seguridad Social. Todos los derechos reservados.</span>
      </div>
      <div class="footer-links">
        <a href="#">Términos de Servicio</a>
        <a href="#">Privacidad</a>
        <a href="#">Soporte Técnico</a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SoiForm from '../components/SoiForm.vue';
import AsopagosForm from '../components/AsopagosForm.vue';
import CompensarForm from '../components/CompensarForm.vue';
import AportesForm from '../components/AportesForm.vue';
import { useAuth } from '../composables/useAuth';
import { useCertificates } from '../composables/useCertificates';

const { isEditProfileModalOpen, profileData, handleEditProfile, closeEditProfileModal, saveProfileChanges } = useAuth();
const {
  isDateMenuOpen, isContractorMenuOpen, isPlatformMenuOpen, isStatusMenuOpen,
  filterDateStart, filterDateEnd, searchContractorText, selectedContractor,
  filterPlatform, filterStatus, searchQuery, currentPage, itemsPerPage,
  isDriveModalOpen, isSyncingToDrive, driveEmail, lastSyncTime,
  isViewModalOpen, selectedItemForView,
  formattedDateRange, filteredContractorNames, paginatedCertificates,
  totalPages, totalApproved, totalPending,
  toggleDateMenu, toggleContractorMenu, togglePlatformMenu, toggleStatusMenu,
  selectContractor, selectPlatform, selectStatus, clearDateRange, clearAllFilters,
  prevPage, nextPage, goToPage,
  fetchCertificates, handleVisualize, handleExportPDF, handleExportExcel, handleExportDrive, confirmDriveExport, closeDriveModal
} = useCertificates();

onMounted(() => {
  fetchCertificates();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.certificates-page {
  font-family: 'Inter', sans-serif;
  color: #0f172a;
}

/* Contenido Principal de la Página */
.page-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
}

.logo-container-mini {
  background: white;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  border: 1px solid #e2e8f0;
}

.mini-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.page-subtitle {
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.25rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-white {
  background-color: #f8fafc;
  color: #1e293b;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.btn-green {
  background-color: #22c55e;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.4);
}

.btn-blue {
  background-color: #4285F4;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(66, 133, 244, 0.4);
}

.nav-link {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  font-size: 0.85rem;
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



.nav-icons {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding-right: 1.25rem;
  border-right: 1px solid #f1f5f9;
}

.nav-icon-badge {
  position: relative;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
}

.nav-icon-badge:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.badge-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 9px;
  height: 9px;
  background-color: #ef4444;
  border: 1.5px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.2);
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

/* Contenido Principal de la Página */
.page-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 2rem; /* Reduced from 2rem 4rem */
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem; /* Coincide con hero-section */
}

.page-title {
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.25rem; /* Reduced from 0.75rem 1.5rem */
  border-radius: 10px; /* Reducido de 12px */
  font-weight: 700;
  font-size: 0.8rem; /* Reducido de 0.9rem */
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-white {
  background-color: #f8fafc;
  color: #1e293b;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
}

.btn-green {
  background-color: #22c55e;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.4);
}

.btn-blue {
  background-color: #4285F4;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(66, 133, 244, 0.4);
}

.loading-spinner-small {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}





@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Barra de Filtros */
.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background-color: #ffffff;
  padding: 0.85rem 1.25rem;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}

.filter-group {
  display: flex;
  gap: 1rem;
  flex-shrink: 0;
}

.filter-item-wrapper {
  position: relative;
}

.filter-btn {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 0.55rem 0.85rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.filter-btn:hover {
  background-color: #ffffff;
  border-color: #2e7d32;
  color: #2e7d32;
  box-shadow: 0 4px 12px rgba(57, 169, 0, 0.08);
  transform: translateY(-1px);
}

.filter-btn svg:first-child {
  color: #2e7d32;
  opacity: 0.8;
}

.filter-btn .chevron {
  color: #94a3b8;
  margin-left: auto;
}

/* Desplegable del Selector de Fecha */
.date-picker-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 260px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  padding: 1.25rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-input-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.date-input {
  padding: 0.6rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #334155;
  outline: none;
}

.date-input:focus {
  border-color: #2e7d32;
}

.date-picker-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.btn-clear-date {
  background: none;
  border: none;
  font-size: 0.8rem;
  font-weight: 600;
  color: #ef4444;
  cursor: pointer;
}

.btn-apply-date {
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

/* Desplegable del Filtro de Contratista */
.contractor-picker-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 280px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  padding: 0.75rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.search-input-wrapper {
  position: relative;
  margin-bottom: 0.5rem;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.dropdown-search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.85rem;
  outline: none;
  background-color: #f8fafc;
}

.dropdown-search-input:focus {
  border-color: #2e7d32;
  background-color: white;
}

.contractor-list {
  max-height: 200px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contractor-item {
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.contractor-item:hover {
  background-color: #f1f5f9;
}

.contractor-item.active {
  background-color: #f0fdf4;
  color: #16a34a;
}

/* Desplegable del Filtro de Plataforma */
.platform-picker-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 200px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  padding: 0.5rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.platform-item {
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.platform-item:hover {
  background-color: #f1f5f9;
}

.platform-item.active {
  background-color: #f0fdf4;
  color: #16a34a;
}

/* Desplegable del Filtro de Estado */
.status-picker-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 180px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  padding: 0.5rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.status-item {
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.status-item:hover {
  background-color: #f1f5f9;
}

.status-item.active {
  background-color: #f0fdf4;
  color: #16a34a;
}

/* Barra de Búsqueda Global */
.search-bar-wrapper {
  position: relative;
  flex: 1;
  min-width: 150px;
  max-width: 450px;
  margin: 0 1.25rem;
}

.search-bar-wrapper .search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
  transition: color 0.2s;
}

.global-search-input {
  width: 100%;
  padding: 0.55rem 1rem 0.55rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #1e293b;
  background-color: #f8fafc;
  outline: none;
  transition: all 0.2s ease;
}

.global-search-input:focus {
  border-color: #2e7d32;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(57, 169, 0, 0.1);
}

.global-search-input:focus + .search-icon {
  color: #2e7d32;
}

.global-search-input::placeholder {
  color: #94a3b8;
  font-weight: 500;
}

.btn-text {
  background: none;
  border: 1px solid transparent;
  padding: 0.55rem 0.85rem;
  border-radius: 10px;
  color: #64748b;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.6rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-text:hover {
  background-color: #fef2f2;
  color: #ef4444;
  border-color: #fee2e2;
  transform: translateY(-1px);
}

.btn-text svg {
  opacity: 0.7;
  transition: color 0.2s;
}

.btn-text:hover svg {
  color: #ef4444;
  opacity: 1;
}

/* Tarjeta de Tabla */
.table-card {
  background-color: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
  margin-bottom: 2.5rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 0.85rem 1.25rem; /* Reducido de 1.25rem 1.5rem */
  font-size: 0.7rem; /* Reducido de 0.75rem */
  font-weight: 800;
  color: #64748b;
  background-color: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  letter-spacing: 0.05em;
}

.data-table td {
  padding: 0.85rem 1.25rem; /* Reducido de 1.25rem 1.5rem */
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.85rem; /* Reducido de 0.9rem */
}

.id-cell {
  color: #64748b;
  font-weight: 600;
}

.name-cell {
  font-weight: 700;
  color: #1e293b;
}

.contractor-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 700;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  background-color: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
}

.platform-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
}

.platform-badge.soi { background-color: #eff6ff; color: #3b82f6; }
.platform-badge.asopagos { background-color: #f5f3ff; color: #8b5cf6; }
.platform-badge.compensar { background-color: #fff7ed; color: #ea580c; }
.platform-badge.aportes { background-color: #ecfdf5; color: #059669; }

.status-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
}

.status-cell.success { color: #16a34a; }
.status-cell.danger { color: #ef4444; }

.btn-visualize {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.btn-visualize:hover {
  color: #2e7d32;
}

.btn-pdf-download {
  background: #f1f5f9;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-pdf-download:hover {
  background-color: #e2e8f0;
  color: #0f172a;
}

/* Estilo del Pie de Tabla */
.table-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
}

.results-info {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.pagination {
  display: flex;
  gap: 0.5rem;
}

.pager-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  color: #1e293b;
}

.pager-btn.active {
  background-color: #22c55e;
  color: white;
  border-color: #22c55e;
}

/* Tarjetas de Estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background-color: white;
  padding: 1.25rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.stat-icon {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.green { background-color: #f0fdf4; color: #22c55e; }
.stat-icon.orange { background-color: #fffaf0; color: #f59e0b; }
.stat-icon.blue { background-color: #eff6ff; color: #3b82f6; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 900;
}

@media (max-width: 1024px) {
  .page-main { padding: 2rem; }
  .stats-grid { grid-template-columns: 1fr; }
}

/* Estilos de Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5000;
  animation: fadeIn 0.2s ease-out;
}

.modal-card {
  background: white;
  width: 100%;
  max-width: 420px;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
}

.modal-icon-circle {
  width: 60px;
  height: 60px;
  background-color: #f0f7ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.proto-badge {
  display: inline-block;
  background-color: #fee2e2;
  color: #ef4444;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modal-header h3 {
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.modal-header p {
  font-size: 0.9rem;
  color: #64748b;
}

.modal-body {
  margin-bottom: 2rem;
}

.modal-body label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon svg {
  position: absolute;
  left: 1rem;
  color: #94a3b8;
}

.input-with-icon input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 3rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.input-with-icon input:focus {
  outline: none;
  border-color: #4285F4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
}

.modal-body small {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.sync-progress {
  margin-top: 1.5rem;
  text-align: center;
}

.progress-bar-container {
  height: 6px;
  background-color: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4285F4, #34A853);
  width: 100%;
  animation: pulseProgress 2s infinite linear;
}

.sync-progress p {
  font-size: 0.85rem;
  color: #4285F4;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  gap: 1rem;
}

.btn-cancel {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background-color: #f8fafc;
}

.btn-confirm {
  flex: 2;
  padding: 0.8rem;
  border: none;
  background-color: #4285F4;
  color: white;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-confirm:hover {
  background-color: #3367d6;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}

.btn-confirm:disabled, .btn-cancel:disabled {
  opacity: 0.6;
  cursor:not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes pulseProgress {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Estilos Especiales del Modal de Visualización */
.form-modal-overlay {
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.form-modal-container {
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.form-modal-container::-webkit-scrollbar {
  width: 8px;
}

.form-modal-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.form-modal-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.form-modal-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
</style>
