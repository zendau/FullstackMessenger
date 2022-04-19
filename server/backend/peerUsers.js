let users = []

function addPeerUser(user) {
    users.push(user)
    console.log(users)
}

function getRoomPeerUser(room) {
    return users.filter(item => item.room === room)
}

function getPeerUserById(id) {
    return users.find(user => user.id === id)
}

function peerUserLeaveChat(id) {
    users = users.filter(user => user.id !== id)
}

function changeMuteStatus(id) {
    users = users.map(item => {
        if (item.id === id) {
            item.mute = !item.mute
        }
        return item
    })
}

module.exports = {
    addPeerUser,
    getRoomPeerUser,
    getPeerUserById,
    peerUserLeaveChat,
    changeMuteStatus
}