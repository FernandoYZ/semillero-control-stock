<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <header class="space-y-6">
      <!-- Desktop Title -->
      <div class="hidden md:block">
        <h1 class="text-4xl font-bold text-white">Proveedores</h1>
      </div>
      <!-- Action Bar -->
      <div class="flex items-center gap-4 w-full">
        <div class="relative flex-grow">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <BuscarIcono class="w-5 h-5 text-oscuro-400" />
          </div>
          <input v-model="busqueda" type="text" placeholder="Buscar proveedor..."
            class="w-full pl-10 pr-4 md:py-2 py-4 bg-oscuro-700/70 md:border md:border-oscuro-700 rounded-full md:rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none">
        </div>
        <button @click="abrirModal()" class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-4 md:py-2 rounded-2xl md:rounded-lg text-sm font-medium transition-colors flex-shrink-0 flex items-center gap-2">
          <PlusIcono class="w-5 h-5" />
          <span class="hidden sm:inline">Nuevo</span>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="md:bg-oscuro-900/50 md:rounded-2xl md:p-6">
      <!-- "No Proveedores" State -->
      <div v-if="proveedoresFiltrados.length === 0" class="text-center py-16 sm:py-24">
        <div class="inline-block bg-oscuro-800 p-5 sm:p-6 rounded-full shadow-lg">
          <BotonProveedores class="w-14 h-14 sm:w-16 sm:h-16 text-oscuro-500" />
        </div>
        <h3 class="text-2xl font-bold tracking-tight mt-6">Sin proveedores</h3>
        <p class="text-sm sm:text-base text-oscuro-400 mt-2 max-w-md mx-auto">
          Comienza agregando tu primer proveedor para gestionar tus pedidos.
        </p>
      </div>

      <!-- Proveedores Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        <CardProveedores
          v-for="proveedor in proveedoresFiltrados"
          :key="proveedor.idProveedor"
          :proveedor="proveedor"
          @editar="abrirModal"
          @eliminar="eliminar"
        />
      </div>
    </main>

    <ModalProveedores 
      v-model="modalAbierto"
      :proveedor="proveedorActual"
      @proveedorGuardado="onProveedorGuardado"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProveedoresStore } from '@/stores/proveedores';
import ModalProveedores from '@/components/Proveedores/ModalProveedores.vue';
import CardProveedores from '@/components/Proveedores/CardProveedores.vue';
import BuscarIcono from '@/components/icons/BuscarIcono.vue';
import PlusIcono from '@/components/icons/PlusIcono.vue';
import BotonProveedores from '@/components/partials/BotonProveedores.vue';

const store = useProveedoresStore();
const modalAbierto = ref(false);
const proveedorActual = ref(null);
const busqueda = ref('');

const proveedores = computed(() => store.proveedores);

const proveedoresFiltrados = computed(() => {
  if (!busqueda.value) return proveedores.value;
  const term = busqueda.value.toLowerCase();
  return proveedores.value.filter(p =>
    p.nombre.toLowerCase().includes(term) ||
    (p.contacto && p.contacto.toLowerCase().includes(term)) ||
    (p.email && p.email.toLowerCase().includes(term))
  );
});

const abrirModal = (proveedor = null) => {
  proveedorActual.value = proveedor;
  modalAbierto.value = true;
};

const onProveedorGuardado = () => {
  store.cargarProveedores();
};

const eliminar = async (id) => {
  if (confirm('¿Estás seguro de eliminar este proveedor?')) {
    try {
      await store.eliminarProveedor(id);
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  }
};

onMounted(() => {
  store.cargarProveedores();
});
</script>