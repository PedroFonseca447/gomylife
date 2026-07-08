export type TournamentDTO = {
    id: string;
    name: string;
    country: string;
}


export interface TournamentService{
    list(): Promise<TournamentDTO[]>;
    addTournament(name: string, country: string, id: string): Promise<void>;
    getTournament(id: string): Promise<TournamentDTO | null>;

}