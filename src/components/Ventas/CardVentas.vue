<template>
  <div @click="$emit('verDetalle', venta)" class="bg-oscuro-800 p-4 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:border-oscuro-700 border border-transparent">
    
    <div class="flex justify-between items-start">
      <!-- Left: Sale Details -->
      <div class="space-y-1">
        <p class="text-sm text-oscuro-400">Cliente</p>
        <h3 class="font-semibold text-white truncate pr-4">{{ obtenerNombreCliente(venta.idCliente) }}</h3>
        <p class="text-xs text-oscuro-500 font-mono">#{{ venta.idVenta.slice(0, 8) }} &bull; {{ formatearFechaHora(venta.fecha) }}</p>
      </div>
      <!-- Right: Total -->
      <div class="text-right flex-shrink-0">
        <p class="text-sm text-oscuro-400">Total</p>
        <p class="text-2xl font-bold text-green-400">{{ formatearMoneda(venta.total) }}</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { formatearMoneda, formatearFechaHora } from '@/utils/helpers';

const props = defineProps({
  venta: Object,
  obtenerNombreCliente: Function
});

defineEmits(['verDetalle']);
</script>