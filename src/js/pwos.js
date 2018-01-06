var PWoS = (function ($) {
    const MAX_RESULTS = 30;

    const DB_URL = 'data/db.json?v=' + PWOS_VERSION;

    const $filters = $('.filter');
    const table    = new Table($('#sites-list'), $('#site-template tr'));

    let db;
    let scrollMon;
    let filters;
    let results;
    let $lazyInfo;
    let $lazySpinner;


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

        table.empty();
        addResults();
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
            table.addRow(site.value);
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
        init: init
    };
})(jQuery);
