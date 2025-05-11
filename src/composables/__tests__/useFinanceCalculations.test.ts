import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useFinanceCalculations } from '../useFinanceCalculations'
import type { FinanceItem } from '../../types/finance'

describe('useFinanceCalculations', () => {
  const createMockItems = (items: Array<{ label: string; value: string }>): FinanceItem[] => {
    return items.map((item) => ({ label: item.label, value: item.value }))
  }

  it('#A1 initializes with empty totals', () => {
    const contributions = ref<FinanceItem[]>([])
    const expenses = ref<FinanceItem[]>([])

    const { totalContribution, totalExpense } = useFinanceCalculations(contributions, expenses)
    expect(totalContribution.value).toBe('')
    expect(totalExpense.value).toBe('')
  })

  it('#A2 calculates total contribution correctly', () => {
    const contributions = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Contribution 1', value: '100' },
        { label: 'Contribution 2', value: '200' },
        { label: 'Contribution 3', value: '300' },
      ]),
    )
    const expenses = ref<FinanceItem[]>([])

    const { totalContribution, calculateTotals } = useFinanceCalculations(contributions, expenses)
    calculateTotals()
    expect(totalContribution.value).toBe('600.00')
  })

  it('#A3 calculates total expense correctly', () => {
    const contributions = ref<FinanceItem[]>([])
    const expenses = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Expense 1', value: '50' },
        { label: 'Expense 2', value: '75' },
        { label: 'Expense 3', value: '25' },
      ]),
    )

    const { totalExpense, calculateTotals } = useFinanceCalculations(contributions, expenses)
    calculateTotals()
    expect(totalExpense.value).toBe('150.00')
  })

  it('#A4 handles invalid number values', () => {
    const contributions = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Contribution 1', value: '100' },
        { label: 'Contribution 2', value: 'invalid' },
        { label: 'Contribution 3', value: '' },
      ]),
    )
    const expenses = ref<FinanceItem[]>([])

    const { totalContribution, calculateTotals } = useFinanceCalculations(contributions, expenses)
    calculateTotals()
    expect(totalContribution.value).toBe('100.00')
  })

  it('#A5 calculates percent shares correctly', () => {
    const contributions = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Contribution 1', value: '100' },
        { label: 'Contribution 2', value: '200' },
        { label: 'Contribution 3', value: '300' },
      ]),
    )
    const expenses = ref<FinanceItem[]>([])

    const { calculateTotals, calculatePercentShares } = useFinanceCalculations(
      contributions,
      expenses,
    )
    calculateTotals()
    const shares = calculatePercentShares()

    expect(shares).toEqual([
      { label: 'Contribution 1', value: '16.67 %' },
      { label: 'Contribution 2', value: '33.33 %' },
      { label: 'Contribution 3', value: '50.00 %' },
    ])
  })

  it('#A6 calculates to pay amounts correctly', () => {
    const contributions = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Contribution 1', value: '100' },
        { label: 'Contribution 2', value: '200' },
        { label: 'Contribution 3', value: '300' },
      ]),
    )
    const expenses = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Expense 1', value: '300' },
        { label: 'Expense 2', value: '300' },
      ]),
    )

    const { calculateTotals, calculateToPay } = useFinanceCalculations(contributions, expenses)
    calculateTotals()
    const toPay = calculateToPay()

    expect(toPay).toEqual([
      { label: 'Contribution 1', value: '100.00' },
      { label: 'Contribution 2', value: '200.00' },
      { label: 'Contribution 3', value: '300.00' },
    ])
  })

  it('#A7 handles zero total contribution in percent shares', () => {
    const contributions = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Contribution 1', value: '0' },
        { label: 'Contribution 2', value: '0' },
      ]),
    )
    const expenses = ref<FinanceItem[]>([])

    const { calculateTotals, calculatePercentShares } = useFinanceCalculations(
      contributions,
      expenses,
    )
    calculateTotals()
    const shares = calculatePercentShares()

    expect(shares).toEqual([
      { label: 'Contribution 1', value: '0.00 %' },
      { label: 'Contribution 2', value: '0.00 %' },
    ])
  })

  it('#A8 handles zero total contribution in to pay calculations', () => {
    const contributions = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Contribution 1', value: '0' },
        { label: 'Contribution 2', value: '0' },
      ]),
    )
    const expenses = ref<FinanceItem[]>(createMockItems([{ label: 'Expense 1', value: '100' }]))

    const { calculateTotals, calculateToPay } = useFinanceCalculations(contributions, expenses)
    calculateTotals()
    const toPay = calculateToPay()

    expect(toPay).toEqual([
      { label: 'Contribution 1', value: '0.00' },
      { label: 'Contribution 2', value: '0.00' },
    ])
  })

  it('#A9 handles negative contribution values', () => {
    const contributions = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Contribution 1', value: '-100' },
        { label: 'Contribution 2', value: '200' },
      ]),
    )
    const expenses = ref<FinanceItem[]>([])

    const { totalContribution, calculateTotals } = useFinanceCalculations(contributions, expenses)
    calculateTotals()
    expect(totalContribution.value).toBe('100.00')
  })

  it('#A10 handles negative expense values', () => {
    const contributions = ref<FinanceItem[]>([])
    const expenses = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Expense 1', value: '-50' },
        { label: 'Expense 2', value: '75' },
      ]),
    )

    const { totalExpense, calculateTotals } = useFinanceCalculations(contributions, expenses)
    calculateTotals()
    expect(totalExpense.value).toBe('25.00')
  })

  it('#A11 calculates percent shares with negative values', () => {
    const contributions = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Contribution 1', value: '-100' },
        { label: 'Contribution 2', value: '300' },
      ]),
    )
    const expenses = ref<FinanceItem[]>([])

    const { calculateTotals, calculatePercentShares } = useFinanceCalculations(
      contributions,
      expenses,
    )
    calculateTotals()
    const shares = calculatePercentShares()

    expect(shares).toEqual([
      { label: 'Contribution 1', value: '-50.00 %' },
      { label: 'Contribution 2', value: '150.00 %' },
    ])
  })

  it('#A12 calculates to pay amounts with negative values', () => {
    const contributions = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Contribution 1', value: '-100' },
        { label: 'Contribution 2', value: '300' },
      ]),
    )
    const expenses = ref<FinanceItem[]>(createMockItems([{ label: 'Expense 1', value: '200' }]))

    const { calculateTotals, calculateToPay } = useFinanceCalculations(contributions, expenses)
    calculateTotals()
    const toPay = calculateToPay()

    expect(toPay).toEqual([
      { label: 'Contribution 1', value: '-100.00' },
      { label: 'Contribution 2', value: '300.00' },
    ])
  })

  it('#A13 handles all negative values', () => {
    const contributions = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Contribution 1', value: '-100' },
        { label: 'Contribution 2', value: '-200' },
      ]),
    )
    const expenses = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Expense 1', value: '-50' },
        { label: 'Expense 2', value: '-75' },
      ]),
    )

    const {
      totalContribution,
      totalExpense,
      calculateTotals,
      calculatePercentShares,
      calculateToPay,
    } = useFinanceCalculations(contributions, expenses)

    calculateTotals()
    expect(totalContribution.value).toBe('-300.00')
    expect(totalExpense.value).toBe('-125.00')

    const shares = calculatePercentShares()
    expect(shares).toEqual([
      { label: 'Contribution 1', value: '0.00 %' },
      { label: 'Contribution 2', value: '0.00 %' },
    ])

    const toPay = calculateToPay()
    expect(toPay).toEqual([
      { label: 'Contribution 1', value: '0.00' },
      { label: 'Contribution 2', value: '0.00' },
    ])
  })
})
