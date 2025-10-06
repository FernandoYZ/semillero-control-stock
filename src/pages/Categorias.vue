<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold">Categorías</h2>
      <button @click="modalAbierto = true" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
        + Nueva
      </button>
    </div>

    <!-- Lista de categorías -->
    <div v-if="categorias.length === 0" class="bg-white p-8 rounded-lg shadow text-center text-gray-500">
      No hay categorías registradas
    </div>

    <div v-else class="space-y-2">
      <div v-for="categoria in categorias" :key="categoria.idCategoria"
        class="bg-white p-4 rounded-lg shadow flex justify-between items-center">
        <div>
          <h3 class="font-semibold text-gray-800">{{ categoria.nombre }}</h3>
          <p class="text-sm text-gray-600">{{ categoria.descripcion }}</p>
        </div>
        <div class="flex gap-2">
          <button @click="editarCategoria(categoria)" class="text-blue-600 px-2 py-1 text-sm">Editar</button>
          <button @click="eliminar(categoria.idCategoria)" class="text-red-600 px-2 py-1 text-sm">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalAbierto" @click="cerrarModal" class="fixed inset-0 bg-black/40 bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div @click.stop class="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-lg p-6 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">{{ categoriaActual ? 'Editar' : 'Nueva' }} Categoría</h3>
        <form @submit.prevent="guardar" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="form.nombre" type="text" required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea v-model="form.descripcion" rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
          </div>
          <div class="flex gap-3">
            <button type="button" @click="cerrarModal" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
              Cancelar
            </button>
            <button type="submit" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useCategoriasStore } from '@/stores/categorias'

const store = useCategoriasStore()
const modalAbierto = ref(false)
const categoriaActual = ref(null)

const form = reactive({
  nombre: '',
  descripcion: ''
})

const categorias = computed(() => store.categorias)

const editarCategoria = (categoria) => {
  categoriaActual.value = categoria
  form.nombre = categoria.nombre
  form.descripcion = categoria.descripcion || ''
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  categoriaActual.value = null
  form.nombre = ''
  form.descripcion = ''
}

const guardar = async () => {
  try {
    if (categoriaActual.value) {
      await store.actualizarCategoria(categoriaActual.value.idCategoria, {
        nombre: form.nombre,
        descripcion: form.descripcion
      })
    } else {
      await store.agregarCategoria({
        nombre: form.nombre,
        descripcion: form.descripcion
      })
    }
    cerrarModal()
  } catch (error) {
    alert('Error al guardar: ' + error.message)
  }
}

const eliminar = async (id) => {
  if (confirm('¿Estás seguro de eliminar esta categoría?')) {
    try {
      await store.eliminarCategoria(id)
    } catch (error) {
      alert('Error al eliminar: ' + error.message)
    }
  }
}

onMounted(() => {
  store.cargarCategorias()
})
</script>
