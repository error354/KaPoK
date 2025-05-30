<template>
  <div class="container row">
    <KColumn :title="$t('data')">
      <ContributionSection
        :items="contributions"
        @add="newContributionModal.open"
        @edit="(idx) => openEditModal('contribution', idx, contributions[idx].label)"
        @delete="(idx) => openDeleteConfirmModal('contribution', idx)"
        @update:items="(items) => (contributions = items)"
      />
      <ExpenseSection
        :items="expenses"
        @add="newExpenseModal.open"
        @edit="(idx) => openEditModal('expense', idx, expenses[idx].label)"
        @delete="(idx) => openDeleteConfirmModal('expense', idx)"
        @update:items="(items) => (expenses = items)"
      />
      <div class="main-buttons">
        <div class="gradient-shadow">
          <KButton
            :text="$t('calculate')"
            icon="refresh-cw"
            icon-color="ffffff"
            @click="onCalculate"
          />
        </div>
        <KButton :text="$t('save')" icon="save" icon-color="ffffff" @click="saveData" />
      </div>
    </KColumn>
    <KColumn :title="$t('summary')">
      <SummarySection
        :total-contribution="totalContribution"
        :total-expense="totalExpense"
        :percent-shares="percentShares"
        :to-pay="toPay"
      />
    </KColumn>
    <ModalsContainer />
    <LanguageSwitcher />
  </div>
</template>

<script setup lang="ts">
import type { FinanceItem } from './types/finance'
import { ref, onMounted } from 'vue'
import { ModalsContainer } from 'vue-final-modal'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { useFinanceStorage } from './composables/useFinanceStorage'
import { useFinanceCalculations } from './composables/useFinanceCalculations'
import { useFinanceModals } from './composables/useFinanceModals'
import KButton from './components/KButton.vue'
import KColumn from './components/KColumn.vue'
import ContributionSection from './components/finance/ContributionSection.vue'
import ExpenseSection from './components/finance/ExpenseSection.vue'
import SummarySection from './components/finance/SummarySection.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

const { t } = useI18n()
const { contributions, expenses, saveData, loadData } = useFinanceStorage()

const percentShares = ref<FinanceItem[]>([])
const toPay = ref<FinanceItem[]>([])

const { totalContribution, totalExpense, calculateTotals, calculatePercentShares, calculateToPay } =
  useFinanceCalculations(contributions, expenses)

const handleContributionAdd = (name: string, amount: string) => {
  contributions.value.push({ label: name, value: amount })
  percentShares.value.push({ label: name, value: '' })
  toPay.value.push({ label: name, value: '' })
}

const handleExpenseAdd = (name: string, amount: string) => {
  expenses.value.push({ label: name, value: amount })
}

const handleEdit = (type: 'contribution' | 'expense', index: number, newLabel: string) => {
  if (type === 'contribution' && index < contributions.value.length) {
    contributions.value[index].label = newLabel
    if (index < percentShares.value.length) {
      percentShares.value[index].label = newLabel
    }
    if (index < toPay.value.length) {
      toPay.value[index].label = newLabel
    }
  } else if (type === 'expense' && index < expenses.value.length) {
    expenses.value[index].label = newLabel
  }
}

const handleDelete = (type: 'contribution' | 'expense', index: number) => {
  if (type === 'contribution' && index < contributions.value.length) {
    contributions.value.splice(index, 1)
    if (index < percentShares.value.length) {
      percentShares.value.splice(index, 1)
    }
    if (index < toPay.value.length) {
      toPay.value.splice(index, 1)
    }
  } else if (type === 'expense' && index < expenses.value.length) {
    expenses.value.splice(index, 1)
  }
}

const { newContributionModal, newExpenseModal, openEditModal, openDeleteConfirmModal } =
  useFinanceModals(handleContributionAdd, handleExpenseAdd, handleEdit, handleDelete)

const toast = useToast()

const onCalculate = () => {
  calculateTotals()
  percentShares.value = calculatePercentShares()
  toPay.value = calculateToPay()
  toast.success(t('calculationSuccess'))
}

onMounted(() => {
  loadData()
  percentShares.value = contributions.value.map((i) => ({ label: i.label, value: '' }))
  toPay.value = contributions.value.map((i) => ({ label: i.label, value: '' }))
})
</script>

<style scoped>
.main-buttons {
  display: flex;
  gap: 8px;
  margin-top: 32px;
  justify-content: space-between;
}

.gradient-shadow {
  position: relative;
  background: white;
  border-radius: 8px;
}

.gradient-shadow button {
  opacity: 1;
}

@keyframes gradient-rotate {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 100% 50%;
  }
  75% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes gradient-flash {
  0% {
    filter: blur(0px);
  }
  20% {
    filter: blur(12px);
  }
  100% {
    filter: blur(6px);
  }
}

.gradient-shadow::before {
  content: '';
  position: absolute;
  --gradient-size: -2px;
  top: var(--gradient-size);
  left: var(--gradient-size);
  right: var(--gradient-size);
  bottom: var(--gradient-size);
  background: linear-gradient(45deg, #954ba5, #65b5eb);
  background-size: 200% 200%;
  border-radius: 8px;
  z-index: -1;
  filter: blur(6px);
  opacity: 0;
  transition: all 0.2s ease;
  animation: gradient-rotate 7s linear infinite;
}

.gradient-shadow:hover::before,
.gradient-shadow:focus-within::before {
  opacity: 1;
  transition: all 0.2s ease;
  animation:
    gradient-rotate 7s linear infinite,
    gradient-flash 1s ease-in-out;
}
</style>
