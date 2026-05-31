import type { propsTournament } from "./tournament.js";

export type GameProps = {
  id: string;
  data: string;
  tournamentObject: propsTournament;
  homeTeamName: string;
  awayTeamName: string;
  stadiumName: string;
  homeScore: number;
  awayScore: number;
};

export class Game {
  private constructor(readonly props: GameProps) {
    // essa classe so possui um atribuito de props que é tipado por gameprops
  }

  public static create(
    data: string,
    tournamentObject: propsTournament,
    homeTeamName: string,
    awayTeamName: string,
    stadiumName: string,
    homeScore: number,
    awayScore: number
  ) {
    return new Game({
      id: crypto.randomUUID().toString(),
      data,
      tournamentObject,
      homeTeamName,
      awayTeamName,
      stadiumName,
      homeScore,
      awayScore,
    });
  }

  public get id() {
    return this.props.id;
  }

  public get data() {
    return this.props.data;
  }

  public get tournamentObject() {
    return this.props.tournamentObject;
  }

  public get tournamentName(){
    return this.props.tournamentObject.name
  }

  public get homeTeamName() {
    return this.props.homeTeamName;
  }

  public get awayTeamName() {
    return this.props.awayTeamName;
  }

  public get stadiumName() {
    return this.props.stadiumName;
  }

  public get homeScore(){
    return this.props.homeScore;
  }

  public get awayScore(){
    return this.props.awayScore;
  }
}
