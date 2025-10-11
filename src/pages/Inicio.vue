<template>
  <div class="text-white px-4 py-6 space-y-6">

    <!-- Header -->
    <div class="bg-oscuro-800 p-5 rounded-xl shadow-lg">
      <h2 class="text-2xl font-bold text-green-400 mb-1 glow-text">Sistema de Control de Stock</h2>
      <p class="text-oscuro-200">Gestiona tu inventario de manera eficiente</p>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-oscuro-800 p-4 rounded-xl shadow text-center">
        <div class="text-3xl font-bold text-green-400">{{ productos.length }}</div>
        <div class="text-sm text-oscuro-300 mt-1">Productos</div>
      </div>
      <div class="bg-oscuro-800 p-4 rounded-xl shadow text-center">
        <div class="text-3xl font-bold text-red-400">{{ productosBajoStock.length }}</div>
        <div class="text-sm text-oscuro-300 mt-1">Bajo Stock</div>
      </div>
      <div class="bg-oscuro-800 p-4 rounded-xl shadow text-center">
        <div class="text-3xl font-bold text-blue-400">{{ ventas.length }}</div>
        <div class="text-sm text-oscuro-300 mt-1">Ventas</div>
      </div>
      <div class="bg-oscuro-800 p-4 rounded-xl shadow text-center">
        <div class="text-3xl font-bold text-purple-400">{{ pedidos.length }}</div>
        <div class="text-sm text-oscuro-300 mt-1">Pedidos</div>
      </div>
    </div>

    <!-- Alertas -->
    <div v-if="productosBajoStock.length > 0" class="bg-red-950/50 border border-red-600 p-4 rounded-lg">
      <h3 class="font-semibold text-red-400 mb-2">⚠️ Productos con Stock Bajo</h3>
      <div class="space-y-2">
        <div v-for="producto in productosBajoStock.slice(0, 5)" :key="producto.idProducto"
          class="flex justify-between text-sm text-oscuro-100">
          <span>{{ producto.nombre }}</span>
          <span class="font-semibold text-red-400">Stock: {{ producto.stockActual }}</span>
        </div>
        <router-link
          v-if="productosBajoStock.length > 5"
          to="/inventario"
          class="text-sm text-green-400 hover:underline mt-2 inline-block transition"
        >
          Ver todos ({{ productosBajoStock.length }})
        </router-link>
      </div>
    </div>

    <!-- Accesos Rápidos -->
    <div class="bg-oscuro-800 p-5 rounded-xl shadow">
      <h3 class="font-semibold text-oscuro-100 mb-3">Accesos Rápidos</h3>
      <div class="grid grid-cols-2 gap-3">
        <router-link
          to="/ventas"
          class="bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg text-center font-medium transition duration-200"
        >
          Nueva Venta
        </router-link>
        <router-link
          to="/pedidos"
          class="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg text-center font-medium transition duration-200"
        >
          Nuevo Pedido
        </router-link>
        <router-link
          to="/productos"
          class="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-lg text-center font-medium transition duration-200"
        >
          Ver Productos
        </router-link>
        <router-link
          to="/inventario"
          class="bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-lg text-center font-medium transition duration-200"
        >
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
