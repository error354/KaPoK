import { ref, h, reactive, watch } from 'vue'
import { useModal } from 'vue-final-modal'
import { useI18n } from 'vue-i18n'
import type { FinanceType } from '../types/finance'
import KModal from '../components/modal/KModal.vue'
import AddModalBody from '../components/modal/AddModalBody.vue'
import EditLabelModalBody from '../components/modal/EditLabelModalBody.vue'
import ConfirmModalBody from '../components/modal/ConfirmModalBody.vue'

export const useFinanceModals = (
  onContributionAdd: (name: string, amount: string) => void,
  onExpenseAdd: (name: string, amount: string) => void,
  onEdit: (type: FinanceType, index: number, newLabel: string) => void,
  onDelete: (type: FinanceType, index: number) => void,
) => {
  const { t } = useI18n()
  const editType = ref<FinanceType | null>(null)
  const editIdx = ref<number | null>(null)
  const editLabel = ref('')
  const deleteType = ref<FinanceType | null>(null)
  const deleteIdx = ref<number | null>(null)

  const isContributionModalValid = ref(false)
  const isExpenseModalValid = ref(false)
  const isEditModalValid = ref(false)

  const contributionModalBodyRef = ref<{ submit: () => { name: string; amount: string } }>({
    submit: () => ({ name: '', amount: '' }),
  })
  const expenseModalBodyRef = ref<{ submit: () => { name: string; amount: string } }>({
    submit: () => ({ name: '', amount: '' }),
  })

  // Edit Modal
  const editModalContent = () => [
    h(EditLabelModalBody, {
      modelValue: editLabel.value,
      'onUpdate:modelValue': (val: string) => (editLabel.value = val),
      'onUpdate:isValid': (val: boolean) => (isEditModalValid.value = val),
    }),
  ]

  const editModalAttrs = reactive({
    title: t('editName'),
    modelValue: false,
    onSubmit: () => {
      if (editType.value && editIdx.value !== null && editLabel.value) {
        onEdit(editType.value, editIdx.value, editLabel.value)
      }
    },
    disabled: false,
  })

  watch(isEditModalValid, (val) => {
    editModalAttrs.disabled = !val
  })

  const editModal = useModal({
    component: KModal,
    attrs: editModalAttrs,
    slots: {
      default: editModalContent,
    },
  })

  // Contribution Modal
  const contributionModalContent = () => [
    h(AddModalBody, {
      ref: contributionModalBodyRef,
      nameLabel: t('contributionName'),
      amountLabel: t('contributionAmount'),
      'onUpdate:isValid': (val: boolean) => (isContributionModalValid.value = val),
    }),
  ]

  const contributionModalAttrs = reactive({
    title: t('addContribution'),
    modelValue: false,
    onSubmit: () => {
      const { name, amount } = contributionModalBodyRef.value.submit()
      if (name && amount) {
        onContributionAdd(name, amount)
      }
    },
    disabled: true,
  })

  watch(isContributionModalValid, (val) => {
    contributionModalAttrs.disabled = !val
  })

  const newContributionModal = useModal({
    component: KModal,
    attrs: contributionModalAttrs,
    slots: {
      default: contributionModalContent,
    },
  })

  // Expense Modal
  const expenseModalContent = () => [
    h(AddModalBody, {
      ref: expenseModalBodyRef,
      nameLabel: t('expenseName'),
      amountLabel: t('expenseAmount'),
      'onUpdate:isValid': (val: boolean) => (isExpenseModalValid.value = val),
    }),
  ]

  const expenseModalAttrs = reactive({
    title: t('addExpense'),
    modelValue: false,
    onSubmit: () => {
      const { name, amount } = expenseModalBodyRef.value.submit()
      if (name && amount) {
        onExpenseAdd(name, amount)
      }
    },
    disabled: true,
  })

  watch(isExpenseModalValid, (val) => {
    expenseModalAttrs.disabled = !val
  })

  const newExpenseModal = useModal({
    component: KModal,
    attrs: expenseModalAttrs,
    slots: {
      default: expenseModalContent,
    },
  })

  // Delete Modal
  const confirmModal = useModal({
    component: KModal,
    attrs: {
      title: t('confirmDelete'),
      modelValue: false,
      confirmText: t('yes'),
      cancelText: t('no'),
      disabled: false,
      onSubmit: () => {
        if (deleteType.value && deleteIdx.value !== null) {
          onDelete(deleteType.value, deleteIdx.value)
        }
      },
    },
    slots: {
      default: () => [
        h(ConfirmModalBody, {
          message:
            deleteType.value === 'contribution'
              ? t('confirmDeleteContribution')
              : t('confirmDeleteExpense'),
        }),
      ],
    },
  })

  const openEditModal = (type: FinanceType, idx: number, currentLabel: string) => {
    editType.value = type
    editIdx.value = idx
    editLabel.value = currentLabel
    editModal.open()
  }

  const openDeleteConfirmModal = (type: FinanceType, idx: number) => {
    deleteType.value = type
    deleteIdx.value = idx
    confirmModal.open()
  }

  return {
    newContributionModal,
    newExpenseModal,
    openEditModal,
    openDeleteConfirmModal,
  }
}
