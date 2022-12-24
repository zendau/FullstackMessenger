import { createStore } from 'vuex'
import { auth } from './modules/auth.module'
import { chat } from './modules/chat.module'
import { conference } from './modules/conference.module'
import { contact } from './modules/contact.module'

export default createStore({
  modules: {
    auth,
    chat,
    conference,
    contact
  }
})