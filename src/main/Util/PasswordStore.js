const mkdirp = require('mkdirp');
const fs = require('fs');
const path = require('path');
const pgp = require('openpgp');

class PasswordStore {
    constructor(storePath) {
        this.path = storePath;

        mkdirp(this.path);
    }

    getPasswords(searchPath) {
        if (typeof searchPath === "undefined") {
            searchPath = this.path;
        }

        const passwords = fs.readdirSync(searchPath).filter((folderName) => {
            return folderName.charAt(0) !== '.';
        }).reduce((passwords, folderName) => {
            const fullPath = path.join(searchPath, folderName);

            if (fs.lstatSync(fullPath).isDirectory()) {
                return passwords.concat(this.getPasswords(fullPath));
            } else {
                passwords.push(fullPath);
                return passwords;
            }
        }, []);

        return passwords;
    }

    storePassword(password, name, keyPath, pubKeyPath) {
        const key = fs.readFileSync(keyPath).toString();
        const pubKey = fs.readFileSync(pubKeyPath).toString();

        pgp.encrypt({
            data: password,
            publicKeys: pgp.key.readArmored(pubKey).keys
        }).then((ciphertext) => {
            console.log(ciphertext);

            fs.writeFileSync(path.join(this.path, name), ciphertext.data);
        }).catch((reason) => {
            console.log(reason);
        });
    }
}

module.exports = PasswordStore;
