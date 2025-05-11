<template>
  <div class="container row">
    <KColumn title="Dane">
      <section>
        <h4>
          Wkład
          <KButton
            size="small"
            outlined
            text="Dodaj"
            icon="plus-circle"
            @click="newIncomeModal.open"
          />
        </h4>
        <div v-for="(item, idx) in incomes" :key="idx" class="input-row">
          <KInput
            :label="item.label"
            v-model="item.value"
            type="number"
            @update:model-value="(val) => (item.value = val)"
          >
            <template #buttons>
              <KButton size="small" outlined icon="edit" @click="openEditModal('income', idx)" />
              <KButton
                size="small"
                outlined
                icon="trash-2"
                @click="openDeleteConfirmModal('income', idx)"
              />
            </template>
          </KInput>
        </div>
      </section>
      <section>
        <h4>
          Wydatki
          <KButton
            size="small"
            outlined
            text="Dodaj"
            icon="plus-circle"
            @click="newExpenseModal.open"
          />
        </h4>
        <div v-for="(item, idx) in expenses" :key="idx" class="input-row">
          <KInput
            :label="item.label"
            v-model="item.value"
            type="number"
            @update:model-value="(val) => (item.value = val)"
          >
            <template #buttons>
              <KButton size="small" outlined icon="edit" @click="openEditModal('expense', idx)" />
              <KButton
                size="small"
                outlined
                icon="trash-2"
                @click="openDeleteConfirmModal('expense', idx)"
              />
            </template>
          </KInput>
        </div>
      </section>
      <div class="main-buttons">
        <div class="gradient-shadow">
          <KButton text="Oblicz" icon="refresh-cw" icon-color="ffffff" @click="onCalculate" />
        </div>
        <KButton text="Zapisz" icon="save" icon-color="ffffff" @click="saveData" />
      </div>
    </KColumn>
    <KColumn title="Podsumowanie">
      <section>
        <h4>Sumy</h4>
        <KInput label="Łączny wkład" :model-value="totalIncome" readonly />
        <KInput label="Łączne wydatki" :model-value="totalExpense" readonly />
      </section>
      <section>
        <h4>Prodentowe udziały</h4>
        <KInput
          v-for="(item, idx) in percentShares"
          :key="item.label + idx"
          :label="item.label"
          :model-value="item.value"
          readonly
        />
      </section>
      <section>
        <h4>Kwoty do zapłaty</h4>
        <KInput
          v-for="(item, idx) in toPay"
          :key="item.label + idx"
          :label="item.label"
          :model-value="item.value"
          readonly
        />
      </section>
    </KColumn>
    <ModalsContainer />
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted, reactive, watch } from 'vue'
import { ModalsContainer, useModal } from 'vue-final-modal'
import { useToast } from 'vue-toastification'
import KButton from './components/KButton.vue'
import KColumn from './components/KColumn.vue'
import KInput from './components/KInput.vue'
import KModal from './components/KModal.vue'
import AddModalBody from './components/AddModalBody.vue'
import EditLabelModalBody from './components/EditLabelModalBody.vue'
import ConfirmModalBody from './components/ConfirmModalBody.vue'

const incomes = ref<{ label: string; value: string }[]>([])
const percentShares = ref<{ label: string; value: string }[]>([])
const toPay = ref<{ label: string; value: string }[]>([])
const expenses = ref<{ label: string; value: string }[]>([])

const editType = ref<'income' | 'expense' | null>(null)
const editIdx = ref<number | null>(null)
const editLabel = ref('')

const isIncomeModalValid = ref(false)
const isExpenseModalValid = ref(false)
const isEditModalValid = ref(false)

const incomeModalBodyRef = ref<{ submit: () => { name: string; amount: string } }>({
  submit: () => ({ name: '', amount: '' }),
})
const expenseModalBodyRef = ref<{ submit: () => { name: string; amount: string } }>({
  submit: () => ({ name: '', amount: '' }),
})

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
  onSubmit: () => handleEditSubmit(editLabel.value),
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

const openEditModal = (type: 'income' | 'expense', idx: number) => {
  editType.value = type
  editIdx.value = idx
  editLabel.value = (type === 'income' ? incomes.value[idx].label : expenses.value[idx].label) || ''
  editModal.open()
}

const handleEditSubmit = (newLabel: string) => {
  if (editType.value && editIdx.value !== null && newLabel) {
    if (editType.value === 'income') {
      incomes.value[editIdx.value].label = newLabel
      percentShares.value[editIdx.value].label = newLabel
      toPay.value[editIdx.value].label = newLabel
    } else {
      expenses.value[editIdx.value].label = newLabel
    }
  }
}

const handleIncomeModalSubmit = () => {
  const { name, amount } = incomeModalBodyRef.value.submit()
  if (name && amount) {
    incomes.value.push({ label: name, value: amount })
    percentShares.value.push({ label: name, value: '' })
    toPay.value.push({ label: name, value: '' })
  }
}

const handleExpenseModalSubmit = () => {
  const { name, amount } = expenseModalBodyRef.value.submit()
  if (name && amount) {
    expenses.value.push({ label: name, value: amount })
  }
}

const incomeModalContent = () => [
  h(AddModalBody, {
    ref: incomeModalBodyRef,
    nameLabel: 'Nazwa wkładu',
    amountLabel: 'Kwota wkładu',
    'onUpdate:isValid': (val: boolean) => (isIncomeModalValid.value = val),
  }),
]

const expenseModalContent = () => [
  h(AddModalBody, {
    ref: expenseModalBodyRef,
    nameLabel: 'Nazwa wydatku',
    amountLabel: 'Kwota wydatku',
    'onUpdate:isValid': (val: boolean) => (isExpenseModalValid.value = val),
  }),
]

const incomeModalAttrs = reactive({
  title: 'Dodaj nowy wkład',
  modelValue: false,
  onSubmit: handleIncomeModalSubmit,
  disabled: true,
})

const expenseModalAttrs = reactive({
  title: 'Dodaj nowy wydatek',
  modelValue: false,
  onSubmit: handleExpenseModalSubmit,
  disabled: true,
})

watch(isIncomeModalValid, (val) => {
  incomeModalAttrs.disabled = !val
})

watch(isExpenseModalValid, (val) => {
  expenseModalAttrs.disabled = !val
})

const newIncomeModal = useModal({
  component: KModal,
  attrs: incomeModalAttrs,
  slots: {
    default: incomeModalContent,
  },
})

const newExpenseModal = useModal({
  component: KModal,
  attrs: expenseModalAttrs,
  slots: {
    default: expenseModalContent,
  },
})

const confirmModal = useModal({
  component: KModal,
  attrs: {
    title: 'Potwierdź usunięcie',
    modelValue: false,
    confirmText: 'Tak',
    cancelText: 'Nie',
    disabled: false,
    onSubmit: () => {
      if (deleteType.value === 'income' && deleteIdx.value !== null) {
        deleteIncome(deleteIdx.value)
      } else if (deleteType.value === 'expense' && deleteIdx.value !== null) {
        deleteExpense(deleteIdx.value)
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

const deleteType = ref<'income' | 'expense' | null>(null)
const deleteIdx = ref<number | null>(null)

const openDeleteConfirmModal = (type: 'income' | 'expense', idx: number) => {
  deleteType.value = type
  deleteIdx.value = idx
  confirmModal.open()
}

const deleteIncome = (idx: number) => {
  incomes.value.splice(idx, 1)
  percentShares.value.splice(idx, 1)
  toPay.value.splice(idx, 1)
}

const deleteExpense = (idx: number) => {
  expenses.value.splice(idx, 1)
}

const INCOMES_KEY = 'incomes'
const EXPENSES_KEY = 'expenses'

const toast = useToast()

const saveData = () => {
  localStorage.setItem(INCOMES_KEY, JSON.stringify(incomes.value))
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses.value))
  toast.success('Dane zostały zapisane')
}

const loadData = () => {
  const savedIncomes = localStorage.getItem(INCOMES_KEY)
  const savedExpenses = localStorage.getItem(EXPENSES_KEY)

  incomes.value = savedIncomes ? JSON.parse(savedIncomes) : []
  percentShares.value = incomes.value.map((i) => ({ label: i.label, value: '' }))
  toPay.value = incomes.value.map((i) => ({ label: i.label, value: '' }))

  expenses.value = savedExpenses ? JSON.parse(savedExpenses) : []
}

const totalIncome = ref('')
const totalExpense = ref('')

const onCalculate = () => {
  const sumIncome = incomes.value.reduce((sum, item) => sum + parseFloat(item.value || '0'), 0)
  const sumExpense = expenses.value.reduce((sum, item) => sum + parseFloat(item.value || '0'), 0)
  totalIncome.value = sumIncome.toFixed(2)
  totalExpense.value = sumExpense.toFixed(2)

  percentShares.value = incomes.value.map((item) => {
    const val = parseFloat(item.value || '0')
    const percent = sumIncome > 0 ? (val / sumIncome) * 100 : 0
    return {
      label: item.label,
      value: `${percent.toFixed(2)} %`,
    }
  })

  toPay.value = incomes.value.map((item) => {
    const val = parseFloat(item.value || '0')
    const percent = sumIncome > 0 ? (val / sumIncome) * 100 : 0
    const pay = (sumExpense * percent) / 100
    return {
      label: item.label,
      value: pay.toFixed(2),
    }
  })

  toast.success('Obliczanie zakończone sukcesem')
}

onMounted(loadData)
</script>

<style scoped>
section {
  margin-bottom: 24px;
}

.main-buttons {
  display: flex;
  gap: 8px;
  margin-top: 32px;
  justify-content: space-between;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.input-row .button.icon {
  height: 36px;
  aspect-ratio: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.input-row .button.icon img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  display: block;
  margin: auto;
}
.input-row .button:last-child {
  margin-left: 0;
}

.gradient-shadow {
  position: relative;
  background: white;
  border-radius: 8px;
  button {
    opacity: 1;
  }
}

@keyframes gradient-rotate {
  0% {
    background-position: 0% 50%;
  }
  25% {
    background-position: 50% 0%;
  }
  50% {
    background-position: 100% 50%;
  }
  75% {
    background-position: 50% 100%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes gradient-flash {
  0% {
    filter: blur(0px);
  }
  20% {
    filter: blur(12px);
  }
  100% {
    filter: blur(6px);
  }
}
.gradient-shadow::before {
  content: '';
  position: absolute;
  --gradient-size: -2px;
  top: var(--gradient-size);
  left: var(--gradient-size);
  right: var(--gradient-size);
  bottom: var(--gradient-size);
  background: linear-gradient(45deg, #954ba5, #65b5eb);
  background-size: 200% 200%;
  border-radius: 8px;
  z-index: -1;
  filter: blur(6px);
  opacity: 0;
  transition: all 0.2s ease;
  animation: gradient-rotate 7s linear infinite;
}

.gradient-shadow:hover::before,
.gradient-shadow:focus-within::before {
  opacity: 1;
  transition: all 0.2s ease;
  animation:
    gradient-rotate 7s linear infinite,
    gradient-flash 1s ease-in-out;
}
</style>
