<template>
  <div role="region" :aria-label="$t('summary')">
    <section aria-labelledby="sums-section-title">
      <h4 id="sums-section-title">{{ $t('sums') }}</h4>
      <KInput
        :label="$t('totalContribution')"
        :model-value="totalContribution"
        readonly
        :aria-label="$t('totalContribution')"
      />
      <KInput
        :label="$t('totalExpense')"
        :model-value="totalExpense"
        readonly
        :aria-label="$t('totalExpense')"
      />
    </section>
    <section aria-labelledby="percent-shares-title">
      <h4 id="percent-shares-title">{{ $t('percentShare') }}</h4>
      <KInput
        v-for="(item, idx) in percentShares"
        :key="item.label + idx"
        :label="item.label"
        :model-value="item.value"
        readonly
        :aria-label="$t('percentShare') + ': ' + item.label"
      />
    </section>
    <section aria-labelledby="to-pay-title">
      <h4 id="to-pay-title">{{ $t('toPay') }}</h4>
      <KInput
        v-for="(item, idx) in toPay"
        :key="item.label + idx"
        :label="item.label"
        :model-value="item.value"
        readonly
        :aria-label="$t('toPay') + ': ' + item.label"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import KInput from '../KInput.vue'
import type { FinanceItem } from '../../types/finance'

useI18n()

defineProps<{
  totalContribution: string
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
