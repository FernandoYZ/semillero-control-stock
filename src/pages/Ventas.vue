<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <header class="space-y-6">
      <!-- Desktop Title -->
      <div class="hidden md:block">
        <h1 class="text-4xl font-bold text-white">Ventas</h1>
      </div>
      <!-- Action Bar -->
      <div class="flex items-center gap-4 w-full">
        <div class="relative flex-grow">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <BuscarIcono class="w-5 h-5 text-oscuro-400" />
          </div>
          <input v-model="busqueda" type="text" placeholder="Buscar por cliente o ID..."
            class="w-full pl-10 pr-4 md:py-2 py-4 bg-oscuro-700/70 md:border md:border-oscuro-700 rounded-full md:rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none">
        </div>
        <button @click="modalNuevaVenta = true" class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-4 md:py-2 rounded-2xl md:rounded-lg text-sm font-medium transition-colors flex-shrink-0 flex items-center gap-2">
          <PlusIcono class="w-5 h-5" />
          <span class="hidden sm:inline">Nueva Venta</span>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="md:bg-oscuro-900/50 md:rounded-2xl md:p-6">
      <!-- "No Ventas" State -->
      <div v-if="!ventasFiltradas || ventasFiltradas.length === 0" class="text-center py-16 sm:py-24">
        <div class="inline-block bg-oscuro-800 p-5 sm:p-6 rounded-full shadow-lg">
          <BotonVentas class="w-14 h-14 sm:w-16 sm:h-16 text-oscuro-500" />
        </div>
        <h3 class="text-2xl font-bold tracking-tight mt-6">Sin ventas</h3>
        <p class="text-sm sm:text-base text-oscuro-400 mt-2 max-w-md mx-auto">
          Aún no se han registrado ventas. Comienza creando una nueva.
        </p>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Card View (Mobile) -->
        <div class="md:hidden space-y-3">
          <CardVentas
            v-for="venta in ventasFiltradas"
            :key="venta.idVenta"
            :venta="venta"
            :obtenerNombreCliente="obtenerNombreCliente"
            @verDetalle="verDetalle"
          />
        </div>

        <!-- Grid View (Desktop) -->
        <div class="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <CardEscritorio
            v-for="venta in ventasFiltrados"
            :key="venta.idVenta"
            :venta="venta"
            :obtenerNombreCliente="obtenerNombreCliente"
            @verDetalle="verDetalle"
          />
        </div>
      </div>
    </main>

    <ModalVentas 
      v-model="modalNuevaVenta"
      :clientes="clientes"
      :productos="productos"
      @ventaGuardada="onVentaGuardada"
    />

    <!-- Modal Detalle Venta -->
    <Transition name="modal">
      <div v-if="modalDetalle" @click="cerrarModalDetalle" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center z-50">
        <div @click.stop class="modal-container bg-gradient-to-br from-oscuro-800/95 to-oscuro-900/95 backdrop-blur-lg w-full md:max-w-md rounded-t-3xl md:rounded-lg flex flex-col max-h-[90vh]">
          <div class="p-4 md:border-b md:border-oscuro-700">
            <div class="w-12 h-1.5 mx-auto rounded-full bg-oscuro-600 mb-4 md:hidden"></div>
            <h3 class="text-lg text-center font-bold md:text-left">Detalle de Venta</h3>
          </div>
          <div v-if="ventaSeleccionada" class="p-4 space-y-4 overflow-y-auto flex-1">
            <div class="bg-oscuro-900/50 rounded-xl p-4 space-y-3">
              <div>
                <p class="text-sm text-oscuro-400">Cliente</p>
                <p class="font-semibold text-white">{{ obtenerNombreCliente(ventaSeleccionada.idCliente) }}</p>
              </div>
              <div>
                <p class="text-sm text-oscuro-400">Fecha</p>
                <p class="font-semibold text-white">{{ formatearFechaHora(ventaSeleccionada.fecha) }}</p>
              </div>
            </div>
            <div class="bg-oscuro-900/50 rounded-xl p-4">
              <p class="text-sm font-medium text-oscuro-300 mb-2">Productos</p>
              <div class="space-y-2">
                <div v-for="detalle in detallesVenta" :key="detalle.idDetalleVenta" class="flex justify-between items-center">
                  <div>
                    <p class="font-medium text-sm text-white">{{ obtenerNombreProducto(detalle.idProducto) }}</p>
                    <p class="text-xs text-oscuro-400">{{ detalle.cantidad }} x {{ formatearMoneda(detalle.precioUnitario) }}</p>
                  </div>
                  <p class="font-semibold text-white">S/.{{ formatearMoneda(detalle.cantidad * detalle.precioUnitario) }}</p>
                </div>
              </div>
            </div>
            <div class="bg-oscuro-900/50 rounded-xl p-4 flex justify-between items-center">
              <p class="text-sm font-medium text-oscuro-300">Total</p>
              <p class="text-2xl font-bold text-green-400">S/.{{ formatearMoneda(ventaSeleccionada.total) }}</p>
            </div>
          </div>
          <div class="p-4 mt-auto md:border-t md:border-oscuro-700">
            <button @click="cerrarModalDetalle" class="w-full px-4 py-2 bg-oscuro-700 text-white rounded-lg hover:bg-oscuro-600 transition-colors">Cerrar</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useVentasStore } from '@/stores/ventas';
import { useClientesStore } from '@/stores/clientes';
import { useProductosStore } from '@/stores/productos';
import { formatearMoneda, formatearFechaHora } from '@/utils/helpers';
import ModalVentas from '@/components/Ventas/ModalVentas.vue';
import CardVentas from '@/components/Ventas/CardVentas.vue';
import CardEscritorio from '@/components/Ventas/CardEscritorio.vue';
import BuscarIcono from '@/components/icons/BuscarIcono.vue';
import PlusIcono from '@/components/icons/PlusIcono.vue';
import BotonVentas from '@/components/partials/BotonVentas.vue';

const ventasStore = useVentasStore();
const clientesStore = useClientesStore();
const productosStore = useProductosStore();

const modalNuevaVenta = ref(false);
const modalDetalle = ref(false);
const ventaSeleccionada = ref(null);
const detallesVenta = ref([]);
const busqueda = ref('');

const ventas = computed(() => ventasStore.ventas);
const clientes = computed(() => clientesStore.clientes);
const productos = computed(() => productosStore.productos);

// --- INICIO DE LA CORRECCIÓN ---

// 1. Se reemplaza la propiedad computada por una referencia simple.
const ventasFiltradas = ref([]);

const obtenerNombreCliente = (idCliente) => {
  if (!clientes.value) return 'N/A';
  const cliente = clientes.value.find(c => c.idCliente === idCliente);
  return cliente ? cliente.nombre : 'N/A';
};

// 2. Se crea un "observador" que actualiza manualmente la lista filtrada.
watch([ventas, busqueda], ([nuevasVentas, nuevaBusqueda]) => {
  if (!Array.isArray(nuevasVentas)) {
    ventasFiltradas.value = [];
    return;
  }

  if (!nuevaBusqueda) {
    ventasFiltradas.value = nuevasVentas;
    return;
  }

  const term = nuevaBusqueda.toLowerCase();
  ventasFiltradas.value = nuevasVentas.filter(venta => {
    if (!venta) return false;
    const nombreCliente = obtenerNombreCliente(venta.idCliente) || '';
    const idVenta = venta.idVenta || '';
    return (
      nombreCliente.toLowerCase().includes(term) ||
      idVenta.toLowerCase().includes(term)
    );
  });
}, { immediate: true }); // immediate: true asegura que se ejecute al inicio

// --- FIN DE LA CORRECCIÓN ---

const obtenerNombreProducto = (idProducto) => {
  const producto = productos.value.find(p => p.idProducto === idProducto);
  return producto ? producto.nombre : 'N/A';
};

const onVentaGuardada = () => {
  ventasStore.cargarVentas();
  productosStore.cargarProductos();
};

const abrirModalNuevaVenta = () => {
  modalNuevaVenta.value = true;
};

const verDetalle = async (venta) => {
  ventaSeleccionada.value = venta;
  detallesVenta.value = await ventasStore.obtenerDetallesVenta(venta.idVenta);
  modalDetalle.value = true;
};

const cerrarModalDetalle = () => {
  modalDetalle.value = false;
  ventaSeleccionada.value = null;
  detallesVenta.value = [];
};

onMounted(async () => {
  await ventasStore.cargarVentas();
  await clientesStore.cargarClientes();
  await productosStore.cargarProductos();
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container {
  transition: all 0.3s ease-out;
}
.modal-leave-active .modal-container {
  transition: all 0.3s ease-in;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  opacity: 0;
  transform: translateY(100%) scale(1);
}

@media (min-width: 768px) {
  .modal-enter-from .modal-container,
  .modal-leave-to .modal-container {
    transform: translateY(0) scale(0.95);
  }
}
</style>