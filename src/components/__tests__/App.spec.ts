import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../../App.vue'

interface AppInstance {
  contributions: { label: string; value: string }[]
  expenses: { label: string; value: string }[]
  percentShares: { label: string; value: string }[]
  toPay: { label: string; value: string }[]
  totalContribution: string
  totalExpense: string
  handleContributionAdd: (name: string, amount: string) => void
  handleExpenseAdd: (name: string, amount: string) => void
  handleEdit: (type: 'contribution' | 'expense', index: number, newLabel: string) => void
  handleDelete: (type: 'contribution' | 'expense', index: number) => void
  saveData: () => void
  onCalculate: () => void
  newContributionModal: { open: () => Promise<void> }
  newExpenseModal: { open: () => Promise<void> }
  openEditModal: (type: 'contribution' | 'expense', idx: number, currentLabel: string) => void
  openDeleteConfirmModal: (type: 'contribution' | 'expense', idx: number) => void
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
      const savedContributions = [{ label: 'Test Contribution', value: '100' }]
      const savedExpenses = [{ label: 'Test Expense', value: '50' }]

      localStorage.setItem('contributions', JSON.stringify(savedContributions))
      localStorage.setItem('expenses', JSON.stringify(savedExpenses))

      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      expect(vm.contributions).toEqual(savedContributions)
      expect(vm.expenses).toEqual(savedExpenses)
    })

    it('#A2 saves data to localStorage', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      // Set up test data directly instead of using modal submits
      vm.contributions = [
        { label: 'Test Contribution 1', value: '100' },
        { label: 'Test Contribution 2', value: '200' },
      ]
      vm.expenses = [
        { label: 'Test Expense 1', value: '50' },
        { label: 'Test Expense 2', value: '75' },
      ]

      // Trigger save
      await vm.saveData()

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'contributions',
        JSON.stringify(vm.contributions),
      )
      expect(localStorage.setItem).toHaveBeenCalledWith('expenses', JSON.stringify(vm.expenses))
    })

    it('#A3 handles empty localStorage', () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      expect(vm.contributions).toEqual([])
      expect(vm.expenses).toEqual([])
    })

    it('#A4 handles invalid JSON in localStorage', () => {
      localStorage.setItem('contributions', 'invalid-json')
      localStorage.setItem('expenses', 'invalid-json')

      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      expect(vm.contributions).toEqual([])
      expect(vm.expenses).toEqual([])
    })
  })

  describe('Calculations', () => {
    it('#B1 calculates totals correctly', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      // Set up test data
      vm.contributions = [
        { label: 'Contribution 1', value: '100' },
        { label: 'Contribution 2', value: '200' },
      ]
      vm.expenses = [
        { label: 'Expense 1', value: '150' },
        { label: 'Expense 2', value: '50' },
      ]

      await vm.onCalculate()

      expect(vm.totalContribution).toBe('300.00')
      expect(vm.totalExpense).toBe('200.00')
    })

    it('#B2 calculates percentage shares correctly', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.contributions = [
        { label: 'Contribution 1', value: '100' },
        { label: 'Contribution 2', value: '200' },
      ]
      vm.expenses = [{ label: 'Expense 1', value: '150' }]

      await vm.onCalculate()

      expect(vm.percentShares).toEqual([
        { label: 'Contribution 1', value: '33.33 %' },
        { label: 'Contribution 2', value: '66.67 %' },
      ])
    })

    it('#B3 calculates payment amounts correctly', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.contributions = [
        { label: 'Contribution 1', value: '100' },
        { label: 'Contribution 2', value: '200' },
      ]
      vm.expenses = [{ label: 'Expense 1', value: '150' }]

      await vm.onCalculate()

      expect(vm.toPay).toEqual([
        { label: 'Contribution 1', value: '50.00' },
        { label: 'Contribution 2', value: '100.00' },
      ])
    })

    it('#B4 handles empty contribution list', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.contributions = []
      vm.expenses = [{ label: 'Expense 1', value: '150' }]

      await vm.onCalculate()

      expect(vm.totalContribution).toBe('0.00')
      expect(vm.percentShares).toEqual([])
      expect(vm.toPay).toEqual([])
    })

    it('#B5 handles zero values', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.contributions = [
        { label: 'Contribution 1', value: '0' },
        { label: 'Contribution 2', value: '0' },
      ]
      vm.expenses = [{ label: 'Expense 1', value: '0' }]

      await vm.onCalculate()

      expect(vm.totalContribution).toBe('0.00')
      expect(vm.totalExpense).toBe('0.00')
      expect(vm.percentShares).toEqual([
        { label: 'Contribution 1', value: '0.00 %' },
        { label: 'Contribution 2', value: '0.00 %' },
      ])
      expect(vm.toPay).toEqual([
        { label: 'Contribution 1', value: '0.00' },
        { label: 'Contribution 2', value: '0.00' },
      ])
    })

    it('#B6 handles invalid number values', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.contributions = [
        { label: 'Contribution 1', value: 'invalid' },
        { label: 'Contribution 2', value: '200' },
      ]
      vm.expenses = [{ label: 'Expense 1', value: 'not-a-number' }]

      await vm.onCalculate()

      expect(vm.totalContribution).toBe('200.00')
      expect(vm.totalExpense).toBe('0.00')
      expect(vm.percentShares).toEqual([
        { label: 'Contribution 1', value: '0.00 %' },
        { label: 'Contribution 2', value: '100.00 %' },
      ])
    })

    it('#B7 handles negative contribution values', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.contributions = [
        { label: 'Contribution 1', value: '-100' },
        { label: 'Contribution 2', value: '200' },
      ]
      vm.expenses = [{ label: 'Expense 1', value: '150' }]

      await vm.onCalculate()

      expect(vm.totalContribution).toBe('100.00')
      expect(vm.percentShares).toEqual([
        { label: 'Contribution 1', value: '-100.00 %' },
        { label: 'Contribution 2', value: '200.00 %' },
      ])
      expect(vm.toPay).toEqual([
        { label: 'Contribution 1', value: '-150.00' },
        { label: 'Contribution 2', value: '300.00' },
      ])
    })

    it('#B8 handles negative expense values', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.contributions = [
        { label: 'Contribution 1', value: '100' },
        { label: 'Contribution 2', value: '200' },
      ]
      vm.expenses = [
        { label: 'Expense 1', value: '-50' },
        { label: 'Expense 2', value: '75' },
      ]

      await vm.onCalculate()

      expect(vm.totalExpense).toBe('25.00')
      expect(vm.toPay).toEqual([
        { label: 'Contribution 1', value: '8.33' },
        { label: 'Contribution 2', value: '16.67' },
      ])
    })

    it('#B9 handles all negative values', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.contributions = [
        { label: 'Contribution 1', value: '-100' },
        { label: 'Contribution 2', value: '-200' },
      ]
      vm.expenses = [
        { label: 'Expense 1', value: '-50' },
        { label: 'Expense 2', value: '-75' },
      ]

      await vm.onCalculate()

      expect(vm.totalContribution).toBe('-300.00')
      expect(vm.totalExpense).toBe('-125.00')
      expect(vm.percentShares).toEqual([
        { label: 'Contribution 1', value: '0.00 %' },
        { label: 'Contribution 2', value: '0.00 %' },
      ])
      expect(vm.toPay).toEqual([
        { label: 'Contribution 1', value: '0.00' },
        { label: 'Contribution 2', value: '0.00' },
      ])
    })
  })

  describe('CRUD Operations', () => {
    it('#C1 adds new contribution', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance
      const initialLength = vm.contributions.length

      vm.handleContributionAdd('New Contribution', '100')

      expect(vm.contributions.length).toBe(initialLength + 1)
      expect(vm.contributions[initialLength]).toEqual({
        label: 'New Contribution',
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

    it('#C3 edits contribution label', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.contributions = [{ label: 'Old Label', value: '100' }]
      vm.percentShares = [{ label: 'Old Label', value: '' }]
      vm.toPay = [{ label: 'Old Label', value: '' }]

      vm.handleEdit('contribution', 0, 'New Label')

      expect(vm.contributions[0].label).toBe('New Label')
      expect(vm.percentShares[0].label).toBe('New Label')
      expect(vm.toPay[0].label).toBe('New Label')
    })

    it('#C4 deletes contribution', async () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.contributions = [{ label: 'Test Contribution', value: '100' }]
      vm.percentShares = [{ label: 'Test Contribution', value: '' }]
      vm.toPay = [{ label: 'Test Contribution', value: '' }]

      vm.handleDelete('contribution', 0)

      expect(vm.contributions.length).toBe(0)
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

    it('#C6 handles empty label for contribution', () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance
      const initialLength = vm.contributions.length

      vm.handleContributionAdd('', '100')

      expect(vm.contributions.length).toBe(initialLength + 1)
      expect(vm.contributions[initialLength]).toEqual({
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

      vm.contributions = [{ label: 'Test Contribution', value: '100' }]
      vm.percentShares = [{ label: 'Test Contribution', value: '' }]
      vm.toPay = [{ label: 'Test Contribution', value: '' }]

      // Should not throw error when editing non-existent index
      vm.handleEdit('contribution', 999, 'New Label')

      expect(vm.contributions[0].label).toBe('Test Contribution')
      expect(vm.percentShares[0].label).toBe('Test Contribution')
      expect(vm.toPay[0].label).toBe('Test Contribution')
    })

    it('#C9 handles deleting non-existent index', () => {
      const wrapper = mount(App)
      const vm = wrapper.vm as unknown as AppInstance

      vm.contributions = [{ label: 'Test Contribution', value: '100' }]
      vm.percentShares = [{ label: 'Test Contribution', value: '' }]
      vm.toPay = [{ label: 'Test Contribution', value: '' }]

      // Should not throw error when deleting non-existent index
      vm.handleDelete('contribution', 999)

      expect(vm.contributions.length).toBe(1)
      expect(vm.percentShares.length).toBe(1)
      expect(vm.toPay.length).toBe(1)
    })
  })
})
