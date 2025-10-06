import { defineStore } from 'pinia'
import { db } from '@/db/database'
import { generarId } from '@/utils/helpers'

export const useClientesStore = defineStore('clientes', {
  state: () => ({
    clientes: [],
    cargando: false
  }),

  actions: {
    async cargarClientes() {
      this.cargando = true
      try {
        this.clientes = await db.clientes.toArray()
      } catch (error) {
        console.error('Error al cargar clientes:', error)
      } finally {
        this.cargando = false
      }
    },

    async agregarCliente(cliente) {
      try {
        const nuevoCliente = {
          idCliente: generarId(),
          ...cliente
        }
        await db.clientes.add(nuevoCliente)
        await this.cargarClientes()
        return nuevoCliente
      } catch (error) {
        console.error('Error al agregar cliente:', error)
        throw error
      }
    },

    async actualizarCliente(idCliente, datos) {
      try {
        await db.clientes.update(idCliente, datos)
        await this.cargarClientes()
      } catch (error) {
        console.error('Error al actualizar cliente:', error)
        throw error
      }
    },

    async eliminarCliente(idCliente) {
      try {
        await db.clientes.delete(idCliente)
        await this.cargarClientes()
      } catch (error) {
        console.error('Error al eliminar cliente:', error)
        throw error
      }
    }
  }
})
