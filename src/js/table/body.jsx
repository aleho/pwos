import Row from './row.jsx';

/**
 * Table body component.
 */
export default class Body extends React.Component {
    render() {
        let rows = this.props.sites.map((site, index) =>
            <Row
                key={site.id}
                id={site.id}
                title={site.title}
                url={site.url}
                pw={site.pw}
                animate={true}
                delay={(index % this.props.delayMod) * 30}
            />
        );

        return (
            <tbody>{rows}</tbody>
        );
    }
}
