<template>
  <div class="column col-12 col-6-md">
    <h3>{{ title }}</h3>
    <hr />
    <slot> </slot>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
})
</script>
