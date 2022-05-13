import { createStore } from 'vuex'
import { auth } from './modules/auth.module'
import { chat } from './modules/chat.module'

export default createStore({
  modules: {
    auth,
    chat
  }
})