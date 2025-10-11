<template>
  <Transition name="modal">
    <div v-if="modelValue" @click="cerrarModal" class="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-end md:items-center justify-center z-50">
      <div @click.stop class="modal-container bg-oscuro-600/50 backdrop-blur-lg w-full md:max-w-md rounded-t-4xl border border-oscuro-700 md:rounded-lg flex flex-col max-h-[90vh]">
        
        <div class="p-4 md:border-b md:border-oscuro-700 flex-shrink-0">
          <div class="w-12 h-1.5 mx-auto rounded-full bg-oscuro-600 mb-4 md:hidden"></div>
          <h3 class="text-lg text-center font-bold md:text-left">Historial de Movimientos</h3>
          <p v-if="producto" class="text-center md:text-left text-sm text-green-400 truncate">{{ producto.nombre }}</p>
        </div>

        <div class="p-4 space-y-3 overflow-y-auto flex-1">
          <div v-if="!movimientos || movimientos.length === 0" class="text-center py-16 text-oscuro-400">
            <p>No hay movimientos registrados para este producto.</p>
          </div>
          <div v-else>
            <div v-for="mov in movimientos" :key="mov.idMovimiento" class="bg-oscuro-900/50 p-3 rounded-lg">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <span :class="obtenerClaseTipo(mov.tipoMovimiento)" class="text-xs font-bold px-2 py-1 rounded-full capitalize">
                    {{ mov.tipoMovimiento }}
                  </span>
                  <p class="text-sm text-white mt-2">{{ mov.descripcion }}</p>
                </div>
                <div class="text-right flex-shrink-0 ml-4">
                  <p class="font-bold text-lg" :class="mov.cantidad >= 0 ? 'text-green-400' : 'text-red-400'">
                    {{ mov.cantidad > 0 ? '+' : '' }}{{ mov.cantidad }}
                  </p>
                  <p class="text-xs text-oscuro-500">{{ formatearFechaHora(mov.fecha) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-4 mt-auto md:border-t md:border-oscuro-700 flex-shrink-0">
          <button @click="cerrarModal" class="w-full px-4 py-2 bg-oscuro-700 text-white rounded-lg hover:bg-oscuro-600 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { formatearFechaHora } from '@/utils/helpers';

const props = defineProps({
  modelValue: Boolean,
  producto: Object,
  movimientos: Array
});

const emit = defineEmits(['update:modelValue']);

const cerrarModal = () => {
  emit('update:modelValue', false);
};

const obtenerClaseTipo = (tipo) => {
  const clases = {
    ingreso: 'bg-green-500/20 text-green-300',
    salida: 'bg-red-500/20 text-red-300',
    ajuste: 'bg-orange-500/20 text-orange-300'
  };
  return clases[tipo] || 'bg-gray-500/20 text-gray-300';
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