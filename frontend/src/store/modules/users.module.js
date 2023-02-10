export function insertUsersList(usersList) {
  const chatUsers = {};

  const stateList = users.state.usersList;

  for (const user of usersList) {
    if (!stateList.has(user.id)) {
      stateList.set(user.id, user);
    }
    chatUsers[user.id] = stateList.get(user.id);
  }

  return chatUsers;
}

export const users = {
  namespaced: true,
  state: {
    usersList: new Map(),
  },
  mutations: {
    saveUsers(state, usersList) {
      const newUsers = new Map(JSON.parse(usersList));
      state.userList = new Map([...state.userList, ...newUsers]);
    },
    saveUser(state, userData) {
      state.chats.set(userData.id, userData);
    },
    updateUserOnline(state, userStatus) {
      if (!state.usersList.has(userStatus.userId)) return;

      const userData = state.usersList.get(userStatus.userId);
      userData.lastOnline = userStatus.status;
      userData.peerId = userStatus.peerId;
    },
  },
};
