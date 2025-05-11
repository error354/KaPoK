import { ref, h, reactive, watch } from 'vue'
import { useModal } from 'vue-final-modal'
import type { FinanceType } from '../types/finance'
import KModal from '../components/modal/KModal.vue'
import AddModalBody from '../components/modal/AddModalBody.vue'
import EditLabelModalBody from '../components/modal/EditLabelModalBody.vue'
import ConfirmModalBody from '../components/modal/ConfirmModalBody.vue'

export const useFinanceModals = (
  onIncomeAdd: (name: string, amount: string) => void,
  onExpenseAdd: (name: string, amount: string) => void,
  onEdit: (type: FinanceType, index: number, newLabel: string) => void,
  onDelete: (type: FinanceType, index: number) => void,
) => {
  const editType = ref<FinanceType | null>(null)
  const editIdx = ref<number | null>(null)
  const editLabel = ref('')
  const deleteType = ref<FinanceType | null>(null)
  const deleteIdx = ref<number | null>(null)

  const isIncomeModalValid = ref(false)
  const isExpenseModalValid = ref(false)
  const isEditModalValid = ref(false)

  const incomeModalBodyRef = ref<{ submit: () => { name: string; amount: string } }>({
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
    title: 'Edytuj nazwę',
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

  // Income Modal
  const incomeModalContent = () => [
    h(AddModalBody, {
      ref: incomeModalBodyRef,
      nameLabel: 'Nazwa wkładu',
      amountLabel: 'Kwota wkładu',
      'onUpdate:isValid': (val: boolean) => (isIncomeModalValid.value = val),
    }),
  ]

  const incomeModalAttrs = reactive({
    title: 'Dodaj nowy wkład',
    modelValue: false,
    onSubmit: () => {
      const { name, amount } = incomeModalBodyRef.value.submit()
      if (name && amount) {
        onIncomeAdd(name, amount)
      }
    },
    disabled: true,
  })

  watch(isIncomeModalValid, (val) => {
    incomeModalAttrs.disabled = !val
  })

  const newIncomeModal = useModal({
    component: KModal,
    attrs: incomeModalAttrs,
    slots: {
      default: incomeModalContent,
    },
  })

  // Expense Modal
  const expenseModalContent = () => [
    h(AddModalBody, {
      ref: expenseModalBodyRef,
      nameLabel: 'Nazwa wydatku',
      amountLabel: 'Kwota wydatku',
      'onUpdate:isValid': (val: boolean) => (isExpenseModalValid.value = val),
    }),
  ]

  const expenseModalAttrs = reactive({
    title: 'Dodaj nowy wydatek',
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
      title: 'Potwierdź usunięcie',
      modelValue: false,
      confirmText: 'Tak',
      cancelText: 'Nie',
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
            deleteType.value === 'income'
              ? 'Czy na pewno chcesz usunąć ten wkład?'
              : 'Czy na pewno chcesz usunąć ten wydatek?',
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
    newIncomeModal,
    newExpenseModal,
    openEditModal,
    openDeleteConfirmModal,
  }
}
