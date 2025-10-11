<template>
  <div class="space-y-4">
    <!-- Search Bar -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <BuscarIcono class="w-5 h-5 text-oscuro-400" />
      </div>
      <input v-model="busqueda" type="text" placeholder="Buscar productos..."
        class="w-full pl-10 pr-4 md:py-2 py-4 bg-oscuro-800 border border-oscuro-700 rounded-full md:rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 outline-none">
    </div>

    <!-- Summary Card -->
    <div class="bg-oscuro-900/50 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
      <div class="text-center md:text-left">
        <p class="text-sm text-oscuro-400">Total Productos</p>
        <p class="text-2xl font-bold text-white">{{ productos.length }}</p>
      </div>
      <div class="text-center md:text-left">
        <p class="text-sm text-oscuro-400">Bajo Stock</p>
        <p class="text-2xl font-bold text-red-500">{{ productosBajoStock.length }}</p>
      </div>
      <div class="col-span-2 md:col-span-1 text-center md:text-right">
        <p class="text-sm text-oscuro-400">Valor Total Inventario</p>
        <p class="text-2xl font-bold text-green-400">S/.{{ formatearMoneda(valorTotalInventario) }}</p>
      </div>
    </div>

    <!-- Product List -->
    <div v-if="productosFiltrados.length === 0" class="text-center py-16 text-oscuro-400">
      <p>No hay productos que coincidan con la búsqueda.</p>
    </div>
    <div v-else class="space-y-3">
      <div v-for="producto in productosFiltrados" :key="producto.idProducto"
        class="bg-oscuro-800 p-4 rounded-xl shadow-lg flex justify-between items-center border-l-4"
        :class="producto.stockActual <= producto.stockMinimo ? 'border-red-500' : 'border-green-500'">
        
        <div>
          <h3 class="font-semibold text-white">{{ producto.nombre }}</h3>
          <p class="text-sm text-oscuro-400">{{ producto.codigo }}</p>
          <p class="text-xs text-oscuro-500">{{ obtenerNombreCategoria(producto.idCategoria) }}</p>
        </div>
        
        <div class="text-right">
          <div class="flex items-baseline gap-2 justify-end">
            <span class="text-2xl font-bold">{{ producto.stockActual }}</span>
            <span class="text-sm text-oscuro-400">/ {{ producto.stockMinimo }} min.</span>
          </div>
          <button @click="$emit('verMovimientos', producto)" class="text-green-400 hover:text-green-300 text-sm font-medium mt-1">
            Ver historial
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { formatearMoneda } from '@/utils/helpers';
import BuscarIcono from '@/components/icons/BuscarIcono.vue';

const props = defineProps({
  productos: Array,
  categorias: Array
});

defineEmits(['verMovimientos']);

const busqueda = ref('');

const productosFiltrados = computed(() => {
  if (!props.productos) return [];
  if (!busqueda.value) return props.productos;
  const term = busqueda.value.toLowerCase();
  return props.productos.filter(p =>
    p.nombre.toLowerCase().includes(term) ||
    p.codigo.toLowerCase().includes(term)
  );
});

const productosBajoStock = computed(() => {
  if (!props.productos) return [];
  return props.productos.filter(p => p.stockActual <= p.stockMinimo);
});

const valorTotalInventario = computed(() => {
  if (!props.productos) return 0;
  return props.productos.reduce((sum, p) => sum + (p.stockActual * p.precioCosto), 0);
});

const obtenerNombreCategoria = (idCategoria) => {
  if (!props.categorias) return 'Sin categoría';
  const categoria = props.categorias.find(c => c.idCategoria === idCategoria);
  return categoria ? categoria.nombre : 'Sin categoría';
};
</script>