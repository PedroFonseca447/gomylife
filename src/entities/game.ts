import type { Team } from "./team.js";
import type { Tournament } from "./tournament.js";

export type TeamSide = "HOME" | "AWAY";

export type GameTeamParticipation = {
  team: Team;
  side: TeamSide;
  matchScored: number;
  matchConceded: number;
};

export type GameProps = {
  id?: string;
  date: Date;
  tournament: Tournament;
  teams: GameTeamParticipation[];
  stadiumName: string;
  homeScore: number;
  awayScore: number;
};

export class Game {
  private constructor(readonly props: GameProps) {}

  public static create(
    date: Date,
    tournament: Tournament,
    teams: GameTeamParticipation[],
    stadiumName: string,
    homeScore: number,
    awayScore: number,
  ) {
    validateGame(teams, homeScore, awayScore);
    const normalizedStadium = stadiumName.trim();
    if (!normalizedStadium) throw new Error("Stadium name is required");

    return new Game({
      date,
      tournament,
      teams,
      stadiumName: normalizedStadium,
      homeScore,
      awayScore,
    });
  }

  public static restore(props: GameProps & { id: string }) {
    return new Game(props);
  }

  public get id() { return this.props.id; }
  public get date() { return this.props.date; }
  public get tournament() { return this.props.tournament; }
  public get teams() { return this.props.teams; }
  public get stadiumName() { return this.props.stadiumName; }
  public get homeScore() { return this.props.homeScore; }
  public get awayScore() { return this.props.awayScore; }
  public get homeTeam() {
    return this.props.teams.find(({ side }) => side === "HOME")!.team;
  }
  public get awayTeam() {
    return this.props.teams.find(({ side }) => side === "AWAY")!.team;
  }
}

function validateGame(
  teams: GameTeamParticipation[],
  homeScore: number,
  awayScore: number,
) {
  if (homeScore < 0 || awayScore < 0) {
    throw new Error("Scores cannot be negative");
  }
  if (teams.length !== 2) {
    throw new Error("A game must have exactly two teams");
  }

  const home = teams.find(({ side }) => side === "HOME");
  const away = teams.find(({ side }) => side === "AWAY");
  if (!home || !away) throw new Error("A game needs HOME and AWAY teams");
  if (home.team.name === away.team.name) {
    throw new Error("A team cannot play against itself");
  }
  if (
    home.matchScored !== homeScore ||
    home.matchConceded !== awayScore ||
    away.matchScored !== awayScore ||
    away.matchConceded !== homeScore
  ) {
    throw new Error("Team participation statistics must match the score");
  }
}