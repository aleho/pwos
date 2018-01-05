var PWoS = (function ($) {
    const MAX_RESULTS = 30;

    const MIN_LEN_BAD     = 5;
    const MAX_LEN_BAD     = 16;
    const SHAME_SCORE_BAD = 3;

    const DB_URL = 'data/db.json?v=' + PWOS_VERSION;

    const ATTRS = [
        'alpha', 'digit', 'space', 'special', 'case', 'changeable'
    ];

    const $list     = $('#sites-list');
    const $template = $('#site-template tr');
    const $filters  = $('.filter');

    let db;
    let scrollMon;
    let filters;
    let results;
    let $lazyInfo;
    let $lazySpinner;



    /**
     * Adds a row to the table.
     */
    function addRow(data) {
        let $row       = $template.clone().appendTo($list);
        let shameScore = 0;

        $row.find('.title').text(data.title);

        $row.find('a.url')
            .attr('href', data.url)
            .find('.url-text')
            .text(data.url.replace(/^https?\:\/\//i, ''));


        $row.find('.attr.min')
            .text(data.pw.min)
            .toggleClass('text-danger', data.pw.min <= MIN_LEN_BAD);

        $row.find('.attr.max')
            .text(data.pw.max)
            .toggleClass('text-danger', data.pw.max <= MAX_LEN_BAD);

        if (data.pw.min <= MIN_LEN_BAD) {
            shameScore++;
        }

        if (data.pw.max <= MAX_LEN_BAD) {
            shameScore++;
        }


        for (let attr of ATTRS) {
            let $col = $row.find('.attr.' + attr);
            let $attr;

            if (!data.pw[attr]) {
                $attr = $col.find('i.attr-false');
            } else {
                $attr = $col.find('i.attr-' + data.pw[attr]);
            }

            if ($attr && $attr.length) {
                $attr.removeClass('hidden');
                shameScore++;
            }
        }

        if (data.scoreplus) {
            shameScore += data.scoreplus;
        }

        // TODO: add comments in abbr
        $row.find('.attr-score')
            .text(shameScore)
            .toggleClass('text-danger', shameScore >= SHAME_SCORE_BAD);
    }


    /**
     * Filters the database using a filter input field.
     */
    function filter($input) {
        let attr = $input.data('filter');
        let val  = $input.val();

        if (!attr || (val.length < 2 && val.length != 0)) {
            return;
        }

        filters       = {};
        filters[attr] = val;

        getResults(filters);
    }

    /**
     * Clears the table and fills it, filtering results (if passed).
     */
    function getResults(filter) {
        filter  = filter || null;
        results = db.filter(filter);

        $list.empty();
        addResults(results);
    }

    /**
     * Appends results to the current table
     */
    function addResults() {
        if (!results) {
            return;
        }

        let site   = results.next();
        let count  = 0;

        while (site && !site.done && site.value && count < MAX_RESULTS) {
            addRow(site.value);
            site = results.next();
            count++;
        }

        $lazySpinner.addClass('hidden');
        $lazyInfo.toggleClass('invisible', site.done);
        $lazyInfo.toggleClass('invisible', site.done);

        if (!site.done) {
            scrollMon.start();
        } else {
            scrollMon.stop();
        }
    }


    /**
     * Initial setup (loading, table population).
     */
    function init() {
        $('#last-update').text(new Date(PWOS_VERSION * 1000));

        $('.filter').keypress(function (event) {
            if (event.which == 13) {
                filter($(this));
            }
        });

        $(window).on('scrolled-to', function (event, $anchor) {
            $lazySpinner.removeClass('hidden');
            setTimeout(function () {
                addResults();
            }, 10)
        });


        $lazyInfo    = $('#lazy-loading-info');
        $lazySpinner = $('#lazy-loading-spinner');
        scrollMon    = new ScrollMonitor($('#lazy-loading-anchor'));


        PWoSDb
            .load(DB_URL)
            .done(function (resultDb) {
                db = resultDb;
                getResults();
            })
            .fail(function () {
                $lazySpinner.addClass('hidden');
                $('#content').append($('<p>').addClass('alert alert-danger').text('Failed to load database'));
            });
    }


    // public interface
    return {
        init: init,

        get db() {
            return db;
        }
    };
})(jQuery);
