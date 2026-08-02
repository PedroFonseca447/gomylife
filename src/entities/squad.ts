export type SquadPlayerProps = {
  idPlayer: string;
  goalsScored: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  shirtNumber: number;
  position: string;
  whatSide: string;
};

export type SquadProps = {
  squadId?: string;
  gameId: string;
  players: SquadPlayerProps[];
};

export class Squad {
  private constructor(readonly props: SquadProps) {}

  public static create(gameId: string, players: SquadPlayerProps[]) {
    return new Squad({ gameId, players });
  }

  public static restore(props: SquadProps) {
    return new Squad(props);
  }

  public get squadId() {
    return this.props.squadId;
  }

  public get gameId() {
    return this.props.gameId;
  }

  public get players() {
    return this.props.players;
  }
}
