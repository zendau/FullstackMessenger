<template>
  <div class="chat__header">Chat</div>
  <div class="chat__body">
    <ul class="chat__messages">
      <li class="chat__message">
        <h4>Name</h4>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate recusandae sequi incidunt veniam
          tempore porro, ex optio quidem magni. Nihil.</p>
        <span>16:56</span>
      </li>
      <li class="chat__message">
        <h4>Name</h4>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate recusandae sequi incidunt veniam
          tempore porro, ex optio quidem magni. Nihil.</p>
        <span>16:56</span>
      </li>
      <li class="chat__message">
        <h4>Name</h4>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate recusandae sequi incidunt veniam
          tempore porro, ex optio quidem magni. Nihil.</p>
        <span>16:56</span>
      </li>
      <li class="chat__message">
        <h4>Name</h4>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate recusandae sequi incidunt veniam
          tempore porro, ex optio quidem magni. Nihil.</p>
        <span>16:56</span>
      </li>
      <li class="chat__message">
        <h4>Name</h4>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate recusandae sequi incidunt veniam
          tempore porro, ex optio quidem magni. Nihil.</p>
        <span>16:56</span>
      </li>
      <li class="chat__message">
        <h4>Name</h4>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate recusandae sequi incidunt veniam
          tempore porro, ex optio quidem magni. Nihil.</p>
        <span>16:56</span>
      </li>
    </ul>
  </div>
  <div class="chat__footer">
    <div class="chat__content">
      <div class="chat__input" contenteditable="true" data-placeholder="Type message"></div>
      <ul class="chat__files">
        <li class="chat__file"><a href="#"><i class="bi bi-file-earmark-arrow-down"></i> test1.txt</a></li>
        <li class="chat__file"><a href="#"><i class="bi bi-file-earmark-arrow-down"></i> test2.txt</a></li>
        <li class="chat__file"><a href="#"><i class="bi bi-file-earmark-arrow-down"></i> test3.txt</a></li>
        <li class="chat__file"><a href="#"><i class="bi bi-file-earmark-arrow-down"></i> test4.txt</a></li>
        <li class="chat__file"><a href="#"><i class="bi bi-file-earmark-arrow-down"></i> test5.txt</a></li>
      </ul>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.chat {
    &__header {
        text-align: center;
        font-size: 20px;
        color: $textColor;
        margin: 8px 0;
        
    }

    &__body {
        flex: 1;
        overflow: auto;
    }

    &__footer {
        height: auto;
        position: relative;

    }

    &__content {
        bottom: 0;
        width: 100%;
    }

    &__messages {
        padding: 0;
        list-style: none;
    }

    &__message {
        display: grid;
        grid-template-columns: 80% 20%;
        margin: 0 7px 7px;
        background-color: $messageColor;
        padding: 6px;
        border-radius: 5px;

        h4 {
            max-width: 100px;
            grid-column: 1/2;
            color: $activeColor;
        }

        p {
            text-align: justify;
            grid-row: 2/3;
            grid-column: 1/3;
            color: $textColor;
        }

        span {
            align-self: flex-end;
            max-width: 50px;
            grid-column: 2/3;
            justify-self: end;
            color: $secondTextColor;
        }
    }

    &__input {
        box-sizing: border-box;
        width: 100%;
        min-height: 1.4em;
        max-height: 10em;
        font-size: 16px;
        text-align: left;
        overflow-y: auto;
        border: none;
        outline: none;
        color: $textColor;
        background-color: $itemColor;
        border-bottom: 1px solid black;
        padding: 10px;

        &:empty:before {
            content: attr(data-placeholder);
        }
        // div {
        //     border: none;
        //     padding: 0;

    }

    &__files {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        background-color: $itemColor;
        padding: 5px;
        justify-content: space-between;
        box-sizing: border-box;
    }

    &__file {
        a {
            text-decoration:  none;
            color: $linkColor;
            transition: .3s ease;

            &:hover {
                color: $textColor;
            }
        }
    }
    
    
};
</style>