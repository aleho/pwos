var PWoS = (function ($) {
    const MIN_LEN_BAD = 5;
    const MAX_LEN_BAD = 16;

    const DB_URL = 'data/db.json?ts=' + PWOS_VERSION;

    const ATTRS = [
        'alpha', 'digit', 'space', 'special', 'case', 'changeable'
    ];

    const $list     = $('#sites-list');
    const $template = $('#site-template tr');
    const $filters  = $('.filter');

    let db;


    function addRow(data) {
        let $row = $template.clone().appendTo($list);;

        $row.find('.title').text(data.title);
        $row.find('a.url')
            .text(data.url.replace(/^https?\:\/\//i, ''))
            .attr('href', data.url);

        $row.find('.attr.min').text(data.pw.min).toggleClass('text-danger text-bold', data.pw.min <= MIN_LEN_BAD);
        $row.find('.attr.max').text(data.pw.max).toggleClass('text-danger text-bold', data.pw.max <= MAX_LEN_BAD);

        for (let attr of ATTRS) {
            if (!data.pw[attr]) {
                $row.find('.attr.' + attr + ' i').removeClass('invisible');
            }
        }
    }

    function filter($input) {
        let attr = $input.data('filter');
        let val  = $input.val();

        if (!attr || (val.length < 2 && val.length != 0)) {
            return;
        }

        let filter   = {};
        filter[attr] = val;

        showResults(filter);
    }

    function showResults(filter) {
        filter = filter || null;

        let result = db.filter(filter);
        let site   = result.next();

        $list.empty();
        while (site && !site.done && site.value) {
            addRow(site.value);
            site = result.next();
        }
    }

    function init() {
        $('#last-update').text(new Date(PWOS_VERSION * 1000));

        $('.filter').keypress(function (event) {
            if (event.which == 13) {
                filter($(this));
            }
        });

        PWoSDb
            .load(DB_URL)
            .done(function (resultDb) {
                db = resultDb;
                showResults();
            })
            .fail(function () {
                console.log('fail') //XXX TODO!
            });
    }

    return {
        init: init,

        get db() {
            return db;
        }
    };
})(jQuery);
