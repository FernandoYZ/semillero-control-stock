<template>
  <Transition name="modal">
    <div v-if="modelValue" @click="cerrarModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center z-40">
      <div @click.stop class="modal-container bg-oscuro-800/60 backdrop-blur-lg w-full md:max-w-2xl rounded-t-4xl border border-oscuro-700 md:rounded-lg flex flex-col max-h-[90vh]">
        
        <div class="p-4 md:border-b md:border-oscuro-700">
          <div class="w-12 h-1.5 mx-auto rounded-full bg-oscuro-600 mb-4 md:hidden"></div>
          <h3 class="text-lg text-center font-bold md:text-left">Nueva Venta</h3>
        </div>

        <div class="p-4 space-y-4 overflow-y-auto flex-1">
          <div class="space-y-4">
            <CampoFormulario id="cliente-nombre" label="Nombre del Cliente" v-model="state.nombreCliente" required placeholder="Escribe el nombre del cliente..." />

            <div class="pb-4 bg-oscuro-900/50 rounded-xl">
              <label class="block text-sm font-medium text-oscuro-400 mb-2">Agregar Productos</label>
              <div class="flex flex-col sm:flex-row gap-2">
                <select v-model="state.productoSeleccionado" class="w-full sm:flex-1 px-3 py-4 md:py-2 bg-oscuro-600/70 rounded-full md:rounded-lg text-oscuro-100 focus:ring-0 focus:outline-none focus:bg-oscuro-600 transition-colors">
                  <option :value="null" disabled>Seleccionar producto</option>
                  <option v-for="producto in productos" :key="producto.idProducto" :value="producto.idProducto">
                    {{ producto.nombre }} (Stock: {{ producto.stockActual }})
                  </option>
                </select>
                <div class="flex gap-2">
                  <input v-model.number="state.cantidadProducto" type="number" min="1" placeholder="Cant."
                    class="flex-grow w-full px-3 py-4 md:py-2 bg-oscuro-600/70 rounded-full md:rounded-lg text-oscuro-100 focus:ring-0 focus:outline-none focus:bg-oscuro-600 transition-colors">
                  <button @click="agregarProducto" type="button" class="flex-shrink-0 px-4 py-2 bg-gradient-to-b from-green-500 to-emerald-600 text-white rounded-2xl md:rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors">
                    <PlusIcono class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div v-if="state.detalles.length > 0" class="border border-oscuro-700 rounded-lg p-3 bg-oscuro-900/50">
              <h4 class="font-semibold mb-2 text-sm">Productos en la Venta</h4>
              <div class="space-y-2">
                <div v-for="(detalle, index) in state.detalles" :key="index" class="flex justify-between items-center py-2 border-b border-oscuro-700 last:border-0">
                  <div>
                    <p class="font-semibold text-white">{{ obtenerNombreProducto(detalle.idProducto) }}</p>
                    <p class="text-sm text-oscuro-400">{{ detalle.cantidad }} uds. x {{ formatearMoneda(detalle.precioUnitario) }} c/u</p>
                  </div>
                  <div class="flex items-center gap-4">
                    <p class="font-bold text-white w-20 text-right">S/.{{ formatearMoneda(detalle.cantidad * detalle.precioUnitario) }}</p>
                    <button @click="eliminarProducto(index)" class="text-red-500 hover:text-red-400 transition-colors" aria-label="Eliminar producto">
                      <BasureroIcono class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t border-oscuro-700 flex justify-between font-bold">
                <span>Total:</span>
                <span class="text-green-400 text-lg">S/.{{ formatearMoneda(totalVenta) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-4 md:border-t md:border-oscuro-700">
          <div class="flex gap-3 justify-end">
            <button type="button" @click="cerrarModal" class="hidden md:block px-4 py-2 bg-oscuro-700 hover:bg-oscuro-600 text-white rounded-xl transition-colors">
              Cancelar
            </button>
            <button @click="guardarVenta" :disabled="state.detalles.length === 0 || !state.nombreCliente.trim()" class="w-full md:w-auto px-4 py-3 md:py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-colors duration-200 font-semibold text-base md:text-sm cursor-pointer disabled:bg-gray-500 disabled:from-gray-500 disabled:to-gray-600">
              Guardar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { reactive, computed, defineProps, defineEmits } from 'vue';
import { useVentasStore } from '@/stores/ventas';
import { useClientesStore } from '@/stores/clientes';
import CampoFormulario from '@/components/Productos/CampoFormulario.vue';
import PlusIcono from '@/components/icons/PlusIcono.vue';
import BasureroIcono from '@/components/icons/BasureroIcono.vue';
import { formatearMoneda } from '@/utils/helpers';

const props = defineProps({
  modelValue: Boolean,
  productos: Array
});

const emit = defineEmits(['update:modelValue', 'ventaGuardada']);

const ventasStore = useVentasStore();
const clientesStore = useClientesStore();

const getInitialState = () => ({
  nombreCliente: '',
  detalles: [],
  productoSeleccionado: null,
  cantidadProducto: 1
});

const state = reactive(getInitialState());

const totalVenta = computed(() => {
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

  if (state.cantidadProducto > producto.stockActual) {
    alert(`Stock insuficiente. Solo quedan ${producto.stockActual} unidades.`);
    return;
  }

  const existente = state.detalles.find(d => d.idProducto === producto.idProducto);
  if (existente) {
    if (existente.cantidad + state.cantidadProducto > producto.stockActual) {
      alert(`Stock insuficiente. Ya tienes ${existente.cantidad} en el carrito y solo quedan ${producto.stockActual} unidades en total.`);
      return;
    }
    existente.cantidad += state.cantidadProducto;
  } else {
    state.detalles.push({
      idProducto: producto.idProducto,
      cantidad: state.cantidadProducto,
      precioUnitario: producto.precioVenta || 0
    });
  }

  state.productoSeleccionado = null;
  state.cantidadProducto = 1;
};

const eliminarProducto = (index) => {
  state.detalles.splice(index, 1);
};

const cerrarModal = () => {
  Object.assign(state, getInitialState());
  emit('update:modelValue', false);
};

const guardarVenta = async () => {
  try {
    if (!state.nombreCliente.trim()) {
      alert('Por favor, ingresa el nombre del cliente.');
      return;
    }
    if (state.detalles.length === 0) {
      alert('Agrega al menos un producto a la venta.');
      return;
    }

    const nuevoCliente = await clientesStore.agregarCliente({ nombre: state.nombreCliente });

    if (!nuevoCliente || !nuevoCliente.idCliente) {
      throw new Error('No se pudo crear el cliente.');
    }

    await ventasStore.crearVenta(
      { idCliente: nuevoCliente.idCliente },
      state.detalles
    );
    
    emit('ventaGuardada');
    cerrarModal();
  } catch (error) {
    console.error('Error al guardar venta:', error);
    alert('Error al guardar venta: ' + error.message);
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