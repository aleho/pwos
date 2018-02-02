/**
 * Table attribute component.
 */
export default class Attr extends React.PureComponent {
    render() {
        let icon = '';

        if (this.props.value !== false && this.props.value !== undefined) {
            if (this.props.value === 'onchange') {
                icon = <i class="far fa-fw fa-dot-circle text-muted attr-onchange"></i>;
            }

        } else {
            icon = <i class="far fa-fw fa-times-circle text-danger attr-false"></i>;
        }

        return (
            <td class={'attr ' + this.props.name}>
                {icon}
            </td>
        );
    }
}
