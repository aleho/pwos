import Attr from './attr.jsx';

/**
 * Table row component.
 *
 * TODO: add comments in modal (?)
 */
export default class Row extends React.PureComponent {
    static MIN_LEN_BAD     = 5;
    static MAX_LEN_BAD     = 16;
    static SHAME_SCORE_BAD = 3;
    static ATTRS           = [
        'alpha', 'digit', 'space', 'special', 'case', 'changeable', '2fa'
    ];

    constructor(props) {
        super(props);
        this.state = {visible: !this.isDelayed()};

        this.shameScore = 0;

        if (props.pw.min <= Row.MIN_LEN_BAD) {
            this.shameScore++;
        }

        if (props.pw.max <= Row.MAX_LEN_BAD) {
            this.shameScore++;
        }

        for (const attr of Row.ATTRS) {
            // not there means false, supported attributes are explicitly set to true or onchange
            if (!(attr in props.pw)) {
                this.shameScore += 1;

            } else if (props.pw[attr] === 'onchange') {
                this.shameScore += 0.5;

            } else if (props.pw[attr] !== true) {
                this.shameScore += 1;
            }
        }

        if (props.scoreplus) {
            this.shameScore += props.scoreplus;
        }
    }

    isDelayed() {
        return ((!this.state || !this.state.visible)
            && this.props.animate === true
            && this.props.delay > 0
        );
    }

    componentWillMount() {
        if (this.props.animate) {
            if (this.isDelayed()) {
                setTimeout(() => {
                    this.show()
                }, this.props.delay);
            } else {
                this.show();
            }
        }
    }

    show() {
        this.setState({visible: true});
    }

    render() {
        let rowClasses = '';
        if (this.state.visible === false) {
            rowClasses = 'invisible';

        } else if (this.props.animate) {
            rowClasses = 'fadeIn animated';
        }

        const displayUrl = this.props.url
            .replace(/^https?\:\/\//i, '')
            .replace(/()*\/$/, '$1');

        const attributes = Row.ATTRS.map((attr, index) =>
            <Attr name={attr} value={this.props.pw[attr]} key={index} />
        );

        return (
            <tr id={'site-' + this.props.id} class={rowClasses}>
                <td class="title">{this.props.title}</td>
                <td>
                    <a href={this.props.url} class="url d-none d-md-block text-truncate" target="_blank">
                        {displayUrl}
                    </a>
                    <a href="#" class="url d-inline d-md-none" target="_blank">
                        <i class="fas fa-fw fa-external-link-alt"></i>
                    </a>
                </td>

                <td class={'attr min ' + (this.props.pw.min <= Row.MIN_LEN_BAD ? 'text-danger' : '')}>{this.props.pw.min}</td>
                <td class={'attr max ' + (this.props.pw.max <= Row.MAX_LEN_BAD ? 'text-danger' : '')}>{this.props.pw.max}</td>

                {attributes}

                <td class="pl-3">
                    <span class={'text-bold attr-score ' + (this.shameScore >= Row.SHAME_SCORE_BAD ? 'text-danger' : '')}>
                        {this.shameScore}</span><small>&nbsp;/&nbsp;{Row.ATTRS.length + 2}
                    </small>
                </td>
            </tr>
        );
    }
}
