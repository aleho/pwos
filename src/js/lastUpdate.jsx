/**
 * Simple date component.
 */
export default class LastUpdate extends React.PureComponent {
    render() {
        return (
            <span>{this.props.date}</span>
        );
    }
}
