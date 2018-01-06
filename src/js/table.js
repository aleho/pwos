var Table = function ($element, $rowTemplate) {
    if (!$element || !$rowTemplate) {
        return;
    }

    this.$element     = $element;
    this.$rowTemplate = $rowTemplate;
};

Table.MIN_LEN_BAD     = 5;
Table.MAX_LEN_BAD     = 16;
Table.SHAME_SCORE_BAD = 3;
Table.ATTRS           = [
    'alpha', 'digit', 'space', 'special', 'case', 'changeable'
];

Table.prototype.$element     = null;
Table.prototype.$rowTemplate = null;


/**
 * Empties the table.
 */
Table.prototype.empty = function () {
    this.$element.empty();
};


/**
 * Adds a row to the table.
 */
Table.prototype.addRow = function (data) {
    let $row       = this.$rowTemplate.clone().appendTo(this.$element);
    let shameScore = 0;

    $row.find('.title').text(data.title);

    $row.find('a.url')
        .attr('href', data.url)
        .find('.url-text')
        .text(data.url.replace(/^https?\:\/\//i, ''));


    $row.find('.attr.min')
        .text(data.pw.min)
        .toggleClass('text-danger', data.pw.min <= Table.MIN_LEN_BAD);

    $row.find('.attr.max')
        .text(data.pw.max)
        .toggleClass('text-danger', data.pw.max <= Table.MAX_LEN_BAD);

    if (data.pw.min <= Table.MIN_LEN_BAD) {
        shameScore++;
    }

    if (data.pw.max <= Table.MAX_LEN_BAD) {
        shameScore++;
    }


    for (let attr of Table.ATTRS) {
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

    // TODO: add comments in modal (?)
    $row.find('.attr-score')
        .text(shameScore)
        .toggleClass('text-danger', shameScore >= Table.SHAME_SCORE_BAD);
};
