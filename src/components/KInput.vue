<template>
  <div class="kinput-container">
    <label :for="inputId">{{ label }}</label>
    <div class="kinput-row">
      <input
        :id="inputId"
        :type="type === 'number' ? 'text' : type"
        :value="displayValue"
        @input="handleInput"
        :readonly="readonly"
        v-bind="$attrs"
      />
      <slot name="buttons" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUniqueId } from '../composables/useUniqueId'

defineOptions({ inheritAttrs: false })

const inputId = useUniqueId('kinput')

const props = defineProps({
  label: String,
  modelValue: String,
  readonly: Boolean,
  type: {
    type: String,
    default: 'text',
  },
})

const emit = defineEmits(['update:modelValue'])

const displayValue = computed(() => props.modelValue)

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value

  if (props.type === 'number') {
    // Remove all spaces first
    value = value.replace(/\s/g, '')

    // If empty or just a minus sign, allow it
    if (value === '' || value === '-') {
      emit('update:modelValue', value)
      return
    }

    // Extract all numbers, preserving minus sign if it's at the start
    const isNegative = value.startsWith('-')
    // Allow both . and , as decimal separators
    const numbers = value.replace(/[^\d.,]/g, '')
    value = isNegative ? '-' + numbers : numbers

    // Normalize all decimal separators to dot
    value = value.replace(/,/g, '.')

    // Handle decimal separator (only keep the first one)
    const parts = value.split('.')
    if (parts.length > 1) {
      // Limit decimal places to 2
      parts[1] = parts[1].slice(0, 2)
      value = parts[0] + '.' + parts[1]
    }

    // Update the input value to show the cleaned version
    input.value = value
  }

  emit('update:modelValue', value)
}
</script>

<style scoped>
.kinput-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.kinput-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
input {
  flex: 1 1 0%;
  min-width: 0;
  background-color: var(--input-color);
  border-color: var(--color-grey);
  &:not([readonly]):hover {
    border-color: var(--color-primary);
  }
}
</style>
