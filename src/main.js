import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus'; // 引入 Element Plus
import 'element-plus/dist/index.css';   // 引入 Element Plus 样式
import '@fortawesome/fontawesome-free/css/all.css'; // 引入 Font Awesome
import store from './store'; // 引入 Vuex Store

createApp(App)
.use(router)
.use(ElementPlus)
.use(store)
.mount('#app');