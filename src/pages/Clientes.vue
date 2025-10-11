<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <header class="space-y-6">
      <!-- Desktop Title -->
      <div class="hidden md:block">
        <h1 class="text-4xl font-bold text-white">Clientes</h1>
      </div>
      <!-- Action Bar -->
      <div class="flex items-center gap-4 w-full">
        <div class="relative flex-grow">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <BuscarIcono class="w-5 h-5 text-oscuro-400" />
          </div>
          <input v-model="busqueda" type="text" placeholder="Buscar cliente..."
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
      <!-- "No Clients" State -->
      <div v-if="clientesFiltrados.length === 0" class="text-center py-16 sm:py-24">
        <div class="inline-block bg-oscuro-800 p-5 sm:p-6 rounded-full shadow-lg">
          <BotonClientes class="w-14 h-14 sm:w-16 sm:h-16 text-oscuro-500" />
        </div>
        <h3 class="text-2xl font-bold tracking-tight mt-6">Sin clientes</h3>
        <p class="text-sm sm:text-base text-oscuro-400 mt-2 max-w-md mx-auto">
          Comienza agregando tu primer cliente para gestionar tus ventas.
        </p>
      </div>

      <!-- Clients List -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        <CardCliente
          v-for="cliente in clientesFiltrados"
          :key="cliente.idCliente"
          :cliente="cliente"
          @editar="abrirModal"
          @eliminar="eliminar"
        />
      </div>
    </main>

    <ModalClientes 
      v-model="modalAbierto"
      :cliente="clienteActual"
      @clienteGuardado="onClienteGuardado"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useClientesStore } from '@/stores/clientes';
import ModalClientes from '@/components/Clientes/ModalClientes.vue';
import CardCliente from '@/components/Clientes/CardCliente.vue';
import BuscarIcono from '@/components/icons/BuscarIcono.vue';
import PlusIcono from '@/components/icons/PlusIcono.vue';
import BotonClientes from '@/components/partials/BotonClientes.vue';

const store = useClientesStore();
const modalAbierto = ref(false);
const clienteActual = ref(null);
const busqueda = ref('');

const clientes = computed(() => store.clientes);

const clientesFiltrados = computed(() => {
  if (!busqueda.value) return clientes.value;
  const term = busqueda.value.toLowerCase();
  return clientes.value.filter(c =>
    c.nombre.toLowerCase().includes(term) ||
    (c.email && c.email.toLowerCase().includes(term))
  );
});

const abrirModal = (cliente = null) => {
  clienteActual.value = cliente;
  modalAbierto.value = true;
};

const onClienteGuardado = () => {
  store.cargarClientes();
};

const eliminar = async (id) => {
  if (confirm('¿Estás seguro de eliminar este cliente?')) {
    try {
      await store.eliminarCliente(id);
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  }
};

onMounted(() => {
  store.cargarClientes();
});
</script>