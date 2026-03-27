<template>
  <div class="aportes-form-embedded">
    <div class="form-inner-header">
      <div class="header-titles">
        <h2 class="embedded-title">Solicitud de Certificado</h2>
        <h3 class="embedded-subtitle">APORTES EN LÍNEA</h3>
      </div>
      <button class="btn-close" @click="$emit('cancel')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>

    <div class="form-content">
      <!-- Section: Contratista -->
      <section class="form-section">
        <div class="section-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <h3 class="section-title">DATOS DEL CONTRATISTA</h3>
        </div>

        <div class="form-box">
          <div class="form-grid">
            <div class="input-group col-4">
              <label>Tipo de Documento</label>
              <div class="select-wrapper">
                <select v-model="formData.documentType" :disabled="readOnly">
                  <option v-for="type in documentTypes" :key="type.value" :value="type.value">
                    {{ type.label }} ({{ type.value }})
                  </option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

            <div class="input-group col-8">
              <label>Número de Documento</label>
              <input type="text" v-model="formData.documentNumber" placeholder="Ej: 1023456789" :disabled="readOnly" />
            </div>

            <div class="input-group col-6">
              <label>Nombre Completo</label>
              <input type="text" v-model="formData.fullName" placeholder="Ingrese nombres e apellidos" :disabled="readOnly" />
            </div>

            <div class="input-group col-6">
              <label>EPS</label>
              <div class="select-wrapper">
                <select v-model="formData.eps" :disabled="readOnly">
                  <option value="" disabled>Seleccione su EPS...</option>
                  <option v-for="eps in epsCatalogGeneral" :key="eps" :value="eps">{{ eps }}</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section: Detalle Aportes en Línea -->
      <section class="detail-box">
        <div class="section-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="section-icon"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
          <h3 class="section-title">DETALLE DE SOLICITUD - APORTES EN LÍNEA</h3>
        </div>
        
        <div class="form-grid">
          <!-- Fecha de expedición -->
          <div class="input-group col-12">
            <label>Fecha de expedición</label>
            <input type="date" v-model="formData.issueDate" :disabled="readOnly" />
          </div>

          <!-- Rango Desde -->
          <div class="input-group col-6">
            <label>Año desde</label>
            <div class="select-wrapper">
              <select v-model="formData.yearFrom" :disabled="readOnly">
                <option v-for="y in yearsList" :key="y" :value="y">{{ y }}</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          <div class="input-group col-6">
            <label>Mes desde</label>
            <div class="select-wrapper">
              <select v-model="formData.monthFrom" :disabled="readOnly">
                <option v-for="m in monthsList" :key="m.value" :value="m.value">{{ m.name }}</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          <!-- Rango Hasta -->
          <div class="input-group col-6">
            <label>Año hasta</label>
            <div class="select-wrapper">
              <select v-model="formData.yearTo" :disabled="readOnly">
                <option v-for="y in yearsList" :key="y" :value="y">{{ y }}</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
          <div class="input-group col-6">
            <label>Mes hasta</label>
            <div class="select-wrapper">
              <select v-model="formData.monthTo" :disabled="readOnly">
                <option v-for="m in monthsList" :key="m.value" :value="m.value">{{ m.name }}</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>

          <!-- Tipo Afiliado -->
          <div class="input-group col-12">
            <label>Tipo afiliado</label>
            <div class="select-wrapper">
              <select v-model="formData.affiliateType" :disabled="readOnly">
                <option value="independiente">Independiente</option>
                <option value="contratista">Contratista</option>
                <option value="empleado">Empleado</option>
                <option value="pensionado">Pensionado</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div class="supervisor-selection-area">
          <div class="input-group">
            <div class="label-with-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              <label>Supervisor Encargado</label>
            </div>
            <div class="select-wrapper">
              <select v-model="formData.supervisorId" :disabled="readOnly || loadingSupervisors">
                <option value="" disabled>{{ loadingSupervisors ? 'Cargando supervisores...' : 'Seleccione el supervisor...' }}</option>
                <option v-for="s in supervisors" :key="s._id" :value="s._id">{{ s.name }}</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="chevron"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
      </section>

      <div class="form-actions" v-if="!readOnly">
        <button class="btn-send" @click="handleSend" :disabled="sending">
          <span v-if="sending" class="spinner-small"></span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="send-icon"><path d="m22 2-7 20-4-9-9-4Z"/></svg>
          {{ sending ? 'Enviando...' : 'Enviar Solicitud' }}
        </button>
        <button class="btn-cancel" @click="$emit('cancel')" :disabled="sending">Cancelar</button>
      </div>
      <div class="form-actions" v-else>
        <button class="btn-cancel" style="flex: 1;" @click="$emit('cancel')">Cerrar Vista</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, defineEmits, defineProps, onMounted } from 'vue';
import { notify } from '../plugins/notify';
import { reportService } from '../services/reportService';
import { supervisorService } from '../services/supervisorService';
import { documentTypes, epsCatalogGeneral, monthsList, yearsList, fallbackSupervisors } from '../static/options';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  readOnly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['cancel', 'success']);

const formData = reactive({
  documentType: 'CC',
  documentNumber: '',
  fullName: '',
  eps: '',
  platform: 'aportes_en_linea',
  issueDate: new Date().toISOString().split('T')[0],
  yearFrom: new Date().getFullYear(),
  monthFrom: 1,
  yearTo: new Date().getFullYear(),
  monthTo: new Date().getMonth() + 1,
  affiliateType: 'contratista',
  supervisorId: ''
});

const supervisors = ref([]);
const loadingSupervisors = ref(false);
const sending = ref(false);

const fetchSupervisors = async () => {
  loadingSupervisors.value = true;
  try {
    const data = await supervisorService.getSupervisors();
    supervisors.value = data;
  } catch (error) {
    console.error('Error fetching supervisors, using fallback:', error);
    supervisors.value = fallbackSupervisors;
  } finally {
    loadingSupervisors.value = false;
  }
};

onMounted(() => {
  fetchSupervisors();

  if (props.initialData && Object.keys(props.initialData).length > 0) {
    formData.documentType = props.initialData.documentType || 'CC';
    formData.documentNumber = props.initialData.documentNumber || props.initialData.cedula || '';
    formData.fullName = props.initialData.fullName || props.initialData.persona || '';
    formData.eps = props.initialData.eps || '';
    formData.supervisorId = props.initialData.supervisorId || '';

    if (props.initialData.platformData) {
      formData.issueDate = props.initialData.platformData.fechaExpedicion?.replace(/\//g, '-') || '';
      formData.yearFrom = props.initialData.platformData.anioIni || 2024;
      formData.monthFrom = props.initialData.platformData.mesIni || 1;
      formData.yearTo = props.initialData.platformData.anioFin || 2024;
      formData.monthTo = props.initialData.platformData.mesFin || 12;
    }
  }
});

const handleSend = async () => {
  if (!formData.documentNumber || !formData.fullName || !formData.eps || !formData.supervisorId) {
    notify('Por favor complete todos los campos obligatorios.', 'error');
    return;
  }

  sending.value = true;
  try {
    const payload = {
      documentType: formData.documentType,
      documentNumber: formData.documentNumber,
      fullName: formData.fullName,
      eps: formData.eps,
      supervisorId: formData.supervisorId,
      platform: 'aportes_en_linea',
      platformData: {
        mesIni: String(formData.monthFrom),
        anioIni: String(formData.yearFrom),
        mesFin: String(formData.monthTo),
        anioFin: String(formData.yearTo),
        fechaExpedicion: formData.issueDate.replace(/-/g, '/'),
        tipoAfiliado: formData.affiliateType
      }
    };

    await reportService.createReport(payload);
    notify('Solicitud enviada al servidor correctamente.');
    emit('success', payload);
  } catch (error) {
    notify('Error al conectar con el servidor', 'error');
  } finally {
    sending.value = false;
  }
};
</script>

<style scoped>
.aportes-form-embedded {
  background-color: #f8fafc;
  border-radius: 20px;
  overflow: hidden;
}

.form-inner-header {
  padding: 1rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.embedded-title {
  font-size: 1rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.embedded-subtitle {
  font-size: 0.7rem;
  font-weight: 700;
  color: #2e7d32;
  margin: 0;
  letter-spacing: 0.05em;
}

.btn-close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
}

.btn-close:hover {
  background-color: #f1f5f9;
  color: #334155;
}

.form-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-box, .detail-box {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
}

.supervisor-selection-area {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #e2e8f0;
}

.label-with-icon {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.label-with-icon label {
  margin-bottom: 0;
  color: #334155;
  font-weight: 700;
}

.supervisor-selection-area .select-wrapper select {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  font-weight: 500;
}

.supervisor-selection-area .select-wrapper select:focus {
  border-color: #2e7d32;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(57, 169, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-8 { grid-column: span 8; }
.col-12 { grid-column: span 12; }

.section-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
}

.section-title {
  font-size: 0.75rem;
  font-weight: 800;
  color: #475569;
  margin: 0;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.input-group label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
}

.input-group input, 
.input-group select {
  padding: 0.55rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: white;
  font-size: 0.85rem;
  color: #1e293b;
  outline: none;
  width: 100%;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper select {
  appearance: none;
  cursor: pointer;
}

.select-wrapper .chevron {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #94a3b8;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.btn-send {
  flex: 1;
  background-color: #2e7d32;
  color: white;
  padding: 0.6rem;
  border-radius: 8px;
  font-weight: 800;
  font-size: 0.8rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-send:hover {
  background-color: #2d7a34;
}

.btn-cancel {
  flex: 1;
  background-color: #f1f5f9;
  color: #64748b;
  padding: 0.6rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.8rem;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background-color: #fee2e2;
  color: #dc2626;
  border-color: #fecaca;
}
</style>
