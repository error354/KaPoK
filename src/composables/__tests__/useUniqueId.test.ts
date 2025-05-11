import { describe, it, expect, beforeEach } from 'vitest'
import { useUniqueId } from '../useUniqueId'

// Import the counter directly to reset it
import { counter } from '../useUniqueId'

describe('useUniqueId', () => {
  beforeEach(() => {
    // Reset the counter before each test
    counter.value = 0
  })

  it('#A1 generates unique IDs with default prefix', () => {
    const id1 = useUniqueId()
    const id2 = useUniqueId()
    const id3 = useUniqueId()

    expect(id1).toBe('id-1')
    expect(id2).toBe('id-2')
    expect(id3).toBe('id-3')
  })

  it('#A2 generates unique IDs with custom prefix', () => {
    const id1 = useUniqueId('test')
    const id2 = useUniqueId('test')
    const id3 = useUniqueId('test')

    expect(id1).toBe('test-1')
    expect(id2).toBe('test-2')
    expect(id3).toBe('test-3')
  })

  it('#A3 maintains counter across multiple calls', () => {
    const id1 = useUniqueId('test')
    const id2 = useUniqueId('other')
    const id3 = useUniqueId('test')

    expect(id1).toBe('test-1')
    expect(id2).toBe('other-2')
    expect(id3).toBe('test-3')
  })
})
