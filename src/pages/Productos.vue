<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold">Productos</h2>
      <button @click="abrirModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
        + Nuevo
      </button>
    </div>

    <!-- Filtro de búsqueda -->
    <input v-model="busqueda" type="text" placeholder="Buscar productos..."
      class="w-full px-4 py-2 border border-gray-300 rounded-lg">

    <!-- Lista de productos -->
    <div v-if="productosFiltrados.length === 0" class="bg-white p-8 rounded-lg shadow text-center text-gray-500">
      No hay productos registrados
    </div>

    <div v-else class="space-y-2">
      <div v-for="producto in productosFiltrados" :key="producto.idProducto"
        class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800">{{ producto.nombre }}</h3>
            <p class="text-sm text-gray-600">{{ producto.codigo }}</p>
            <p class="text-xs text-gray-500">{{ producto.descripcion }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="abrirModal(producto)" class="text-blue-600 text-sm">Editar</button>
            <button @click="eliminar(producto.idProducto)" class="text-red-600 text-sm">Eliminar</button>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 text-sm mt-3 pt-3 border-t">
          <div>
            <span class="text-gray-600">Stock:</span>
            <span class="font-semibold ml-1" :class="producto.stockActual <= producto.stockMinimo ? 'text-red-600' : 'text-green-600'">
              {{ producto.stockActual }}
            </span>
          </div>
          <div>
            <span class="text-gray-600">Costo:</span>
            <span class="font-semibold ml-1">${{ producto.precioCosto }}</span>
          </div>
          <div>
            <span class="text-gray-600">Venta:</span>
            <span class="font-semibold ml-1">${{ producto.precioVenta }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalAbierto" @click="cerrarModal" class="fixed inset-0 bg-black/40 bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div @click.stop class="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-lg p-6 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">{{ productoActual ? 'Editar' : 'Nuevo' }} Producto</h3>
        <form @submit.prevent="guardar" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Código SKU</label>
            <input v-model="form.codigo" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="form.nombre" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea v-model="form.descripcion" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select v-model="form.idCategoria" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Seleccionar categoría</option>
              <option v-for="cat in categorias" :key="cat.idCategoria" :value="cat.idCategoria">
                {{ cat.nombre }}
              </option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio Costo</label>
              <input v-model.number="form.precioCosto" type="number" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Precio Venta</label>
              <input v-model.number="form.precioVenta" type="number" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stock Actual</label>
              <input v-model.number="form.stockActual" type="number" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
              <input v-model.number="form.stockMinimo" type="number" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            </div>
          </div>
          <div class="flex gap-3 pt-2">
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
import { useProductosStore } from '@/stores/productos'
import { useCategoriasStore } from '@/stores/categorias'

const productosStore = useProductosStore()
const categoriasStore = useCategoriasStore()

const modalAbierto = ref(false)
const productoActual = ref(null)
const busqueda = ref('')

const form = reactive({
  codigo: '',
  nombre: '',
  descripcion: '',
  idCategoria: '',
  precioCosto: 0,
  precioVenta: 0,
  stockActual: 0,
  stockMinimo: 0
})

const productos = computed(() => productosStore.productos)
const categorias = computed(() => categoriasStore.categorias)

const productosFiltrados = computed(() => {
  if (!busqueda.value) return productos.value
  const term = busqueda.value.toLowerCase()
  return productos.value.filter(p =>
    p.nombre.toLowerCase().includes(term) ||
    p.codigo.toLowerCase().includes(term)
  )
})

const abrirModal = (producto = null) => {
  productoActual.value = producto
  if (producto) {
    Object.assign(form, producto)
  } else {
    Object.keys(form).forEach(key => {
      form[key] = typeof form[key] === 'number' ? 0 : ''
    })
  }
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  productoActual.value = null
}

const guardar = async () => {
  try {
    if (productoActual.value) {
      await productosStore.actualizarProducto(productoActual.value.idProducto, { ...form })
    } else {
      await productosStore.agregarProducto({ ...form })
    }
    cerrarModal()
  } catch (error) {
    alert('Error al guardar: ' + error.message)
  }
}

const eliminar = async (id) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    try {
      await productosStore.eliminarProducto(id)
    } catch (error) {
      alert('Error al eliminar: ' + error.message)
    }
  }
}

onMounted(async () => {
  await productosStore.cargarProductos()
  await categoriasStore.cargarCategorias()
})
</script>
