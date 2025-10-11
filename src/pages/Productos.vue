<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="space-y-6">
      <!-- Desktop Title -->
      <div class="hidden md:block">
        <h1 class="text-4xl font-bold text-white">Productos</h1>
      </div>
      <h2 class="text-2xl font-bold text-white md:hidden">Productos</h2>

      <!-- Action Bar -->
      <div class="flex items-center gap-4 w-full">
        <div class="relative flex-grow">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <BuscarIcono class="w-5 h-5 text-oscuro-400" />
          </div>
          <input v-model="busqueda" type="text" placeholder="Buscar producto..."
            class="w-full pl-10 pr-4 py-2 bg-oscuro-800 border border-oscuro-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
        </div>
        <button @click="abrirModal()" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex-shrink-0 flex items-center gap-2">
          <PlusIcono class="w-5 h-5" />
          <span class="hidden sm:inline">Nuevo Producto</span>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="md:bg-oscuro-900/50 md:rounded-2xl md:p-6">
      <!-- "No Products" State -->
      <div v-if="!productosFiltrados || productosFiltrados.length === 0" class="text-center py-16 sm:py-24">
        <div class="inline-block bg-oscuro-800 p-5 sm:p-6 rounded-full shadow-lg">
          <ImagenIcono class="w-14 h-14 sm:w-16 sm:h-16 text-oscuro-500" />
        </div>
        <h3 class="text-2xl font-bold tracking-tight mt-6">Sin productos</h3>
        <p class="text-sm sm:text-base text-oscuro-400 mt-2 max-w-md mx-auto">
          Comienza agregando tu primer producto para empezar a gestionar tu inventario.
        </p>
      </div>
  
      <!-- Content -->
      <div v-else>
        <!-- Card View (Mobile) -->
        <div class="md:hidden space-y-3">
          <div v-for="producto in productosFiltrados" :key="producto.idProducto"
            class="bg-oscuro-800 p-4 rounded-2xl shadow-lg relative transition-all duration-300 hover:border-oscuro-700 border border-transparent">
            <div class="flex items-start gap-4">
              <img v-if="producto.imagen" :src="crearUrlImagen(producto.imagen)" alt="" class="w-16 h-16 object-cover rounded-xl border border-oscuro-700">
              <div v-else class="w-16 h-16 bg-oscuro-700 rounded-xl flex items-center justify-center text-oscuro-500 flex-shrink-0">
                <ImagenIcono class="w-8 h-8" />
              </div>
              <div class="flex-1">
                <p class="text-xs font-bold uppercase tracking-wider text-green-400 mb-1">{{ getCategoryName(producto.idCategoria) }}</p>
                <h3 class="font-bold text-lg text-white pr-16 truncate" :title="producto.nombre">{{ producto.nombre }}</h3>
                <p class="text-sm text-oscuro-400 font-mono">{{ producto.codigo }}</p>
              </div>
            </div>
            <div class="absolute top-3 right-3 flex flex-col gap-2">
              <button @click="abrirModal(producto)" class="w-8 h-8 flex items-center justify-center bg-oscuro-700/50 backdrop-blur-sm rounded-full text-white hover:bg-green-500 transition-colors" aria-label="Editar">
                <EditarIcono class="w-4 h-4" />
              </button>
              <button @click="eliminar(producto.idProducto)" class="w-8 h-8 flex items-center justify-center bg-oscuro-700/50 backdrop-blur-sm rounded-full text-white hover:bg-red-500 transition-colors" aria-label="Eliminar">
                <BasureroIcono class="w-4 h-4" />
              </button>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center mt-4 pt-4 border-t border-oscuro-700">
              <div>
                <p class="text-xs font-medium text-oscuro-400 uppercase tracking-wider">Stock</p>
                <p class="text-xl font-bold mt-1" :class="producto.stockActual <= producto.stockMinimo ? 'text-red-500' : 'text-green-400'">{{ producto.stockActual }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-oscuro-400 uppercase tracking-wider">Costo</p>
                <p class="text-xl font-bold text-white mt-1">S/.{{ producto.precioCosto.toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-xs font-medium text-oscuro-400 uppercase tracking-wider">Venta</p>
                <p class="text-xl font-bold text-green-400 mt-1">S/.{{ producto.precioVenta.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Grid View (Desktop) -->
        <div class="hidden md:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
           <div v-for="producto in productosFiltrados" :key="producto.idProducto"
            class="bg-oscuro-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 border border-transparent hover:border-oscuro-700">
            <div class="relative">
              <img v-if="producto.imagen" :src="crearUrlImagen(producto.imagen)" alt="" class="w-full h-48 object-cover">
              <div v-else class="w-full h-48 bg-oscuro-700 flex items-center justify-center text-oscuro-500">
                <ImagenIcono class="w-16 h-16" />
              </div>
              <div class="absolute top-2 right-2 flex gap-2">
                <button @click="abrirModal(producto)" class="w-8 h-8 flex items-center justify-center bg-oscuro-900/50 backdrop-blur-sm border border-white/10 rounded-full text-white hover:bg-green-500 transition-colors" aria-label="Editar">
                  <EditarIcono class="w-4 h-4" />
                </button>
                <button @click="eliminar(producto.idProducto)" class="w-8 h-8 flex items-center justify-center bg-oscuro-900/50 backdrop-blur-sm border border-white/10 rounded-full text-white hover:bg-red-500 transition-colors" aria-label="Eliminar">
                  <BasureroIcono class="w-4 h-4" />
                </button>
              </div>
              <span class="absolute bottom-2 left-2 bg-oscuro-900/50 backdrop-blur-sm border border-white/10 text-green-300 text-xs font-bold px-2 py-1 rounded-full">{{ getCategoryName(producto.idCategoria) }}</span>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-lg text-white truncate" :title="producto.nombre">{{ producto.nombre }}</h3>
              <p class="text-xs text-oscuro-500 font-mono">{{ producto.codigo }}</p>
              <div class="flex justify-between items-center mt-4">
                <div>
                  <p class="text-sm text-oscuro-400">Costo</p>
                  <p class="font-semibold text-white">S/.{{ producto.precioCosto.toFixed(2) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm text-oscuro-400">Venta</p>
                  <p class="font-bold text-lg text-green-400">S/.{{ producto.precioVenta.toFixed(2) }}</p>
                </div>
              </div>
              <div class="mt-4">
                <p class="text-sm text-oscuro-400">Stock</p>
                <div class="flex items-baseline gap-2">
                  <p class="font-bold text-2xl" :class="producto.stockActual <= producto.stockMinimo ? 'text-red-500' : 'text-green-400'">{{ producto.stockActual }}</p>
                  <p class="text-xs text-oscuro-500">/ min. {{ producto.stockMinimo }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Productos -->
    <ProductoModal
      v-model="modalAbierto"
      :producto="productoActual"
      :categorias="categorias"
      @productoGuardado="onProductoGuardado"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductosStore } from "@/stores/productos";
import { useCategoriasStore } from "@/stores/categorias";
import ProductoModal from "@/components/Productos/ProductoModal.vue";
import BuscarIcono from "@/components/icons/BuscarIcono.vue";
import PlusIcono from "@/components/icons/PlusIcono.vue";
import ImagenIcono from "@/components/icons/ImagenIcono.vue";
import EditarIcono from "@/components/icons/EditarIcono.vue";
import BasureroIcono from "@/components/icons/BasureroIcono.vue";

const productosStore = useProductosStore();
const categoriasStore = useCategoriasStore();

const modalAbierto = ref(false);
const productoActual = ref(null);
const busqueda = ref("");

const productos = computed(() => productosStore.productos);
const categorias = computed(() => categoriasStore.categorias);

const productosFiltrados = computed(() => {
  if (!busqueda.value) return productos.value;
  const term = busqueda.value.toLowerCase();
  return productos.value.filter(
    (p) =>
      p.nombre.toLowerCase().includes(term) ||
      p.codigo.toLowerCase().includes(term)
  );
});

const getCategoryName = (id) => {
  const categoria = categorias.value.find((c) => c.idCategoria === id);
  return categoria ? categoria.nombre : "N/A";
};

const abrirModal = (producto = null) => {
  productoActual.value = producto;
  modalAbierto.value = true;
};

const onProductoGuardado = () => {
  productosStore.cargarProductos();
};

const eliminar = async (id) => {
  if (confirm("¿Estás seguro de eliminar este producto?")) {
    try {
      await productosStore.eliminarProducto(id);
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
  }
};

const crearUrlImagen = (imagen) => {
  if (imagen instanceof Blob) {
    return URL.createObjectURL(imagen);
  }
  return null;
};

onMounted(async () => {
  await productosStore.cargarProductos();
  await categoriasStore.cargarCategorias();
});
</script>