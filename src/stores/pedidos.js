import { defineStore } from 'pinia'
import { db, ESTADOS_PEDIDO, TIPOS_MOVIMIENTO, TIPOS_REFERENCIA } from '@/db/database'
import { generarId, obtenerTimestamp } from '@/utils/helpers'
import { useProductosStore } from './productos'

export const usePedidosStore = defineStore('pedidos', {
  state: () => ({
    pedidos: [],
    cargando: false
  }),

  actions: {
    async cargarPedidos() {
      this.cargando = true
      try {
        this.pedidos = await db.pedidos.orderBy('fecha').reverse().toArray()
      } catch (error) {
        console.error('Error al cargar pedidos:', error)
      } finally {
        this.cargando = false
      }
    },

    async crearPedido(pedido, detalles) {
      try {
        const timestamp = obtenerTimestamp()
        const idPedido = generarId()

        // Calcular total
        const total = detalles.reduce((sum, item) =>
          sum + (item.cantidad * item.precioUnitario), 0
        )

        // Crear pedido
        const nuevoPedido = {
          idPedido,
          idEmpresa: pedido.idEmpresa || '',
          idProveedor: pedido.idProveedor,
          fecha: timestamp,
          estado: ESTADOS_PEDIDO.PENDIENTE,
          total,
          creadoEn: timestamp,
          actualizadoEn: timestamp
        }
        await db.pedidos.add(nuevoPedido)

        // Agregar detalles
        for (const detalle of detalles) {
          await db.detallePedidos.add({
            idDetalle: generarId(),
            idPedido,
            idProducto: detalle.idProducto,
            cantidad: detalle.cantidad,
            precioUnitario: detalle.precioUnitario
          })
        }

        await this.cargarPedidos()
        return nuevoPedido
      } catch (error) {
        console.error('Error al crear pedido:', error)
        throw error
      }
    },

    async actualizarEstadoPedido(idPedido, estado) {
      try {
        const timestamp = obtenerTimestamp()
        await db.pedidos.update(idPedido, {
          estado,
          actualizadoEn: timestamp
        })

        // Si el pedido es recibido, actualizar stock
        if (estado === ESTADOS_PEDIDO.RECIBIDO) {
          const detalles = await db.detallePedidos.where('idPedido').equals(idPedido).toArray()
          const productosStore = useProductosStore()

          for (const detalle of detalles) {
            // Actualizar stock
            await productosStore.actualizarStock(detalle.idProducto, detalle.cantidad)

            // Registrar movimiento
            await db.historialMovimientos.add({
              idMovimiento: generarId(),
              fecha: timestamp,
              tipoMovimiento: TIPOS_MOVIMIENTO.INGRESO,
              idProducto: detalle.idProducto,
              cantidad: detalle.cantidad,
              precioUnitario: detalle.precioUnitario,
              totalMovimiento: detalle.cantidad * detalle.precioUnitario,
              idReferencia: idPedido,
              tipoReferencia: TIPOS_REFERENCIA.PEDIDO,
              descripcion: 'Recepción de pedido',
              creadoEn: timestamp
            })
          }
        }

        await this.cargarPedidos()
      } catch (error) {
        console.error('Error al actualizar estado del pedido:', error)
        throw error
      }
    },

    async obtenerDetallesPedido(idPedido) {
      try {
        return await db.detallePedidos.where('idPedido').equals(idPedido).toArray()
      } catch (error) {
        console.error('Error al obtener detalles de pedido:', error)
        throw error
      }
    }
  }
})
