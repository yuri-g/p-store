const electron = require('electron');
const url = require('url');
const path = require('path');
const App = require('./src/main/App');

const app = electron.app;

const BrowserWindow = electron.BrowserWindow;


let mainWindow;

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegrationInWorker: true,
            sandbox: false
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'src', 'renderer', 'html', 'main.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.toggleDevTools();

    new App({
        homePath: app.getPath('home')
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});