<template>
  <div
    class="bg-oscuro-850 p-4 rounded-2xl shadow-lg relative transition-all duration-300 hover:border-oscuro-700 border border-transparent"
  >
    <div class="flex items-start gap-4">
      <img
        v-if="producto.imagen"
        :src="crearUrlImagen(producto.imagen)"
        alt="Imagen del producto"
        class="w-16 h-16 object-cover rounded-xl border border-oscuro-700"
      />
      <div
        v-else
        class="w-16 h-16 bg-oscuro-700 rounded-xl flex items-center justify-center text-oscuro-500 flex-shrink-0"
      >
        <ImagenIcono class="w-8 h-8" />
      </div>
      <div class="flex-1">
        <span
          class="inline-block bg-green-900/20 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-green-600 mb-1"
        >
          {{ getCategoryName(producto.idCategoria) }}
        </span>
        <h3
          class="font-bold text-lg text-white pr-16 break-words"
          :title="producto.nombre"
        >
          {{ producto.nombre }}
        </h3>
        <p class="text-sm text-oscuro-400 font-mono">{{ producto.codigo }}</p>
      </div>
    </div>

    <div class="absolute top-3 right-3 flex flex-col gap-2">
      <button
        @click="$emit('editar', producto)"
        class="w-9 h-9 flex items-center justify-center bg-oscuro-900/50 border border-white/10 backdrop-blur-sm rounded-full text-white hover:bg-green-500 transition-colors"
        aria-label="Editar"
      >
        <EditarIcono class="w-4 h-4" />
      </button>
      <button
        @click="$emit('eliminar', producto.idProducto)"
        class="w-9 h-9 flex items-center justify-center bg-oscuro-900/50 border border-white/10 backdrop-blur-sm rounded-full text-white hover:bg-red-500 transition-colors"
        aria-label="Eliminar"
      >
        <BasureroIcono class="w-4 h-4" />
      </button>
    </div>

    <div
      class="grid grid-cols-3 gap-2 text-center mt-4 pt-4 border-t border-oscuro-700"
    >
      <div>
        <p class="text-xs font-medium text-oscuro-400 uppercase tracking-wider">
          Stock
        </p>
        <p
          class="text-xl font-bold mt-1"
          :class="
            producto.stockActual <= producto.stockMinimo
              ? 'text-red-500'
              : 'text-green-400'
          "
        >
          {{ producto.stockActual }}
        </p>
      </div>
      <div>
        <p class="text-xs font-medium text-oscuro-400 uppercase tracking-wider">
          Costo
        </p>
        <p class="text-xl font-bold text-white mt-1">
          S/.{{ producto.precioCosto.toFixed(2) }}
        </p>
      </div>
      <div>
        <p class="text-xs font-medium text-oscuro-400 uppercase tracking-wider">
          Venta
        </p>
        <p class="text-xl font-bold text-green-400 mt-1">
          S/.{{ producto.precioVenta.toFixed(2) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import ImagenIcono from "@/components/icons/ImagenIcono.vue";
import EditarIcono from "@/components/icons/EditarIcono.vue";
import BasureroIcono from "@/components/icons/BasureroIcono.vue";

const props = defineProps({
  producto: {
    type: Object,
    required: true,
  },
  getCategoryName: {
    type: Function,
    required: true,
  },
});

defineEmits(["editar", "eliminar"]);

const crearUrlImagen = (imagen) => {
  if (imagen instanceof Blob) {
    return URL.createObjectURL(imagen);
  }
  return null;
};
</script>
