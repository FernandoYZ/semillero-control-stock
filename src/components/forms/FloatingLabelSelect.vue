<template>
  <div class="relative">
    <select
      :id="id"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="peer block w-full px-3 py-2.5 bg-oscuro-900 border border-oscuro-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-green-500 appearance-none"
      v-bind="$attrs"
    >
      <slot></slot>
    </select>
    <label 
      :for="id"
      class="absolute text-sm text-oscuro-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-oscuro-900 px-2 left-1"
    >
      {{ label }}
    </label>
    <div class="absolute top-0 right-0 h-full flex items-center px-3 pointer-events-none">
        <svg class="w-4 h-4 text-oscuro-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </div>
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
  modelValue: [String, Number]
})

defineEmits(['update:modelValue'])
</script>