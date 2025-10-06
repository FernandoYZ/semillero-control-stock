import { defineStore } from 'pinia'
import { db, TIPOS_MOVIMIENTO, TIPOS_REFERENCIA } from '@/db/database'
import { generarId, obtenerTimestamp } from '@/utils/helpers'
import { useProductosStore } from './productos'

export const useMovimientosStore = defineStore('movimientos', {
  state: () => ({
    movimientos: [],
    cargando: false
  }),

  actions: {
    async cargarMovimientos() {
      this.cargando = true
      try {
        this.movimientos = await db.historialMovimientos
          .orderBy('fecha')
          .reverse()
          .toArray()
      } catch (error) {
        console.error('Error al cargar movimientos:', error)
      } finally {
        this.cargando = false
      }
    },

    async crearAjuste(idProducto, cantidad, precioUnitario, descripcion) {
      try {
        const timestamp = obtenerTimestamp()
        const idMovimiento = generarId()
        const productosStore = useProductosStore()

        // Crear movimiento
        await db.historialMovimientos.add({
          idMovimiento,
          fecha: timestamp,
          tipoMovimiento: TIPOS_MOVIMIENTO.AJUSTE,
          idProducto,
          cantidad,
          precioUnitario,
          totalMovimiento: cantidad * precioUnitario,
          idReferencia: idMovimiento,
          tipoReferencia: TIPOS_REFERENCIA.AJUSTE,
          descripcion: descripcion || 'Ajuste manual de inventario',
          creadoEn: timestamp
        })

        // Actualizar stock
        await productosStore.actualizarStock(idProducto, cantidad)

        await this.cargarMovimientos()
      } catch (error) {
        console.error('Error al crear ajuste:', error)
        throw error
      }
    },

    async obtenerMovimientosPorProducto(idProducto) {
      try {
        return await db.historialMovimientos
          .where('idProducto')
          .equals(idProducto)
          .reverse()
          .sortBy('fecha')
      } catch (error) {
        console.error('Error al obtener movimientos del producto:', error)
        throw error
      }
    }
  }
})
