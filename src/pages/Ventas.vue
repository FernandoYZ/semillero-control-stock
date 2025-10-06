<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold">Ventas</h2>
      <button @click="abrirModalNuevaVenta()" class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
        + Nueva Venta
      </button>
    </div>

    <!-- Lista de ventas -->
    <div v-if="ventas.length === 0" class="bg-white p-8 rounded-lg shadow text-center text-gray-500">
      No hay ventas registradas
    </div>

    <div v-else class="space-y-2">
      <div v-for="venta in ventas" :key="venta.idVenta"
        class="bg-white p-4 rounded-lg shadow cursor-pointer"
        @click="verDetalle(venta)">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-800">Venta #{{ venta.idVenta.slice(0, 8) }}</h3>
            <p class="text-sm text-gray-600">{{ formatearFechaHora(venta.fecha) }}</p>
            <p class="text-sm text-gray-600">Cliente: {{ obtenerNombreCliente(venta.idCliente) }}</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-bold text-green-600">{{ formatearMoneda(venta.total) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Nueva Venta -->
    <div v-if="modalNuevaVenta" @click="cerrarModalNuevaVenta" class="fixed inset-0 bg-black/40 bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div @click.stop class="bg-white w-full md:max-w-2xl rounded-t-2xl md:rounded-lg p-6 max-h-[85vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">Nueva Venta</h3>

        <!-- Seleccionar cliente -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
          <select v-model="nuevaVenta.idCliente" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">Seleccionar cliente</option>
            <option v-for="cliente in clientes" :key="cliente.idCliente" :value="cliente.idCliente">
              {{ cliente.nombre }}
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
                {{ producto.nombre }} (Stock: {{ producto.stockActual }})
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
        <div v-if="nuevaVenta.detalles.length > 0" class="mb-4 border rounded-lg p-3">
          <h4 class="font-semibold mb-2 text-sm">Productos</h4>
          <div v-for="(detalle, index) in nuevaVenta.detalles" :key="index" class="flex justify-between items-center py-2 border-b last:border-0">
            <div class="flex-1">
              <p class="text-sm font-medium">{{ obtenerNombreProducto(detalle.idProducto) }}</p>
              <p class="text-xs text-gray-600">{{ detalle.cantidad }} x {{ formatearMoneda(detalle.precioUnitario) }}</p>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-semibold">{{ formatearMoneda(detalle.cantidad * detalle.precioUnitario) }}</span>
              <button @click="eliminarProducto(index)" class="text-red-600 text-sm">✕</button>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t flex justify-between font-bold">
            <span>Total:</span>
            <span class="text-green-600">{{ formatearMoneda(totalVenta) }}</span>
          </div>
        </div>

        <div class="flex gap-3">
          <button type="button" @click="cerrarModalNuevaVenta" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
            Cancelar
          </button>
          <button @click="guardarVenta" :disabled="nuevaVenta.detalles.length === 0 || !nuevaVenta.idCliente"
            class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-300">
            Guardar Venta
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Detalle -->
    <div v-if="modalDetalle" @click="cerrarModalDetalle" class="fixed inset-0 bg-black/40 bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div @click.stop class="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-lg p-6 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">Detalle de Venta</h3>
        <div v-if="ventaSeleccionada" class="space-y-3">
          <div>
            <p class="text-sm text-gray-600">Fecha</p>
            <p class="font-medium">{{ formatearFechaHora(ventaSeleccionada.fecha) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Cliente</p>
            <p class="font-medium">{{ obtenerNombreCliente(ventaSeleccionada.idCliente) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-2">Productos</p>
            <div v-for="detalle in detallesVenta" :key="detalle.idDetalleVenta" class="bg-gray-50 p-2 rounded mb-2">
              <p class="font-medium text-sm">{{ obtenerNombreProducto(detalle.idProducto) }}</p>
              <p class="text-xs text-gray-600">{{ detalle.cantidad }} x {{ formatearMoneda(detalle.precioUnitario) }}</p>
            </div>
          </div>
          <div class="pt-3 border-t">
            <p class="text-sm text-gray-600">Total</p>
            <p class="text-2xl font-bold text-green-600">{{ formatearMoneda(ventaSeleccionada.total) }}</p>
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
import { useVentasStore } from '@/stores/ventas'
import { useClientesStore } from '@/stores/clientes'
import { useProductosStore } from '@/stores/productos'
import { formatearMoneda, formatearFechaHora } from '@/utils/helpers'

const ventasStore = useVentasStore()
const clientesStore = useClientesStore()
const productosStore = useProductosStore()

const modalNuevaVenta = ref(false)
const modalDetalle = ref(false)
const ventaSeleccionada = ref(null)
const detallesVenta = ref([])
const productoSeleccionado = ref('')
const cantidadProducto = ref(1)

const nuevaVenta = reactive({
  idCliente: '',
  detalles: []
})

const ventas = computed(() => ventasStore.ventas)
const clientes = computed(() => clientesStore.clientes)
const productos = computed(() => productosStore.productos)

const totalVenta = computed(() => {
  return nuevaVenta.detalles.reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0)
})

const obtenerNombreCliente = (idCliente) => {
  const cliente = clientes.value.find(c => c.idCliente === idCliente)
  return cliente ? cliente.nombre : 'N/A'
}

const obtenerNombreProducto = (idProducto) => {
  const producto = productos.value.find(p => p.idProducto === idProducto)
  return producto ? producto.nombre : 'N/A'
}

const abrirModalNuevaVenta = () => {
  nuevaVenta.idCliente = ''
  nuevaVenta.detalles = []
  productoSeleccionado.value = ''
  cantidadProducto.value = 1
  modalNuevaVenta.value = true
}

const cerrarModalNuevaVenta = () => {
  modalNuevaVenta.value = false
}

const agregarProducto = () => {
  if (!productoSeleccionado.value || cantidadProducto.value <= 0) return

  const producto = productos.value.find(p => p.idProducto === productoSeleccionado.value)
  if (!producto) return

  if (cantidadProducto.value > producto.stockActual) {
    alert('Stock insuficiente')
    return
  }

  nuevaVenta.detalles.push({
    idProducto: producto.idProducto,
    cantidad: cantidadProducto.value,
    precioUnitario: producto.precioVenta
  })

  productoSeleccionado.value = ''
  cantidadProducto.value = 1
}

const eliminarProducto = (index) => {
  nuevaVenta.detalles.splice(index, 1)
}

const guardarVenta = async () => {
  try {
    await ventasStore.crearVenta(
      { idCliente: nuevaVenta.idCliente },
      nuevaVenta.detalles
    )
    cerrarModalNuevaVenta()
    alert('Venta registrada exitosamente')
  } catch (error) {
    alert('Error al guardar venta: ' + error.message)
  }
}

const verDetalle = async (venta) => {
  ventaSeleccionada.value = venta
  detallesVenta.value = await ventasStore.obtenerDetallesVenta(venta.idVenta)
  modalDetalle.value = true
}

const cerrarModalDetalle = () => {
  modalDetalle.value = false
  ventaSeleccionada.value = null
  detallesVenta.value = []
}

onMounted(async () => {
  await ventasStore.cargarVentas()
  await clientesStore.cargarClientes()
  await productosStore.cargarProductos()
})
</script>
