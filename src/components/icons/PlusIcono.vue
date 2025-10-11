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
      d="M12 4.5V19.5"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M19.5 12H4.5"
      stroke="currentColor"
      stroke-width="2"
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
