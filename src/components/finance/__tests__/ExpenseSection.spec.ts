import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExpenseSection from '../ExpenseSection.vue'
import type { FinanceItem } from '../../../types/finance'

describe('ExpenseSection', () => {
  const mockItems: FinanceItem[] = [
    { label: 'Expense 1', value: '50' },
    { label: 'Expense 2', value: '75' },
  ]

  it('#A1 renders section title', () => {
    const wrapper = mount(ExpenseSection, {
      props: {
        items: [],
      },
    })
    expect(wrapper.find('h4').text()).toContain('Wydatki')
  })

  it('#A2 renders add button', () => {
    const wrapper = mount(ExpenseSection, {
      props: {
        items: [],
      },
    })
    expect(wrapper.find('button').text()).toBe('Dodaj')
  })

  it('#A3 renders list of expense items', () => {
    const wrapper = mount(ExpenseSection, {
      props: {
        items: mockItems,
      },
    })
    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(2)
    expect(inputs[0].element.value).toBe('50')
    expect(inputs[1].element.value).toBe('75')
  })

  it('#A4 emits add event when add button is clicked', async () => {
    const wrapper = mount(ExpenseSection, {
      props: {
        items: [],
      },
    })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('add')).toBeTruthy()
  })

  it('#A5 emits edit event when edit button is clicked', async () => {
    const wrapper = mount(ExpenseSection, {
      props: {
        items: mockItems,
      },
    })
    await wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.emitted('edit')?.[0]).toEqual([0])
  })

  it('#A6 emits delete event when delete button is clicked', async () => {
    const wrapper = mount(ExpenseSection, {
      props: {
        items: mockItems,
      },
    })
    await wrapper.findAll('button')[2].trigger('click')
    expect(wrapper.emitted('delete')?.[0]).toEqual([0])
  })

  it('#A7 emits update:items when input value changes', async () => {
    const wrapper = mount(ExpenseSection, {
      props: {
        items: mockItems,
      },
    })
    await wrapper.find('input').setValue('60')
    expect(wrapper.emitted('update:items')).toBeTruthy()
    expect((wrapper.emitted('update:items')?.[0][0] as FinanceItem[])[0].value).toBe('60')
  })

  it('#A8 maintains item order after updates', async () => {
    const wrapper = mount(ExpenseSection, {
      props: {
        items: mockItems,
      },
    })
    await wrapper.find('input').setValue('60')
    const updatedItems = wrapper.emitted('update:items')?.[0][0] as FinanceItem[]
    expect(updatedItems[0].label).toBe('Expense 1')
    expect(updatedItems[1].label).toBe('Expense 2')
  })
})
