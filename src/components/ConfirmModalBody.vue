<template>
  <div class="confirm-modal-body">
    {{ message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<style scoped>
.confirm-modal-body {
  text-align: center;
  padding: 1rem;
}
</style>
