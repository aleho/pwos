/**
 * Alert component.
 */
export default class Alert extends React.Component {
    render() {
        if (this.props.errorLoading !== true) {
            return null;
        }

        return (<p role="alert" class="alert alert-danger">Failed to load database</p>);
    }
}
