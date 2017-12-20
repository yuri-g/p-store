const {ipcRenderer} = require('electron');

class KeyGenerator {
    static getPasswords() {
        return new Promise((resolve, reject) => {
            ipcRenderer.on('store:get-list-response', (_, {passwords}) => {
                resolve(passwords);
            });
            ipcRenderer.send('store:get-list');
        });
    }

    static addPassword(name) {
        return new Promise((resolve, reject) => {
            ipcRenderer.send('store:add-password', {name: name});
        });
    }

    static readPassword(path, passphrase) {
        return new Promise((resolve, reject) => {
            ipcRenderer.on('store:read-password-response', (_, args) => {
                resolve(args.password);
            });

            ipcRenderer.send('store:read-password', {path: path, passphrase: passphrase});
        });
    }

    static keysExist() {
        return new Promise((resolve, reject) => {
            ipcRenderer.on('key:exist-response', (_, args) => {
                resolve(args.exist);
            });

            ipcRenderer.send('key:exist');
        });
    }

    static generateKeyPair(options) {
        return new Promise((resolve, reject) => {
            ipcRenderer.on('key:receive-key-pair', (_, args) => {
                resolve(args);
            });

            ipcRenderer.send('key:generate-key-pair', {options});
        });
    }
}

module.exports = KeyGenerator;
