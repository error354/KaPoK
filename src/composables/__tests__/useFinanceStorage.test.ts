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
  const mockContributions: FinanceItem[] = [
    { label: 'Contribution 1', value: '100' },
    { label: 'Contribution 2', value: '200' },
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
    const { contributions, expenses } = useFinanceStorage()
    expect(contributions.value).toEqual([])
    expect(expenses.value).toEqual([])
  })

  it('#A2 saves data to localStorage', () => {
    const { contributions, expenses, saveData } = useFinanceStorage()
    contributions.value = mockContributions
    expenses.value = mockExpenses

    saveData()

    expect(localStorage.getItem('contributions')).toBe(JSON.stringify(mockContributions))
    expect(localStorage.getItem('expenses')).toBe(JSON.stringify(mockExpenses))
  })

  it('#A3 loads data from localStorage', () => {
    localStorage.setItem('contributions', JSON.stringify(mockContributions))
    localStorage.setItem('expenses', JSON.stringify(mockExpenses))

    const { contributions, expenses, loadData } = useFinanceStorage()
    loadData()

    expect(contributions.value).toEqual(mockContributions)
    expect(expenses.value).toEqual(mockExpenses)
  })

  it('#A4 handles invalid JSON in localStorage', () => {
    localStorage.setItem('contributions', 'invalid-json')
    localStorage.setItem('expenses', 'invalid-json')

    const { contributions, expenses, loadData } = useFinanceStorage()
    loadData()

    expect(contributions.value).toEqual([])
    expect(expenses.value).toEqual([])
  })

  it('#A5 handles empty localStorage', () => {
    const { contributions, expenses, loadData } = useFinanceStorage()
    loadData()

    expect(contributions.value).toEqual([])
    expect(expenses.value).toEqual([])
  })
})
