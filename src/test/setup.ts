import { config } from '@vue/test-utils'
import { createVfm } from 'vue-final-modal'
import { i18n } from '../i18n'
import Toast from 'vue-toastification'

// Configure Vue Test Utils
config.global.plugins = [
  [i18n],
  [createVfm()],
  [
    Toast,
    {
      position: 'top-right',
      timeout: 3000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: 'button',
      icon: true,
      rtl: false,
      containerClassName: 'alert-container',
    },
  ],
]
