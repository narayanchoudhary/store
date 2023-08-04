const { app, dialog, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const { startServer } = require('./server');
const isDevelopment = !app.isPackaged;
console.log('isDevelopment: ', isDevelopment);


app.whenReady().then(() => {
    const window = new BrowserWindow({
        width: 800, height: 600, transparent: true,
    }); // Create window

    try {
        startServer();
        if (isDevelopment)
            window.loadURL('http://localhost:3000')
        else {

            window.loadURL(
                url.format({
                    pathname: path.join(__dirname, 'build', 'index.html'),
                    protocol: 'file:',
                    slashes: true,
                })
            );
        }
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

