import 'chota/dist/chota.min.css'
import 'vue-final-modal/style.css'
import 'vue-toastification/dist/index.css'
import './assets/main.css'

import { createVfm } from 'vue-final-modal'
import { createApp } from 'vue'
import Toast from 'vue-toastification'
import App from './App.vue'

const vfm = createVfm()
const app = createApp(App)

app.use(vfm)
app.use(Toast, {
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
})

app.mount('#app')
