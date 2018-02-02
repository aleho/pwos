class Db {
    constructor(data) {
        this.data = data;
    }

    * filter(filter) {
        filter = filter || {};

        const fTitle = filter.title ? new RegExp(filter.title, 'i') : null;
        const fUrl   = filter.url   ? new RegExp(filter.url, 'i')   : null;

        for (let i = 0; i < this.data.length; i++) {
            const site = this.data[i];

            if (!('id' in site)) {
                site.id = parseInt(i) + 1;
            }

            if (fTitle
                && (!site.title || !site.title.match(fTitle))
            ) {
               continue;
            }

            if (fUrl
                && (!site.url || !site.url.match(fUrl))
            ) {
               continue;
            }

            yield site;
        }
    }
}


let dbInstance = null;

function load(url) {
    if (!url) {
        return Promise.reject();
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            dbInstance = null;

            if (xhr.status === 200 && xhr.responseText) {
                try {
                    let json = JSON.parse(xhr.responseText);
                    dbInstance = new Db(json);
                    resolve(dbInstance);
                } catch (e) {
                    reject();
                }

            } else {
                reject();
            }
        };
        xhr.send();
    });
}


export default {
    load: load
}
