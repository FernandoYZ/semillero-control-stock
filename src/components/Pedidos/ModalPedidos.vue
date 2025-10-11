<template>
  <Transition name="modal">
    <div v-if="modelValue" @click="cerrarModal" class="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-end md:items-center justify-center z-40">
      <div @click.stop class="modal-container bg-oscuro-600/50 backdrop-blur-lg w-full md:max-w-2xl rounded-t-4xl border border-oscuro-700 md:rounded-lg flex flex-col max-h-[90vh]">
        
        <div class="p-4 md:border-b md:border-oscuro-700">
          <div class="w-12 h-1.5 mx-auto rounded-full bg-oscuro-600 mb-4 md:hidden"></div>
          <h3 class="text-lg text-center font-bold md:text-left">Nuevo Pedido</h3>
        </div>

        <div class="p-4 space-y-4 overflow-y-auto flex-1">
          <div class="space-y-4">
            <CampoFormulario as="select" id="proveedor" label="Proveedor" v-model="state.idProveedor" required>
              <option disabled value="">{{ placeholders.proveedor }}</option>
              <option v-for="proveedor in proveedores" :key="proveedor.idProveedor" :value="proveedor.idProveedor" class="bg-oscuro-800/50">{{ proveedor.nombre }}</option>
            </CampoFormulario>

            <div class="pb-4 bg-oscuro-900/50 rounded-xl">
              <label class="block text-sm font-medium text-oscuro-400 mb-2">Agregar Productos</label>
              <div class="flex flex-col sm:flex-row gap-2">
                <select v-model="state.productoSeleccionado" class="w-full sm:flex-1 px-5 md:px-3 md:py-2 py-3 bg-oscuro-800/60 md:rounded-lg rounded-full text-oscuro-100 focus:ring-0 focus:outline-none focus:bg-oscuro-700 transition-colors">
                  <option value="">{{ placeholders.producto }}</option>
                  <option v-for="producto in productos" :key="producto.idProducto" :value="producto.idProducto">{{ producto.nombre }}</option>
                </select>
                <div class="flex gap-2">
                  <input v-model.number="state.cantidadProducto" type="number" min="1" placeholder="Cant."
                    class="flex-grow w-full px-5 md:px-3 md:py-2 py-3 bg-oscuro-800/60 md:rounded-lg rounded-full text-oscuro-100 focus:ring-0 focus:outline-none focus:bg-oscuro-700 transition-colors">
                  <button @click="agregarProducto" type="button" class="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl md:rounded-lg transition-colors">
                    <PlusIcono class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div v-if="state.detalles.length > 0" class="border border-oscuro-700 rounded-2xl p-3 bg-oscuro-900/50">
              <h4 class="font-semibold mb-2 text-sm text-oscuro-400">Productos del Pedido</h4>
              <div class="space-y-2">
                <div v-for="(detalle, index) in state.detalles" :key="index" class="flex justify-between items-center py-2 border-b border-oscuro-700 last:border-0">
                  <div>
                    <p class="font-semibold text-white">{{ obtenerNombreProducto(detalle.idProducto) }}</p>
                    <p class="text-sm text-oscuro-400">{{ detalle.cantidad }} unidades</p>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-right">
                      <label :for="'precio-' + index" class="text-xs text-oscuro-400">Precio Unit.</label>
                      <div class="relative">
                        <span class="absolute inset-y-0 left-0 flex items-center pl-2 text-oscuro-400">S/.</span>
                        <input 
                          :id="'precio-' + index"
                          v-model.number="detalle.precioUnitario" 
                          type="number" 
                          step="0.01" 
                          class="w-28 pl-5 pr-4 py-2 text-sm bg-oscuro-800/60 md:rounded-lg rounded-full text-white text-right focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none"
                        >
                      </div>
                    </div>
                    <p class="font-bold text-white w-20 text-right text-sm">S/.{{ formatearMoneda(detalle.cantidad * detalle.precioUnitario) }}</p>
                    <button @click="eliminarProducto(index)" class="text-red-500 hover:text-red-400 transition-colors" aria-label="Eliminar producto">
                      <BasureroIcono class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t border-oscuro-700 flex justify-between font-bold">
                <span>Total del Pedido:</span>
                <span class="text-green-400 text-lg">S/.{{ formatearMoneda(totalPedido) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-4 md:border-t md:border-oscuro-700">
          <div class="flex gap-3 justify-end">
            <button type="button" @click="cerrarModal" class="hidden md:block px-4 py-2 bg-oscuro-700 hover:bg-oscuro-600 text-white rounded-xl transition-colors">
              Cancelar
            </button>
            <button @click="guardarPedido" :disabled="state.detalles.length === 0 || !state.idProveedor" class="w-full md:w-auto px-4 py-3 md:py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-colors duration-200 font-semibold text-base md:text-sm cursor-pointer disabled:bg-gray-500 disabled:from-gray-500 disabled:to-gray-600">
              Guardar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { reactive, computed, defineProps, defineEmits } from 'vue';
import { usePedidosStore } from '@/stores/pedidos';
import CampoFormulario from '@/components/Productos/CampoFormulario.vue';
import PlusIcono from '@/components/icons/PlusIcono.vue';
import BasureroIcono from '@/components/icons/BasureroIcono.vue';
import { formatearMoneda } from '@/utils/helpers';

const props = defineProps({
  modelValue: Boolean,
  proveedores: Array,
  productos: Array
});

const emit = defineEmits(['update:modelValue', 'pedidoGuardado']);

const pedidosStore = usePedidosStore();

const placeholders = {
  proveedor: 'Seleccionar proveedor',
  producto: 'Seleccionar producto'
};

const getInitialState = () => ({
  idProveedor: '',
  detalles: [],
  productoSeleccionado: '',
  cantidadProducto: 1
});

const state = reactive(getInitialState());

const totalPedido = computed(() => {
  return state.detalles.reduce((sum, d) => sum + (d.cantidad * (d.precioUnitario || 0)), 0);
});

const obtenerNombreProducto = (idProducto) => {
  const producto = props.productos.find(p => p.idProducto === idProducto);
  return producto ? producto.nombre : 'N/A';
};

const agregarProducto = () => {
  if (!state.productoSeleccionado || state.cantidadProducto <= 0) return;
  const producto = props.productos.find(p => p.idProducto === state.productoSeleccionado);
  if (!producto) return;

  const existente = state.detalles.find(d => d.idProducto === producto.idProducto);
  if (existente) {
    existente.cantidad += state.cantidadProducto;
  } else {
    state.detalles.push({
      idProducto: producto.idProducto,
      cantidad: state.cantidadProducto,
      precioUnitario: producto.precioCosto || 0
    });
  }

  state.productoSeleccionado = '';
  state.cantidadProducto = 1;
};

const eliminarProducto = (index) => {
  state.detalles.splice(index, 1);
};

const cerrarModal = () => {
  Object.assign(state, getInitialState());
  emit('update:modelValue', false);
};

const guardarPedido = async () => {
  try {
    await pedidosStore.crearPedido(
      { idProveedor: state.idProveedor },
      state.detalles
    );
    emit('pedidoGuardado');
    cerrarModal();
  } catch (error) {
    console.error('Error al guardar pedido:', error);
    alert('Error al guardar pedido: ' + error.message);
  }
};
</script>

<style scoped>
/* Modal Transition Styles */
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