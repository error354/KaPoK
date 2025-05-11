import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KButton from '../KButton.vue'

describe('KButton', () => {
  it('#A1 renders button with text', () => {
    const wrapper = mount(KButton, {
      props: {
        text: 'Test Button',
      },
    })
    expect(wrapper.text()).toBe('Test Button')
  })

  it('#A2 renders button with icon', () => {
    const wrapper = mount(KButton, {
      props: {
        icon: 'test-icon',
      },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('test-icon.svg')
  })

  it('#A3 applies outlined style when outlined prop is true', () => {
    const wrapper = mount(KButton, {
      props: {
        outlined: true,
        text: 'Test',
      },
    })
    expect(wrapper.classes()).toContain('outlined')
  })

  it('#A4 applies small size when size prop is small', () => {
    const wrapper = mount(KButton, {
      props: {
        size: 'small',
        text: 'Test',
      },
    })
    expect(wrapper.classes()).toContain('small-button')
  })

  it('#A5 emits click event when clicked', async () => {
    const wrapper = mount(KButton, {
      props: {
        text: 'Test',
      },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('#A6 applies icon color when provided', () => {
    const wrapper = mount(KButton, {
      props: {
        icon: 'test-icon',
        iconColor: 'red',
      },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('color=red')
  })

  it('#A7 uses custom icon source when provided', () => {
    const wrapper = mount(KButton, {
      props: {
        iconSrc: 'custom-icon.svg',
      },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('custom-icon.svg')
  })

  it('#A8 applies icon size when provided', () => {
    const wrapper = mount(KButton, {
      props: {
        icon: 'test-icon',
        iconSize: '24',
      },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('size=24')
  })
})
