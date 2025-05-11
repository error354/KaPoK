<template>
  <div class="container row">
    <KColumn title="Dane">
      <IncomeSection
        :items="incomes"
        @add="newIncomeModal.open"
        @edit="(idx) => openEditModal('income', idx, incomes[idx].label)"
        @delete="(idx) => openDeleteConfirmModal('income', idx)"
        @update:items="(items) => (incomes = items)"
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
          <KButton text="Oblicz" icon="refresh-cw" icon-color="ffffff" @click="onCalculate" />
        </div>
        <KButton text="Zapisz" icon="save" icon-color="ffffff" @click="saveData" />
      </div>
    </KColumn>
    <KColumn title="Podsumowanie">
      <SummarySection
        :total-income="totalIncome"
        :total-expense="totalExpense"
        :percent-shares="percentShares"
        :to-pay="toPay"
      />
    </KColumn>
    <ModalsContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ModalsContainer } from 'vue-final-modal'
import { useToast } from 'vue-toastification'
import KButton from './components/KButton.vue'
import KColumn from './components/KColumn.vue'
import IncomeSection from './components/finance/IncomeSection.vue'
import ExpenseSection from './components/finance/ExpenseSection.vue'
import SummarySection from './components/finance/SummarySection.vue'
import { useFinanceStorage } from './composables/useFinanceStorage'
import { useFinanceCalculations } from './composables/useFinanceCalculations'
import { useFinanceModals } from './composables/useFinanceModals'
import type { FinanceItem } from './types/finance'

const { incomes, expenses, saveData, loadData } = useFinanceStorage()

const percentShares = ref<FinanceItem[]>([])
const toPay = ref<FinanceItem[]>([])

const { totalIncome, totalExpense, calculatePercentShares, calculateToPay } =
  useFinanceCalculations(incomes, expenses)

const handleIncomeAdd = (name: string, amount: string) => {
  incomes.value.push({ label: name, value: amount })
  percentShares.value.push({ label: name, value: '' })
  toPay.value.push({ label: name, value: '' })
}

const handleExpenseAdd = (name: string, amount: string) => {
  expenses.value.push({ label: name, value: amount })
}

const handleEdit = (type: 'income' | 'expense', index: number, newLabel: string) => {
  if (type === 'income') {
    incomes.value[index].label = newLabel
    percentShares.value[index].label = newLabel
    toPay.value[index].label = newLabel
  } else {
    expenses.value[index].label = newLabel
  }
}

const handleDelete = (type: 'income' | 'expense', index: number) => {
  if (type === 'income') {
    incomes.value.splice(index, 1)
    percentShares.value.splice(index, 1)
    toPay.value.splice(index, 1)
  } else {
    expenses.value.splice(index, 1)
  }
}

const { newIncomeModal, newExpenseModal, openEditModal, openDeleteConfirmModal } = useFinanceModals(
  handleIncomeAdd,
  handleExpenseAdd,
  handleEdit,
  handleDelete,
)

const toast = useToast()

const onCalculate = () => {
  percentShares.value = calculatePercentShares()
  toPay.value = calculateToPay()
  toast.success('Obliczanie zakończone sukcesem')
}

onMounted(() => {
  loadData()
  percentShares.value = incomes.value.map((i) => ({ label: i.label, value: '' }))
  toPay.value = incomes.value.map((i) => ({ label: i.label, value: '' }))
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
