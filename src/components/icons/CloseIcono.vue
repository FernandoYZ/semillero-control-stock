<template>
  <svg
    :width="size"
    :height="size"
    :class="className"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 5L5 19"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M19 19L5 5"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
<script setup>
defineProps({
  size: {
    type: [String, Number],
    default: 24,
  },
  className: {
    type: String,
    default: "",
  },
});
</script>
