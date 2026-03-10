<template>
  <q-page class="flex flex-center bg-grey-2">
    <!-- Contenedor Principal -->
    <div class="q-pa-md" style="max-width: 800px; width: 100%">
      
      <!-- Título Dinámico -->
      <h4 class="text-center text-weight-bold q-mb-xl">
        {{ step === 1 ? 'Gestión de Certificados de Seguridad Social' : 'Seleccione plataforma' }}
      </h4>

      <p class="text-center text-subtitle1 q-mb-lg text-grey-8">
        {{ step === 1 
          ? 'Seleccione su perfil de acceso' 
          : 'Elija la plataforma para procesar su certificado de seguridad social. Cada operador ofrece diferentes opciones de liquidación y servicios.' 
        }}
      </p>

      <!-- PASO 1: Selección de Perfil -->
      <div v-if="step === 1" class="row q-col-gutter-lg justify-center">
        <!-- Tarjeta Mi Formulario -->
        <div class="col-12 col-md-6">
          <q-card class="profile-card cursor-pointer" flat bordered @click="goToStep(2)">
            <q-card-section>
              <q-avatar size="60px" class="q-mb-md" color="primary" text-color="white" icon="edit_document" />
              <div class="text-h6 text-weight-bold">Llenar Formulario</div>
              <p class="text-grey-7 q-mt-sm">
                Dirigido a ciudadanos y empresas que requieren solicitar nuevos certificados o actualizar información existente.
              </p>
            </q-card-section>
            <q-card-actions align="center" class="q-pb-md">
              <q-btn color="primary" label="Ir al Formulario" icon-right="open_in_new" class="full-width text-weight-bold" unelevated />
            </q-card-actions>
          </q-card>
        </div>

        <!-- Tarjeta Supervisor -->
        <div class="col-12 col-md-6">
          <q-card class="profile-card profile-card-dark bg-dark text-white cursor-not-allowed" flat bordered>
            <q-card-section>
              <q-avatar size="60px" class="q-mb-md" color="grey-8" text-color="white" icon="shield" />
              <div class="text-h6 text-weight-bold">Supervisor</div>
              <p class="text-grey-4 q-mt-sm">
                Acceso exclusivo para personal administrativo. Gestión de solicitudes, auditoría y validación de documentos oficiales.
              </p>
            </q-card-section>
            <q-card-actions align="center" class="q-pb-md">
              <q-btn color="white" text-color="dark" label="Acceso Administrativo" icon-right="lock" class="full-width text-weight-bold" outline disable />
            </q-card-actions>
          </q-card>
        </div>
      </div>

      <!-- PASO 2: Selección de Plataforma -->
      <div v-if="step === 2">
        <div class="row q-col-gutter-md justify-center">
          
          <!-- SOI (Activo) -->
          <div class="col-12 col-sm-6 text-center">
            <q-card class="platform-card cursor-pointer" flat bordered @click="goToSoi">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-avatar color="green-1" text-color="primary" icon="payments" />
                </q-item-section>
                <q-item-section class="text-left text-weight-bold text-h6">
                  SOI
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" color="grey-4" />
                </q-item-section>
              </q-item>
            </q-card>
          </div>

          <!-- ASOPAGOS (Deshabilitado por ahora) -->
          <div class="col-12 col-sm-6 text-center">
            <q-card class="platform-card cursor-not-allowed" flat bordered>
              <q-item disabled>
                <q-item-section avatar>
                  <q-avatar color="green-1" text-color="primary" icon="account_balance" />
                </q-item-section>
                <q-item-section class="text-left text-weight-bold text-h6 text-grey-6">
                  ASOPAGOS
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" color="grey-3" />
                </q-item-section>
              </q-item>
            </q-card>
          </div>

          <!-- COMPENSAR (Deshabilitado por ahora) -->
          <div class="col-12 col-sm-6 text-center">
            <q-card class="platform-card cursor-not-allowed" flat bordered>
              <q-item disabled>
                <q-item-section avatar>
                  <q-avatar color="green-1" text-color="primary" icon="family_restroom" />
                </q-item-section>
                <q-item-section class="text-left text-weight-bold text-h6 text-grey-6">
                  COMPENSAR
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" color="grey-3" />
                </q-item-section>
              </q-item>
            </q-card>
          </div>

          <!-- APORTES EN LINEA (Deshabilitado por ahora) -->
          <div class="col-12 col-sm-6 text-center">
            <q-card class="platform-card cursor-not-allowed" flat bordered>
              <q-item disabled>
                <q-item-section avatar>
                  <q-avatar color="green-1" text-color="primary" icon="computer" />
                </q-item-section>
                <q-item-section class="text-left text-weight-bold text-h6 text-grey-6">
                  APORTES EN LINEA
                </q-item-section>
                <q-item-section side>
                  <q-icon name="chevron_right" color="grey-3" />
                </q-item-section>
              </q-item>
            </q-card>
          </div>

        </div>

        <div class="text-center q-mt-xl">
          <q-btn label="Volver" color="grey-3" text-color="dark" flat class="text-weight-bold px-xl" @click="goToStep(1)" />
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const step = ref(1);
const router = useRouter();

const goToStep = (newStep) => {
  step.value = newStep;
};

const goToSoi = () => {
  router.push('/soi');
};
</script>

<style scoped>
.profile-card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
}
.profile-card:hover:not(.cursor-not-allowed) {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  border-color: #00A650;
}
.profile-card-dark {
  background-color: #1a1f24 !important; /* Aproximando al dark mode del screenshot */
}

.platform-card {
  border-radius: 8px;
  transition: transform 0.2s;
}
.platform-card:hover:not(.cursor-not-allowed) {
  transform: translateY(-3px);
  border-color: #00A650;
}
</style>
