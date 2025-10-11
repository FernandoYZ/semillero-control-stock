<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-oscuro-400 mb-1">{{ label }}</label>
    
    <input
      v-if="as === 'input'"
      :id="id"
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
      class="w-full px-5 md:px-3 md:py-2 py-3 bg-oscuro-600/70 md:rounded-lg rounded-full text-oscuro-100 focus:ring-0 focus:outline-none focus:bg-oscuro-600 transition-colors"
    />
    
    <select
      v-else-if="as === 'select'"
      :id="id"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
      class="w-full px-5 md:px-3 md:py-2 py-3 bg-oscuro-600/70 md:rounded-lg rounded-full text-oscuro-100 focus:ring-0 focus:outline-none focus:bg-oscuro-600 transition-colors appearance-none"
    >
      <slot></slot>
    </select>

    <textarea
      v-else-if="as === 'textarea'"
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      v-bind="$attrs"
      class="w-full px-5 md:px-3 md:py-2 py-3 bg-oscuro-600/70 md:rounded-lg rounded-3xl text-oscuro-100 focus:ring-0 focus:outline-none focus:bg-oscuro-600 transition-colors"
    ></textarea>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  modelValue: [String, Number],
  label: String,
  id: String,
  as: {
    type: String,
    default: 'input'
  },
  type: {
    type: String,
    default: 'text'
  }
});

defineEmits(['update:modelValue']);
</script>