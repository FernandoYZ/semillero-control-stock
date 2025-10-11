<template>
  <div @click="$emit('verDetalle', venta)" class="bg-oscuro-800 rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 border border-transparent hover:border-oscuro-700 flex flex-col">
    
    <!-- Header -->
    <div class="p-4 flex justify-between items-center border-b border-oscuro-700">
      <h3 class="font-bold text-white">Venta #{{ venta.idVenta.slice(0, 8) }}</h3>
      <p class="text-sm text-oscuro-400">{{ formatearFechaHora(venta.fecha) }}</p>
    </div>

    <!-- Content -->
    <div class="p-4 space-y-3 flex-grow">
      <div>
        <p class="text-sm text-oscuro-400">Cliente</p>
        <p class="font-semibold text-white truncate">{{ obtenerNombreCliente(venta.idCliente) }}</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-oscuro-700 bg-oscuro-900/50 rounded-b-lg">
      <div class="text-right w-full">
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