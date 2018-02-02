import Filter from './filter.jsx';

/**
 * Table header component.
 */
export default class Header extends React.PureComponent {
    render() {
        return (
            <thead>
                <tr>
                    <Filter attr="title" label="Site" onFilter={this.props.onFilter} />
                    <Filter attr="url" icon="fa-globe" onFilter={this.props.onFilter} />

                    <th scope="col" class="attr"><i class="fas fa-fw fa-step-backward" title="min length"></i></th>
                    <th scope="col" class="attr"><i class="fas fa-fw fa-step-forward" title="max length"></i></th>
                    <th scope="col" class="attr"><span title="alphabetical letters">A–Z</span></th>
                    <th scope="col" class="attr"><span title="digits">0–9</span></th>
                    <th scope="col" class="attr"><span title="spaces">__</span></th>
                    <th scope="col" class="attr"><span title="special characters">!#?</span></th>
                    <th scope="col" class="attr"><span title="case sensitive">Aa</span></th>
                    <th scope="col" class="attr"><i class="fas fa-fw fa-pencil-alt" title="changeable"></i></th>
                    <th scope="col" class="attr"><span title="two-factor-authentication">2fa</span></th>

                    <th scope="col" class="attr"><i class="fas fa-crosshairs" title="shame score"></i></th>
                </tr>
            </thead>
        );
    }
}
