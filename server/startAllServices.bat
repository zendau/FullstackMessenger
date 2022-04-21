wt nt --title gateway -d "./" cmd /k "cd gateway && npm run start || title gateway2" ^
 ; nt --title file-cloud -d "./" cmd /k "cd file-cloud && npm run start" ^
 ; nt  --title file-cloud -d "./" cmd /k "cd peer-chat && npm run start" ^
 ; nt --title file-cloud -d "./" cmd /k "cd socket-chat && npm run start"