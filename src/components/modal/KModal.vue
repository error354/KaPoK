<template>
  <VueFinalModal
    :model-value="modelValue"
    @update:model-value="(value) => emit('update:modelValue', value)"
    :esc-to-close="true"
    :click-to-close="true"
    content-class="modal-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-slide-up"
    @opened="onModalOpened"
  >
    <div class="modal-wrapper" ref="modalContent" @keydown.enter="handleEnterKey">
      <div class="modal-header">
        <h4>{{ title }}</h4>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <div class="row dialog-buttons">
          <KButton :text="cancelText" :outlined="true" size="small" @click="closeModal" />
          <KButton :text="confirmText" :disabled="disabled" size="small" @click="submit" />
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import KButton from '../KButton.vue'
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
  onSubmit: Function,
  confirmText: {
    type: String,
    default: 'OK',
  },
  cancelText: {
    type: String,
    default: 'Anuluj',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'update:modelValue'])
const modalContent = ref<HTMLElement | null>(null)

const closeModal = () => {
  emit('update:modelValue', false)
}

const submit = () => {
  if (typeof props.onSubmit === 'function') props.onSubmit()
  emit('update:modelValue', false)
}

const onModalOpened = () => {
  // Small delay to ensure content is fully rendered
  setTimeout(() => {
    const firstInput = modalContent.value?.querySelector('input, textarea, select')
    if (firstInput instanceof HTMLElement) {
      firstInput.focus()
    }
  }, 10)
}

const handleEnterKey = (event: KeyboardEvent) => {
  if (!props.disabled) {
    event.preventDefault()
    submit()
  }
}
</script>

<style>
.modal-content {
  background-color: var(--columnBgC);
  max-width: 400px;
  width: 80%;
  margin: auto;
  border-radius: 0 0 12px 12px;
  box-shadow: 0px 0px 32px #1119;
  backdrop-filter: blur(32px);
}
</style>

<style scoped>
.dialog-buttons {
  justify-content: space-between;
  margin: 0 auto;
  width: 100%;
}

.modal-header {
  padding: 4px 16px;
  border-bottom: 1px solid #eee;
  h3 {
    margin: 0;
  }
}
.modal-body {
  padding: 8px 16px 16px 16px;
}
.modal-footer {
  padding: 16px;
  border-top: 1px solid #eee;
}
</style>
