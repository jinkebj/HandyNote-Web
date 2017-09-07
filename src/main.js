// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// import ElementUI components
import {
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button,
  ButtonGroup,
  Popover,
  Tooltip,
  Tree,
  Icon,
  Row,
  Col,
  Loading,
  MessageBox,
  Message
} from 'element-ui'

Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Tree)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message

// import HandyNote components
import App from '@/App'
import router from '@/router'
import * as filters from '@/util/filters'

Vue.config.productionTip = false

// define global event bus
const EventBus = new Vue()
Vue.prototype.$bus = EventBus

// register filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
