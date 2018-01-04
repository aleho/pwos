var ScrollMonitor = function ($element) {
    if (!$element) {
        return;
    }

    this.uid      = ++ScrollMonitor.uid;
    this.$element = $element;
};

ScrollMonitor.uid = 0;
ScrollMonitor.prototype.isMonitoring = false;
ScrollMonitor.prototype.uid = 0;
ScrollMonitor.prototype.$element = null;


/**
 * Checks whether out element is visible in the viewport.
 */
ScrollMonitor.prototype._isScrolledTo = function () {
    let anchorTop    = this.$element.offset().top;
    let screenBottom = $(window).scrollTop() + $(window).height();

    return (screenBottom > anchorTop);
};

/**
 * Starts monitoring.
 */
ScrollMonitor.prototype.start = function () {
    if (!this.uid || this.isMonitoring) {
        return;
    }

    this.isMonitoring = true;

    $(window).on('scroll.lazyload-' + this.uid, function () {
        if (!this._isScrolledTo(this.$element)) {
            return;
        }

        this.stop();
        $(window).trigger('scrolled-to', [ this.$element, this ]);
    }.bind(this));
};

/**
 * Stops all events related to lazy loading.
 */
ScrollMonitor.prototype.stop = function () {
    if (!this.uid || !this.isMonitoring) {
        return;
    }

    this.isMonitoring = false;
    $(window).off('scroll.lazyload-' + this.uid);
};
