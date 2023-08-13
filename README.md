Development me kaise chalana he... bas do command chalana he
    1) "npm start" // which will start the react developemnt
    2) "node server.js" // which will start the node js server which connects to the mssql server and provides
        the data

Prodution me kaise chalana he... 
    1) Pehle to server.js ki exe file bana leni he "nexe" ki madad se
        Example:-  "nexe -i server.js -o public/server.exe --target windows-x86-12.9.1"
            -i matlab input file.
            -o matlab output file. Hamne output public directory me rakha he kyo ki jab react ki build
            banayenge to vo build folder me automatic aa jaaye
            --target option he usme hame ye batan hota he ki konse system (windows architechture and node version) ke liye exe banani he. Eski website pe list he release target karke vaha dekhlo

    2) Fir "npm run build" chalake build banaleni he react ki isse hamara build folder taiyar ho jayega

    3) Fir kya karna he ki build folder ko production computer pe le jana he aur vb.vbs file ka shortcut
       banana he aur use startup folder me dal dena he bas khatam
