import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios, { AxiosStatic } from 'axios';
import VueAxios from 'vue-axios';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import '@/assets/styles/style.scss'

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

declare module "vue/types/vue" {
  interface Vue {
    axios: AxiosStatic;
  }
}
declare module "vuex/types/index" {
  // this.axios inside Vuex stores
  interface Store<S> {
    axios: AxiosStatic;
  }
}