export class Game {
    props;
    constructor(props) {
        this.props = props;
    }
    static create(date, tournament, teams, stadiumName, homeScore, awayScore) {
        validateGame(teams, homeScore, awayScore);
        const normalizedStadium = stadiumName.trim();
        if (!normalizedStadium)
            throw new Error("Stadium name is required");
        return new Game({
            date,
            tournament,
            teams,
            stadiumName: normalizedStadium,
            homeScore,
            awayScore,
        });
    }
    static restore(props) {
        return new Game(props);
    }
    get id() { return this.props.id; }
    get date() { return this.props.date; }
    get tournament() { return this.props.tournament; }
    get teams() { return this.props.teams; }
    get stadiumName() { return this.props.stadiumName; }
    get homeScore() { return this.props.homeScore; }
    get awayScore() { return this.props.awayScore; }
    get homeTeam() {
        return this.props.teams.find(({ side }) => side === "HOME").team;
    }
    get awayTeam() {
        return this.props.teams.find(({ side }) => side === "AWAY").team;
    }
}
function validateGame(teams, homeScore, awayScore) {
    if (homeScore < 0 || awayScore < 0) {
        throw new Error("Scores cannot be negative");
    }
    if (teams.length !== 2) {
        throw new Error("A game must have exactly two teams");
    }
    const home = teams.find(({ side }) => side === "HOME");
    const away = teams.find(({ side }) => side === "AWAY");
    if (!home || !away)
        throw new Error("A game needs HOME and AWAY teams");
    if (home.team.name === away.team.name) {
        throw new Error("A team cannot play against itself");
    }
    if (home.matchScored !== homeScore ||
        home.matchConceded !== awayScore ||
        away.matchScored !== awayScore ||
        away.matchConceded !== homeScore) {
        throw new Error("Team participation statistics must match the score");
    }
}
//# sourceMappingURL=game.js.map