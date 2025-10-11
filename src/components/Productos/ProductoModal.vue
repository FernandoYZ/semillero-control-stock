<template>
  <Transition name="modal">
    <div v-if="modelValue" @click="cerrarModal" class="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-end md:items-center justify-center z-40">
      <div @click.stop class="modal-container bg-oscuro-600/50 backdrop-blur-lg w-full md:max-w-md rounded-t-4xl border border-oscuro-700 md:rounded-lg flex flex-col max-h-[90vh]">
        
        <div class="p-4 md:border-b md:border-oscuro-700">
          <div class="w-12 h-1.5 mx-auto rounded-full bg-oscuro-600 mb-4 md:hidden"></div>
          <h3 class="text-lg text-center font-bold md:text-left">{{ producto ? 'Editar' : 'Nuevo' }} Producto</h3>
        </div>

        <form @submit.prevent="guardar" class="p-4 space-y-4 overflow-y-auto flex-1">
          
          <!-- Image Section -->
          <div class="">
            <div @click="triggerFileInput" class="group cursor-pointer w-32 h-32 mx-auto rounded-full bg-oscuro-900 border-2 border-dashed border-oscuro-600 flex items-center justify-center hover:border-green-500 transition-colors">
              <img v-if="imagenPreviewUrl" :src="imagenPreviewUrl" alt="Vista previa" class="w-full h-full object-cover rounded-full">
              <div v-else class="text-center text-oscuro-500">
                <ImagenIcono class="w-10 h-10 mx-auto" />
                <p class="text-xs mt-1">Subir Imagen</p>
              </div>
              <input id="file-upload" ref="fileInput" type="file" @change="handleImagenSeleccionada" accept="image/*" class="sr-only">
            </div>
          </div>

          <!-- Form Fields -->
          <div class="space-y-4">
            <div v-if="categorias.length === 0" class="mt-2 text-center p-4 bg-oscuro-800 rounded-xl">
              <p class="hidden md:block text-sm text-oscuro-400 mb-3">No hay categorías.</p>
              <button @click="abrirModalCategoria" type="button" class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer">+ Agregar Categoría</button>
            </div>
            <CampoFormulario v-else as="select" id="categoria" label="Categoría" v-model="form.idCategoria" required>
              <option disabled value="">Seleccionar categoría</option>
              <option v-for="cat in categorias" :key="cat.idCategoria" :value="cat.idCategoria" class="bg-oscuro-800/50">{{ cat.nombre }}</option>
            </CampoFormulario>
            
            <CampoFormulario id="nombre" label="Nombre" v-model="form.nombre" type="text" required />

            <div class="grid grid-cols-2 gap-4">
              <CampoFormulario id="precioCosto" label="Precio Costo" v-model.number="form.precioCosto" type="number" step="0.01" required />
              <CampoFormulario id="precioVenta" label="Precio Venta" v-model.number="form.precioVenta" type="number" step="0.01" required />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <CampoFormulario id="stockActual" label="Stock Actual" v-model.number="form.stockActual" type="number" required />
              <CampoFormulario id="stockMinimo" label="Stock Mínimo" v-model.number="form.stockMinimo" type="number" required />
            </div>
          </div>
        </form>
        
        <div class="p-4 md:border-t md:border-oscuro-700">
          <div class="flex gap-3 justify-end">
            <button 
              type="button" 
              @click="cerrarModal" 
              class="hidden md:block px-4 py-2 bg-oscuro-700 hover:bg-oscuro-600 text-white rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              @click="guardar" 
              type="button" 
              class="w-full md:w-auto px-4 py-3 md:py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-colors duration-200 font-semibold text-base md:text-sm cursor-pointer"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <CategoriaModal v-model="categoriaModalAbierto" @categoriaGuardada="onCategoriaGuardada" />
</template>

<script setup>
import { ref, reactive, watch, nextTick, defineProps, defineEmits } from 'vue';
import { useProductosStore } from '@/stores/productos';
import { useCategoriasStore } from '@/stores/categorias';
import ImagenIcono from '@/components/icons/ImagenIcono.vue';
import CategoriaModal from '@/components/Categorias/CategoriaModal.vue';
import CampoFormulario from '@/components/Productos/CampoFormulario.vue';

const props = defineProps({
  modelValue: Boolean,
  producto: Object,
  categorias: Array
});

const emit = defineEmits(['update:modelValue', 'productoGuardado']);

const productosStore = useProductosStore();
const categoriasStore = useCategoriasStore();

const form = reactive({
  codigo: '',
  nombre: '',
  idCategoria: '',
  precioCosto: 0,
  precioVenta: 0,
  stockActual: 0,
  stockMinimo: 0,
  imagen: null
});

const imagenPreviewUrl = ref(null);
const fileInput = ref(null);
const categoriaModalAbierto = ref(false);

const generarSKU = (idCategoria, nombreProducto) => {
  const categoria = props.categorias.find(c => c.idCategoria === idCategoria);
  if (!categoria || !nombreProducto) return '';

  const prefijoCat = categoria.nombre.substring(0, 3).toUpperCase();
  const prefijoProd = nombreProducto.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  
  return `${prefijoCat}-${prefijoProd}-${timestamp}`;
};

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    if (props.producto) {
      Object.assign(form, props.producto);
      imagenPreviewUrl.value = props.producto.imagen ? URL.createObjectURL(props.producto.imagen) : null;
    } else {
      Object.keys(form).forEach(key => {
        const value = form[key];
        form[key] = typeof value === 'number' ? 0 : (key === 'imagen' ? null : '');
      });
      imagenPreviewUrl.value = null;
    }
  }
});

watch([() => form.idCategoria, () => form.nombre], ([newCatId, newProdName]) => {
  if (!props.producto && newCatId && newProdName) {
    form.codigo = generarSKU(newCatId, newProdName);
  }
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleImagenSeleccionada = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.imagen = file;
    imagenPreviewUrl.value = URL.createObjectURL(file);
  }
};

const cerrarModal = () => {
  if (imagenPreviewUrl.value) {
    URL.revokeObjectURL(imagenPreviewUrl.value);
  }
  imagenPreviewUrl.value = null;
  emit('update:modelValue', false);
};

const guardar = async () => {
  try {
    const datosProducto = { ...form };
    if (props.producto) {
      await productosStore.actualizarProducto(props.producto.idProducto, datosProducto);
    } else {
      if (!form.codigo) {
        form.codigo = generarSKU(form.idCategoria, form.nombre);
      }
      await productosStore.agregarProducto(datosProducto);
    }
    emit('productoGuardado');
    cerrarModal();
  } catch (error) {
    console.error('Error al guardar:', error);
    alert('Error al guardar: ' + error.message);
  }
};

const abrirModalCategoria = () => {
  categoriaModalAbierto.value = true;
};

const onCategoriaGuardada = async (nuevaCategoria) => {
  await categoriasStore.cargarCategorias();
  await nextTick();
  if (nuevaCategoria && nuevaCategoria.idCategoria) {
    form.idCategoria = nuevaCategoria.idCategoria;
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container {
  transition: all 0.3s ease-out;
}
.modal-leave-active .modal-container {
  transition: all 0.3s ease-in;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  opacity: 0;
  transform: translateY(100%) scale(1);
}

@media (min-width: 768px) {
  .modal-enter-from .modal-container,
  .modal-leave-to .modal-container {
    transform: translateY(0) scale(0.95);
  }
}
</style>