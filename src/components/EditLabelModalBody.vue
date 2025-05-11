<template>
  <form @submit.prevent="submit">
    <KInput
      :model-value="labelInput"
      @update:model-value="(val) => updateValue(val)"
      label="Nowa nazwa"
      autofocus
    />
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import KInput from './KInput.vue'

const props = defineProps({
  modelValue: String,
})
const emit = defineEmits(['update:modelValue', 'submit', 'update:isValid'])

const labelInput = ref(props.modelValue || '')

watch(labelInput, (newValue) => {
  emit('update:isValid', Boolean(newValue))
})

watch(
  () => props.modelValue,
  (val) => {
    labelInput.value = val || ''
    emit('update:isValid', Boolean(val))
  },
  { immediate: true },
)

const updateValue = (val: string) => {
  labelInput.value = val
  emit('update:modelValue', val)
}

const submit = () => {
  emit('submit')
}
</script>

<style scoped>
.mt-2 {
  margin-top: 1rem;
}
</style>
