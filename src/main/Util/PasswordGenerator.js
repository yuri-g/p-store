// @TODO Not password generator, but key generator

const openpgp = require('openpgp');
const fs = require('fs');

const name = process.argv[2];
const email = process.argv[3];
const passphrase = process.argv[4];
const keyPath = process.argv[5];
const pubKeyPath = process.argv[6];

openpgp.generateKey({
    userIds: [{ name: name, email: email}],
    numBits: 2048,
    passphrase: passphrase
}).then((key) => {
    fs.writeFileSync(keyPath, key.privateKeyArmored);
    fs.writeFileSync(pubKeyPath, key.publicKeyArmored);

    process.send(true);
}).catch((result) => {
    process.send(false);
});
