class HtmlHelpers {
    constructor(document) {
        this.document = document;
    }

    findById(id) {
        return this.document.getElementById(id);
    }

    findByClass(c) {
        return this.document.getElementsByClassName(c);
    }

    addClass(e, c) {
        e.classList.add(c);
    }

    removeClass(e, c) {
        e.classList.remove(c);
    }

    onSubmit(e, callback) {
        this.on('submit', e, callback);
    }

    onClick(e, callback) {
        this.on('click', e, callback);
    }

    on(event, e, callback) {
        e.addEventListener(event, (e) => {
            callback(e);
        });
    }

    createElement(htmlString, parent) {
        parent.insertAdjacentHTML('beforeend', htmlString);
    }
}

module.exports = HtmlHelpers;