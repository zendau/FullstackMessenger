<template>
  <div class="alert" :class="'alert__'+type">
        <p class="alert__text">{{text}}</p>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            validator: (value) => {
                return ['success', 'danger'].indexOf(value) !== -1
            },
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        }
    },
}
</script>

<style lang='scss'>
    .alert {

    width: 250px;
    height: 60px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &__danger {
        background-color: $dangerColor;
    }

    &__success {
        background-color: $successColor;
    }

    &__text {
        color: $textColor;
        text-align: center;
    }
}
</style>