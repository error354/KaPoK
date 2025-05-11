import { ref } from 'vue'

export const counter = ref(0)

export const useUniqueId = (prefix = 'id') => {
  counter.value++
  return `${prefix}-${counter.value}`
}
