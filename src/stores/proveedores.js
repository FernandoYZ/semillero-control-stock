import { defineStore } from 'pinia'
import { db } from '@/db/database'
import { generarId } from '@/utils/helpers'

export const useProveedoresStore = defineStore('proveedores', {
  state: () => ({
    proveedores: [],
    cargando: false
  }),

  actions: {
    async cargarProveedores() {
      this.cargando = true
      try {
        this.proveedores = await db.proveedores.toArray()
      } catch (error) {
        console.error('Error al cargar proveedores:', error)
      } finally {
        this.cargando = false
      }
    },

    async agregarProveedor(proveedor) {
      try {
        const nuevoProveedor = {
          idProveedor: generarId(),
          ...proveedor
        }
        await db.proveedores.add(nuevoProveedor)
        await this.cargarProveedores()
        return nuevoProveedor
      } catch (error) {
        console.error('Error al agregar proveedor:', error)
        throw error
      }
    },

    async actualizarProveedor(idProveedor, datos) {
      try {
        await db.proveedores.update(idProveedor, datos)
        await this.cargarProveedores()
      } catch (error) {
        console.error('Error al actualizar proveedor:', error)
        throw error
      }
    },

    async eliminarProveedor(idProveedor) {
      try {
        await db.proveedores.delete(idProveedor)
        await this.cargarProveedores()
      } catch (error) {
        console.error('Error al eliminar proveedor:', error)
        throw error
      }
    }
  }
})
