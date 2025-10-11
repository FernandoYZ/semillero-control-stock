<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <header class="space-y-6">
      <!-- Desktop Title -->
      <div class="hidden md:block">
        <h1 class="text-4xl font-bold text-white">Inventario</h1>
      </div>
      <!-- Action Bar -->
      <div class="flex items-center justify-between gap-4 w-full">
        <h2 class="text-2xl font-bold text-white md:hidden">Inventario</h2>
        <button @click="modalAjuste = true" class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-4 md:py-2 rounded-2xl md:rounded-lg text-sm font-medium transition-colors flex-shrink-0 flex items-center gap-2">
          <PlusIcono class="w-5 h-5" />
          <span class="hidden sm:inline">Ajuste Manual</span>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main>
      <!-- Tabs -->
      <div class="border-b border-oscuro-700">
        <nav class="-mb-px flex space-x-6" aria-label="Tabs">
          <button @click="tabActiva = 'productos'" 
            :class="[tabActiva === 'productos' ? 'border-green-400 text-green-400' : 'border-transparent text-oscuro-400 hover:text-oscuro-200 hover:border-oscuro-500']"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors">
            Productos
          </button>
          <button @click="tabActiva = 'movimientos'" 
            :class="[tabActiva === 'movimientos' ? 'border-green-400 text-green-400' : 'border-transparent text-oscuro-400 hover:text-oscuro-200 hover:border-oscuro-500']"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors">
            Movimientos
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="pt-6">
        <InventarioProductos 
          v-if="tabActiva === 'productos'" 
          :productos="productos"
          :categorias="categorias"
          @verMovimientos="verMovimientos"
        />
        <InventarioMovimientos 
          v-if="tabActiva === 'movimientos'" 
          :movimientos="movimientos"
          :productos="productos"
        />
      </div>
    </main>

    <ModalAjuste 
      v-model="modalAjuste"
      :productos="productos"
      @ajusteGuardado="onAjusteGuardado"
    />

    <ModalHistorial 
      v-model="modalMovimientos"
      :producto="productoSeleccionado"
      :movimientos="movimientosProducto"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useProductosStore } from '@/stores/productos';
import { useCategoriasStore } from '@/stores/categorias';
import { useMovimientosStore } from '@/stores/movimientos';
import PlusIcono from '@/components/icons/PlusIcono.vue';
import ModalAjuste from '@/components/Inventario/ModalAjuste.vue';
import ModalHistorial from '@/components/Inventario/ModalHistorial.vue';
import InventarioProductos from '@/components/Inventario/InventarioProductos.vue';
import InventarioMovimientos from '@/components/Inventario/InventarioMovimientos.vue';

const productosStore = useProductosStore();
const categoriasStore = useCategoriasStore();
const movimientosStore = useMovimientosStore();

const tabActiva = ref('productos');
const modalAjuste = ref(false);
const modalMovimientos = ref(false);
const productoSeleccionado = ref(null);
const movimientosProducto = ref([]);

const productos = computed(() => productosStore.productos);
const categorias = computed(() => categoriasStore.categorias);
const movimientos = computed(() => movimientosStore.movimientos);

const onAjusteGuardado = () => {
  productosStore.cargarProductos();
  movimientosStore.cargarMovimientos();
};

const verMovimientos = async (producto) => {
  productoSeleccionado.value = producto;
  movimientosProducto.value = await movimientosStore.obtenerMovimientosPorProducto(producto.idProducto);
  modalMovimientos.value = true;
};

onMounted(async () => {
  await productosStore.cargarProductos();
  await categoriasStore.cargarCategorias();
  await movimientosStore.cargarMovimientos();
});
</script>