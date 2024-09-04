wt nt --title gateway -d "./" cmd /k "cd gateway && npm run start" ^
 ; nt --title file-cloud -d "./" cmd /k "cd file-cloud && npm run start" ^
 ; nt  --title peer-chat -d "./" cmd /k "cd peer-chat && npm run start" ^
 ; nt --title socket-chat -d "./" cmd /k "cd socket-chat && npm run start" ^
 ; nt --title auth-service -d "./" cmd /k "cd auth-service && npm run start"