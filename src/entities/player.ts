export type PlayerProps = {
  id: string;
  name: string;
  totalGoals: number;
  totalYellowCards: number;
  totalRedCards: number;
  totalAssists: number;
};

export type PlayerGameStats = {
  goalsScored: number;
  yellowCards: number;
  redCards: number;
  assists: number;
};

export class Player {
  private constructor(readonly props: PlayerProps) {}

  public static create(id: string, name: string) {
    return new Player({
      id,
      name,
      totalGoals: 0,
      totalYellowCards: 0,
      totalRedCards: 0,
      totalAssists: 0,
    });
  }

  public static restore(props: PlayerProps) {
    return new Player(props);
  }

  public get id() {
    return this.props.id;
  }

  public get name() {
    return this.props.name;
  }

  public get totalGoals() {
    return this.props.totalGoals;
  }

  public get totalYellowCards() {
    return this.props.totalYellowCards;
  }

  public get totalRedCards() {
    return this.props.totalRedCards;
  }

  public get totalAssists() {
    return this.props.totalAssists;
  }

  public addGameStats(stats: PlayerGameStats) {
    const values = [
      stats.goalsScored,
      stats.yellowCards,
      stats.redCards,
      stats.assists,
    ];

    if (values.some((value) => value < 0)) {
      throw new Error("Player stats must be greater than or equal to zero");
    }

    this.props.totalGoals += stats.goalsScored;
    this.props.totalAssists += stats.assists;
    this.props.totalYellowCards += stats.yellowCards;
    this.props.totalRedCards += stats.redCards;
  }
}
