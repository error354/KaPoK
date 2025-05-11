import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useFinanceStorage } from '../useFinanceStorage'
import type { FinanceItem } from '../../types/finance'

// Mock vue-toastification
vi.mock('vue-toastification', () => ({
  useToast: () => ({
    success: vi.fn(),
  }),
}))

describe('useFinanceStorage', () => {
  const mockIncomes: FinanceItem[] = [
    { label: 'Income 1', value: '100' },
    { label: 'Income 2', value: '200' },
  ]
  const mockExpenses: FinanceItem[] = [
    { label: 'Expense 1', value: '50' },
    { label: 'Expense 2', value: '75' },
  ]

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Clean up after each test
    localStorage.clear()
  })

  it('#A1 initializes with empty arrays', () => {
    const { incomes, expenses } = useFinanceStorage()
    expect(incomes.value).toEqual([])
    expect(expenses.value).toEqual([])
  })

  it('#A2 saves data to localStorage', () => {
    const { incomes, expenses, saveData } = useFinanceStorage()
    incomes.value = mockIncomes
    expenses.value = mockExpenses

    saveData()

    expect(localStorage.getItem('incomes')).toBe(JSON.stringify(mockIncomes))
    expect(localStorage.getItem('expenses')).toBe(JSON.stringify(mockExpenses))
  })

  it('#A3 loads data from localStorage', () => {
    localStorage.setItem('incomes', JSON.stringify(mockIncomes))
    localStorage.setItem('expenses', JSON.stringify(mockExpenses))

    const { incomes, expenses, loadData } = useFinanceStorage()
    loadData()

    expect(incomes.value).toEqual(mockIncomes)
    expect(expenses.value).toEqual(mockExpenses)
  })

  it('#A4 handles invalid JSON in localStorage', () => {
    localStorage.setItem('incomes', 'invalid-json')
    localStorage.setItem('expenses', 'invalid-json')

    const { incomes, expenses, loadData } = useFinanceStorage()
    loadData()

    expect(incomes.value).toEqual([])
    expect(expenses.value).toEqual([])
  })

  it('#A5 handles empty localStorage', () => {
    const { incomes, expenses, loadData } = useFinanceStorage()
    loadData()

    expect(incomes.value).toEqual([])
    expect(expenses.value).toEqual([])
  })
})
