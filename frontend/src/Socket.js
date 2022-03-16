import {io} from "socket.io-client"
import CONSTANT from "./constant"

export class Socket {
    constructor() {
        this.socket = io(CONSTANT.URL)
    }

    createRoom(roomId, userLogin, userId) {
        if (!this.socket.connected) {
            this.reconnect()
        }
        this.socket.emit("room", [roomId, userLogin, userId])
    }


    resiveMessage(store, fun) {
        this.socket.on("message", (data) => {
            if (typeof data !== "string") {
                data.push(this.getTime())
            } 
            store.commit("pushMessage", data)           
            fun()
        })
    }

    getUserId(userId, store) {
        this.socket.on("getUserId", (id) => {
            if (userId.value === "" || userId.value === null) {
              store.commit("setUserId", id)
              userId.value =  store.state.userId
            }
        })
    }

    getUsers(store) {
        this.socket.on("getUsers", (users) => {
            console.log(users)
            store.commit("saveUsers", users)
        })
    }

    sendMessage(params) {
        this.socket.emit("newMessage", params)
    }

    logoutUser() {
        this.socket.emit("logoutUser")
    }

    reconnect() {
        this.socket = io(CONSTANT.URL)
    }

    getTime() {
        return new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() 
      }

    getConnect() {
        return this.socket
    }
}
    
