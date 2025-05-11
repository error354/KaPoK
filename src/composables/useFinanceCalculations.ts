import { ref, type Ref } from 'vue'
import type { FinanceItem } from '../types/finance'

export const useFinanceCalculations = (
  contributions: Ref<FinanceItem[]>,
  expenses: Ref<FinanceItem[]>,
) => {
  const totalContribution = ref('')
  const totalExpense = ref('')

  const calculateTotals = () => {
    totalContribution.value = contributions.value
      .reduce((sum, item) => {
        const value = parseFloat(item.value || '0')
        return sum + (isNaN(value) ? 0 : value)
      }, 0)
      .toFixed(2)

    totalExpense.value = expenses.value
      .reduce((sum, item) => {
        const value = parseFloat(item.value || '0')
        return sum + (isNaN(value) ? 0 : value)
      }, 0)
      .toFixed(2)
  }

  const calculatePercentShares = () => {
    const sumContribution = parseFloat(totalContribution.value)
    return contributions.value.map((item) => {
      const val = parseFloat(item.value || '0')
      const percent = sumContribution > 0 ? ((isNaN(val) ? 0 : val) / sumContribution) * 100 : 0
      return {
        label: item.label,
        value: `${percent.toFixed(2)} %`,
      }
    })
  }

  const calculateToPay = () => {
    const sumContribution = parseFloat(totalContribution.value)
    const sumExpense = parseFloat(totalExpense.value)
    return contributions.value.map((item) => {
      const val = parseFloat(item.value || '0')
      const percent = sumContribution > 0 ? ((isNaN(val) ? 0 : val) / sumContribution) * 100 : 0
      const pay = (sumExpense * percent) / 100
      return {
        label: item.label,
        value: pay.toFixed(2),
      }
    })
  }

  return {
    totalContribution,
    totalExpense,
    calculateTotals,
    calculatePercentShares,
    calculateToPay,
  }
}
