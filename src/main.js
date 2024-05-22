/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components

import App from './App.vue'
import Router from './routers/router'
import Store from './store/index'

// Composables
import { createApp } from 'vue'


const app = createApp(App)


registerPlugins(app)
app.use(Router)
app.use(Store)
app.mount('#app')
