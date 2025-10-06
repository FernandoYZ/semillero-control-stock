<template>
  <div class="min-h-screen flex flex-col pb-16">
    <!-- Header -->
    <header class="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-10">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-bold">{{ titulo }}</h1>
        <button @click="menuAbierto = !menuAbierto" class="md:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </header>

    <!-- Menú lateral móvil -->
    <div v-if="menuAbierto" @click="menuAbierto = false" class="fixed inset-0 bg-black/40 bg-opacity-50 z-20 md:hidden"></div>
    <aside v-if="menuAbierto" class="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-lg z-30 md:hidden overflow-y-auto">
      <div class="p-4 bg-blue-600 text-white">
        <h2 class="text-lg font-bold">Menú</h2>
      </div>
      <nav class="p-4">
        <RouterLink v-for="item in menuItems" :key="item.path" :to="item.path" @click="menuAbierto = false"
          class="block py-3 px-4 rounded mb-2 hover:bg-blue-50" :class="{ 'bg-blue-100': $route.path === item.path }">
          {{ item.label }}
        </RouterLink>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-4 bg-gray-50 overflow-y-auto">
      <RouterView />
    </main>

    <!-- Bottom Navigation (Móvil) -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
      <div class="flex justify-around items-center h-16">
        <RouterLink to="/" class="flex flex-col items-center justify-center flex-1 py-2" :class="{ 'text-blue-600': $route.path === '/' }">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <span class="text-xs mt-1">Inicio</span>
        </RouterLink>
        <RouterLink to="/productos" class="flex flex-col items-center justify-center flex-1 py-2" :class="{ 'text-blue-600': $route.path === '/productos' }">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          <span class="text-xs mt-1">Productos</span>
        </RouterLink>
        <RouterLink to="/ventas" class="flex flex-col items-center justify-center flex-1 py-2" :class="{ 'text-blue-600': $route.path === '/ventas' }">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span class="text-xs mt-1">Ventas</span>
        </RouterLink>
        <RouterLink to="/pedidos" class="flex flex-col items-center justify-center flex-1 py-2" :class="{ 'text-blue-600': $route.path === '/pedidos' }">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span class="text-xs mt-1">Pedidos</span>
        </RouterLink>
        <RouterLink to="/inventario" class="flex flex-col items-center justify-center flex-1 py-2" :class="{ 'text-blue-600': $route.path === '/inventario' }">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <span class="text-xs mt-1">Inventario</span>
        </RouterLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const menuAbierto = ref(false)

const titulo = computed(() => {
  const titles = {
    '/': 'Control de Stock',
    '/productos': 'Productos',
    '/categorias': 'Categorías',
    '/clientes': 'Clientes',
    '/proveedores': 'Proveedores',
    '/pedidos': 'Pedidos',
    '/ventas': 'Ventas',
    '/inventario': 'Inventario'
  }
  return titles[route.path] || 'Control de Stock'
})

const menuItems = [
  { path: '/', label: 'Inicio' },
  { path: '/productos', label: 'Productos' },
  { path: '/categorias', label: 'Categorías' },
  { path: '/clientes', label: 'Clientes' },
  { path: '/proveedores', label: 'Proveedores' },
  { path: '/pedidos', label: 'Pedidos' },
  { path: '/ventas', label: 'Ventas' },
  { path: '/inventario', label: 'Inventario' }
]
</script>

