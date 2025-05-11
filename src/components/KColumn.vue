<template>
  <div class="column col-6">
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
