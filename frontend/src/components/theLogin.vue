<template>
  <div class="login__container">
      <form class="login__form">
            <label for="login" class="form__label" v-if="login.length > 0">Login</label>
            <input type="text" class="login-input" 
                :class="[login.length > 0 ? 'active' : '', errorMessage.length > 0 ? 'active--error' : '']" 
                id="login" 
                placeholder="Login" 
                v-model="login">
            <div class="login__info">
                <p class="login__error" v-if="errorMessage.length > 0">{{errorMessage}}</p>
                <p v-if="login.length > 0" class="login__length">{{login.length}} / 12</p>
            </div>
            <label for="room" 
             class="form__label" v-if="roomId.length > 0">Room id</label>
            <input type="text" 
                class="room-input"
                :class="[roomId.length > 0 ? 'room-input--active' : '']"
                id="room" placeholder="Room id" v-model="roomId">
            <button
                class="login__btn"  
                :status=checkRoomId 
                @click.prevent="userLogin">
                {{checkRoomId ? "Enter the chat" : "Create new room"}}
            </button>
      </form>
  </div>
</template>

<script>

import {mapMutations} from "vuex"

export default {
    data() {
        return {
            login: "",
            roomId: "",
            errorMessage: "",
            activeInfo: false
        }
    },
    methods: {
        ...mapMutations([
            "authUser"
        ]),
        userLogin() {
            if (!this.checkRoomId) {
                this.roomId = Date.now()
            } else {
                
                if (this.login.length > 0) {
                    this.authUser([this.login, this.roomId])
                    this.$router.push("/chat")
                } else {
                    this.errorMessage = "Enter login"
                    setTimeout(() => this.errorMessage = "", 3000)
                }

                
            }
        }
    },
    computed: {
        checkRoomId() {
            return this.roomId !== ""
        }
    },
    watch: {
        login: function(newVal, oldVal) {
            if (newVal.length > 12) this.login = oldVal
        }
    }
}
</script>

<style lang="scss" scoped>
    $bgcColorForm: #fff5fd;
    $colorForm: #343f56;

    * {
        font-family: 'Roboto', sans-serif;
    }

    .login {
        &__container {
            margin: 0 auto;
            width: 500px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: $bgcColorForm;
            height: 250px;
            border-radius: 3px;
            margin-top: 5%;
            box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
        }

        &__form {
            max-width: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        &__btn {
            width: 200px;
            height: 45px;
            margin-top: 20px;
            border: none;
            background-color: #125d98;
            color: #fff;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            line-height: 15px;
            &:hover {
                transition: .5s;
                background-color: #325288;
            }
        }

        &__info {
            width: 100%;
            display: grid;
            p {
                margin: 0;
            }
        }

        &__error {
            grid-column: 1/2;
            color: #fb3640;
        }

        &__length {
            grid-column: 2/3;
            text-align: end;
        }
    
    }


    .form__label {
        margin-top: 6px;
        align-self: flex-start;
        font-size: 12px;
        color: $colorForm;
    }

    input {
        width: 400px;
        border: none;
        outline: none;
        border-bottom: 1px solid #343f56;
        height: 30px;
        font-size: 20px;
        padding: 5px;
        color: $colorForm;
        background-color: $bgcColorForm;

    }
    
    .room-input {
        margin-top: 20px;

        &--active {
            margin-top: 0;
        }
    }

    .login-input {
        margin: 24px 0;
    }

    .active {
        margin: 5px;
        &--error {
            margin-bottom: 5px;
        }
    }
</style>