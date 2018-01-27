/**
 * Table filter component.
 */
export default class Filter extends React.Component {
    constructor() {
        super();
    }

    handleFilter = (event) => {
        if (!event.target || event.key !== 'Enter') {
            return;
        }

        let val = event.target.value;

        if (!this.props.attr || (val.length < 2 && val.length != 0)) {
            return;
        }

        let filter = {};
        filter[this.props.attr] = val;

        this.props.onFilter(filter);
    }

    render() {
        let label = this.props.label;
        let icon  = this.props.icon ? <i class={'fas fa-fw ' + this.props.icon}></i> : '';

        return (
            <th scope="col">
                <div class="row no-gutters align-items-end">
                    <div class="col-md col-md-auto mr-md-2">
                        {icon}{label}
                    </div>
                    <div class="col col-xl-7">
                        <input type="search" class="filter form-control form-control-sm" placeholder="filter"
                            onKeyPress={this.handleFilter}
                        />
                    </div>
                </div>
            </th>
        );
    }
}
