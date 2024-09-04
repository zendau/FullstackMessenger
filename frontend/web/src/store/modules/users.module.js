import i18n from "@/locales/index";
const { t: $t, d: $d } = i18n.global;

export function insertUsersList(usersList) {
  const chatUsers = {};

  const stateList = users.state.usersList;

  for (const user of usersList) {
    if (!stateList.has(user.id)) {
      if (user.lastOnline !== "online") {
        user.lastDate = user.lastOnline;
        user.lastOnline = dateTransformer(user.lastOnline);
      } else {
        user.lastOnline = $t("store.user.online");
      }
      stateList.set(user.id, user);
    }
    chatUsers[user.id] = stateList.get(user.id);
  }

  return chatUsers;
}

export function dateTransformer(time) {
  let delta = Math.floor((new Date() - new Date(time)) / 1000);
  const days = Math.floor(delta / 86400);
  delta -= days * 86400;
  const hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;
  const minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  if (days > 0) {
    return $d(new Date(time), "long");
  } else if (hours > 0) {
    return $t("store.user.hour", hours);
  } else if (minutes > 0) {
    return $t("store.user.minute", minutes);
  } else {
    return $t("store.user.recently");
  }
}

export const users = {
  namespaced: true,
  state: {
    usersList: new Map(),
  },
  mutations: {
    saveUsers(state, usersList) {
      const newUsers = new Map(JSON.parse(usersList));

      state.usersList = new Map([...state.usersList, ...newUsers]);
    },
    saveUser(state, userData) {
      state.usersList.set(userData.id, userData);
    },
    updateUserOnline(state, userStatus) {
      if (!state.usersList.has(userStatus.userId)) return;

      const userData = state.usersList.get(userStatus.userId);
      userData.peerId = userStatus.peerId;
      userData.lastOnline = userStatus.status;
      if (userStatus.status === "online") {
        userData.lastOnline = $t("store.user.online");
        return;
      }

      userData.lastOnline = dateTransformer(userStatus.status);
      userData.lastDate = userStatus.status;
    },
    updateUsersDateOnline(state) {
      for (const user of state.usersList.values()) {
        if (user.lastOnline === $t("store.user.online")) continue;

        user.lastOnline = dateTransformer(user.lastDate);
      }
    },
  },
};
