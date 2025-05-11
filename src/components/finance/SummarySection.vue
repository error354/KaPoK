<template>
  <div role="region" aria-label="Podsumowanie finansów">
    <section aria-labelledby="sums-section-title">
      <h4 id="sums-section-title">Sumy</h4>
      <KInput
        label="Łączny wkład"
        :model-value="totalIncome"
        readonly
        aria-label="Łączna kwota wkładów"
      />
      <KInput
        label="Łączne wydatki"
        :model-value="totalExpense"
        readonly
        aria-label="Łączna kwota wydatków"
      />
    </section>
    <section aria-labelledby="percent-shares-title">
      <h4 id="percent-shares-title">Procentowe udziały</h4>
      <KInput
        v-for="(item, idx) in percentShares"
        :key="item.label + idx"
        :label="item.label"
        :model-value="item.value"
        readonly
        :aria-label="`Procentowy udział: ${item.label}`"
      />
    </section>
    <section aria-labelledby="to-pay-title">
      <h4 id="to-pay-title">Kwoty do zapłaty</h4>
      <KInput
        v-for="(item, idx) in toPay"
        :key="item.label + idx"
        :label="item.label"
        :model-value="item.value"
        readonly
        :aria-label="`Kwota do zapłaty: ${item.label}`"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
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
