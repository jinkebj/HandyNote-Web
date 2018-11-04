// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// import ElementUI components
import {
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  RadioGroup,
  RadioButton,
  Button,
  ButtonGroup,
  Popover,
  Tree,
  Icon,
  Row,
  Col,
  Upload,
  Slider,
  Loading,
  MessageBox,
  Message
} from 'element-ui'

Vue.use(Dialog)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Input)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Popover)
Vue.use(Tree)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Slider)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message

// import Material Icons
import '@/assets/fonts/material-icons.css'

// import HandyNote components
import App from '@/App'
import Model from '@/models'
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

// add request interceptor
Model.getHttpPrototype().interceptors.request.use(
  (config) => {
    config.headers['X-Auth-Token'] = window.localStorage.getItem('hn-token')
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// add response interceptor
Model.getHttpPrototype().interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      window.location.href = './#/login'
      return error.response
    }
  }
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

// disable inline table editing controls in firefox
window.document.execCommand('enableInlineTableEditing', false, 'false')
