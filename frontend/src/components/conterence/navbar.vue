<template>
   <header>
        <nav class="nav__menu">
            <ul v-if="authStatus">
              <li v-for='(item, index) in navbarAuthList.items' :key="index">
                <router-link :to="item.link">{{item.name}}</router-link>
              </li>
            </ul>
             <ul v-else>
               <li v-for='(item, index) in navbarNoAuthList.items' :key="index">
                <router-link :to="item.link">{{item.name}}</router-link>
              </li>
            </ul>
            <navbar-conf-admin/>
            <a v-if="authStatus" href="#">Exit</a>
        </nav>
        <div class="nav__btn">
            <input type="checkbox" name="" id="" />
            <div class="hamburger-lines">
                <span class="line line1"></span>
                <span class="line line2"></span>
                <span class="line line3"></span>
            </div>
        </div>
    </header>
</template>

<script>
import { computed } from 'vue'

import { useStore } from 'vuex'
import NavbarConfAdmin from './navbarConfAdmin.vue'

export default {
    components: { NavbarConfAdmin },
    setup() {
        const store = useStore();
        const navbarAuthList = {
            items: [
                {
                    name: "Chat",
                    link: "/chat"
                },
                {
                    name: "Conferences",
                    link: "/conferences"
                },
                {
                    name: "Create conference",
                    link: "/create"
                },
                {
                    name: "User",
                    link: "/user"
                }
            ]
        };
        const navbarNoAuthList = {
            items: [
                {
                    name: "Login",
                    link: "/login"
                },
                {
                    name: "Register",
                    link: "/register"
                }
            ]
        };
        const authStatus = computed(() => store.getters["auth/getAuthStatus"]);
        console.log("auth", authStatus.value);
        return {
            authStatus,
            navbarAuthList,
            navbarNoAuthList,
        };
    },
    
}
</script>

<style lang='scss' scoped>
    header {
    height: 100%;
    background-color: $bgcColor;
    box-sizing: border-box; 
}


.nav {
    &__menu {
        height: 100%;
        width: 1000px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;

        ul {
            list-style: none;
            display: flex;
    
            li {
                margin-right: 15px;
            }
        }
    
        :deep(a) {
            text-decoration:  none;
            color: $textColor;
            padding: 6px;
            transition: .3s ease;
    
            &:hover {
                color: $linkColor;
            }
        }
    
        button {
            display: none;
        }
    }

    &__btn {
        display: none;

        input[type="checkbox"] {
            display: block;
            height: 32px;
            width: 30px;
            z-index: 5;
            opacity: 0;
            cursor: pointer;
        }
        
        .hamburger-lines {
            display: block;
            height: 28px;
            width: 35px;
            position: absolute;
            z-index: 2;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
        }
        
        .hamburger-lines .line {
            display: block;
            height: 4px;
            width: 100%;
            border-radius: 10px;
            background: #fff;
        }
        
        .hamburger-lines .line1 {
            transform-origin: 0% 0%;
            transition: transform 0.3s ease-in-out;
        }
        
        .hamburger-lines .line2 {
            transition: transform 0.1s ease-in-out;
        }
        
        .hamburger-lines .line3 {
            transform-origin: 0% 100%;
            transition: transform 0.3s ease-in-out;
        }
        
        input[type="checkbox"]:checked ~ .menu-items {
            transform: translateX(0);
        }
        
        input[type="checkbox"]:checked ~ .hamburger-lines .line1 {
            transform: rotate(45deg);
        }
        
        input[type="checkbox"]:checked ~ .hamburger-lines .line2 {
            transform: scaleY(0);
        }
        
        input[type="checkbox"]:checked ~ .hamburger-lines .line3 {
            transform: rotate(-45deg);
        }
    }

    
}



@media (max-width: 1140px) {

    .nav {
        &__menu {
            width: 800px;
        }
    } 
}
// Убрать грид на нав, сделать флексом например
// для футер меню сделать фикс высоту и прижать к нижу с помощью позиционировая


@media (max-width: 960px) {

    header {
        background-color: inherit;
    }

    header.active {
        background-color: $bgcColor;
    }

    .nav {

        &__menu {
            width: 100%;
            flex-direction: column;
            height: auto;
            display: none;
            align-items: center;
            justify-content: center;
            

            &--active {
                display: flex;
            }
    
            :deep(ul) {
                flex-direction: column;
                align-items: center;
                width: 100%;
    
                li {
                    margin: 0;
                }
            }
    
            a {
                width: 100%;
                text-align: center;
                margin: 4px 0;
                font-size: 20px;
            }
        }

        &__btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            position: fixed;
            bottom: 5px;
            right: 10px;

            &--active {
                position: absolute;
                right: 15px;
                top: 20px;
            }
        }
    }
   
}

@media (max-width: 730px) {

    .nav {
        &__btn {
            right: 5px;
        }
    }
   
}
</style>