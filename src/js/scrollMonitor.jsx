/**
 * Scroll monitor component
 */
export default class ScrollMonitor extends React.Component {
    constructor() {
        super();

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    isScrolledTo() {
        if (!this.anchor) {
            return false;
        }

        let anchorBottom = this.anchor.offsetTop + (this.anchor.offsetHeight || 0 * 2);
        let screenBottom = (window.pageYOffset + window.innerHeight) || 0;

        return (screenBottom > anchorBottom);
    }

    handleScroll(event) {
        if (!this.props.isMonitoring
            || this.props.isLoading
            || !this.isScrolledTo()
        ) {
            return;
        }

        this.props.onLoadMore(event);
    }

    render() {
        return (
            <div ref={anchor => { this.anchor = anchor; }}>
                <div role="alert"
                    class={'alert alert-light ' + (!this.props.isMonitoring ? 'invisible' : '')}
                >
                    More entries available. Scroll to load.
                </div>

                <div role="alert"
                    class={'alert alert-light ' + (!this.props.isLoading ? 'hidden' : '')}
                >
                    <div class="d-flex flex-row">
                        <div class="align-self-center pr-3">
                            <i class="fas fa-spinner fa-pulse fa-2x"></i>
                        </div>
                        <div class="align-self-center">
                            Loading entries…
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
