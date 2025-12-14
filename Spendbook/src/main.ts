import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAuth } from './composables/useAuth'

const app = createApp(App)

// Initialize auth state before mounting
const { initAuth } = await useAuth()
initAuth()

app.use(router)
app.mount('#app')
