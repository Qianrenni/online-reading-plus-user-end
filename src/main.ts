import {createApp} from 'vue';
import App from './App.vue';
import QyaniComponents from 'qyani-components';
import 'qyani-components/dist/style.css'
import './private.css'
import router from "./route.ts";

const app = createApp(App)
app.use(router)
app.use(QyaniComponents)
app.mount('#app')
