const {addUser, getRoomUser, getUserById, userLeaveChat} = require("./users")
const {addPeerUser, getRoomPeerUser, getPeerUserById, peerUserLeaveChat, changeMuteStatus} = require("./peerUsers")

module.exports = function(io) {
    // Вывод сообщение что был подключен пользователь по сокету
    io.on("connection", (socket) => {
        console.log("user connect")

        socket.on('newMessage', (msg) => {
            console.log(`message ${msg[1]} from user ${msg[0]}, room ${msg[2]}`)
            console.log("msg", msg)
            io.to(msg[2]+"").emit("message", msg)  
        })

        socket.on("logoutUser", () => {
            socket.disconnect()
        })

        // socket.on('disconnect', () => {
        //     console.log(`user ${socket.id} disconnected`, )
        //     const user = getUserById(socket.id)
        //     console.log(user)
        //     if (user) {
        //         userLeaveChat(user.id)
        //         io.to(user.room).emit("userDisconnect", socket.id)
        //         io.to(user.room).emit("message", `${user.login} has left the chat`)  
        //         io.to(user.room).emit("getUsers", getRoomUser(user.room))
        //     }   
        // })


        socket.on('join-room', (roomId, userId, userLogin) => {
            console.log('peer room connected')

            const user = {
                id: userId,
                room: roomId,
                login: userLogin,
                mute: false
            }

            addPeerUser(user)
            socket.join(user.room)
            console.log('room data')
            io.to(user.room).emit("getUserId", user.id)
            io.to(user.room).emit("getUsers", getRoomPeerUser(user.room))
            io.to(user.room).emit("message", `${user.login} has join to chat`)  


            socket.join(roomId)
            socket.broadcast.emit('user-connected', userId)
        
            socket.on('disconnect', () => {
                console.log('disconnet 2')
                peerUserLeaveChat(userId)
                io.to(roomId).emit("userDisconnect", userId)
                io.to(roomId).emit("message", `${userLogin} has left the chat`)  
                io.to(roomId).emit("getUsers", getRoomPeerUser(roomId))
            })


            socket.on('userMute', (userId, muteStatus) => {

                changeMuteStatus(userId)
                io.to(user.room).emit("getUsers", getRoomPeerUser(user.room))
            })
          })
    })
}