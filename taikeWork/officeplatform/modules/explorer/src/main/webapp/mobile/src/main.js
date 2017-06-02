import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import Login from './Login'
import Index from './Index'
import message from './components/Message'
import Work from './components/Work'
import contacts from './components/Contacts'
import my from './components/My'
import Todolist from './components/Todolist'
import password from './components/password'
import information from './components/information'
import initiate from './components/Initiate'
import initiatecom from './components/InitiateCom'
import selectNextNode from './components/selectNextNode'
import ReviewInput from './components/ReviewInput'
import HistoryTask from './components/HistoryTask'
import SponsorByMeTask from './components/SponsorByMeTask'
import 'mint-ui/lib/style.css'
import '../css/index.css'
import './rem'

//引用路由和ajax
Vue.use(VueRouter)
Vue.prototype.$http = axios;

//配置路由
const routes = [
  { path: '/', component: Index,
  children: [
        {
          path: '',
          component: message
        },
        { path: '/work', component: Work },
        { path: '/contacts' , component: contacts},
        { path: '/my' , component: my}
        ]
    },
  { path: '/login', component: Login },
  { path: '/todolist', component: Todolist },
  { path: '/password', component: password},
  { path: '/information', component: information},
  { path: '/initiate' , component: initiate},
  { path: '/selectNextNode' , component: selectNextNode},
  { path: '/initiatecom/:taskid' , component: initiatecom},
  { path: '/reviewInput/:taskid' , component: ReviewInput},
  { path: '/historyTask' , component: HistoryTask},
  { path: '/sponsorByMeTask' , component: SponsorByMeTask}
]
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})
const app = new Vue({
  router
}).$mount('#app')


