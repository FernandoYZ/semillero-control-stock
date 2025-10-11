<template>
  <Transition name="modal">
    <div v-if="modelValue" @click="cerrar" class="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-end md:items-center justify-center z-50">
      <div @click.stop class="modal-container bg-oscuro-600/50 backdrop-blur-lg w-full md:max-w-md rounded-t-4xl border border-oscuro-700 md:rounded-lg flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="p-4 md:border-b md:border-oscuro-700">
          <div class="w-12 h-1.5 mx-auto rounded-full bg-oscuro-600 mb-4 md:hidden"></div>
          <h3 class="text-lg text-center font-bold md:text-left">{{ categoria ? 'Editar' : 'Nueva' }} Categoría</h3>
        </div>

        <!-- Content -->
        <form @submit.prevent="guardar" class="p-4 space-y-2 overflow-y-auto flex-1">
          <CampoFormulario 
            id="cat-nombre" 
            label="Nombre"
            v-model="form.nombre" 
            required 
          />
          <CampoFormulario 
            as="textarea"
            id="cat-desc" 
            label="Descripción (Opcional)" 
            v-model="form.descripcion" 
            rows="3" 
          />
        </form>

        <!-- Footer -->
        <div class="p-4 md:border-t md:border-oscuro-700">
          <div class="flex gap-3 justify-end">
            <button type="button" @click="cerrar" class="hidden md:block px-4 py-2 bg-oscuro-700 hover:bg-oscuro-600 text-white rounded-xl transition-colors">
              Cancelar
            </button>
            <button @click="guardar" type="button" class="w-full md:w-auto px-4 py-3 md:py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-colors duration-200 font-semibold text-base md:text-sm cursor-pointer">
              Guardar
            </button>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { reactive, watch, defineProps, defineEmits } from 'vue'
import { useCategoriasStore } from '@/stores/categorias'
import CampoFormulario from '@/components/Productos/CampoFormulario.vue'

const props = defineProps({
  modelValue: Boolean,
  categoria: Object 
})

const emit = defineEmits(['update:modelValue', 'categoriaGuardada'])

const store = useCategoriasStore()

const form = reactive({
  nombre: '',
  descripcion: ''
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    if (props.categoria) {
      form.nombre = props.categoria.nombre
      form.descripcion = props.categoria.descripcion || ''
    } else {
      form.nombre = ''
      form.descripcion = ''
    }
  }
})

const cerrar = () => {
  emit('update:modelValue', false)
}

const guardar = async () => {
  try {
    let categoriaGuardada;
    if (props.categoria) {
      categoriaGuardada = await store.actualizarCategoria(props.categoria.idCategoria, { ...form })
    } else {
      categoriaGuardada = await store.agregarCategoria({ ...form })
    }
    emit('categoriaGuardada', categoriaGuardada)
    cerrar()
  } catch (error) {
    console.error('Error al guardar categoría:', error)
    alert('Error al guardar: ' + error.message)
  }
}
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