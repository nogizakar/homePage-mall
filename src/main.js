import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import LazyLoad from 'vue-lazyload'
// import store from './store'

// import toast from 'components/common/toast'

// 插件
// Vue.use(toast)
Vue.config.productionTip = false
// bus用于无关系组件间通信
Vue.prototype.$bus = new Vue()
// 图片懒加载，未加载图片默认设置
// Vue.use(LazyLoad, {
//   loading: require('assets/img/common/placeholder.png')
// })

new Vue({
  render: h => h(App),
  router
  // store
}).$mount('#app')
