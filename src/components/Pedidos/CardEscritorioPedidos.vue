<template>
  <div @click="$emit('verDetalle', pedido)" class="bg-oscuro-850 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 border border-transparent hover:border-oscuro-700 flex flex-col">
    
    <!-- Header -->
    <div class="p-4 flex justify-between items-center border-b border-oscuro-700">
      <h3 class="font-bold text-white">Pedido #{{ pedido.idPedido.slice(0, 8) }}</h3>
      <span :class="obtenerClaseEstado(pedido.estado)" class="text-xs font-medium px-3 py-1 rounded-full capitalize">
        {{ pedido.estado }}
      </span>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-3 flex-grow">
      <div>
        <p class="text-sm text-oscuro-400">Proveedor</p>
        <p class="font-semibold text-white truncate">{{ obtenerNombreProveedor(pedido.idProveedor) }}</p>
      </div>
      <div>
        <p class="text-sm text-oscuro-400">Fecha</p>
        <p class="font-semibold text-white">{{ formatearFechaHora(pedido.fecha) }}</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-oscuro-700 bg-oscuro-900/50 rounded-b-lg">
      <div class="flex justify-between items-end">
        <div>
          <p class="text-sm text-oscuro-400">Total</p>
          <p class="text-2xl font-bold text-green-400">{{ formatearMoneda(pedido.total) }}</p>
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
    pendiente: 'bg-yellow-700/20 text-yellow-400',
    recibido: 'bg-green-700/20 text-green-400',
    cancelado: 'bg-red-700/20 text-red-400'
  };
  return clases[estado] || 'bg-gray-700/20 text-gray-300';
};
</script>