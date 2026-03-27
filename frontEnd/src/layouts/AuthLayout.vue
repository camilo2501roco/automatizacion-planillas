<template>
  <div class="auth-layout">
    <!-- Elementos decorativos de fondo dinámicos -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="grid-pattern"></div>
    </div>

    <!-- Contenido Principal -->
    <main class="main-container">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), 
              url('../assets/sena-bg.png') center/cover no-repeat;
  overflow: hidden;
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.2;
}

.circle-1 {
  top: -10%;
  right: -5%;
  width: 500px;
  height: 500px;
  background: rgba(45, 122, 52, 0.15);
}

.circle-2 {
  bottom: -15%;
  left: -5%;
  width: 600px;
  height: 600px;
  background: rgba(45, 122, 52, 0.1);
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#ffffff22 1px, transparent 1px);
  background-size: 30px 30px;
  opacity: 0.2;
}

.main-container {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
</style>
