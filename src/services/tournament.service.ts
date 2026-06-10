export type TournamentDTO = {
    id: string;
    name: string;
    country: string;
}


export interface TournamentService{
    list(): Promise<TournamentDTO[]>;
}