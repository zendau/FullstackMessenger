<template>
    <header class="conference__navbar">
        <nav class="nav__menu" :class="{ 'nav__menu--active': isShowMobileNavbar }">
            <ul v-if="authStatus">
                <li v-for='(item, index) in navbarAuthList.items' :key="index">
                    <router-link :to="item.link" replace>{{ item.name }}</router-link>
                </li>
                <admin-menu v-if='isAdmin' />
            </ul>
            <ul v-else>
                <li v-for='(item, index) in navbarNoAuthList.items' :key="index">
                    <router-link :to="item.link">{{ item.name }}</router-link>
                </li>
            </ul>

            <navbar-conf-admin v-if="authStatus" />
            <a v-if="authStatus" @click="logout" href="#">Exit</a>
        </nav>
        <button class="nav__btn" @click="isShowMobileNavbar = !isShowMobileNavbar">
            <input type="checkbox" name="" id="" :checked="isShowMobileNavbar" />
            <div class="hamburger-lines">
                <span class="line line1"></span>
                <span class="line line2"></span>
                <span class="line line3"></span>
            </div>
        </button>
    </header>
</template>

<script>
import { computed, ref, watch } from 'vue'

import { useStore } from 'vuex'
import NavbarConfAdmin from './navbarConfAdmin.vue'

import { Role } from '../../router/roles'
import AdminMenu from './adminMenu.vue'
import { useRoute } from 'vue-router'

export default {
    components: { NavbarConfAdmin, AdminMenu },
    setup() {
        const store = useStore();
        const route = useRoute()

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

        const isShowMobileNavbar = ref(false)

        const authStatus = computed(() => store.state.auth.authStatus);
        console.log("auth", authStatus.value);

        const isAdmin = computed(() => store.state.auth.user.role.accessLevel === Role.Admin)
        console.log('isAdmin', isAdmin.value)




        watch(() => route.path, () => {
            console.log('isShow', isShowMobileNavbar.value)
            isShowMobileNavbar.value = false
            console.log('isShow', isShowMobileNavbar.value)
        })

        function logout() {
            store.dispatch('auth/logout')
        }
        return {
            logout,
            isAdmin,
            authStatus,
            navbarAuthList,
            navbarNoAuthList,
            isShowMobileNavbar
        };
    },

}
</script>

<style lang='scss' scoped>
header {
    height: 50px;
    background-color: var(--bgcColor);
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
            text-decoration: none;
            color: var(--textColor);
            padding: 6px;
            transition: .3s ease;

            &:hover {
                color: var(--linkColor);
            }
        }

        button {
            display: none;
        }
    }

    &__btn {
        display: none;
        background-color: transparent;
        border: none;

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

        input[type="checkbox"]:checked~.menu-items {
            transform: translateX(0);
        }

        input[type="checkbox"]:checked~.hamburger-lines .line1 {
            transform: rotate(45deg);
        }

        input[type="checkbox"]:checked~.hamburger-lines .line2 {
            transform: scaleY(0);
        }

        input[type="checkbox"]:checked~.hamburger-lines .line3 {
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

@media (max-width: 960px) {

    header {
        height: 0px;
    }

    .nav {

        &__menu {
            width: 100%;
            flex-direction: column;
            height: auto;
            display: none;
            align-items: center;
            justify-content: center;

            position: fixed;
            top: 0;
            width: 100%;
            background-color: var(--bgcColor);


            &--active {
                display: flex;
            }

            :deep(ul) {
                flex-direction: column;
                align-items: center;
                width: 100%;

                li,
                div {
                    margin: 4px 0;
                    font-size: 20px !important;
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