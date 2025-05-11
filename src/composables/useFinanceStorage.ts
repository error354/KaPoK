import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import type { FinanceItem } from '../types/finance'

const INCOMES_KEY = 'incomes'
const EXPENSES_KEY = 'expenses'

export const useFinanceStorage = () => {
  const incomes = ref<FinanceItem[]>([])
  const expenses = ref<FinanceItem[]>([])
  const toast = useToast()

  const saveData = () => {
    localStorage.setItem(INCOMES_KEY, JSON.stringify(incomes.value))
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses.value))
    toast.success('Dane zostały zapisane')
  }

  const loadData = () => {
    const savedIncomes = localStorage.getItem(INCOMES_KEY)
    const savedExpenses = localStorage.getItem(EXPENSES_KEY)

    incomes.value = savedIncomes ? JSON.parse(savedIncomes) : []
    expenses.value = savedExpenses ? JSON.parse(savedExpenses) : []
  }

  return {
    incomes,
    expenses,
    saveData,
    loadData,
  }
}
