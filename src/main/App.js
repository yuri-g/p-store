const {ipcMain} = require('electron');
const openpgp = require('openpgp');
const {setTimeout} = require('timers');
const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const PasswordStore = require('./Util/PasswordStore');
const childProcess = require('child_process');
const crypto = require('crypto');

class App {
    constructor(options) {
        this.basePath = path.join(options.homePath, "/password-storage");
        this.prepareFileSystem();
        this.startEventListeners();

        this.store = new PasswordStore(path.join(this.basePath, '/store'));
    }

    prepareFileSystem() {
        mkdirp(this.basePath);

        const keysPath = path.join(this.basePath, '/keys');
        mkdirp(keysPath);

        this.keyPath = path.join(keysPath, 'key');
        this.pubKeyPath = path.join(keysPath, 'key.pub');
    }

    startEventListeners() {
        ipcMain.on('key:exist', (event) => {
            const exists = fs.existsSync(this.keyPath) && fs.existsSync(this.pubKeyPath);

            event.sender.send('key:exist-response', {exist: exists});
        });

        ipcMain.on('store:get-list', (event) => {
            const passwords = this.store.getPasswords();

            event.sender.send('store:get-list-response', {passwords: passwords});
        });

        ipcMain.on('key:generate-key-pair', (event, {options}) => {
            const newKeyInput = options;
            childProcess.fork('./src/main/Util/PasswordGenerator', [
                newKeyInput.name,
                newKeyInput.email,
                newKeyInput.passphrase,
                this.keyPath,
                this.pubKeyPath
            ]).on('message', (response) => {
                event.sender.send('key:receive-key-pair', response);
            });
        });

        ipcMain.on('store:add-password', (event, args) => {
            crypto.randomBytes(12, (_, buf) => {
                const p = buf.toString('hex');
                this.store.storePassword(p, args.name.name, this.keyPath, this.pubKeyPath) ;           });
        });
    }
}

module.exports = App;
