var PWoSDb = (function () {
    let Db = function (data) {
        this.data = data;
    };

    Db.prototype.filter = function* (filter) {
        filter = filter || {};

        let fTitle = filter.title ? new RegExp(filter.title, 'i') : null;
        let fUrl   = filter.url   ? new RegExp(filter.url, 'i')   : null;

        for (let site of this.data) {
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
    };


    let db = null;

    function load(url) {
        let deferred = $.Deferred();

        if (!url) {
            deferred.reject();
            return deferred.promise();
        }

        $.ajax({
            type:     'GET',
            dataType: 'json',
            url:      url

        }).done(function (json) {
            if (json) {
                db = new Db(json);
                deferred.resolve(db);
            } else {
                deferred.reject();
            }

        }).fail(function () {
            db = null;
            deferred.reject();
        });

        return deferred.promise();
    }


    return {
        load: load
    }
})();
