const { app, dialog, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const { startServer } = require('./server');
const isDevelopment = !app.isPackaged;
console.log('isDevelopment: ', isDevelopment);
if (require('electron-squirrel-startup')) app.quit();



app.whenReady().then(() => {
    const window = new BrowserWindow({ width: 800, height: 600, resizable: true }); // Create window

    try {
        startServer();
        window.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    } catch (error) {
        dialog.showMessageBox(window, {
            type: 'error',
            title: 'Server Error',
            message: 'Failed to start the server. Please check the database connection.',
            buttons: ['Retry', 'Quit'],
            defaultId: 0, // Set the default selected button to "Retry"
            cancelId: 1, // Set the "Quit" button as the cancel option
        }).then((result) => {
            if (result.response === 0) {
                // Retry button was clicked, try starting the server again
                startServer();
            } else {
                // Quit button was clicked or the dialog was canceled, exit the application
                app.quit();
            }
        });
    }
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

