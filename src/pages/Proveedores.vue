<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold">Proveedores</h2>
      <button @click="abrirModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
        + Nuevo
      </button>
    </div>

    <!-- Búsqueda -->
    <input v-model="busqueda" type="text" placeholder="Buscar proveedores..."
      class="w-full px-4 py-2 border border-gray-300 rounded-lg">

    <!-- Lista de proveedores -->
    <div v-if="proveedoresFiltrados.length === 0" class="bg-white p-8 rounded-lg shadow text-center text-gray-500">
      No hay proveedores registrados
    </div>

    <div v-else class="space-y-2">
      <div v-for="proveedor in proveedoresFiltrados" :key="proveedor.idProveedor"
        class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800">{{ proveedor.nombre }}</h3>
            <p class="text-sm text-gray-600">👤 {{ proveedor.contacto }}</p>
            <p class="text-sm text-gray-600">📧 {{ proveedor.email }}</p>
            <p class="text-sm text-gray-600">📞 {{ proveedor.telefono }}</p>
            <p class="text-sm text-gray-600">📍 {{ proveedor.direccion }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="abrirModal(proveedor)" class="text-blue-600 text-sm">Editar</button>
            <button @click="eliminar(proveedor.idProveedor)" class="text-red-600 text-sm">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalAbierto" @click="cerrarModal" class="fixed inset-0 bg-black/40 bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div @click.stop class="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-lg p-6 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">{{ proveedorActual ? 'Editar' : 'Nuevo' }} Proveedor</h3>
        <form @submit.prevent="guardar" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="form.nombre" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
            <input v-model="form.contacto" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="form.email" type="email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input v-model="form.telefono" type="tel" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <textarea v-model="form.direccion" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
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
import { useProveedoresStore } from '@/stores/proveedores'

const store = useProveedoresStore()
const modalAbierto = ref(false)
const proveedorActual = ref(null)
const busqueda = ref('')

const form = reactive({
  nombre: '',
  contacto: '',
  email: '',
  telefono: '',
  direccion: ''
})

const proveedores = computed(() => store.proveedores)

const proveedoresFiltrados = computed(() => {
  if (!busqueda.value) return proveedores.value
  const term = busqueda.value.toLowerCase()
  return proveedores.value.filter(p =>
    p.nombre.toLowerCase().includes(term) ||
    p.email.toLowerCase().includes(term)
  )
})

const abrirModal = (proveedor = null) => {
  proveedorActual.value = proveedor
  if (proveedor) {
    Object.assign(form, proveedor)
  } else {
    Object.keys(form).forEach(key => form[key] = '')
  }
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  proveedorActual.value = null
}

const guardar = async () => {
  try {
    if (proveedorActual.value) {
      await store.actualizarProveedor(proveedorActual.value.idProveedor, { ...form })
    } else {
      await store.agregarProveedor({ ...form })
    }
    cerrarModal()
  } catch (error) {
    alert('Error al guardar: ' + error.message)
  }
}

const eliminar = async (id) => {
  if (confirm('¿Estás seguro de eliminar este proveedor?')) {
    try {
      await store.eliminarProveedor(id)
    } catch (error) {
      alert('Error al eliminar: ' + error.message)
    }
  }
}

onMounted(() => {
  store.cargarProveedores()
})
</script>
