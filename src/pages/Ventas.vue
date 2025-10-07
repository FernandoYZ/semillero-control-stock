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
      <div @click.stop class="bg-white w-full md:max-w-2xl rounded-t-2xl md:rounded-lg p-4 md:p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">Nueva Venta</h3>

        <!-- Seleccionar cliente -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
          <select v-model="nuevaVenta.idCliente" required class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="" disabled>Seleccionar cliente</option>
            <option v-for="cliente in clientes" :key="cliente.idCliente" :value="cliente.idCliente">
              {{ cliente.nombre }}
            </option>
          </select>
        </div>

        <!-- Agregar productos -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Agregar Producto</label>
          <div class="flex flex-col sm:flex-row gap-2">
            <select v-model="productoSeleccionado" class="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option :value="null" disabled>Seleccionar producto</option>
              <option v-for="producto in productos" :key="producto.idProducto" :value="producto.idProducto">
                {{ producto.nombre }} (Stock: {{ producto.stockActual }})
              </option>
            </select>
            <div class="flex gap-2">
              <input v-model.number="cantidadProducto" type="number" min="1" placeholder="Cantidad"
                class="flex-1 sm:w-24 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <button @click="agregarProducto" type="button" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Agregar
              </button>
            </div>
          </div>
        </div>

        <!-- Lista de productos -->
        <div v-if="nuevaVenta.detalles.length > 0" class="mb-4 border rounded-lg p-3 bg-gray-50">
          <h4 class="font-semibold mb-3 text-sm">Productos Agregados</h4>
          <div v-for="(detalle, index) in nuevaVenta.detalles" :key="index" class="flex justify-between items-start py-2.5 border-b last:border-0 bg-white px-3 mb-2 rounded">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ obtenerNombreProducto(detalle.idProducto) }}</p>
              <p class="text-xs text-gray-600 mt-0.5">{{ detalle.cantidad }} x {{ formatearMoneda(detalle.precioUnitario) }}</p>
            </div>
            <div class="flex items-center gap-2 ml-2">
              <span class="font-semibold text-sm whitespace-nowrap">{{ formatearMoneda(detalle.cantidad * detalle.precioUnitario) }}</span>
              <button @click="eliminarProducto(index)" class="text-red-600 hover:bg-red-50 w-6 h-6 rounded flex items-center justify-center flex-shrink-0">✕</button>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t flex justify-between font-bold text-base">
            <span>Total:</span>
            <span class="text-green-600">{{ formatearMoneda(totalVenta) }}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-white pt-4 -mx-4 md:-mx-6 px-4 md:px-6 pb-2">
          <button type="button" @click="cerrarModalNuevaVenta" class="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
            Cancelar
          </button>
          <button @click="guardarVenta" :disabled="nuevaVenta.detalles.length === 0 || !nuevaVenta.idCliente"
            class="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg disabled:bg-gray-300 hover:bg-green-700 disabled:hover:bg-gray-300 font-medium">
            Guardar Venta
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Detalle -->
    <div v-if="modalDetalle" @click="cerrarModalDetalle" class="fixed inset-0 bg-black/40 bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div @click.stop class="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-lg p-4 md:p-6 max-h-[85vh] overflow-y-auto">
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
            <div v-for="detalle in detallesVenta" :key="detalle.idDetalleVenta" class="bg-gray-50 p-3 rounded mb-2">
              <div class="flex justify-between items-start">
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-sm truncate">{{ obtenerNombreProducto(detalle.idProducto) }}</p>
                  <p class="text-xs text-gray-600 mt-1">{{ detalle.cantidad }} x {{ formatearMoneda(detalle.precioUnitario) }}</p>
                </div>
                <p class="font-semibold text-sm ml-2 whitespace-nowrap">{{ formatearMoneda(detalle.cantidad * detalle.precioUnitario) }}</p>
              </div>
            </div>
          </div>
          <div class="pt-3 border-t">
            <p class="text-sm text-gray-600">Total</p>
            <p class="text-2xl font-bold text-green-600">{{ formatearMoneda(ventaSeleccionada.total) }}</p>
          </div>
        </div>
        <button @click="cerrarModalDetalle" class="w-full mt-4 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
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
const productoSeleccionado = ref(null)
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
  productoSeleccionado.value = null
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

  productoSeleccionado.value = null
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
