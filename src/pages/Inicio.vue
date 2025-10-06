<template>
  <div class="space-y-4">
    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold text-blue-600 mb-2">Sistema de Control de Stock</h2>
      <p class="text-gray-600">Gestiona tu inventario de manera eficiente</p>
    </div>

    <!-- Tarjetas de estadísticas -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="text-3xl font-bold text-blue-600">{{ productos.length }}</div>
        <div class="text-sm text-gray-600 mt-1">Productos</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="text-3xl font-bold text-red-600">{{ productosBajoStock.length }}</div>
        <div class="text-sm text-gray-600 mt-1">Bajo Stock</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="text-3xl font-bold text-green-600">{{ ventas.length }}</div>
        <div class="text-sm text-gray-600 mt-1">Ventas</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="text-3xl font-bold text-purple-600">{{ pedidos.length }}</div>
        <div class="text-sm text-gray-600 mt-1">Pedidos</div>
      </div>
    </div>

    <!-- Alertas de stock bajo -->
    <div v-if="productosBajoStock.length > 0" class="bg-red-50 border border-red-200 p-4 rounded-lg">
      <h3 class="font-semibold text-red-800 mb-2">⚠️ Productos con Stock Bajo</h3>
      <div class="space-y-2">
        <div v-for="producto in productosBajoStock.slice(0, 5)" :key="producto.idProducto"
          class="flex justify-between text-sm">
          <span class="text-gray-700">{{ producto.nombre }}</span>
          <span class="font-semibold text-red-600">Stock: {{ producto.stockActual }}</span>
        </div>
        <router-link v-if="productosBajoStock.length > 5" to="/inventario"
          class="text-blue-600 text-sm block mt-2">
          Ver todos ({{ productosBajoStock.length }})
        </router-link>
      </div>
    </div>

    <!-- Accesos rápidos -->
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="font-semibold text-gray-800 mb-3">Accesos Rápidos</h3>
      <div class="grid grid-cols-2 gap-3">
        <router-link to="/ventas" class="bg-green-500 text-white p-3 rounded-lg text-center font-medium">
          Nueva Venta
        </router-link>
        <router-link to="/pedidos" class="bg-blue-500 text-white p-3 rounded-lg text-center font-medium">
          Nuevo Pedido
        </router-link>
        <router-link to="/productos" class="bg-purple-500 text-white p-3 rounded-lg text-center font-medium">
          Ver Productos
        </router-link>
        <router-link to="/inventario" class="bg-orange-500 text-white p-3 rounded-lg text-center font-medium">
          Ver Inventario
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useProductosStore } from '@/stores/productos'
import { useVentasStore } from '@/stores/ventas'
import { usePedidosStore } from '@/stores/pedidos'

const productosStore = useProductosStore()
const ventasStore = useVentasStore()
const pedidosStore = usePedidosStore()

const productos = computed(() => productosStore.productos)
const ventas = computed(() => ventasStore.ventas)
const pedidos = computed(() => pedidosStore.pedidos)
const productosBajoStock = computed(() => productosStore.obtenerProductosBajoStock())

onMounted(async () => {
  await productosStore.cargarProductos()
  await ventasStore.cargarVentas()
  await pedidosStore.cargarPedidos()
})
</script>