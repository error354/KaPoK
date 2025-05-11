import { computed, type Ref } from 'vue'
import type { FinanceItem } from '../types/finance'

export const useFinanceCalculations = (
  incomes: Ref<FinanceItem[]>,
  expenses: Ref<FinanceItem[]>,
) => {
  const totalIncome = computed(() => {
    return incomes.value.reduce((sum, item) => sum + parseFloat(item.value || '0'), 0).toFixed(2)
  })

  const totalExpense = computed(() => {
    return expenses.value.reduce((sum, item) => sum + parseFloat(item.value || '0'), 0).toFixed(2)
  })

  const calculatePercentShares = () => {
    const sumIncome = parseFloat(totalIncome.value)
    return incomes.value.map((item) => {
      const val = parseFloat(item.value || '0')
      const percent = sumIncome > 0 ? (val / sumIncome) * 100 : 0
      return {
        label: item.label,
        value: `${percent.toFixed(2)} %`,
      }
    })
  }

  const calculateToPay = () => {
    const sumIncome = parseFloat(totalIncome.value)
    const sumExpense = parseFloat(totalExpense.value)
    return incomes.value.map((item) => {
      const val = parseFloat(item.value || '0')
      const percent = sumIncome > 0 ? (val / sumIncome) * 100 : 0
      const pay = (sumExpense * percent) / 100
      return {
        label: item.label,
        value: pay.toFixed(2),
      }
    })
  }

  return {
    totalIncome,
    totalExpense,
    calculatePercentShares,
    calculateToPay,
  }
}
