<template>
  <div class="space-y-6">
    <!-- Header -->
    <header class="space-y-6">
      <!-- Desktop Title -->
      <div class="hidden md:block">
        <h1 class="text-4xl font-bold text-white">Categorías</h1>
      </div>
      <h2 class="text-2xl font-bold text-white md:hidden">Categorías</h2>

      <!-- Action Bar -->
      <div class="flex items-center gap-4 w-full">
        <div class="relative flex-grow">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <BuscarIcono class="w-5 h-5 text-oscuro-400" />
          </div>
          <input v-model="busqueda" type="text" placeholder="Buscar categoría..."
            class="w-full pl-10 pr-4 py-2 bg-oscuro-800 border border-oscuro-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
        </div>
        <button @click="abrirModal()" class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 flex items-center gap-2">
          <PlusIcono class="w-5 h-5" />
          <span class="hidden sm:inline">Nueva</span>
        </button>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="md:bg-oscuro-900/50 md:rounded-2xl md:p-6">
      <!-- "No Categories" State -->
      <div v-if="categoriasFiltradas.length === 0" class="text-center py-16 sm:py-24">
        <div class="inline-block bg-oscuro-800 p-5 sm:p-6 rounded-full shadow-lg">
          <BotonCategorias class="w-14 h-14 sm:w-16 sm:h-16 text-oscuro-500" />
        </div>
        <h3 class="text-2xl font-bold tracking-tight mt-6">Sin categorías</h3>
        <p class="text-sm sm:text-base text-oscuro-400 mt-2 max-w-md mx-auto">
          Comienza agregando tu primera categoría para organizar tus productos.
        </p>
      </div>

      <!-- Categories List -->
      <div v-else class="space-y-3">
        <div v-for="categoria in categoriasFiltradas" :key="categoria.idCategoria"
          class="bg-oscuro-800 p-4 rounded-xl shadow-lg flex justify-between items-center transition-all duration-300 hover:shadow-green-500/10 hover:border-oscuro-700 border border-transparent">
          <div>
            <h3 class="font-bold text-lg text-white">{{ categoria.nombre }}</h3>
            <p class="text-sm text-oscuro-400 mt-1">{{ categoria.descripcion }}</p>
          </div>
          <div class="flex gap-3 flex-shrink-0">
            <button @click="abrirModal(categoria)" class="w-9 h-9 flex items-center justify-center bg-oscuro-700/50 backdrop-blur-sm rounded-full text-white hover:bg-green-500 transition-colors" aria-label="Editar">
              <EditarIcono class="w-5 h-5" />
            </button>
            <button @click="eliminar(categoria.idCategoria)" class="w-9 h-9 flex items-center justify-center bg-oscuro-700/50 backdrop-blur-sm rounded-full text-white hover:bg-red-500 transition-colors" aria-label="Eliminar">
              <BasureroIcono class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </main>

    <CategoriaModal 
      v-model="modalAbierto"
      :categoria="categoriaActual"
      @categoriaGuardada="onCategoriaGuardada"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCategoriasStore } from "@/stores/categorias";
import CategoriaModal from "@/components/Categorias/CategoriaModal.vue";
import BuscarIcono from "@/components/icons/BuscarIcono.vue";
import PlusIcono from "@/components/icons/PlusIcono.vue";
import EditarIcono from "@/components/icons/EditarIcono.vue";
import BasureroIcono from "@/components/icons/BasureroIcono.vue";
import BotonCategorias from "@/components/partials/BotonCategorias.vue";

const store = useCategoriasStore();
const modalAbierto = ref(false);
const categoriaActual = ref(null);
const busqueda = ref("");

const categorias = computed(() => store.categorias);

const categoriasFiltradas = computed(() => {
  if (!busqueda.value) {
    return categorias.value || [];
  }
  const term = busqueda.value.toLowerCase();
  return (categorias.value || []).filter(
    (c) =>
      c.nombre.toLowerCase().includes(term) ||
      (c.descripcion && c.descripcion.toLowerCase().includes(term))
  );
});

const abrirModal = (categoria = null) => {
  categoriaActual.value = categoria;
  modalAbierto.value = true;
};

const onCategoriaGuardada = () => {
  store.cargarCategorias();
};

const eliminar = async (id) => {
  if (
    confirm(
      "¿Estás seguro de eliminar esta categoría? Esto podría afectar a los productos asociados."
    )
  ) {
    try {
      await store.eliminarCategoria(id);
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
  }
};

onMounted(() => {
  store.cargarCategorias();
});
</script>