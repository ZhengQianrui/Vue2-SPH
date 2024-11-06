import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TypeNav from "./components/TypeNav";
import store from "@/store";
Vue.config.productionTip = false

import { MessageBox } from 'element-ui'
Vue.component(MessageBox.name, MessageBox)

// 由于三级联动,在Home、Search、Detail都使用,把三级联动注册为全局组件
Vue.component(TypeNav.name, TypeNav)

import Pagination from '@/components/Pagination'
Vue.component(Pagination.name, Pagination)

//引入swiper样式
import "swiper/css/swiper.css"



export default new Vue({
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  router,
  store,
}).$mount('#app')
