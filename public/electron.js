const { app, dialog, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { startServer } = require('./server');
const isDevelopment = !app.isPackaged;
console.log('isDevelopment: ', isDevelopment);
if (require('electron-squirrel-startup')) app.quit();

app.whenReady().then(async () => {
    const window = new BrowserWindow({ width: 800, height: 600, resizable: true }); // Create window

    // Jab tak server chalu nahi ho user ko dialog dikhate raho retry karne ke liye
    // server chalu ho jaye uske baad react ka app load karo
    let serverStarted = false;
    while (!serverStarted) {
        try {
            await startServer();
            serverStarted = true;
        } catch (error) {
            const response = await dialog.showMessageBox(window, {
                type: 'error',
                title: 'Server Error',
                message: 'Failed to start the server. Please check the database connection.',
                buttons: ['Retry', 'Quit'],
                defaultId: 0,
                cancelId: 1,
            });

            if (response.response === 0) {
                // Retry button was clicked, continue the loop
            } else {
                // Quit button was clicked or the dialog was canceled, exit the application
                app.quit();
                return;
            }
        }
    }

    window.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

