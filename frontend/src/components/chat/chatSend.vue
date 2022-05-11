<template>
  <div class="chat__send">
    <div
      class="chat__input"
      contenteditable="true"
      data-placeholder="Type message"
    ></div>
    <ul class="chat__files">
      <li class="chat__file">
        <a href="#"><i class="bi bi-file-earmark-arrow-down"></i>test1.txt</a>
      </li>
      <li class="chat__file">
        <a href="#"><i class="bi bi-file-earmark-arrow-down"></i>test2.txt</a>
      </li>
      <li class="chat__file">
        <a href="#"><i class="bi bi-file-earmark-arrow-down"></i>test3.txt</a>
      </li>
      <li class="chat__file">
        <a href="#"><i class="bi bi-file-earmark-arrow-down"></i>test4.txt</a>
      </li>
      <li class="chat__file">
        <a href="#"><i class="bi bi-file-earmark-arrow-down"></i>test5.txt</a>
      </li>
    </ul>
    <button><i class="bi bi-send"></i></button>
  </div>
</template>

<style lang="scss" scoped>
  .chat {
    &__send {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 60px;
      background-color: $bgcColor;
      color: $textColor;

      button {
        grid-column: 2/3;
        grid-row: 1/2;
        height: 40px;
        align-self: end;
        border: none;
        background-color: $activeColor;

        i {
          font-size: 28px;
          &::before {
            transform: rotateZ(45deg);
          }
        }
      }
    }

    &__input {
      box-sizing: border-box;
      width: 100%;
      min-height: 1.4em;
      max-height: 10em;
      background-color: white;
      font-size: 16px;
      text-align: left;
      overflow-y: auto;
      grid-column: 1/2;
      background-color: inherit;
      outline: none;
      padding: 10px;

      &::-webkit-scrollbar {
        width: 0;
      }

      &:empty:before {
        content: attr(data-placeholder);
      }
      // div {
      //     border: none;
      //     padding: 0;
    }

    &__files {
      border-top: 1px solid black;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      padding: 3px;
      grid-column: 1/3;
      background-color: $bgcColor;
    }

    &__file {
      margin: 3px 8px;
      a {
        color: $linkColor;
        text-decoration: none;
      }
    }
  }
</style>