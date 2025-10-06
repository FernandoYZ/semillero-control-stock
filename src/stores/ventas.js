import { defineStore } from 'pinia'
import { db, ESTADOS_VENTA, TIPOS_MOVIMIENTO, TIPOS_REFERENCIA } from '@/db/database'
import { generarId, obtenerTimestamp } from '@/utils/helpers'
import { useProductosStore } from './productos'

export const useVentasStore = defineStore('ventas', {
  state: () => ({
    ventas: [],
    cargando: false
  }),

  actions: {
    async cargarVentas() {
      this.cargando = true
      try {
        this.ventas = await db.ventas.orderBy('fecha').reverse().toArray()
      } catch (error) {
        console.error('Error al cargar ventas:', error)
      } finally {
        this.cargando = false
      }
    },

    async crearVenta(venta, detalles) {
      try {
        const timestamp = obtenerTimestamp()
        const idVenta = generarId()

        // Calcular total
        const total = detalles.reduce((sum, item) =>
          sum + (item.cantidad * item.precioUnitario), 0
        )

        // Crear venta
        const nuevaVenta = {
          idVenta,
          fecha: timestamp,
          total,
          idCliente: venta.idCliente,
          creadoEn: timestamp,
          actualizadoEn: timestamp
        }
        await db.ventas.add(nuevaVenta)

        // Agregar detalles
        const productosStore = useProductosStore()
        for (const detalle of detalles) {
          const idDetalleVenta = generarId()
          await db.detalleVentas.add({
            idDetalleVenta,
            idVenta,
            idProducto: detalle.idProducto,
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario
          })

          // Actualizar stock
          await productosStore.actualizarStock(detalle.idProducto, -detalle.cantidad)

          // Registrar movimiento
          await db.historialMovimientos.add({
            idMovimiento: generarId(),
            fecha: timestamp,
            tipoMovimiento: TIPOS_MOVIMIENTO.SALIDA,
            idProducto: detalle.idProducto,
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario,
            totalMovimiento: detalle.cantidad * detalle.precioUnitario,
            idReferencia: idVenta,
            tipoReferencia: TIPOS_REFERENCIA.VENTA,
            descripcion: 'Venta de producto',
            creadoEn: timestamp
          })
        }

        await this.cargarVentas()
        return nuevaVenta
      } catch (error) {
        console.error('Error al crear venta:', error)
        throw error
      }
    },

    async obtenerDetallesVenta(idVenta) {
      try {
        return await db.detalleVentas.where('idVenta').equals(idVenta).toArray()
      } catch (error) {
        console.error('Error al obtener detalles de venta:', error)
        throw error
      }
    }
  }
})
