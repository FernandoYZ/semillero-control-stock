<template>
  <div
    class="bg-oscuro-850 rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10 border border-transparent hover:border-oscuro-700"
  >
    <div class="relative">
      <img
        v-if="producto.imagen"
        :src="crearUrlImagen(producto.imagen)"
        alt="Imagen del producto"
        class="w-full h-48 object-cover"
      />
      <div
        v-else
        class="w-full h-48 bg-oscuro-700 flex items-center justify-center text-oscuro-500"
      >
        <ImagenIcono class="w-16 h-16" />
      </div>
      <div class="absolute top-2 right-2 flex gap-2">
        <button
          @click="$emit('editar', producto)"
          class="w-12 h-12 cursor-pointer flex items-center justify-center bg-oscuro-900/50 backdrop-blur-sm border border-white/10 rounded-full text-white hover:bg-green-500 transition-colors"
          aria-label="Editar"
        >
          <EditarIcono class="w-4 h-4" />
        </button>
        <button
          @click="$emit('eliminar', producto.idProducto)"
          class="w-12 h-12 cursor-pointer flex items-center justify-center bg-oscuro-900/50 backdrop-blur-sm border border-white/10 rounded-full text-white hover:bg-red-500 transition-colors"
          aria-label="Eliminar"
        >
          <BasureroIcono class="w-4 h-4" />
        </button>
      </div>
      <span
        class="absolute bottom-2 left-2 bg-green-900/50 backdrop-blur-sm border border-white/10 text-green-300 text-xs font-bold px-2 py-1 rounded-full"
        >{{ getCategoryName(producto.idCategoria) }}</span
      >
    </div>

    <div class="p-4">
      <h3
        class="font-bold text-lg text-white truncate"
        :title="producto.nombre"
      >
        {{ producto.nombre }}
      </h3>
      <p class="text-xs text-oscuro-500 font-mono">{{ producto.codigo }}</p>

      <div class="flex justify-between items-center mt-4">
        <div>
          <p class="text-sm text-oscuro-400">Costo</p>
          <p class="font-semibold text-white">S/.{{ producto.precioCosto }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-oscuro-400">Venta</p>
          <p class="font-bold text-lg text-green-400">
            S/.{{ producto.precioVenta }}
          </p>
        </div>
      </div>

      <div class="mt-4">
        <p class="text-sm text-oscuro-400">Stock</p>
        <div class="flex items-baseline gap-2">
          <p
            class="font-bold text-2xl"
            :class="
              producto.stockActual <= producto.stockMinimo
                ? 'text-red-500'
                : 'text-green-400'
            "
          >
            {{ producto.stockActual }}
          </p>
          <p class="text-xs text-oscuro-500">
            / min. {{ producto.stockMinimo }}
          </p>
        </div>
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
