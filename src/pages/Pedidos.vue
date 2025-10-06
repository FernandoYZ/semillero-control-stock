<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold">Pedidos</h2>
      <button @click="abrirModalNuevoPedido()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
        + Nuevo Pedido
      </button>
    </div>

    <!-- Filtro por estado -->
    <div class="flex gap-2 overflow-x-auto pb-2">
      <button @click="filtroEstado = ''" :class="filtroEstado === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
        class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
        Todos
      </button>
      <button @click="filtroEstado = 'pendiente'" :class="filtroEstado === 'pendiente' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'"
        class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
        Pendientes
      </button>
      <button @click="filtroEstado = 'recibido'" :class="filtroEstado === 'recibido' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'"
        class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
        Recibidos
      </button>
      <button @click="filtroEstado = 'cancelado'" :class="filtroEstado === 'cancelado' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'"
        class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
        Cancelados
      </button>
    </div>

    <!-- Lista de pedidos -->
    <div v-if="pedidosFiltrados.length === 0" class="bg-white p-8 rounded-lg shadow text-center text-gray-500">
      No hay pedidos registrados
    </div>

    <div v-else class="space-y-2">
      <div v-for="pedido in pedidosFiltrados" :key="pedido.idPedido"
        class="bg-white p-4 rounded-lg shadow cursor-pointer"
        @click="verDetalle(pedido)">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800">Pedido #{{ pedido.idPedido.slice(0, 8) }}</h3>
            <p class="text-sm text-gray-600">{{ formatearFechaHora(pedido.fecha) }}</p>
            <p class="text-sm text-gray-600">Proveedor: {{ obtenerNombreProveedor(pedido.idProveedor) }}</p>
          </div>
          <div class="text-right">
            <span :class="obtenerClaseEstado(pedido.estado)" class="text-xs font-medium px-2 py-1 rounded">
              {{ pedido.estado.toUpperCase() }}
            </span>
            <p class="text-lg font-bold text-blue-600 mt-1">{{ formatearMoneda(pedido.total) }}</p>
          </div>
        </div>
        <div v-if="pedido.estado === 'pendiente'" class="flex gap-2 mt-3 pt-3 border-t">
          <button @click.stop="cambiarEstado(pedido.idPedido, 'recibido')"
            class="flex-1 px-3 py-1 bg-green-600 text-white rounded text-sm">
            Marcar Recibido
          </button>
          <button @click.stop="cambiarEstado(pedido.idPedido, 'cancelado')"
            class="flex-1 px-3 py-1 bg-red-600 text-white rounded text-sm">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Nuevo Pedido -->
    <div v-if="modalNuevoPedido" @click="cerrarModalNuevoPedido" class="fixed inset-0 bg-black/40 bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div @click.stop class="bg-white w-full md:max-w-2xl rounded-t-2xl md:rounded-lg p-6 max-h-[85vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">Nuevo Pedido</h3>

        <!-- Seleccionar proveedor -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
          <select v-model="nuevoPedido.idProveedor" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">Seleccionar proveedor</option>
            <option v-for="proveedor in proveedores" :key="proveedor.idProveedor" :value="proveedor.idProveedor">
              {{ proveedor.nombre }}
            </option>
          </select>
        </div>

        <!-- Agregar productos -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Agregar Producto</label>
          <div class="flex gap-2">
            <select v-model="productoSeleccionado" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Seleccionar producto</option>
              <option v-for="producto in productos" :key="producto.idProducto" :value="producto.idProducto">
                {{ producto.nombre }}
              </option>
            </select>
            <input v-model.number="cantidadProducto" type="number" min="1" placeholder="Cant."
              class="w-20 px-3 py-2 border border-gray-300 rounded-lg">
            <button @click="agregarProducto" type="button" class="px-4 py-2 bg-blue-600 text-white rounded-lg">
              +
            </button>
          </div>
        </div>

        <!-- Lista de productos -->
        <div v-if="nuevoPedido.detalles.length > 0" class="mb-4 border rounded-lg p-3">
          <h4 class="font-semibold mb-2 text-sm">Productos</h4>
          <div v-for="(detalle, index) in nuevoPedido.detalles" :key="index" class="flex justify-between items-center py-2 border-b last:border-0">
            <div class="flex-1">
              <p class="text-sm font-medium">{{ obtenerNombreProducto(detalle.idProducto) }}</p>
              <input v-model.number="detalle.precioUnitario" type="number" step="0.01"
                class="text-xs w-24 px-2 py-1 border border-gray-300 rounded mt-1"
                placeholder="Precio">
              <span class="text-xs text-gray-600 ml-1">x {{ detalle.cantidad }}</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-semibold">{{ formatearMoneda(detalle.cantidad * detalle.precioUnitario) }}</span>
              <button @click="eliminarProducto(index)" class="text-red-600 text-sm">✕</button>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t flex justify-between font-bold">
            <span>Total:</span>
            <span class="text-blue-600">{{ formatearMoneda(totalPedido) }}</span>
          </div>
        </div>

        <div class="flex gap-3">
          <button type="button" @click="cerrarModalNuevoPedido" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
            Cancelar
          </button>
          <button @click="guardarPedido" :disabled="nuevoPedido.detalles.length === 0 || !nuevoPedido.idProveedor"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300">
            Guardar Pedido
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Detalle -->
    <div v-if="modalDetalle" @click="cerrarModalDetalle" class="fixed inset-0 bg-black/40 bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div @click.stop class="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-lg p-6 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">Detalle de Pedido</h3>
        <div v-if="pedidoSeleccionado" class="space-y-3">
          <div>
            <p class="text-sm text-gray-600">Fecha</p>
            <p class="font-medium">{{ formatearFechaHora(pedidoSeleccionado.fecha) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Proveedor</p>
            <p class="font-medium">{{ obtenerNombreProveedor(pedidoSeleccionado.idProveedor) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Estado</p>
            <span :class="obtenerClaseEstado(pedidoSeleccionado.estado)" class="inline-block text-xs font-medium px-3 py-1 rounded mt-1">
              {{ pedidoSeleccionado.estado.toUpperCase() }}
            </span>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-2">Productos</p>
            <div v-for="detalle in detallesPedido" :key="detalle.idDetalle" class="bg-gray-50 p-2 rounded mb-2">
              <p class="font-medium text-sm">{{ obtenerNombreProducto(detalle.idProducto) }}</p>
              <p class="text-xs text-gray-600">{{ detalle.cantidad }} x {{ formatearMoneda(detalle.precioUnitario) }}</p>
            </div>
          </div>
          <div class="pt-3 border-t">
            <p class="text-sm text-gray-600">Total</p>
            <p class="text-2xl font-bold text-blue-600">{{ formatearMoneda(pedidoSeleccionado.total) }}</p>
          </div>
        </div>
        <button @click="cerrarModalDetalle" class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { usePedidosStore } from '@/stores/pedidos'
import { useProveedoresStore } from '@/stores/proveedores'
import { useProductosStore } from '@/stores/productos'
import { formatearMoneda, formatearFechaHora } from '@/utils/helpers'

const pedidosStore = usePedidosStore()
const proveedoresStore = useProveedoresStore()
const productosStore = useProductosStore()

const modalNuevoPedido = ref(false)
const modalDetalle = ref(false)
const pedidoSeleccionado = ref(null)
const detallesPedido = ref([])
const productoSeleccionado = ref('')
const cantidadProducto = ref(1)
const filtroEstado = ref('')

const nuevoPedido = reactive({
  idProveedor: '',
  detalles: []
})

const pedidos = computed(() => pedidosStore.pedidos)
const proveedores = computed(() => proveedoresStore.proveedores)
const productos = computed(() => productosStore.productos)

const pedidosFiltrados = computed(() => {
  if (!filtroEstado.value) return pedidos.value
  return pedidos.value.filter(p => p.estado === filtroEstado.value)
})

const totalPedido = computed(() => {
  return nuevoPedido.detalles.reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0)
})

const obtenerNombreProveedor = (idProveedor) => {
  const proveedor = proveedores.value.find(p => p.idProveedor === idProveedor)
  return proveedor ? proveedor.nombre : 'N/A'
}

const obtenerNombreProducto = (idProducto) => {
  const producto = productos.value.find(p => p.idProducto === idProducto)
  return producto ? producto.nombre : 'N/A'
}

const obtenerClaseEstado = (estado) => {
  const clases = {
    pendiente: 'bg-orange-100 text-orange-800',
    recibido: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800'
  }
  return clases[estado] || 'bg-gray-100 text-gray-800'
}

const abrirModalNuevoPedido = () => {
  nuevoPedido.idProveedor = ''
  nuevoPedido.detalles = []
  productoSeleccionado.value = ''
  cantidadProducto.value = 1
  modalNuevoPedido.value = true
}

const cerrarModalNuevoPedido = () => {
  modalNuevoPedido.value = false
}

const agregarProducto = () => {
  if (!productoSeleccionado.value || cantidadProducto.value <= 0) return

  const producto = productos.value.find(p => p.idProducto === productoSeleccionado.value)
  if (!producto) return

  nuevoPedido.detalles.push({
    idProducto: producto.idProducto,
    cantidad: cantidadProducto.value,
    precioUnitario: producto.precioCosto || 0
  })

  productoSeleccionado.value = ''
  cantidadProducto.value = 1
}

const eliminarProducto = (index) => {
  nuevoPedido.detalles.splice(index, 1)
}

const guardarPedido = async () => {
  try {
    await pedidosStore.crearPedido(
      { idProveedor: nuevoPedido.idProveedor },
      nuevoPedido.detalles
    )
    cerrarModalNuevoPedido()
    alert('Pedido registrado exitosamente')
  } catch (error) {
    alert('Error al guardar pedido: ' + error.message)
  }
}

const cambiarEstado = async (idPedido, nuevoEstado) => {
  if (confirm(`¿Desea marcar el pedido como ${nuevoEstado}?`)) {
    try {
      await pedidosStore.actualizarEstadoPedido(idPedido, nuevoEstado)
      alert('Estado actualizado')
    } catch (error) {
      alert('Error al actualizar estado: ' + error.message)
    }
  }
}

const verDetalle = async (pedido) => {
  pedidoSeleccionado.value = pedido
  detallesPedido.value = await pedidosStore.obtenerDetallesPedido(pedido.idPedido)
  modalDetalle.value = true
}

const cerrarModalDetalle = () => {
  modalDetalle.value = false
  pedidoSeleccionado.value = null
  detallesPedido.value = []
}

onMounted(async () => {
  await pedidosStore.cargarPedidos()
  await proveedoresStore.cargarProveedores()
  await productosStore.cargarProductos()
})
</script>
