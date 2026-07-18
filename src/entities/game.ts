import type { SquadProps } from "./squad.js";
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
  homeSquad: SquadProps;
  awaySquad: SquadProps;
};


//Essa classe posui alguns atributos

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
    awayScore: number,
    homeSquad: SquadProps,
    awaySquad: SquadProps,
    
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
      homeSquad,
      awaySquad,
    });
  }

  public static restore(props: GameProps) { // construtor feito para persistir os dados no banco de dados, ele recebe os dados do banco e restaura a entidade
    return new Game(props);
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

  public get homeSquad(){
    return this.props.homeSquad;
  }

  public get awaySquad(){
    return this.props.awaySquad;
  }
}
