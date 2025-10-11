<template>
  <div class="space-y-4">
    <!-- Filter Buttons -->
    <div class="flex gap-2 overflow-x-auto pb-2">
      <button @click="filtroTipo = ''" :class="filtroTipo === '' ? 'bg-green-600 text-white' : 'bg-oscuro-800 text-oscuro-300'" class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors">Todos</button>
      <button @click="filtroTipo = 'ingreso'" :class="filtroTipo === 'ingreso' ? 'bg-green-600 text-white' : 'bg-oscuro-800 text-oscuro-300'" class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors">Ingresos</button>
      <button @click="filtroTipo = 'salida'" :class="filtroTipo === 'salida' ? 'bg-red-600 text-white' : 'bg-oscuro-800 text-oscuro-300'" class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors">Salidas</button>
      <button @click="filtroTipo = 'ajuste'" :class="filtroTipo === 'ajuste' ? 'bg-orange-600 text-white' : 'bg-oscuro-800 text-oscuro-300'" class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors">Ajustes</button>
    </div>

    <!-- Movement List -->
    <div v-if="movimientosFiltrados.length === 0" class="text-center py-16 text-oscuro-400">
      <p>No hay movimientos que coincidan con el filtro.</p>
    </div>
    <div v-else class="space-y-3">
      <div v-for="mov in movimientosFiltrados" :key="mov.idMovimiento" class="bg-oscuro-800 p-4 rounded-xl shadow-lg">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <span :class="obtenerClaseTipo(mov.tipoMovimiento)" class="text-xs font-bold px-2 py-1 rounded-full capitalize">
              {{ mov.tipoMovimiento }}
            </span>
            <h3 class="font-semibold text-white mt-2">{{ obtenerNombreProducto(mov.idProducto) }}</h3>
            <p class="text-sm text-oscuro-400">{{ mov.descripcion }}</p>
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
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';
import { formatearFechaHora } from '@/utils/helpers';

const props = defineProps({
  movimientos: Array,
  productos: Array
});

const filtroTipo = ref('');

const movimientosFiltrados = computed(() => {
  if (!props.movimientos) return [];
  if (!filtroTipo.value) return props.movimientos;
  return props.movimientos.filter(m => m.tipoMovimiento === filtroTipo.value);
});

const obtenerNombreProducto = (idProducto) => {
  if (!props.productos) return 'N/A';
  const producto = props.productos.find(p => p.idProducto === idProducto);
  return producto ? producto.nombre : 'N/A';
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