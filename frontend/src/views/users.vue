<template>
    <section v-show="sideMenu" class="section__users">
        <h1>Users online</h1>
        <ul class="users__list">
            <li v-for="user in users" :key="user.id">{{user.login}}</li>
        </ul>
    </section>
</template>

<script>

import {computed} from "vue"
import {useStore} from "vuex"

export default {
    props: {
        sideMenu: Boolean
    },
    setup() {
        
        const store = useStore()
        
        return {
            users: computed(() => store.state.users),
        }    
    }
}
</script>

<style lang="scss">
    .section {
        &__users {
            min-width: 25%;
            font-family: 'Roboto', sans-serif;
            background-color: #f6e6e4;
            height: 100vh;
            box-shadow: 4px 0px 10px 0px rgba(34, 60, 80, 0.06);

            h1 {
                margin-top: 30px;
                text-align: center;
            }
        }
    }

    .users__list {
        list-style: none;
        padding: 0;
        li {
        text-align: center;
        }
    }
</style>