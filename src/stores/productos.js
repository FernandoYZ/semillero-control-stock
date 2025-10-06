import { defineStore } from 'pinia'
import { db } from '@/db/database'
import { generarId, obtenerTimestamp } from '@/utils/helpers'

export const useProductosStore = defineStore('productos', {
  state: () => ({
    productos: [],
    cargando: false
  }),

  actions: {
    async cargarProductos() {
      this.cargando = true
      try {
        this.productos = await db.productos.toArray()
      } catch (error) {
        console.error('Error al cargar productos:', error)
      } finally {
        this.cargando = false
      }
    },

    async agregarProducto(producto) {
      try {
        const nuevoProducto = {
          idProducto: generarId(),
          ...producto,
          stockActual: producto.stockActual || 0
        }
        await db.productos.add(nuevoProducto)
        await this.cargarProductos()
        return nuevoProducto
      } catch (error) {
        console.error('Error al agregar producto:', error)
        throw error
      }
    },

    async actualizarProducto(idProducto, datos) {
      try {
        await db.productos.update(idProducto, datos)
        await this.cargarProductos()
      } catch (error) {
        console.error('Error al actualizar producto:', error)
        throw error
      }
    },

    async eliminarProducto(idProducto) {
      try {
        await db.productos.delete(idProducto)
        await this.cargarProductos()
      } catch (error) {
        console.error('Error al eliminar producto:', error)
        throw error
      }
    },

    async actualizarStock(idProducto, cantidad) {
      try {
        const producto = await db.productos.get(idProducto)
        if (producto) {
          await db.productos.update(idProducto, {
            stockActual: (producto.stockActual || 0) + cantidad
          })
          await this.cargarProductos()
        }
      } catch (error) {
        console.error('Error al actualizar stock:', error)
        throw error
      }
    },

    obtenerProductoPorId(idProducto) {
      return this.productos.find(p => p.idProducto === idProducto)
    },

    obtenerProductosPorCategoria(idCategoria) {
      return this.productos.filter(p => p.idCategoria === idCategoria)
    },

    obtenerProductosBajoStock() {
      return this.productos.filter(p => p.stockActual <= p.stockMinimo)
    }
  }
})
