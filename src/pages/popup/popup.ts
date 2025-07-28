import { createApp } from 'vue'
import Popup from './Popup.vue'

// https://www.gethalfmoon.com
import "halfmoon/css/halfmoon.min.css";

import '../../assets/css/global.css'
import '../../assets/css/extensions.css'
import './popup.css'

// https://pinia.vuejs.org/
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(Popup)
app.use(pinia)
app.mount('#popup')
