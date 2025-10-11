<template>
  <div class="h-screen flex flex-col bg-oscuro-950 text-oscuro-50 pb-16 md:pb-0">
    <!-- Header -->
    <header class="bg-oscuro-900/80 backdrop-blur-lg text-white p-4 shadow-lg sticky top-0 z-10 border-b border-oscuro-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="bg-oscuro-50 rounded-lg p-1">
            <img src="/logo.webp" alt="Logo" class="h-7 w-7">
          </div>
          <h1 class="text-xl font-bold tracking-wider">{{ titulo }}</h1>
        </div>
        
        <div class="flex items-center gap-4">
          <!-- Profile Avatar -->
          <div class="w-9 h-9 rounded-full bg-oscuro-700 flex items-center justify-center text-white font-bold overflow-hidden border-2 border-oscuro-600">
            <img v-if="perfilImageUrl" :src="perfilImageUrl" class="w-full h-full object-cover" alt="Foto de perfil">
            <span v-else>{{ fallbackLetter }}</span>
          </div>

          <!-- Mobile Hamburger Button -->
          <button @click="menuAbierto = !menuAbierto" class="md:hidden p-2 rounded-md hover:bg-oscuro-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:text-green-400">
            <FiltroIcono class="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden min-h-0">
      <!-- Menú lateral para Desktop -->
      <aside class="hidden md:flex md:flex-col md:w-64 bg-oscuro-900 border-r border-oscuro-700">
        <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center px-4 py-3 border-l-4 transition-colors duration-200 group rounded-lg"
            :class="[
              $route.path === item.path
                ? 'bg-oscuro-850 border-green-400 text-green-400'
                : 'border-transparent text-oscuro-300 hover:bg-oscuro-700/50 hover:text-white',
            ]"
          >
            <component
              :is="item.icon"
              class="w-5 h-5 mr-4 transition-colors duration-200"
              :class="[
                $route.path === item.path
                  ? 'text-green-400'
                  : 'text-oscuro-400 group-hover:text-white',
              ]"
            />
            <span class="font-medium">{{ item.label }}</span>
          </router-link>
        </nav>
        <div class="p-2 border-t border-oscuro-700">
          <router-link
            to="/configuracion"
            class="flex items-center px-4 py-2.5 text-oscuro-300 rounded-lg hover:bg-oscuro-700 hover:text-green-400 transition-colors duration-200 group"
            :class="{ 'bg-green-500/10 text-green-400': $route.path === '/configuracion' }"
            >
            <BotonConfiguracion class="w-5 h-5 mr-3 text-oscuro-400 group-hover:text-green-400 transition-colors duration-200" :class="{'text-green-400': $route.path === '/configuracion'}"/>
            <span class="font-medium">Configuración</span>
          </router-link>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <RouterView v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
    </div>

    <!-- Menú Sheet Modal (Overlay) -->
    <div
      v-if="menuAbierto"
      @click="menuAbierto = false"
      class="fixed inset-0 bg-black/70 backdrop-blur-xs z-20 md:hidden transition-opacity duration-300"
      :class="menuAbierto ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    ></div>
    
    <!-- Menú Sheet Modal (Contenido) -->
    <aside
      class="fixed bottom-0 left-0 right-0 w-full bg-oscuro-600/50 border border-oscuro-700 backdrop-blur-lg shadow-2xl z-30 md:hidden transition-transform duration-300 ease-in-out rounded-t-4xl"
      :class="menuAbierto ? 'translate-y-0' : 'translate-y-full'"
    >
      <div class="p-4 max-h-[80vh] overflow-y-auto">
        <div class="w-12 h-1.5 mx-auto rounded-full bg-oscuro-600 mb-4"></div>
        <nav class="pt-2">
          <router-link
            v-for="(item, i) in menuItems.concat(configMenuItem)"
            :key="item.path"
            :to="item.path"
            @click="menuAbierto = false"
            class="flex items-center py-4 px-4 transition-colors duration-200 group border-b"
            :class="[
              $route.path === item.path
                ? 'text-green-400 font-bold'
                : 'text-oscuro-200',
              i === menuItems.length
                ? 'border-transparent mt-2 pt-4 border-t border-oscuro-600'
                : (i === menuItems.length - 1 ? 'border-transparent' : 'border-oscuro-600'),
            ]"
          >
            <component
              :is="item.icon"
              class="w-5 h-5 mr-4 transition-colors duration-200"
              :class="[
                $route.path === item.path
                  ? 'text-green-400'
                  : 'text-oscuro-400',
              ]"
            />
            <span>{{ item.label }}</span>
          </router-link>
        </nav>
      </div>
    </aside>

    <!-- Bottom Navigation (Móvil) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-oscuro-900/90 backdrop-blur-xs shadow-lg z-10 border-t border-oscuro-700">
      <div class="flex justify-around items-center h-16 text-oscuro-400">
        <router-link
          v-for="item in bottomNavItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center justify-center flex-1 py-2 transition-colors duration-300 ease-in-out"
          :class="{ 'text-green-400': $route.path === item.path }"
        >
          <component :is="item.icon" class="w-6 h-6" />
          <span 
            class="font-semibold text-xs mt-1"
            :class="{ 'glow-text': $route.path === item.path }"
          >
            {{ item.label }}
          </span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, markRaw, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useConfiguracionStore } from "@/stores/configuracion";
import BotonHome from "@/components/partials/BotonHome.vue";
import BotonInventario from "@/components/partials/BotonInventario.vue";
import BotonPedidos from "@/components/partials/BotonPedidos.vue";
import BotonProductos from "@/components/partials/BotonProductos.vue";
import BotonVentas from "@/components/partials/BotonVentas.vue";
import BotonCategorias from "@/components/partials/BotonCategorias.vue";
import BotonClientes from "@/components/partials/BotonClientes.vue";
import BotonProveedores from "@/components/partials/BotonProveedores.vue";
import BotonConfiguracion from "@/components/partials/BotonConfiguracion.vue";
import FiltroIcono from "@/components/icons/FiltroIcono.vue";

const route = useRoute();
const menuAbierto = ref(false);
const configuracionStore = useConfiguracionStore();

const config = computed(() => configuracionStore.configuracion);

onMounted(() => {
  configuracionStore.cargarConfiguracion();
});

const perfilImageUrl = computed(() => {
  if (config.value && config.value.fotoPerfil instanceof Blob) {
    return URL.createObjectURL(config.value.fotoPerfil);
  }
  return null;
});

const fallbackLetter = computed(() => {
  if (config.value && config.value.nombreUsuario) {
    return config.value.nombreUsuario.charAt(0).toUpperCase();
  }
  return 'E';
});

const titulo = computed(() => {
  let currentRoute = menuItems.find(item => item.path === route.path);
  if (!currentRoute) {
    if (route.path === configMenuItem.path) {
      currentRoute = configMenuItem;
    }
  }
  return currentRoute ? currentRoute.label : "Control de Stock";
});

const menuItems = [
  { path: "/", label: "Inicio", icon: markRaw(BotonHome) },
  { path: "/productos", label: "Productos", icon: markRaw(BotonProductos) },
  { path: "/categorias", label: "Categorías", icon: markRaw(BotonCategorias) },
  { path: "/clientes", label: "Clientes", icon: markRaw(BotonClientes) },
  { path: "/proveedores", label: "Proveedores", icon: markRaw(BotonProveedores) },
  { path: "/pedidos", label: "Pedidos", icon: markRaw(BotonPedidos) },
  { path: "/ventas", label: "Ventas", icon: markRaw(BotonVentas) },
  { path: "/inventario", label: "Inventario", icon: markRaw(BotonInventario) },
];

const configMenuItem = {
    path: "/configuracion", 
    label: "Configuración", 
    icon: markRaw(BotonConfiguracion)
};

const bottomNavItems = [
  { path: "/", label: "Inicio", icon: markRaw(BotonHome) },
  { path: "/productos", label: "Productos", icon: markRaw(BotonProductos) },
  { path: "/ventas", label: "Ventas", icon: markRaw(BotonVentas) },
  { path: "/pedidos", label: "Pedidos", icon: markRaw(BotonPedidos) },
  { path: "/inventario", label: "Inventario", icon: markRaw(BotonInventario) },
];
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilo para la barra de desplazamiento */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-oscuro-900);
}

::-webkit-scrollbar-thumb {
  background-color: var(--color-oscuro-700);
  border-radius: 10px;
  border: 2px solid var(--color-oscuro-900);
}

::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-oscuro-600);
}
</style>