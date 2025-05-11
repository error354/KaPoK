<template>
  <KInput
    :label="nameLabel"
    :model-value="name"
    type="text"
    @update:model-value="(val) => (name = val)"
  />
  <KInput
    :label="amountLabel"
    :model-value="amount"
    type="number"
    min="0"
    step="0.01"
    @update:model-value="(val) => (amount = val)"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import KInput from '../KInput.vue'

defineProps<{
  nameLabel: string
  amountLabel: string
}>()

const name = ref('')
const amount = ref('')

const emit = defineEmits(['update:isValid'])

watch(
  [name, amount],
  ([newName, newAmount]) => {
    emit('update:isValid', Boolean(newName && newAmount))
  },
  { immediate: true },
)

function submit() {
  return { name: name.value, amount: amount.value }
}

defineExpose({ submit })
</script>

<style scoped></style>
