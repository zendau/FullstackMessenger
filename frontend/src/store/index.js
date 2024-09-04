import { createStore } from "vuex";
import { auth } from "./modules/auth.module";
import { chat } from "./modules/chat.module";
import { contact } from "./modules/contact.module";
import { alert } from "./modules/alert.module";
import { admin } from "./modules/admin.module";
import { users } from "./modules/users.module";
import { message } from "./modules/message.module";

export default createStore({
  modules: {
    auth,
    chat,
    contact,
    alert,
    admin,
    users,
    message,
  },
});
