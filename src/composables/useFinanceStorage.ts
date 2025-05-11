import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import type { FinanceItem } from '../types/finance'

const CONTRIBUTIONS_KEY = 'contributions'
const EXPENSES_KEY = 'expenses'

const exampleContributions: FinanceItem[] = [
  { label: 'Person 1', value: '100' },
  { label: 'Person 2', value: '120' },
]

const exampleExpenses: FinanceItem[] = [
  { label: 'Expense 1', value: '30' },
  { label: 'Expense 2', value: '290' },
  { label: 'Expense 3', value: '-20' },
]

export const useFinanceStorage = () => {
  const contributions = ref<FinanceItem[]>([])
  const expenses = ref<FinanceItem[]>([])
  const toast = useToast()

  const saveData = () => {
    localStorage.setItem(CONTRIBUTIONS_KEY, JSON.stringify(contributions.value))
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses.value))
    toast.success('Dane zostały zapisane')
  }

  const loadData = () => {
    try {
      const savedContributions = localStorage.getItem(CONTRIBUTIONS_KEY)
      const savedExpenses = localStorage.getItem(EXPENSES_KEY)

      contributions.value = savedContributions
        ? JSON.parse(savedContributions)
        : exampleContributions
      expenses.value = savedExpenses ? JSON.parse(savedExpenses) : exampleExpenses
    } catch (error) {
      console.error('Failed to parse localStorage data:', error)
      // If JSON parsing fails, load example data
      contributions.value = exampleContributions
      expenses.value = exampleExpenses
    }
  }

  return {
    contributions,
    expenses,
    saveData,
    loadData,
  }
}
