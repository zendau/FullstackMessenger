#!/bin/bash

session_name="nest"
microservices=("gateway" "auth-service" "file-cloud" "peer-chat" "socket-chat")

tmux kill-session -t "$session_name"
tmux new-session -d -s "$session_name" -n "Workspace"

tmux select-window -t "$session_name"

for element in "${microservices[@]}"
do
    tmux new-window -d -n "$element"
    tmux send-keys -t "$element.0" "cd server/$element" C-m
    tmux send-keys -t "$element.0" "pnpm run start" C-m

done

# Переключаемся на первое окно
tmux select-window -t "$session_name:0"

# Привязываем сессию к оконному менеджеру
tmux attach-session -t "$session_name"
