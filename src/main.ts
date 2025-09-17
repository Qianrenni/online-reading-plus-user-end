import {createApp} from 'vue';
import App from './App.vue';
import {createPinia} from "pinia";
import QyaniComponents from 'qyani-components';
import 'qyani-components/dist/style.css'
import './private.css'
import router from "./route.ts";

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(QyaniComponents)
app.mount('#app')
