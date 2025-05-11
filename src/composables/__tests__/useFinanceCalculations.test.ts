import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useFinanceCalculations } from '../useFinanceCalculations'
import type { FinanceItem } from '../../types/finance'

describe('useFinanceCalculations', () => {
  const createMockItems = (items: Array<{ label: string; value: string }>): FinanceItem[] => {
    return items.map((item) => ({ label: item.label, value: item.value }))
  }

  it('#A1 calculates total income correctly', () => {
    const incomes = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Income 1', value: '100' },
        { label: 'Income 2', value: '200' },
        { label: 'Income 3', value: '300' },
      ]),
    )
    const expenses = ref<FinanceItem[]>([])

    const { totalIncome } = useFinanceCalculations(incomes, expenses)
    expect(totalIncome.value).toBe('600.00')
  })

  it('#A2 calculates total expense correctly', () => {
    const incomes = ref<FinanceItem[]>([])
    const expenses = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Expense 1', value: '50' },
        { label: 'Expense 2', value: '75' },
        { label: 'Expense 3', value: '25' },
      ]),
    )

    const { totalExpense } = useFinanceCalculations(incomes, expenses)
    expect(totalExpense.value).toBe('150.00')
  })

  it('#A3 handles invalid number values', () => {
    const incomes = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Income 1', value: '100' },
        { label: 'Income 2', value: 'invalid' },
        { label: 'Income 3', value: '' },
      ]),
    )
    const expenses = ref<FinanceItem[]>([])

    const { totalIncome } = useFinanceCalculations(incomes, expenses)
    expect(totalIncome.value).toBe('100.00')
  })

  it('#A4 calculates percent shares correctly', () => {
    const incomes = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Income 1', value: '100' },
        { label: 'Income 2', value: '200' },
        { label: 'Income 3', value: '300' },
      ]),
    )
    const expenses = ref<FinanceItem[]>([])

    const { calculatePercentShares } = useFinanceCalculations(incomes, expenses)
    const shares = calculatePercentShares()

    expect(shares).toEqual([
      { label: 'Income 1', value: '16.67 %' },
      { label: 'Income 2', value: '33.33 %' },
      { label: 'Income 3', value: '50.00 %' },
    ])
  })

  it('#A5 calculates to pay amounts correctly', () => {
    const incomes = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Income 1', value: '100' },
        { label: 'Income 2', value: '200' },
        { label: 'Income 3', value: '300' },
      ]),
    )
    const expenses = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Expense 1', value: '300' },
        { label: 'Expense 2', value: '300' },
      ]),
    )

    const { calculateToPay } = useFinanceCalculations(incomes, expenses)
    const toPay = calculateToPay()

    expect(toPay).toEqual([
      { label: 'Income 1', value: '100.00' },
      { label: 'Income 2', value: '200.00' },
      { label: 'Income 3', value: '300.00' },
    ])
  })

  it('#A6 handles zero total income in percent shares', () => {
    const incomes = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Income 1', value: '0' },
        { label: 'Income 2', value: '0' },
      ]),
    )
    const expenses = ref<FinanceItem[]>([])

    const { calculatePercentShares } = useFinanceCalculations(incomes, expenses)
    const shares = calculatePercentShares()

    expect(shares).toEqual([
      { label: 'Income 1', value: '0.00 %' },
      { label: 'Income 2', value: '0.00 %' },
    ])
  })

  it('#A7 handles zero total income in to pay calculations', () => {
    const incomes = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Income 1', value: '0' },
        { label: 'Income 2', value: '0' },
      ]),
    )
    const expenses = ref<FinanceItem[]>(createMockItems([{ label: 'Expense 1', value: '100' }]))

    const { calculateToPay } = useFinanceCalculations(incomes, expenses)
    const toPay = calculateToPay()

    expect(toPay).toEqual([
      { label: 'Income 1', value: '0.00' },
      { label: 'Income 2', value: '0.00' },
    ])
  })

  it('#A8 handles negative income values', () => {
    const incomes = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Income 1', value: '-100' },
        { label: 'Income 2', value: '200' },
      ]),
    )
    const expenses = ref<FinanceItem[]>([])

    const { totalIncome } = useFinanceCalculations(incomes, expenses)
    expect(totalIncome.value).toBe('100.00')
  })

  it('#A9 handles negative expense values', () => {
    const incomes = ref<FinanceItem[]>([])
    const expenses = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Expense 1', value: '-50' },
        { label: 'Expense 2', value: '75' },
      ]),
    )

    const { totalExpense } = useFinanceCalculations(incomes, expenses)
    expect(totalExpense.value).toBe('25.00')
  })

  it('#A10 calculates percent shares with negative values', () => {
    const incomes = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Income 1', value: '-100' },
        { label: 'Income 2', value: '300' },
      ]),
    )
    const expenses = ref<FinanceItem[]>([])

    const { calculatePercentShares } = useFinanceCalculations(incomes, expenses)
    const shares = calculatePercentShares()

    expect(shares).toEqual([
      { label: 'Income 1', value: '-50.00 %' },
      { label: 'Income 2', value: '150.00 %' },
    ])
  })

  it('#A11 calculates to pay amounts with negative values', () => {
    const incomes = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Income 1', value: '-100' },
        { label: 'Income 2', value: '300' },
      ]),
    )
    const expenses = ref<FinanceItem[]>(createMockItems([{ label: 'Expense 1', value: '200' }]))

    const { calculateToPay } = useFinanceCalculations(incomes, expenses)
    const toPay = calculateToPay()

    expect(toPay).toEqual([
      { label: 'Income 1', value: '-100.00' },
      { label: 'Income 2', value: '300.00' },
    ])
  })

  it('#A12 handles all negative values', () => {
    const incomes = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Income 1', value: '-100' },
        { label: 'Income 2', value: '-200' },
      ]),
    )
    const expenses = ref<FinanceItem[]>(
      createMockItems([
        { label: 'Expense 1', value: '-50' },
        { label: 'Expense 2', value: '-75' },
      ]),
    )

    const { totalIncome, totalExpense, calculatePercentShares, calculateToPay } =
      useFinanceCalculations(incomes, expenses)

    expect(totalIncome.value).toBe('-300.00')
    expect(totalExpense.value).toBe('-125.00')

    const shares = calculatePercentShares()
    expect(shares).toEqual([
      { label: 'Income 1', value: '0.00 %' },
      { label: 'Income 2', value: '0.00 %' },
    ])

    const toPay = calculateToPay()
    expect(toPay).toEqual([
      { label: 'Income 1', value: '0.00' },
      { label: 'Income 2', value: '0.00' },
    ])
  })
})
