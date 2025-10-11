<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <header class="space-y-6">
      <!-- Desktop Title -->
      <div class="hidden md:block">
        <h1 class="text-4xl font-bold text-white">Pedidos a Proveedores</h1>
      </div>
      <!-- Action Bar -->
      <div class="flex flex-col sm:flex-row items-center gap-4 w-full">
        <div class="w-full sm:w-auto flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button @click="filtroEstado = ''" :class="filtroEstado === '' ? 'bg-green-600 text-white' : 'bg-oscuro-800 text-oscuro-300'" class="px-4 py-2 rounded-lg md:text-sm text-[13px] font-medium whitespace-nowrap transition-colors">Todos</button>
          <button @click="filtroEstado = 'pendiente'" :class="filtroEstado === 'pendiente' ? 'bg-orange-500 text-white' : 'bg-oscuro-800 text-oscuro-300'" class="px-4 py-2 rounded-lg md:text-sm text-[13px] font-medium whitespace-nowrap transition-colors">Pendientes</button>
          <button @click="filtroEstado = 'recibido'" :class="filtroEstado === 'recibido' ? 'bg-blue-500 text-white' : 'bg-oscuro-800 text-oscuro-300'" class="px-4 py-2 rounded-lg md:text-sm text-[13px] font-medium whitespace-nowrap transition-colors">Recibidos</button>
          <button @click="filtroEstado = 'cancelado'" :class="filtroEstado === 'cancelado' ? 'bg-red-500 text-white' : 'bg-oscuro-800 text-oscuro-300'" class="px-4 py-2 rounded-lg md:text-sm text-[13px] font-medium whitespace-nowrap transition-colors">Cancelados</button>
        </div>
        <div class="w-full sm:w-auto sm:ml-auto flex-shrink-0">
          <button @click="modalNuevoPedido = true" class="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3.5 md:py-2.5 rounded-xl md:rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <PlusIcono class="w-5 h-5" />
            <span class="inline md:text-sm text-base">Nuevo Pedido</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="md:bg-oscuro-900/50 md:rounded-2xl md:p-6">
      <!-- "No Pedidos" State -->
      <div v-if="pedidosFiltrados.length === 0" class="text-center py-16 sm:py-24">
        <div class="inline-block bg-oscuro-800 p-5 sm:p-6 rounded-full shadow-lg">
          <BotonPedidos class="w-14 h-14 sm:w-16 sm:h-16 text-oscuro-500" />
        </div>
        <h3 class="text-2xl font-bold tracking-tight mt-6">Sin pedidos</h3>
        <p class="text-sm sm:text-base text-oscuro-400 mt-2 max-w-md mx-auto">
          No hay pedidos que coincidan con el filtro actual. Intenta seleccionar otro estado o crea un nuevo pedido.
        </p>
      </div>

      <!-- Content -->
      <div v-else>
        <!-- Card View (Mobile) -->
        <div class="md:hidden space-y-3">
          <CardPedidos
            v-for="pedido in pedidosFiltrados"
            :key="pedido.idPedido"
            :pedido="pedido"
            :obtenerNombreProveedor="obtenerNombreProveedor"
            @verDetalle="verDetalle"
            @marcarRecibido="(id) => cambiarEstado(id, 'recibido')"
            @cancelar="(id) => cambiarEstado(id, 'cancelado')"
          />
        </div>

        <!-- Grid View (Desktop) -->
        <div class="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <CardEscritorioPedidos
            v-for="pedido in pedidosFiltrados"
            :key="pedido.idPedido"
            :pedido="pedido"
            :obtenerNombreProveedor="obtenerNombreProveedor"
            @verDetalle="verDetalle"
            @marcarRecibido="(id) => cambiarEstado(id, 'recibido')"
            @cancelar="(id) => cambiarEstado(id, 'cancelado')"
          />
        </div>
      </div>
    </main>

    <ModalPedidos 
      v-model="modalNuevoPedido"
      :proveedores="proveedores"
      :productos="productos"
      @pedidoGuardado="onPedidoGuardado"
    />

    <!-- Modal Detalle Pedido -->
    <Transition name="modal">
      <div v-if="modalDetalle" @click="cerrarModalDetalle" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center z-50">
        <div @click.stop class="modal-container bg-gradient-to-br from-oscuro-800/95 to-oscuro-900/95 backdrop-blur-lg w-full md:max-w-md rounded-t-3xl md:rounded-lg flex flex-col max-h-[90vh]">
          <div class="p-4 md:border-b md:border-oscuro-700">
            <div class="w-12 h-1.5 mx-auto rounded-full bg-oscuro-600 mb-4 md:hidden"></div>
            <h3 class="text-lg text-center font-bold md:text-left">Detalle del Pedido</h3>
          </div>
          <div v-if="pedidoSeleccionado" class="p-4 space-y-4 overflow-y-auto flex-1">
            <div class="bg-oscuro-900/50 rounded-xl p-4 space-y-3">
              <div>
                <p class="text-sm text-oscuro-400">Proveedor</p>
                <p class="font-semibold text-white">{{ obtenerNombreProveedor(pedidoSeleccionado.idProveedor) }}</p>
              </div>
              <div>
                <p class="text-sm text-oscuro-400">Fecha</p>
                <p class="font-semibold text-white">{{ formatearFechaHora(pedidoSeleccionado.fecha) }}</p>
              </div>
              <div>
                <p class="text-sm text-oscuro-400">Estado</p>
                <span :class="obtenerClaseEstado(pedidoSeleccionado.estado)" class="inline-block text-xs font-medium px-3 py-1 rounded-full mt-1 capitalize">{{ pedidoSeleccionado.estado }}</span>
              </div>
            </div>
            <div class="bg-oscuro-900/50 rounded-xl p-4">
              <p class="text-sm font-medium text-oscuro-300 mb-2">Productos</p>
              <div class="space-y-2">
                <div v-for="detalle in detallesPedido" :key="detalle.idDetalle" class="flex justify-between items-center">
                  <div>
                    <p class="font-medium text-sm text-white">{{ obtenerNombreProducto(detalle.idProducto) }}</p>
                    <p class="text-xs text-oscuro-400">{{ detalle.cantidad }} x {{ formatearMoneda(detalle.precioUnitario) }}</p>
                  </div>
                  <p class="font-semibold text-white">{{ formatearMoneda(detalle.cantidad * detalle.precioUnitario) }}</p>
                </div>
              </div>
            </div>
            <div class="bg-oscuro-900/50 rounded-xl p-4 flex justify-between items-center">
              <p class="text-sm font-medium text-oscuro-300">Total</p>
              <p class="text-2xl font-bold text-green-400">{{ formatearMoneda(pedidoSeleccionado.total) }}</p>
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
import { ref, computed, onMounted } from 'vue';
import { usePedidosStore } from '@/stores/pedidos';
import { useProveedoresStore } from '@/stores/proveedores';
import { useProductosStore } from '@/stores/productos';
import { formatearMoneda, formatearFechaHora } from '@/utils/helpers';
import ModalPedidos from '@/components/Pedidos/ModalPedidos.vue';
import CardPedidos from '@/components/Pedidos/CardPedidos.vue';
import CardEscritorioPedidos from '@/components/Pedidos/CardEscritorioPedidos.vue';
import BuscarIcono from '@/components/icons/BuscarIcono.vue';
import PlusIcono from '@/components/icons/PlusIcono.vue';
import BotonPedidos from '@/components/partials/BotonPedidos.vue';

const pedidosStore = usePedidosStore();
const proveedoresStore = useProveedoresStore();
const productosStore = useProductosStore();

const modalNuevoPedido = ref(false);
const modalDetalle = ref(false);
const pedidoSeleccionado = ref(null);
const detallesPedido = ref([]);
const filtroEstado = ref('');

const pedidos = computed(() => pedidosStore.pedidos);
const proveedores = computed(() => proveedoresStore.proveedores);
const productos = computed(() => productosStore.productos);

const pedidosFiltrados = computed(() => {
  if (!filtroEstado.value) return pedidos.value;
  return pedidos.value.filter(p => p.estado === filtroEstado.value);
});

const obtenerNombreProveedor = (idProveedor) => {
  const proveedor = proveedores.value.find(p => p.idProveedor === idProveedor);
  return proveedor ? proveedor.nombre : 'N/A';
};

const obtenerNombreProducto = (idProducto) => {
  const producto = productos.value.find(p => p.idProducto === idProducto);
  return producto ? producto.nombre : 'N/A';
};

const obtenerClaseEstado = (estado) => {
  const clases = {
    pendiente: 'bg-orange-500/20 text-orange-300',
    recibido: 'bg-blue-500/20 text-blue-300',
    cancelado: 'bg-red-500/20 text-red-300'
  };
  return clases[estado] || 'bg-gray-500/20 text-gray-300';
};

const onPedidoGuardado = () => {
  pedidosStore.cargarPedidos();
};

const cambiarEstado = async (idPedido, nuevoEstado) => {
  if (confirm(`¿Desea marcar el pedido como ${nuevoEstado}?`)) {
    try {
      await pedidosStore.actualizarEstadoPedido(idPedido, nuevoEstado);
    } catch (error) {
      alert('Error al actualizar estado: ' + error.message);
    }
  }
};

const verDetalle = async (pedido) => {
  pedidoSeleccionado.value = pedido;
  detallesPedido.value = await pedidosStore.obtenerDetallesPedido(pedido.idPedido);
  modalDetalle.value = true;
};

const cerrarModalDetalle = () => {
  modalDetalle.value = false;
  pedidoSeleccionado.value = null;
  detallesPedido.value = [];
};

onMounted(async () => {
  await pedidosStore.cargarPedidos();
  await proveedoresStore.cargarProveedores();
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