export class Tournament {
    props;
    constructor(props) {
        this.props = props;
    }
    static create(name, country, year) {
        return new Tournament({
            name: required(name, "Tournament name"),
            country: required(country, "Tournament country"),
            year: required(year, "Tournament year"),
        });
    }
    static restore(props) {
        return new Tournament(props);
    }
    get id() { return this.props.id; }
    get name() { return this.props.name; }
    get country() { return this.props.country; }
    get year() { return this.props.year; }
}
function required(value, field) {
    const normalized = value.trim();
    if (!normalized)
        throw new Error(`${field} is required`);
    return normalized;
}
//# sourceMappingURL=tournament.js.map