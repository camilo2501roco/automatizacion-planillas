<template>
  <q-page class="flex flex-center bg-grey-2 q-pa-md">
    <q-card class="soi-card" flat bordered>
      
      <q-card-section class="bg-green-1">
        <div class="text-h5 text-weight-bold text-dark q-mb-xs">Consulta de Planilla - SOI</div>
        <div class="text-grey-7">Ingrese la información requerida para consultar el estado de sus aportes.</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <q-form @submit="onSubmit" class="q-gutter-md">
          
          <!-- Datos del aportante -->
          <div class="section-title text-weight-bold q-mb-md">
            <q-icon name="apartment" color="primary" size="sm" class="q-mr-sm" />
            Datos del aportante
          </div>
          
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select 
                outlined 
                v-model="form.aportanteTipoDoc" 
                :options="['CC', 'NIT', 'CE']" 
                label="Tipo de documento" 
                color="primary"
                dense
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input 
                outlined 
                v-model="form.aportanteNumDoc" 
                label="No. de documento" 
                color="primary"
                dense
              />
            </div>
          </div>

          <q-separator class="q-my-lg" />

          <!-- Información del cotizante -->
           <div class="section-title text-weight-bold q-mb-md">
            <q-icon name="person" color="primary" size="sm" class="q-mr-sm" />
            Información del cotizante
          </div>
          
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select 
                outlined 
                v-model="form.cotizanteTipoDoc" 
                :options="['CC', 'CE', 'TI']" 
                label="Tipo de documento" 
                color="primary"
                dense
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input 
                outlined 
                v-model="form.cotizanteNumDoc" 
                label="No. de documento" 
                color="primary"
                dense
              />
            </div>

            <div class="col-12">
              <q-input 
                outlined 
                v-model="form.fullName" 
                label="Nombre Completo" 
                color="primary"
                dense
              />
            </div>
            
            <div class="col-12">
               <q-select 
                outlined 
                v-model="form.eps" 
                :options="['SURA', 'SANITAS', 'NUEVA EPS', 'COMPENSAR EPS']" 
                label="EPS" 
                color="primary"
                dense
              />
            </div>

            <div class="col-12 col-md-6">
              <q-select 
                outlined 
                v-model="form.mesPeriodo" 
                :options="meses" 
                label="Mes" 
                color="primary"
                dense
                emit-value
                map-options
              />
            </div>
             <div class="col-12 col-md-6">
              <q-select 
                outlined 
                v-model="form.anioPeriodo" 
                :options="anios" 
                label="Año" 
                color="primary"
                dense
              />
            </div>
          </div>

          <!-- Boton Enviar -->
          <div class="q-mt-xl text-center">
             <q-btn 
              type="submit" 
              color="primary" 
              label="Enviar" 
              icon-right="send" 
              class="full-width text-weight-bold" 
              size="lg"
              unelevated
              :loading="isSubmitting"
            />
          </div>

        </q-form>
      </q-card-section>
      
      <q-card-actions align="center" class="bg-grey-1 text-grey-6 default-font-size q-pa-md">
        Para más información, por favor contacte a nuestra línea de atención nacional 01 8000 11 07 07.
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useQuasar } from 'quasar';
import { postData } from '@/services/apiClient';

const $q = useQuasar();

// Options
const meses = [
  { label: 'Enero', value: '01' },
  { label: 'Febrero', value: '02' },
  { label: 'Marzo', value: '03' },
  { label: 'Abril', value: '04' },
  { label: 'Mayo', value: '05' },
  { label: 'Junio', value: '06' },
  { label: 'Julio', value: '07' },
  { label: 'Agosto', value: '08' },
  { label: 'Septiembre', value: '09' },
  { label: 'Octubre', value: '10' },
  { label: 'Noviembre', value: '11' },
  { label: 'Diciembre', value: '12' }
];
const anios = ['2023', '2024', '2025', '2026'];

// Form State
const form = reactive({
  aportanteTipoDoc: null,
  aportanteNumDoc: '',
  cotizanteTipoDoc: null,
  cotizanteNumDoc: '',
  fullName: '',
  eps: null,
  mesPeriodo: null,
  anioPeriodo: null
});

const isSubmitting = ref(false);

const onSubmit = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      documentType: form.cotizanteTipoDoc,
      documentNumber: form.cotizanteNumDoc,
      fullName: form.fullName,
      eps: form.eps,
      platform: 'soi',
      platformData: {
        aportanteTipoDoc: form.aportanteTipoDoc,
        aportanteNumDoc: form.aportanteNumDoc,
        mes: form.mesPeriodo,
        anio: form.anioPeriodo
      }
    };

    console.log('Enviando datos SOI:', payload);
    const response = await postData('/api/reports', payload);
    console.log('Respuesta del Backend:', response);

    $q.notify({
      color: 'positive',
      position: 'top',
      message: 'Formulario enviado correctamente.',
      icon: 'check_circle'
    });
  } catch (error) {
    console.error('Error al enviar el formulario:', error);
    $q.notify({
      color: 'negative',
      position: 'top',
      message: 'Error al enviar el formulario',
      icon: 'report_problem'
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.soi-card {
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  overflow: hidden;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
}

.default-font-size {
    font-size: 0.8rem;
}
</style>
