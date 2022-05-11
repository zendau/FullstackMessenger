<template>
  <div class="message__container">
    <p class="message__author">Admin</p>
    <div class="message__body">
      <p class="message__text">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas
        laborum, saepe quibusdam ducimus dignissimos asperiores! Rem aliquid
        nihil quo quae quidem consequatur nesciunt. Enim corrupti itaque,
        suscipit odit non nam voluptatem! Rerum, culpa veritatis! Eaque fugiat
        pariatur illo assumenda et voluptate. Consectetur assumenda corporis
        repellendus reiciendis temporibus aut ipsa, reprehenderit rerum quos
        nobis ex porro fuga corrupti eum similique earum ut iusto nihil? Earum
        nostrum impedit, in pariatur reiciendis asperiores a temporibus deleniti
        corrupti sequi quae? Facere voluptatem quaerat alias voluptate
        doloribus. Error a culpa explicabo blanditiis, provident quas cupiditate
        maiores veritatis similique dolorum perferendis illum molestias
        reiciendis dolorem sunt!
      </p>
      <a href="#" class="message__link">localhost.com</a>
      <a href="#" class="message__file">
        <i class="bi bi-file-earmark-arrow-down"></i>text.txt</a
      >
    </div>
    <span class="message__time">16:43</span>
  </div>
</template>

<style lang="scss" scoped>
.message {
    &__container {
        width: 500px;
        align-items: flex-start;
        margin: 5px 10px;
        display: grid;
        grid-template-columns: 1fr 50px;
        align-items: end;
        padding: 7px;
        background-color: $messageColor;
        border-radius: 5px;

        &--author {
            align-self: flex-end;
        }
    }

    &__link, &__file {
        color: $activeColor;
    }

    &__author {
        justify-self: start;
        margin-left: 15px;
        color: $activeColor;
    }

    &__time {
        text-align: center;
        color: $secondTextColor;
    }

    &__text {
        text-align: left;
        color: $textColor;
    }

    &__body {
        grid-row: 2/3;
        grid-column: 1/3;
    }

    &__time {
        grid-column: 2/3;
    }
}

@media (max-width: 960px) {
    .message {
        &__container {
            width: 100%;
            margin: 6px 0;
            box-sizing: border-box;

            &--author {
                align-self: center;
            }

        }
    }
}
</style>