import Header from './header.jsx';
import Body from './body.jsx';

/**
 * Sites table component.
 */
export default class Table extends React.PureComponent {
    render() {
        return (
            <table class="table table-hover table-sm">
                <Header
                    onFilter={this.props.onFilter}
                />
                <Body
                    sites={this.props.sites}
                    delayMod={this.props.delayMod}
                />
            </table>
        );
    }
}
