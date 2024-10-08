import './assets/main.css'

import { createApp } from 'vue'

import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

import router from './router'
import {createPinia} from 'pinia'
import persist from 'pinia-plugin-persistedstate'

import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(ElementPlus);

app.use(router);
app.use(pinia.use(persist))
app.mount('#app')
