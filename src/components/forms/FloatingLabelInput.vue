<template>
  <div class="relative">
    <input 
      :type="type" 
      :id="id" 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="peer block w-full px-3 py-2.5 bg-oscuro-900 border border-oscuro-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-green-500 appearance-none"
      placeholder=" "
      v-bind="$attrs"
    />
    <label 
      :for="id"
      class="absolute text-sm text-oscuro-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-oscuro-900 px-2 peer-focus:px-2 peer-focus:text-green-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  modelValue: [String, Number]
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
/* Ocultar flechas en input[type=number] para un look más limpio */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>