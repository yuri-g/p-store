const path = require('path');
const KeyGenerator = require(path.resolve('src/renderer/js/KeyGenerator'));
const HtmlHelpers = require(path.resolve('src/renderer/js/HtmlHelpers'))

window.onload = () => {
    const h = new HtmlHelpers(document);

    const generateKeysForm = h.findById('generate-keys-form');
    const welcomeTitle = h.findById('keys-exist');
    const loading = h.findById('loading');
    const addPasswordForm = h.findById('add-password');
    const passwordsList = h.findById('passwords-list');


    KeyGenerator.getPasswords().then((passwords) => {
        passwords.forEach((password) => {
            h.createElement('<li class="password" data-path="' + password + '">' + password + '</li>', passwordsList);
        }); 

        Array.from(h.findByClass('password')).forEach((el) => {
            h.onClick(el, (e) => {
                const path = e.target.dataset.path;
                const passphrase = h.findById('passphrase-input').value;
                KeyGenerator.readPassword({path: path, passphrase: passphrase}).then((data) => {
                    console.log(data);
                });
            })
        });
    });

    KeyGenerator.keysExist().then((exist) => {
        if (exist) {
            h.addClass(generateKeysForm, "hidden");
            h.removeClass(welcomeTitle, "hidden");
        } else {
            h.addClass(welcomeTitle, "hidden");
            h.removeClass(generateKeysForm, "hidden");
        }
    });

    h.onSubmit(generateKeysForm, (event) => {
        event.preventDefault();

        const formElements = event.target.elements;
        const passphrase = formElements.passphrase.value; 
        const name = formElements.name.value; 
        const email = formElements.email.value; 

        h.removeClass(loading, "hidden");
        h.addClass(generateKeysForm, "hidden");
        KeyGenerator.generateKeyPair({passphrase: passphrase, name: name, email: email}).then((args) => {
            h.addClass(loading, "hidden");
            h.removeClass(welcomeTitle, "hidden");
        })
    });

    h.onSubmit(addPasswordForm, (event) => {
        event.preventDefault();

        const passwordName = event.target.elements.name.value;

        h.removeClass(loading, "hidden");
        KeyGenerator.addPassword({name: passwordName}).then(() => {
            h.addClass(loading, "hidden");
        })

    });
}