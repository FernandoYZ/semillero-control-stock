<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold">Inventario</h2>
      <button @click="modalAjuste = true" class="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
        Ajuste Manual
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b">
      <button @click="tabActiva = 'productos'" :class="tabActiva === 'productos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'"
        class="px-4 py-2 font-medium">
        Productos
      </button>
      <button @click="tabActiva = 'movimientos'" :class="tabActiva === 'movimientos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'"
        class="px-4 py-2 font-medium">
        Movimientos
      </button>
    </div>

    <!-- Tab Productos -->
    <div v-if="tabActiva === 'productos'" class="space-y-2">
      <input v-model="busqueda" type="text" placeholder="Buscar productos..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg">

      <div v-if="productosFiltrados.length === 0" class="bg-white p-8 rounded-lg shadow text-center text-gray-500">
        No hay productos
      </div>

      <div v-else class="space-y-2">
        <div v-for="producto in productosFiltrados" :key="producto.idProducto"
          class="bg-white p-4 rounded-lg shadow"
          :class="{ 'border-l-4 border-red-500': producto.stockActual <= producto.stockMinimo }">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-800">{{ producto.nombre }}</h3>
              <p class="text-sm text-gray-600">{{ producto.codigo }}</p>
              <p class="text-xs text-gray-500">{{ obtenerNombreCategoria(producto.idCategoria) }}</p>
            </div>
            <button @click="verMovimientos(producto)" class="text-blue-600 text-sm">Ver historial</button>
          </div>
          <div class="grid grid-cols-3 gap-2 text-sm mt-3 pt-3 border-t">
            <div>
              <span class="text-gray-600">Stock:</span>
              <span class="font-bold ml-1" :class="producto.stockActual <= producto.stockMinimo ? 'text-red-600' : 'text-green-600'">
                {{ producto.stockActual }}
              </span>
            </div>
            <div>
              <span class="text-gray-600">Mínimo:</span>
              <span class="font-semibold ml-1">{{ producto.stockMinimo }}</span>
            </div>
            <div>
              <span class="text-gray-600">Valor:</span>
              <span class="font-semibold ml-1">{{ formatearMoneda(producto.stockActual * producto.precioCosto) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen -->
      <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 class="font-semibold text-blue-900 mb-2">Resumen</h3>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span class="text-blue-800">Total productos:</span>
            <span class="font-bold ml-1">{{ productos.length }}</span>
          </div>
          <div>
            <span class="text-blue-800">Bajo stock:</span>
            <span class="font-bold ml-1 text-red-600">{{ productosBajoStock.length }}</span>
          </div>
          <div class="col-span-2">
            <span class="text-blue-800">Valor total inventario:</span>
            <span class="font-bold ml-1 text-green-600">{{ formatearMoneda(valorTotalInventario) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Movimientos -->
    <div v-if="tabActiva === 'movimientos'" class="space-y-2">
      <div class="flex gap-2 overflow-x-auto pb-2">
        <button @click="filtroTipo = ''" :class="filtroTipo === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
          class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
          Todos
        </button>
        <button @click="filtroTipo = 'ingreso'" :class="filtroTipo === 'ingreso' ? 'bg-green-600 text-white' : 'bg-white text-gray-700'"
          class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
          Ingresos
        </button>
        <button @click="filtroTipo = 'salida'" :class="filtroTipo === 'salida' ? 'bg-red-600 text-white' : 'bg-white text-gray-700'"
          class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
          Salidas
        </button>
        <button @click="filtroTipo = 'ajuste'" :class="filtroTipo === 'ajuste' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700'"
          class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
          Ajustes
        </button>
      </div>

      <div v-if="movimientosFiltrados.length === 0" class="bg-white p-8 rounded-lg shadow text-center text-gray-500">
        No hay movimientos registrados
      </div>

      <div v-else class="space-y-2">
        <div v-for="mov in movimientosFiltrados" :key="mov.idMovimiento"
          class="bg-white p-4 rounded-lg shadow">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span :class="obtenerClaseTipo(mov.tipoMovimiento)" class="text-xs font-medium px-2 py-1 rounded">
                  {{ mov.tipoMovimiento.toUpperCase() }}
                </span>
                <span class="text-xs text-gray-500">{{ formatearFechaHora(mov.fecha) }}</span>
              </div>
              <h3 class="font-semibold text-gray-800 mt-2">{{ obtenerNombreProducto(mov.idProducto) }}</h3>
              <p class="text-sm text-gray-600">{{ mov.descripcion }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold" :class="mov.tipoMovimiento === 'salida' ? 'text-red-600' : 'text-green-600'">
                {{ mov.tipoMovimiento === 'salida' ? '-' : '+' }}{{ mov.cantidad }}
              </p>
              <p class="text-sm text-gray-600">{{ formatearMoneda(mov.totalMovimiento) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ajuste -->
    <div v-if="modalAjuste" @click="cerrarModalAjuste" class="fixed inset-0 bg-black/40 bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div @click.stop class="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-lg p-6 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">Ajuste Manual de Inventario</h3>
        <form @submit.prevent="guardarAjuste" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Producto</label>
            <select v-model="ajuste.idProducto" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="">Seleccionar producto</option>
              <option v-for="producto in productos" :key="producto.idProducto" :value="producto.idProducto">
                {{ producto.nombre }} (Stock actual: {{ producto.stockActual }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad (positivo para aumentar, negativo para disminuir)</label>
            <input v-model.number="ajuste.cantidad" type="number" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio Unitario</label>
            <input v-model.number="ajuste.precioUnitario" type="number" step="0.01" required class="w-full px-3 py-2 border border-gray-300 rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción/Motivo</label>
            <textarea v-model="ajuste.descripcion" rows="3" required class="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="cerrarModalAjuste" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg">
              Cancelar
            </button>
            <button type="submit" class="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg">
              Guardar Ajuste
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Movimientos de Producto -->
    <div v-if="modalMovimientos" @click="cerrarModalMovimientos" class="fixed inset-0 bg-black/40 bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div @click.stop class="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-lg p-6 max-h-[80vh] overflow-y-auto">
        <h3 class="text-lg font-bold mb-4">Historial de Movimientos</h3>
        <p v-if="productoSeleccionado" class="text-sm text-gray-600 mb-4">{{ productoSeleccionado.nombre }}</p>

        <div v-if="movimientosProducto.length === 0" class="text-center text-gray-500 py-8">
          No hay movimientos registrados
        </div>

        <div v-else class="space-y-2">
          <div v-for="mov in movimientosProducto" :key="mov.idMovimiento" class="bg-gray-50 p-3 rounded-lg">
            <div class="flex justify-between items-start mb-1">
              <span :class="obtenerClaseTipo(mov.tipoMovimiento)" class="text-xs font-medium px-2 py-1 rounded">
                {{ mov.tipoMovimiento.toUpperCase() }}
              </span>
              <span class="text-xs text-gray-500">{{ formatearFechaHora(mov.fecha) }}</span>
            </div>
            <p class="text-sm text-gray-700">{{ mov.descripcion }}</p>
            <div class="flex justify-between items-center mt-2 text-sm">
              <span :class="mov.tipoMovimiento === 'salida' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'">
                {{ mov.tipoMovimiento === 'salida' ? '-' : '+' }}{{ mov.cantidad }} unidades
              </span>
              <span class="text-gray-600">{{ formatearMoneda(mov.totalMovimiento) }}</span>
            </div>
          </div>
        </div>

        <button @click="cerrarModalMovimientos" class="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useProductosStore } from '@/stores/productos'
import { useCategoriasStore } from '@/stores/categorias'
import { useMovimientosStore } from '@/stores/movimientos'
import { formatearMoneda, formatearFechaHora } from '@/utils/helpers'

const productosStore = useProductosStore()
const categoriasStore = useCategoriasStore()
const movimientosStore = useMovimientosStore()

const tabActiva = ref('productos')
const busqueda = ref('')
const filtroTipo = ref('')
const modalAjuste = ref(false)
const modalMovimientos = ref(false)
const productoSeleccionado = ref(null)
const movimientosProducto = ref([])

const ajuste = reactive({
  idProducto: '',
  cantidad: 0,
  precioUnitario: 0,
  descripcion: ''
})

const productos = computed(() => productosStore.productos)
const categorias = computed(() => categoriasStore.categorias)
const movimientos = computed(() => movimientosStore.movimientos)

const productosFiltrados = computed(() => {
  if (!busqueda.value) return productos.value
  const term = busqueda.value.toLowerCase()
  return productos.value.filter(p =>
    p.nombre.toLowerCase().includes(term) ||
    p.codigo.toLowerCase().includes(term)
  )
})

const productosBajoStock = computed(() => {
  return productos.value.filter(p => p.stockActual <= p.stockMinimo)
})

const valorTotalInventario = computed(() => {
  return productos.value.reduce((sum, p) => sum + (p.stockActual * p.precioCosto), 0)
})

const movimientosFiltrados = computed(() => {
  if (!filtroTipo.value) return movimientos.value
  return movimientos.value.filter(m => m.tipoMovimiento === filtroTipo.value)
})

const obtenerNombreCategoria = (idCategoria) => {
  const categoria = categorias.value.find(c => c.idCategoria === idCategoria)
  return categoria ? categoria.nombre : 'Sin categoría'
}

const obtenerNombreProducto = (idProducto) => {
  const producto = productos.value.find(p => p.idProducto === idProducto)
  return producto ? producto.nombre : 'N/A'
}

const obtenerClaseTipo = (tipo) => {
  const clases = {
    ingreso: 'bg-green-100 text-green-800',
    salida: 'bg-red-100 text-red-800',
    ajuste: 'bg-orange-100 text-orange-800'
  }
  return clases[tipo] || 'bg-gray-100 text-gray-800'
}

const cerrarModalAjuste = () => {
  modalAjuste.value = false
  ajuste.idProducto = ''
  ajuste.cantidad = 0
  ajuste.precioUnitario = 0
  ajuste.descripcion = ''
}

const guardarAjuste = async () => {
  try {
    await movimientosStore.crearAjuste(
      ajuste.idProducto,
      ajuste.cantidad,
      ajuste.precioUnitario,
      ajuste.descripcion
    )
    cerrarModalAjuste()
    alert('Ajuste registrado exitosamente')
  } catch (error) {
    alert('Error al guardar ajuste: ' + error.message)
  }
}

const verMovimientos = async (producto) => {
  productoSeleccionado.value = producto
  movimientosProducto.value = await movimientosStore.obtenerMovimientosPorProducto(producto.idProducto)
  modalMovimientos.value = true
}

const cerrarModalMovimientos = () => {
  modalMovimientos.value = false
  productoSeleccionado.value = null
  movimientosProducto.value = []
}

onMounted(async () => {
  await productosStore.cargarProductos()
  await categoriasStore.cargarCategorias()
  await movimientosStore.cargarMovimientos()
})
</script>
