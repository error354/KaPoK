import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SummarySection from '../SummarySection.vue'
import type { FinanceItem } from '../../../types/finance'

describe('SummarySection', () => {
  const mockPersons: FinanceItem[] = [
    { label: 'Person 1', value: '33.33 %' },
    { label: 'Person 2', value: '66.67 %' },
  ]

  const mockToPay: FinanceItem[] = [
    { label: 'Person 1', value: '50.00' },
    { label: 'Person 2', value: '100.00' },
  ]

  it('#A1 renders all section titles', () => {
    const wrapper = mount(SummarySection, {
      props: {
        totalContribution: '300.00',
        totalExpense: '150.00',
        percentShares: [],
        toPay: [],
      },
    })
    const titles = wrapper.findAll('h4')
    expect(titles).toHaveLength(3)
    expect(titles[0].text()).toContain('Sums')
    expect(titles[1].text()).toContain('Percent share')
    expect(titles[2].text()).toContain('To pay')
  })

  it('#A2 displays total contribution and expense values', () => {
    const wrapper = mount(SummarySection, {
      props: {
        totalContribution: '300.00',
        totalExpense: '150.00',
        percentShares: [],
        toPay: [],
      },
    })
    const inputs = wrapper.findAll('input')
    expect(inputs[0].element.value).toBe('300.00')
    expect(inputs[1].element.value).toBe('150.00')
  })

  it('#A3 displays percent shares when provided', () => {
    const wrapper = mount(SummarySection, {
      props: {
        totalContribution: '300.00',
        totalExpense: '150.00',
        percentShares: mockPersons,
        toPay: [],
      },
    })
    const inputs = wrapper.findAll('input')
    expect(inputs[2].element.value).toBe('33.33 %')
    expect(inputs[3].element.value).toBe('66.67 %')
  })

  it('#A4 displays amounts to pay when provided', () => {
    const wrapper = mount(SummarySection, {
      props: {
        totalContribution: '300.00',
        totalExpense: '150.00',
        percentShares: [],
        toPay: mockToPay,
      },
    })
    const inputs = wrapper.findAll('input')
    expect(inputs[2].element.value).toBe('50.00')
    expect(inputs[3].element.value).toBe('100.00')
  })

  it('#A5 applies readonly attribute to all inputs', () => {
    const wrapper = mount(SummarySection, {
      props: {
        totalContribution: '300.00',
        totalExpense: '150.00',
        percentShares: mockPersons,
        toPay: mockToPay,
      },
    })
    const inputs = wrapper.findAll('input')
    inputs.forEach((input) => {
      expect(input.attributes('readonly')).toBeDefined()
    })
  })

  it('#A6 displays correct labels for all inputs', () => {
    const wrapper = mount(SummarySection, {
      props: {
        totalContribution: '300.00',
        totalExpense: '150.00',
        percentShares: mockPersons,
        toPay: mockToPay,
      },
    })
    const labels = wrapper.findAll('label')
    expect(labels[0].text()).toBe('Total contribution')
    expect(labels[1].text()).toBe('Total expense')
    expect(labels[2].text()).toBe('Person 1')
    expect(labels[3].text()).toBe('Person 2')
    expect(labels[4].text()).toBe('Person 1')
    expect(labels[5].text()).toBe('Person 2')
  })
})
