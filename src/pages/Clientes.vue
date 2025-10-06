<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold">Clientes</h2>
      <button @click="abrirModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
        + Nuevo
      </button>
    </div>

    <!-- Búsqueda -->
    <input v-model="busqueda" type="text" placeholder="Buscar clientes..."
      class="w-full px-4 py-2 border border-gray-300 rounded-lg">

    <!-- Lista de clientes -->
    <div v-if="clientesFiltrados.length === 0" class="bg-white p-8 rounded-lg shadow text-center text-gray-500">
      No hay clientes registrados
    </div>

    <div v-else class="space-y-2">
      <div v-for="cliente in clientesFiltrados" :key="cliente.idCliente"
        class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800">{{ cliente.nombre }}</h3>
            <p class="text-sm text-gray-600">📧 {{ cliente.email }}</p>
            <p class="text-sm text-gray-600">📞 {{ cliente.telefono }}</p>
            <p class="text-sm text-gray-600">📍 {{ cliente.direccion }}</p>
          </div>
          <div class="flex gap-2">
            <button @click="abrirModal(cliente)" class="text-blue-600 text-sm">Editar</button>
            <button @click="eliminar(cliente.idCliente)" class="text-red-600 text-sm">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalAbierto" @click="cerrarModal" class="fixed inset-0 bg-black/40 bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div @click.stop class="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-lg p-6 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">{{ clienteActual ? 'Editar' : 'Nuevo' }} Cliente</h3>
        <form @submit.prevent="guardar" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="form.nombre" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
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
import { useClientesStore } from '@/stores/clientes'

const store = useClientesStore()
const modalAbierto = ref(false)
const clienteActual = ref(null)
const busqueda = ref('')

const form = reactive({
  nombre: '',
  email: '',
  telefono: '',
  direccion: ''
})

const clientes = computed(() => store.clientes)

const clientesFiltrados = computed(() => {
  if (!busqueda.value) return clientes.value
  const term = busqueda.value.toLowerCase()
  return clientes.value.filter(c =>
    c.nombre.toLowerCase().includes(term) ||
    c.email.toLowerCase().includes(term)
  )
})

const abrirModal = (cliente = null) => {
  clienteActual.value = cliente
  if (cliente) {
    Object.assign(form, cliente)
  } else {
    Object.keys(form).forEach(key => form[key] = '')
  }
  modalAbierto.value = true
}

const cerrarModal = () => {
  modalAbierto.value = false
  clienteActual.value = null
}

const guardar = async () => {
  try {
    if (clienteActual.value) {
      await store.actualizarCliente(clienteActual.value.idCliente, { ...form })
    } else {
      await store.agregarCliente({ ...form })
    }
    cerrarModal()
  } catch (error) {
    alert('Error al guardar: ' + error.message)
  }
}

const eliminar = async (id) => {
  if (confirm('¿Estás seguro de eliminar este cliente?')) {
    try {
      await store.eliminarCliente(id)
    } catch (error) {
      alert('Error al eliminar: ' + error.message)
    }
  }
}

onMounted(() => {
  store.cargarClientes()
})
</script>
