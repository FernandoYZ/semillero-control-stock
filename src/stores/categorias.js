import { defineStore } from 'pinia'
import { db } from '@/db/database'
import { generarId } from '@/utils/helpers'

export const useCategoriasStore = defineStore('categorias', {
  state: () => ({
    categorias: [],
    cargando: false
  }),

  actions: {
    async cargarCategorias() {
      this.cargando = true
      try {
        this.categorias = await db.categorias.toArray()
      } catch (error) {
        console.error('Error al cargar categorías:', error)
      } finally {
        this.cargando = false
      }
    },

    async agregarCategoria(categoria) {
      try {
        const nuevaCategoria = {
          idCategoria: generarId(),
          ...categoria
        }
        await db.categorias.add(nuevaCategoria)
        await this.cargarCategorias()
        return nuevaCategoria
      } catch (error) {
        console.error('Error al agregar categoría:', error)
        throw error
      }
    },

    async actualizarCategoria(idCategoria, datos) {
      try {
        await db.categorias.update(idCategoria, datos)
        await this.cargarCategorias()
      } catch (error) {
        console.error('Error al actualizar categoría:', error)
        throw error
      }
    },

    async eliminarCategoria(idCategoria) {
      try {
        await db.categorias.delete(idCategoria)
        await this.cargarCategorias()
      } catch (error) {
        console.error('Error al eliminar categoría:', error)
        throw error
      }
    }
  }
})
