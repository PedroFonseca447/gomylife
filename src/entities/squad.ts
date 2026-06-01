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
    playersSquad: SquadPlayerProps[],
}

export class Squad{
    private constructor(readonly props: SquadProps){
    }

    public static create(reference: "home" | "away", playersSquad: SquadPlayerProps[]){
        return new Squad({
            reference,
            playersSquad,
        })
    }

    public static restore(props: SquadProps){
        return new Squad(props);
    }

    public get reference(){
        return this.props.reference;
    }

    public get playersSquad(){
        return this.props.playersSquad;
    }
}
