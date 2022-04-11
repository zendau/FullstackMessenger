let users = []

function addUser(user) {
    users.push(user)
    console.log(users)
}

function getRoomUser(room) {
    return users.filter(item => item.room === room)
}

function getUserById(id) {
    return users.find(user => user.id === id)
}

function userLeaveChat(id) {
    users = users.filter(user => user.id !== id)
}

module.exports = {
    addUser,
    getRoomUser,
    getUserById,
    userLeaveChat
}