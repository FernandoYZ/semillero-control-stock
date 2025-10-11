<template>
  <Transition name="modal">
    <div v-if="modelValue" @click="cerrarModal" class="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-end md:items-center justify-center z-50">
      <div @click.stop class="modal-container bg-oscuro-600/50 backdrop-blur-lg w-full md:max-w-md rounded-t-4xl border border-oscuro-700 md:rounded-lg flex flex-col max-h-[90vh]">
        
        <div class="p-4 md:border-b md:border-oscuro-700">
          <div class="w-12 h-1.5 mx-auto rounded-full bg-oscuro-600 mb-4 md:hidden"></div>
          <h3 class="text-lg text-center font-bold md:text-left">Ajuste Manual de Inventario</h3>
        </div>

        <form @submit.prevent="guardar" class="p-4 space-y-4 overflow-y-auto flex-1">
          <div class="space-y-4">
            <CampoFormulario as="select" id="producto-ajuste" label="Producto" v-model="form.idProducto" required>
              <option disabled value="">Seleccionar producto</option>
              <option v-for="producto in productos" :key="producto.idProducto" :value="producto.idProducto" class="bg-oscuro-800/50">
                {{ producto.nombre }} (Stock: {{ producto.stockActual }})
              </option>
            </CampoFormulario>
            
            <CampoFormulario id="cantidad-ajuste" label="Cantidad a ajustar" v-model.number="form.cantidad" type="number" required />
            <p class="text-xs text-oscuro-400 -mt-2 px-1">Usa un número positivo para agregar stock y uno negativo para quitar.</p>

            <CampoFormulario id="precio-ajuste" label="Precio Unitario (Costo)" v-model.number="form.precioUnitario" type="number" step="0.01" required />

            <CampoFormulario as="textarea" id="desc-ajuste" label="Motivo del ajuste" v-model="form.descripcion" rows="3" required />
          </div>
        </form>
        
        <div class="p-4 mt-auto md:border-t md:border-oscuro-700">
          <div class="flex gap-3 justify-end">
            <button type="button" @click="cerrarModal" class="hidden md:block px-4 py-2 bg-oscuro-700 hover:bg-oscuro-600 text-white rounded-xl transition-colors">
              Cancelar
            </button>
            <button @click="guardar" type="button" class="w-full md:w-auto px-4 py-3 md:py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl transition-colors duration-200 font-semibold text-base md:text-sm cursor-pointer">
              Guardar Ajuste
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { reactive, watch, defineProps, defineEmits } from 'vue';
import { useMovimientosStore } from '@/stores/movimientos';
import CampoFormulario from '@/components/Productos/CampoFormulario.vue';

const props = defineProps({
  modelValue: Boolean,
  productos: Array
});

const emit = defineEmits(['update:modelValue', 'ajusteGuardado']);

const movimientosStore = useMovimientosStore();

const getInitialState = () => ({
  idProducto: '',
  cantidad: 0,
  precioUnitario: 0,
  descripcion: ''
});

const form = reactive(getInitialState());

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    Object.assign(form, getInitialState());
  }
});

const cerrarModal = () => {
  emit('update:modelValue', false);
};

const guardar = async () => {
  if (!form.idProducto || form.cantidad === 0) {
    alert('Por favor, selecciona un producto y una cantidad diferente de cero.');
    return;
  }
  try {
    await movimientosStore.crearAjuste(
      form.idProducto,
      form.cantidad,
      form.precioUnitario,
      form.descripcion
    );
    emit('ajusteGuardado');
    cerrarModal();
  } catch (error) {
    console.error('Error al guardar ajuste:', error);
    alert('Error al guardar ajuste: ' + error.message);
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