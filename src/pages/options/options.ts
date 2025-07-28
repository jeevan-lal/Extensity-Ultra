import { createApp } from 'vue'

import '../../assets/css/global.css'
import './options.css'
import Options from './Options.vue'

// https://pinia.vuejs.org/
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(Options)
app.use(pinia)
app.mount('#options')