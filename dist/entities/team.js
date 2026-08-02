export class Team {
    props;
    constructor(props) {
        this.props = props;
    }
    static create(name, colorPrimary, colorSecondary) {
        return new Team({
            name: required(name, "Team name"),
            colorPrimary: required(colorPrimary, "Primary color"),
            colorSecondary: required(colorSecondary, "Secondary color"),
            allTimeScored: 0,
            allTimeConceded: 0,
        });
    }
    static restore(props) {
        return new Team(props);
    }
    get id() { return this.props.id; }
    get name() { return this.props.name; }
    get colorPrimary() { return this.props.colorPrimary; }
    get colorSecondary() { return this.props.colorSecondary; }
    get allTimeScored() { return this.props.allTimeScored; }
    get allTimeConceded() { return this.props.allTimeConceded; }
}
function required(value, field) {
    const normalized = value.trim();
    if (!normalized)
        throw new Error(`${field} is required`);
    return normalized;
}
//# sourceMappingURL=team.js.map