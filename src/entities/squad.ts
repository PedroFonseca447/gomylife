export type SquadPlayerProps = {
    playerId: string,
    goalsScored: number,
    assists: number,
    yellowCards: number,
    redCards: number,
    shirtNumber: number,
    position: string,
}

export type SquadProps ={
    reference: "home" | "away",
    gameId: string,
    playersSquad: SquadPlayerProps[],
}

export class Squad{
    private constructor(readonly props: SquadProps){
    }

    public static create(reference: "home" | "away", gameId: string, playersSquad: SquadPlayerProps[]){
        return new Squad({
            reference,
            gameId,
            playersSquad,
        })
    }

    public static restore(props: SquadProps){
        return new Squad(props);
    }

    public get reference(){
        return this.props.reference;
    }
    public get gameId(){
        return this.props.gameId;
    }
    public get playersSquad(){
        return this.props.playersSquad;
    }
}
