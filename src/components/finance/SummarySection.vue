<template>
  <div>
    <section>
      <h4>Sumy</h4>
      <KInput label="Łączny wkład" :model-value="totalIncome" readonly />
      <KInput label="Łączne wydatki" :model-value="totalExpense" readonly />
    </section>
    <section>
      <h4>Prodentowe udziały</h4>
      <KInput
        v-for="(item, idx) in percentShares"
        :key="item.label + idx"
        :label="item.label"
        :model-value="item.value"
        readonly
      />
    </section>
    <section>
      <h4>Kwoty do zapłaty</h4>
      <KInput
        v-for="(item, idx) in toPay"
        :key="item.label + idx"
        :label="item.label"
        :model-value="item.value"
        readonly
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import KInput from '../KInput.vue'
import type { FinanceItem } from '../../types/finance'

defineProps<{
  totalIncome: string
  totalExpense: string
  percentShares: FinanceItem[]
  toPay: FinanceItem[]
}>()
</script>

<style scoped>
section {
  margin-bottom: 2rem;
}

section:last-child {
  margin-bottom: 0;
}
</style>
