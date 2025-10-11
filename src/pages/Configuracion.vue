<template>
  <div class="space-y-6">
    
    <header class="space-y-6">
      <div class="hidden md:block">
        <h1 class="text-4xl font-bold text-white">Configuración</h1>
      </div>
      <h2 class="text-2xl font-bold text-white md:hidden">Configuración</h2>
    </header>

    <main class="space-y-8 max-w-2xl">
      <form @submit.prevent="guardar" class="space-y-6">
        
        <!-- Profile Picture Section -->
        <div class="flex items-center gap-6 border-b border-oscuro-800 pb-8">
          <div @click="triggerFileInput('fotoPerfilInput')" class="group cursor-pointer w-24 h-24 rounded-full bg-oscuro-800 border-2 border-dashed border-oscuro-600 flex items-center justify-center hover:border-green-500 transition-colors flex-shrink-0">
            <img v-if="imagenPreviewUrl" :src="imagenPreviewUrl" alt="Vista previa" class="w-full h-full object-cover rounded-full">
            <div v-else class="text-center text-oscuro-500">
              <ImagenIcono class="w-8 h-8 mx-auto" />
            </div>
            <input ref="fotoPerfilInput" type="file" @change="handleImagenSeleccionada" accept="image/*" class="sr-only">
          </div>
          <div>
            <h3 class="font-bold text-xl text-white">Foto de Perfil</h3>
            <p class="text-sm text-oscuro-400">Sube una imagen cuadrada para tu perfil o el de tu negocio.</p>
          </div>
        </div>

        <!-- User Info Section -->
        <div class="py-8 border-b border-oscuro-800 space-y-5">
          <h3 class="font-bold text-lg text-white">Información General</h3>
          <CampoFormulario id="nombre-empresa" label="Nombre de la Empresa" v-model="form.nombre" required />
          <CampoFormulario id="nombre-usuario" label="Nombre de Usuario" v-model="form.nombreUsuario" />
          <CampoFormulario id="rubro" label="Rubro del Negocio" v-model="form.rubro" placeholder="Ej: Venta de Ropa, Restaurante..." />
        </div>

        <!-- Sharing Setting Section -->
        <div class="py-8 border-b border-oscuro-800">
          <h3 class="font-bold text-lg text-white">Privacidad</h3>
          <div class="flex items-center justify-between mt-5">
            <div>
              <h4 class="font-medium text-white">Compartir Datos</h4>
              <p class="text-sm text-oscuro-400 max-w-sm">Permitir que se compartan datos de manera anónima para mejorar el servicio.</p>
            </div>
            <button @click="form.infoCompartida = !form.infoCompartida" type="button" class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-oscuro-900" :class="form.infoCompartida ? 'bg-green-600' : 'bg-oscuro-700'">
              <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" :class="form.infoCompartida ? 'translate-x-5' : 'translate-x-0'"></span>
            </button>
          </div>
        </div>

        <!-- Save Button -->
        <div class="pt-6">
          <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Guardar Cambios
          </button>
        </div>
      </form>

      <!-- Data Management Section -->
      <div class="py-8 border-t border-oscuro-800">
        <h3 class="font-bold text-lg text-white">Gestión de Datos</h3>
        <p class="text-sm text-oscuro-400 mt-2 mb-5">Exporta todos tus datos a un archivo JSON como copia de seguridad, o importa un archivo para restaurar tu información.</p>
        <div class="flex gap-4">
          <button @click="exportarDatos" type="button" class="px-6 py-2 bg-oscuro-700 text-white rounded-lg font-semibold hover:bg-oscuro-600 transition-colors">
            Exportar
          </button>
          <button @click="triggerFileInput('importInput')" type="button" class="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Importar
          </button>
          <input ref="importInput" type="file" @change="importarDatos" accept=".json,application/json" class="sr-only">
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useConfiguracionStore } from '@/stores/configuracion';
import CampoFormulario from '@/components/Productos/CampoFormulario.vue';
import ImagenIcono from '@/components/icons/ImagenIcono.vue';
import { db } from '@/db/database';

const store = useConfiguracionStore();

const form = reactive({
  idEmpresa: null,
  nombre: '',
  nombreUsuario: '',
  rubro: '',
  infoCompartida: false,
  fotoPerfil: null
});

const imagenPreviewUrl = ref(null);
const fotoPerfilInput = ref(null);
const importInput = ref(null);

// Cargar datos iniciales
onMounted(async () => {
  const config = await store.cargarConfiguracion();
  if (config) {
    form.idEmpresa = config.idEmpresa;
    form.nombre = config.nombre || '';
    form.nombreUsuario = config.nombreUsuario || '';
    form.rubro = config.rubro || '';
    form.infoCompartida = config.infoCompartida || false;
    form.fotoPerfil = config.fotoPerfil || null;
    if (config.fotoPerfil instanceof Blob) {
      imagenPreviewUrl.value = URL.createObjectURL(config.fotoPerfil);
    }
  }
});

const triggerFileInput = (refName) => {
  if (refName === 'fotoPerfilInput') fotoPerfilInput.value.click();
  if (refName === 'importInput') importInput.value.click();
};

const handleImagenSeleccionada = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.fotoPerfil = file;
    imagenPreviewUrl.value = URL.createObjectURL(file);
  }
};

const guardar = async () => {
  try {
    await store.actualizarConfiguracion({ ...form });
    alert('Configuración guardada exitosamente');
  } catch (error) {
    console.error('Error al guardar:', error);
    alert('Error al guardar la configuración: ' + error.message);
  }
};

// --- Lógica de Importación y Exportación ---

const exportarDatos = async () => {
  try {
    console.log("Exportando datos...");
    const exportData = {};
    const tablesToExport = db.tables.map(table => table.name);

    for (const tableName of tablesToExport) {
      const tableData = await db.table(tableName).toArray();
      exportData[tableName] = tableData;
    }

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `control-stock-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("Exportación completada.");

  } catch (error) {
    console.error("Error al exportar datos:", error);
    alert("Ocurrió un error durante la exportación.");
  }
};

const importarDatos = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!confirm('¡Atención! Esto reemplazará todos los datos existentes en la aplicación. ¿Estás seguro de que quieres continuar?')) {
    event.target.value = null; // Reset file input
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const json = e.target.result;
      const importedData = JSON.parse(json);
      
      const tableNames = db.tables.map(t => t.name);
      const importedKeys = Object.keys(importedData);

      // Validación simple: ¿el archivo importado tiene tablas que esperamos?
      const isValid = importedKeys.some(key => tableNames.includes(key));
      if (!isValid) {
        throw new Error("El archivo no parece ser una copia de seguridad válida.");
      }

      await db.transaction('rw', db.tables, async () => {
        console.log("Limpiando base de datos actual...");
        for (const tableName of tableNames) {
          await db.table(tableName).clear();
        }

        console.log("Importando nuevos datos...");
        for (const tableName of importedKeys) {
          if (tableNames.includes(tableName)) {
            await db.table(tableName).bulkAdd(importedData[tableName]);
          }
        }
      });

      alert('¡Importación completada con éxito! La aplicación se recargará.');
      window.location.reload();

    } catch (error) {
      console.error("Error al importar datos:", error);
      alert(`Ocurrió un error durante la importación: ${error.message}`);
    }
  };

  reader.readAsText(file);
  event.target.value = null; // Reset file input
};

</script>