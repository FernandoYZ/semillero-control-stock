<template>
  <Transition name="modal">
    <div v-if="modelValue" @click="cerrarModal" class="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-end md:items-center justify-center z-40">
      <div @click.stop class="modal-container bg-oscuro-600/50 backdrop-blur-lg w-full md:max-w-md rounded-t-4xl border border-oscuro-700 md:rounded-lg flex flex-col max-h-[90vh]">
        
        <div class="p-4 md:border-b md:border-oscuro-700">
          <div class="w-12 h-1.5 mx-auto rounded-full bg-oscuro-600 mb-4 md:hidden"></div>
          <h3 class="text-lg text-center font-bold md:text-left">{{ cliente ? 'Editar' : 'Nuevo' }} Cliente</h3>
        </div>

        <form @submit.prevent="guardar" class="p-4 space-y-4 overflow-y-auto flex-1">
          <div class="space-y-4">
            <CampoFormulario id="nombre" label="Nombre Completo" v-model="form.nombre" type="text" required />
            <CampoFormulario id="email" label="Correo Electrónico" v-model="form.email" type="email" />
            <CampoFormulario id="telefono" label="Teléfono" v-model="form.telefono" type="tel" />
            <CampoFormulario as="textarea" id="direccion" label="Dirección" v-model="form.direccion" rows="3" />
          </div>
        </form>
        
        <div class="p-4 mt-auto md:border-t md:border-oscuro-700">
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
</template>

<script setup>
import { ref, reactive, watch, defineProps, defineEmits } from 'vue';
import { useClientesStore } from '@/stores/clientes';
import CampoFormulario from '@/components/Productos/CampoFormulario.vue';

const props = defineProps({
  modelValue: Boolean,
  cliente: Object
});

const emit = defineEmits(['update:modelValue', 'clienteGuardado']);

const clientesStore = useClientesStore();

const form = reactive({
  nombre: '',
  email: '',
  telefono: '',
  direccion: ''
});

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    if (props.cliente) {
      Object.assign(form, props.cliente);
    } else {
      Object.keys(form).forEach(key => {
        form[key] = '';
      });
    }
  }
});

const cerrarModal = () => {
  emit('update:modelValue', false);
};

const guardar = async () => {
  try {
    const datosCliente = { ...form };
    if (props.cliente) {
      await clientesStore.actualizarCliente(props.cliente.idCliente, datosCliente);
    } else {
      await clientesStore.agregarCliente(datosCliente);
    }
    emit('clienteGuardado');
    cerrarModal();
  } catch (error) {
    console.error('Error al guardar cliente:', error);
    alert('Error al guardar: ' + error.message);
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