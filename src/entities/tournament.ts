export type propsTournament = {
    id: string,
    name: string,
    country: string
}


export class Tournament{
    private constructor(readonly props: propsTournament){

    }

    public static create(id: string, name: string, country: string){
        return new Tournament({
            id,
            name,
            country
        })
    }

    public get id(){
        return this.props.id;
    }
    public get name(){
        return this.props.name;
    }
    public get country(){
        return this.props.country;
    }
}
