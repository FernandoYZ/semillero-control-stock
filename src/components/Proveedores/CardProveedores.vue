<template>
  <div class="bg-oscuro-850 p-4 rounded-2xl shadow-lg relative transition-all duration-300 hover:border-oscuro-700 border border-transparent">
    <!-- Header with Name and Actions -->
    <div class="flex justify-between items-center" :class="{ 'mb-4': proveedor.contacto || proveedor.email || proveedor.telefono || proveedor.direccion }">
      <h3 class="font-bold text-lg text-white pr-20 truncate" :title="proveedor.nombre">{{ proveedor.nombre }}</h3>
      <div class="flex gap-2 flex-shrink-0">
        <button @click="$emit('editar', proveedor)" class="w-10 h-10 flex items-center justify-center bg-oscuro-700/50 backdrop-blur-sm rounded-full text-white hover:bg-green-500 transition-colors" aria-label="Editar">
          <EditarIcono class="w-4 h-4" />
        </button>
        <button @click="$emit('eliminar', proveedor.idProveedor)" class="w-10 h-10 flex items-center justify-center bg-oscuro-700/50 backdrop-blur-sm rounded-full text-white hover:bg-red-500 transition-colors" aria-label="Eliminar">
          <BasureroIcono class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Contact Info -->
    <div v-if="proveedor.contacto || proveedor.email || proveedor.telefono || proveedor.direccion" class="space-y-2 text-sm text-oscuro-300 border-t border-oscuro-700 pt-4">
      <p v-if="proveedor.contacto" class="flex items-center gap-3">
        <BotonClientes class="w-4 h-4 text-oscuro-400 flex-shrink-0" />
        <span>{{ proveedor.contacto }}</span>
      </p>
      <p v-if="proveedor.email" class="flex items-center gap-3">
        <MailIcono class="w-4 h-4 text-oscuro-400 flex-shrink-0" />
        <span>{{ proveedor.email }}</span>
      </p>
      <p v-if="proveedor.telefono" class="flex items-center gap-3">
        <TelefonoIcono class="w-4 h-4 text-oscuro-400 flex-shrink-0" />
        <span>{{ proveedor.telefono }}</span>
      </p>
      <p v-if="proveedor.direccion" class="flex items-center gap-3">
        <UbicacionIcono class="w-4 h-4 text-oscuro-400 flex-shrink-0" />
        <span>{{ proveedor.direccion }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import MailIcono from '@/components/icons/MailIcono.vue';
import TelefonoIcono from '@/components/icons/TelefonoIcono.vue';
import UbicacionIcono from '@/components/icons/UbicacionIcono.vue';
import EditarIcono from '@/components/icons/EditarIcono.vue';
import BasureroIcono from '@/components/icons/BasureroIcono.vue';
import BotonClientes from '@/components/partials/BotonClientes.vue'; // Using this as a contact person icon

defineProps({
  proveedor: {
    type: Object,
    required: true
  }
});

defineEmits(['editar', 'eliminar']);
</script>