import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../../App.vue'

interface AppInstance {
  incomes: { label: string; value: string }[]
  expenses: { label: string; value: string }[]
  percentShares: { label: string; value: string }[]
  toPay: { label: string; value: string }[]
  totalIncome: string
  totalExpense: string
  handleIncomeAdd: (name: string, amount: string) => void
  handleExpenseAdd: (name: string, amount: string) => void
  handleEdit: (type: 'income' | 'expense', index: number, newLabel: string) => void
  handleDelete: (type: 'income' | 'expense', index: number) => void
  saveData: () => void
  onCalculate: () => void
  newIncomeModal: { open: () => Promise<void> }
  newExpenseModal: { open: () => Promise<void> }
  openEditModal: (type: 'income' | 'expense', idx: number, currentLabel: string) => void
  openDeleteConfirmModal: (type: 'income' | 'expense', idx: number) => void
}

// Mock vue-toastification
vi.mock('vue-toastification', () => ({
  useToast: () => ({
    success: vi.fn(),
  }),
}))

// Mock vue-final-modal
vi.mock('vue-final-modal', () => ({
  ModalsContainer: {
    name: 'ModalsContainer',
    render: () => null,
  },
  useModal: () => ({
    open: vi.fn().mockResolvedValue(undefined),
  }),
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('App', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('Data Management', () => {
    it('#A1 loads saved data on mount', () => {
      const savedIncomes = [{ label: 'Test Income', value: '100' }]
      const savedExpenses = [{ label: 'Test Expense', value: '50' }]

      localStorage.setItem('incomes', JSON.stringify(savedIncomes))
      localStorage.setItem('expenses', JSON.stringify(savedExpenses))

      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      expect(vm.incomes).toEqual(savedIncomes)
      expect(vm.expenses).toEqual(savedExpenses)
    })

    it('#A2 saves data to localStorage', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      // Set up test data directly instead of using modal submits
      vm.incomes = [
        { label: 'Test Income 1', value: '100' },
        { label: 'Test Income 2', value: '200' },
      ]
      vm.expenses = [
        { label: 'Test Expense 1', value: '50' },
        { label: 'Test Expense 2', value: '75' },
      ]

      // Trigger save
      await vm.saveData()

      expect(localStorage.setItem).toHaveBeenCalledWith('incomes', JSON.stringify(vm.incomes))
      expect(localStorage.setItem).toHaveBeenCalledWith('expenses', JSON.stringify(vm.expenses))
    })

    it('#A3 handles empty localStorage', () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      expect(vm.incomes).toEqual([])
      expect(vm.expenses).toEqual([])
    })

    it('#A4 handles invalid JSON in localStorage', () => {
      localStorage.setItem('incomes', 'invalid-json')
      localStorage.setItem('expenses', 'invalid-json')

      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      expect(vm.incomes).toEqual([])
      expect(vm.expenses).toEqual([])
    })
  })

  describe('Calculations', () => {
    it('#B1 calculates totals correctly', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      // Set up test data
      vm.incomes = [
        { label: 'Income 1', value: '100' },
        { label: 'Income 2', value: '200' },
      ]
      vm.expenses = [
        { label: 'Expense 1', value: '150' },
        { label: 'Expense 2', value: '50' },
      ]

      await vm.onCalculate()

      expect(vm.totalIncome).toBe('300.00')
      expect(vm.totalExpense).toBe('200.00')
    })

    it('#B2 calculates percentage shares correctly', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.incomes = [
        { label: 'Income 1', value: '100' },
        { label: 'Income 2', value: '200' },
      ]
      vm.expenses = [{ label: 'Expense 1', value: '150' }]

      await vm.onCalculate()

      expect(vm.percentShares).toEqual([
        { label: 'Income 1', value: '33.33 %' },
        { label: 'Income 2', value: '66.67 %' },
      ])
    })

    it('#B3 calculates payment amounts correctly', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.incomes = [
        { label: 'Income 1', value: '100' },
        { label: 'Income 2', value: '200' },
      ]
      vm.expenses = [{ label: 'Expense 1', value: '150' }]

      await vm.onCalculate()

      expect(vm.toPay).toEqual([
        { label: 'Income 1', value: '50.00' },
        { label: 'Income 2', value: '100.00' },
      ])
    })

    it('#B4 handles empty income list', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.incomes = []
      vm.expenses = [{ label: 'Expense 1', value: '150' }]

      await vm.onCalculate()

      expect(vm.totalIncome).toBe('0.00')
      expect(vm.percentShares).toEqual([])
      expect(vm.toPay).toEqual([])
    })

    it('#B5 handles zero values', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.incomes = [
        { label: 'Income 1', value: '0' },
        { label: 'Income 2', value: '0' },
      ]
      vm.expenses = [{ label: 'Expense 1', value: '0' }]

      await vm.onCalculate()

      expect(vm.totalIncome).toBe('0.00')
      expect(vm.totalExpense).toBe('0.00')
      expect(vm.percentShares).toEqual([
        { label: 'Income 1', value: '0.00 %' },
        { label: 'Income 2', value: '0.00 %' },
      ])
      expect(vm.toPay).toEqual([
        { label: 'Income 1', value: '0.00' },
        { label: 'Income 2', value: '0.00' },
      ])
    })

    it('#B6 handles invalid number values', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.incomes = [
        { label: 'Income 1', value: 'invalid' },
        { label: 'Income 2', value: '200' },
      ]
      vm.expenses = [{ label: 'Expense 1', value: 'not-a-number' }]

      await vm.onCalculate()

      expect(vm.totalIncome).toBe('200.00')
      expect(vm.totalExpense).toBe('0.00')
      expect(vm.percentShares).toEqual([
        { label: 'Income 1', value: '0.00 %' },
        { label: 'Income 2', value: '100.00 %' },
      ])
    })
  })

  describe('CRUD Operations', () => {
    it('#C1 adds new income', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance
      const initialLength = vm.incomes.length

      vm.handleIncomeAdd('New Income', '100')

      expect(vm.incomes.length).toBe(initialLength + 1)
      expect(vm.incomes[initialLength]).toEqual({
        label: 'New Income',
        value: '100',
      })
    })

    it('#C2 adds new expense', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance
      const initialLength = vm.expenses.length

      vm.handleExpenseAdd('New Expense', '50')

      expect(vm.expenses.length).toBe(initialLength + 1)
      expect(vm.expenses[initialLength]).toEqual({
        label: 'New Expense',
        value: '50',
      })
    })

    it('#C3 edits income label', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.incomes = [{ label: 'Old Label', value: '100' }]
      vm.percentShares = [{ label: 'Old Label', value: '' }]
      vm.toPay = [{ label: 'Old Label', value: '' }]

      vm.handleEdit('income', 0, 'New Label')

      expect(vm.incomes[0].label).toBe('New Label')
      expect(vm.percentShares[0].label).toBe('New Label')
      expect(vm.toPay[0].label).toBe('New Label')
    })

    it('#C4 deletes income', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.incomes = [{ label: 'Test Income', value: '100' }]
      vm.percentShares = [{ label: 'Test Income', value: '' }]
      vm.toPay = [{ label: 'Test Income', value: '' }]

      vm.handleDelete('income', 0)

      expect(vm.incomes.length).toBe(0)
      expect(vm.percentShares.length).toBe(0)
      expect(vm.toPay.length).toBe(0)
    })

    it('#C5 deletes expense', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.expenses = [{ label: 'Test Expense', value: '50' }]

      vm.handleDelete('expense', 0)

      expect(vm.expenses.length).toBe(0)
    })

    it('#C6 handles empty label for income', () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance
      const initialLength = vm.incomes.length

      vm.handleIncomeAdd('', '100')

      expect(vm.incomes.length).toBe(initialLength + 1)
      expect(vm.incomes[initialLength]).toEqual({
        label: '',
        value: '100',
      })
    })

    it('#C7 handles empty value for expense', () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance
      const initialLength = vm.expenses.length

      vm.handleExpenseAdd('New Expense', '')

      expect(vm.expenses.length).toBe(initialLength + 1)
      expect(vm.expenses[initialLength]).toEqual({
        label: 'New Expense',
        value: '',
      })
    })

    it('#C8 handles editing non-existent index', () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.incomes = [{ label: 'Test Income', value: '100' }]
      vm.percentShares = [{ label: 'Test Income', value: '' }]
      vm.toPay = [{ label: 'Test Income', value: '' }]

      // Should not throw error when editing non-existent index
      vm.handleEdit('income', 999, 'New Label')

      expect(vm.incomes[0].label).toBe('Test Income')
      expect(vm.percentShares[0].label).toBe('Test Income')
      expect(vm.toPay[0].label).toBe('Test Income')
    })

    it('#C9 handles deleting non-existent index', () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.incomes = [{ label: 'Test Income', value: '100' }]
      vm.percentShares = [{ label: 'Test Income', value: '' }]
      vm.toPay = [{ label: 'Test Income', value: '' }]

      // Should not throw error when deleting non-existent index
      vm.handleDelete('income', 999)

      expect(vm.incomes.length).toBe(1)
      expect(vm.percentShares.length).toBe(1)
      expect(vm.toPay.length).toBe(1)
    })
  })
})
