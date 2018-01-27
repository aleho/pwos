import Alert from './alert.jsx';
import LastUpdate from './lastUpdate.jsx';
import PWoSDb from './lib/database.js';
import ScrollMonitor from './scrollMonitor.jsx';
import Table from './table/table.jsx';

const MAX_RESULTS = 30;
const DB_URL = 'data/db.json?v=' + PWOS_VERSION;

/**
 * Main app component.
 */
class App extends React.Component {
    constructor() {
        super();

        this.state = {
            sites:        [],
            isMonitoring: false,
            isLoading:    false,
            errorLoading: false
        }

        this.updateFilter();
        this.loadDb();
    }

    /**
     * Loads the JSON DB.
     */
    loadDb() {
        this.setState({isLoading: true});

        let promise = PWoSDb
            .load(DB_URL)
            .then(resultDb => {
                this.db = resultDb;
                this.getResults();
            })
            .catch(() => {
                this.setState({errorLoading: true, isLoading: false});
            });
    }

    /**
     * Merges the local filter with the object passed in.
     *
     * @param {Object} [filter]
     */
    updateFilter(filter) {
        if (!filter) {
            this.filter = {
                title: '',
                url:   ''
            };

        } else {
            for (let attr in filter) {
                this.filter[attr] = filter[attr];
            }
        }
    }

    /**
     * Clears the table and fills it, filtering results (if passed).
     *
     * @param {Object} filter
     */
    getResults = (filter) => {
        this.updateFilter(filter);
        this.results = this.db.filter(this.filter || null);

        this.setState({isLoading: true, sites: []}, () => {
            this.addResults();
        });
    }

    /**
     * Appends results to the current table
     */
    addResults() {
        if (!this.results) {
            return;
        }

        let sites = this.state.sites.slice();
        let site  = this.results.next();
        let count = 0;

        while (site && !site.done && site.value && count < MAX_RESULTS) {
            sites.push(site.value);
            site = this.results.next();
            count++;
        }

        this.setState({
            sites:        sites,
            isMonitoring: !site.done,
            isLoading:    false
        });
    }

    onLoadMore = () => {
        this.addResults();
    }

    render() {
        return (<>
            <div class="table-responsive-sm" id="sites-table">
                <Table
                    sites={this.state.sites || []}
                    onFilter={this.getResults}
                    delayMod={MAX_RESULTS}
                />

                <Alert errorLoading={this.state.errorLoading || false} />
            </div>

            <ScrollMonitor
                isMonitoring={this.state.isMonitoring || false}
                isLoading={this.state.isLoading || false}
                onLoadMore={this.onLoadMore}
            />
        </>);
    }
}


ReactDOM.render(<App />, document.getElementById('app'));

const LAST_UPDATE = new Date(PWOS_VERSION * 1000);
ReactDOM.render(<LastUpdate date={LAST_UPDATE.toString()} />, document.getElementById('last-update'));
