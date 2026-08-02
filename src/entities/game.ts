import type { SquadProps } from "./squad.js";

export type GameProps = {
  id: string;
  date: string;
  tournamentId: string;
  homeTeamId: string;
  awayTeamId: string;
  stadiumName: string;
  teams: TeamGameData[];
  homeScore: number;
  awayScore: number;
  squads: SquadProps;
};

export type TeamGameData = {
    side: string,
    matchScored: number,
    matchConceded: number,
    idGame: string, 
    idTeam: string
}


//Essa classe posui alguns atributos

export class Game {

  private constructor(readonly props: GameProps) {
    // essa classe so possui um atribuito de props que é tipado por gameprops
  }

  public static create(
    date: string,
    tournamentId: string,
    homeTeamId: string,
    awayTeamId: string,
    stadiumName: string,
    teams: TeamGameData[],
    homeScore: number,
    awayScore: number,
    squads: SquadProps,
  ) {
    return new Game({
      id: crypto.randomUUID().toString(),
      date,
      tournamentId,
      homeTeamId,
      awayTeamId,
      stadiumName,
      teams,
      homeScore,
      awayScore,
      squads
    });
  }

  public static restore(props: GameProps) { // construtor feito para persistir os dados no banco de dados, ele recebe os dados do banco e restaura a entidade
    return new Game(props);
  }

  public get id() {
    return this.props.id;
  }

  public get date() {
    return this.props.date;
  }

  public get tournamentId() {
    return this.props.tournamentId;
  }


  public get homeTeamId() {
    return this.props.homeTeamId;
  }

  public get awayTeamId() {
    return this.props.awayTeamId;
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

  public get teams() {
    return this.props.teams;
  }

  public get squad() {
    return this.props.squads;
  }
}
