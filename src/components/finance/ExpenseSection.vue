<template>
  <section aria-labelledby="expense-section-title">
    <h4 id="expense-section-title">
      Wydatki
      <KButton
        size="small"
        outlined
        text="Dodaj"
        @click="onAddClick"
        aria-label="Dodaj nowy wydatek"
      />
    </h4>
    <div
      v-for="(item, idx) in items"
      :key="idx"
      class="input-row"
      role="listitem"
      :aria-label="`Wydatek: ${item.label}`"
    >
      <KInput
        :label="item.label"
        v-model="item.value"
        type="number"
        :aria-label="`Wartość wydatku: ${item.label}`"
        @update:model-value="(val) => onValueUpdate(idx, val)"
      >
        <template #buttons>
          <KButton
            size="small"
            outlined
            icon="edit"
            icon-size="18"
            @click="onEditClick(idx)"
            :aria-label="`Edytuj wydatek: ${item.label}`"
          />
          <KButton
            size="small"
            outlined
            icon="trash-2"
            icon-size="18"
            @click="onDeleteClick(idx)"
            :aria-label="`Usuń wydatek: ${item.label}`"
          />
        </template>
      </KInput>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import KButton from '../KButton.vue'
import KInput from '../KInput.vue'
import type { FinanceItem } from '../../types/finance'

const props = defineProps<{
  items: FinanceItem[]
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'edit', index: number): void
  (e: 'delete', index: number): void
  (e: 'update:items', items: FinanceItem[]): void
}>()

const onAddClick = () => emit('add')

const onEditClick = (index: number) => emit('edit', index)

const onDeleteClick = (index: number) => emit('delete', index)

const onValueUpdate = (index: number, value: string) => {
  const newItems = [...props.items]
  newItems[index] = { ...newItems[index], value }
  emit('update:items', newItems)
}
</script>
