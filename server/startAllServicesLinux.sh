export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
node -v
nvm alias default 16.14.2
node -v
cmd.exe /c "wt.exe" nt --title gateway -d "." bash -c "cd gateway && node -v && npm run start" \; nt --title file-cloud -d "./" bash -c "cd file-cloud && npm run start" \; nt  --title file-cloud -d "./" bash -c "cd peer-chat && npm run start" \; nt --title file-cloud -d "./" bash -c "cd socket-chat && npm run start"