(function ($) {
    let $last;

    function hideTooltip($element) {
        clearTimeout($element.data('tt-timeout'));

        $element.data('tt-timeout', null);
        $element.tooltip('dispose');
    }

    function showTooltip($element) {
        if ($last) {
            clearTimeout($last.data('tt-timeout'));
            $last.data('tt-timeout', null);
        }

        if (!$element.is($last)) {
            if ($last) {
                $last.tooltip('dispose');
            }

            $element.tooltip('show');
        }

        $last = $element;

        let timeout = setTimeout(function () {
            clearTimeout($element.data('tt-timeout'));
            $element.data('tt-timeout', null);
            $element.tooltip('dispose');
            $last = null;
        }, 2000);

        $element.data('tt-timeout', timeout);
    }


    // lazy touch-friendlyness
    let hasTouch = ('ontouchstart' in document.documentElement);

    if (hasTouch) {
        $('body').addClass('hastouch');
        $(document).on('touchend', '[title]', function () {
            showTooltip($(this));
        });
    }

})(jQuery);
