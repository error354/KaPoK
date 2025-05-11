import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import type { FinanceItem } from '../types/finance'

const INCOMES_KEY = 'contributions'
const EXPENSES_KEY = 'expenses'

export const useFinanceStorage = () => {
  const contributions = ref<FinanceItem[]>([])
  const expenses = ref<FinanceItem[]>([])
  const toast = useToast()

  const saveData = () => {
    localStorage.setItem(INCOMES_KEY, JSON.stringify(contributions.value))
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses.value))
    toast.success('Dane zostały zapisane')
  }

  const loadData = () => {
    try {
      const savedContributions = localStorage.getItem(INCOMES_KEY)
      const savedExpenses = localStorage.getItem(EXPENSES_KEY)

      contributions.value = savedContributions ? JSON.parse(savedContributions) : []
      expenses.value = savedExpenses ? JSON.parse(savedExpenses) : []
    } catch (error) {
      console.error('Failed to parse localStorage data:', error)
      // If JSON parsing fails, reset to empty arrays
      contributions.value = []
      expenses.value = []
    }
  }

  return {
    contributions,
    expenses,
    saveData,
    loadData,
  }
}
