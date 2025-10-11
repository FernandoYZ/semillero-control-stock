<template>
  <div @click="$emit('verDetalle', pedido)" class="bg-oscuro-850 p-4 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:border-oscuro-700 border border-transparent">
    
    <!-- Main Info -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="font-bold text-white text-lg">Pedido #{{ pedido.idPedido.slice(0, 8) }}</h3>
        <p class="text-sm text-oscuro-400">{{ obtenerNombreProveedor(pedido.idProveedor) }}</p>
        <p class="text-xs text-oscuro-500 mt-1">{{ formatearFechaHora(pedido.fecha) }}</p>
      </div>
      <span :class="obtenerClaseEstado(pedido.estado)" class="text-xs font-medium px-3 py-1 rounded-full capitalize flex-shrink-0">
        {{ pedido.estado }}
      </span>
    </div>

    <!-- Footer: Total & Actions -->
    <div class="flex items-center justify-between pt-4 border-t border-oscuro-700">
      <div class="flex items-baseline gap-2">
        <span class="text-sm text-oscuro-400">Total:</span>
        <span class="text-xl font-bold text-green-400">S/.{{ formatearMoneda(pedido.total) }}</span>
      </div>
      <div v-if="pedido.estado === 'pendiente'" class="flex gap-2">
        <button @click.stop="$emit('marcarRecibido', pedido.idPedido)" class="w-9 h-9 flex items-center justify-center bg-green-600/20 text-green-300 rounded-full hover:bg-green-500 hover:text-white transition-colors" aria-label="Marcar Recibido">
          <CheckIcono class="w-5 h-5" />
        </button>
        <button @click.stop="$emit('cancelar', pedido.idPedido)" class="w-9 h-9 flex items-center justify-center bg-red-600/20 text-red-300 rounded-full hover:bg-red-500 hover:text-white transition-colors" aria-label="Cancelar">
          <CloseIcono class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { formatearMoneda, formatearFechaHora } from '@/utils/helpers';
import CheckIcono from '@/components/icons/CheckIcono.vue';
import CloseIcono from '@/components/icons/CloseIcono.vue';

const props = defineProps({
  pedido: Object,
  obtenerNombreProveedor: Function
});

defineEmits(['verDetalle', 'marcarRecibido', 'cancelar']);

const obtenerClaseEstado = (estado) => {
  const clases = {
    pendiente: 'bg-orange-500/20 text-orange-300',
    recibido: 'bg-blue-500/20 text-blue-300',
    cancelado: 'bg-red-500/20 text-red-300'
  };
  return clases[estado] || 'bg-gray-500/20 text-gray-300';
};
</script>