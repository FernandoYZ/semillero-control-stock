import { defineStore } from 'pinia';
import { ref } from 'vue';
import { db } from '@/db/database';

export const useConfiguracionStore = defineStore('configuracion', () => {
  const configuracion = ref(null);

  async function cargarConfiguracion() {
    try {
      // Siempre intenta obtener el registro con el ID fijo 1.
      const config = await db.empresa.get(1);
      configuracion.value = config || null; // Asigna el resultado o null si no existe.
      return configuracion.value;
    } catch (error) {
      console.error('Error al cargar la configuración:', error);
      return null;
    }
  }

  async function actualizarConfiguracion(nuevosDatos) {
    try {
      // Si ya existe un ID, actualizamos el registro existente.
      if (nuevosDatos.idEmpresa) {
        const { idEmpresa, ...datosParaActualizar } = nuevosDatos;
        await db.empresa.update(idEmpresa, datosParaActualizar);
      } else {
        // Si no hay ID, es el primer guardado, así que creamos el registro con ID 1.
        await db.empresa.add({ ...nuevosDatos, idEmpresa: 1 });
      }
      await cargarConfiguracion(); // Recargar el estado después de la operación.
    } catch (error) {
      console.error('Error al actualizar la configuración:', error);
      throw error;
    }
  }

  return { 
    configuracion, 
    cargarConfiguracion, 
    actualizarConfiguracion 
  };
});