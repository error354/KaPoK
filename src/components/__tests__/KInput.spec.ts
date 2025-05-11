import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KInput from '../KInput.vue'

describe('KInput', () => {
  // Helper function to create wrapper with common props
  const createWrapper = (props = {}) => {
    return mount(KInput, {
      props: {
        type: 'text',
        modelValue: '',
        ...props,
      },
    })
  }

  describe('text input validation', () => {
    it('#A1 accepts valid text input', async () => {
      const wrapper = createWrapper({ type: 'text' })
      const input = wrapper.find('input')

      await input.setValue('test')
      expect(input.element.value).toBe('test')
    })

    it('#A2 handles empty input', async () => {
      const wrapper = createWrapper({ type: 'text' })
      const input = wrapper.find('input')

      await input.setValue('')
      expect(input.element.value).toBe('')
    })

    it('#A3 emits update:modelValue event', async () => {
      const wrapper = createWrapper({ type: 'text' })
      const input = wrapper.find('input')

      await input.setValue('test')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['test'])
    })
  })

  describe('number input validation', () => {
    it('#B1 accepts valid positive number', async () => {
      const wrapper = createWrapper({ type: 'number' })
      const input = wrapper.find('input')

      await input.setValue('456')
      expect(input.element.value).toBe('456')
    })

    it('#B2 accepts valid negative number', async () => {
      const wrapper = createWrapper({ type: 'number' })
      const input = wrapper.find('input')

      await input.setValue('-456')
      expect(input.element.value).toBe('-456')
    })

    it('#B3 prevents typing letters into number input', async () => {
      const wrapper = createWrapper({ type: 'number' })
      const input = wrapper.find('input')

      // Try to type a letter
      await input.setValue('abc')
      expect(input.element.value).toBe('')

      // Try to type a number with a letter
      await input.setValue('123a')
      expect(input.element.value).toBe('123')

      // Try to type multiple letters with numbers
      await input.setValue('1a2b3c')
      expect(input.element.value).toBe('123')
    })

    it('#B4 formats number with spaces and commas correctly', async () => {
      const wrapper = createWrapper({ type: 'number' })
      const input = wrapper.find('input')

      // Test various number formats
      await input.setValue('8 145,99')
      expect(input.element.value).toBe('8145.99')

      await input.setValue('8 145.99')
      expect(input.element.value).toBe('8145.99')

      await input.setValue('1 234 567,89')
      expect(input.element.value).toBe('1234567.89')

      await input.setValue('-1 234,56')
      expect(input.element.value).toBe('-1234.56')
    })

    it('#B5 allows max 2 decimal places', async () => {
      const wrapper = createWrapper({ type: 'number' })
      const input = wrapper.find('input')

      await input.setValue('1234567.891')
      expect(input.element.value).toBe('1234567.89')

      await input.setValue('123.4.89')
      expect(input.element.value).toBe('123.4')
    })
  })

  describe('component behavior', () => {
    it('#C1 renders with initial value', () => {
      const wrapper = createWrapper({
        type: 'text',
        modelValue: 'initial value',
      })
      const input = wrapper.find('input')
      expect(input.element.value).toBe('initial value')
    })
  })
})
