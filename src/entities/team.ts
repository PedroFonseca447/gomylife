export type TeamProps = {
  id: string;
  name: string;
  colorPrimary: string;
  colorSecondary: string;
  allTimeScored: number;
  allTimeConceded: number;
};


export type TeamInGameStats = {
    matchScored: number,
    matchConceded: number,
}

export class Team {
  private constructor(readonly props: TeamProps) {}

  public static create(

    //recebe apenas os dados necessarios para criar um novo time 
    id: string,
    name: string,
    colorPrimary: string,
    colorSecondary: string,
    allTimeScored: number,
    allTimeConceded: number,
  ) {
    return new Team({ // o novo time e com o acesso ao que era privado no construtor
      id,
      name,
      colorPrimary,
      colorSecondary,
      allTimeScored,
      allTimeConceded,
    });
  }

  public static restore(props: TeamProps) {
    return new Team(props);
  }


  public get idTeam(){
    return this.props.id;
  }

  public get teamName(){
    return this.props.name;
  }

  public get colorPrimary(){
    return this.props.colorPrimary;
  }

  public get colorSecondary(){
    return this.props.colorSecondary;
  }


  public get allTimeTeamScored(){
    return this.props.allTimeScored;
  }

  public get allTimeTeamConceded(){
    return this.props.allTimeConceded;
  }


  public  addTeamStats(teamStats: TeamInGameStats){
    this.props.allTimeScored += teamStats.matchScored;
    this.props.allTimeConceded += teamStats.matchConceded;
  }


  //pq nao temos settes, sao classes anemicas, classes que fazem sentido para se alterar os dados ai sim sao anemicas
}
