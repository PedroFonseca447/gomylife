/* 
a ideia nesse arquivo e na camada service é criar um ponto que serve de interface para 
indicar e descrever que métodos vamos ter na aplicação, exemplo um de procurar a partida pelo id do produto
*/



export type matchDTO ={
    reference: string,
    playersSquad: SquadPlayerDTO[],
}


export type SquadPlayerDTO = {
    playerId: string,
    goalsScored: number,
    assists: number,
    yellowCards: number,
    redCards: number,
    shirtNumber: number,
    position: string,
}


export type gameDTO = { 
    id: string;
    data: string;
    tournamentObject: tournamentDTO;
    homeTeamName: string;
    awayTeamName: string;
    stadiumName: string;
    homeScore: number;
    awayScore: number;
}

export type tournamentDTO = {
    name: string,
    country: string
}

export type listGamesDTO ={
    games: {
         id: string;
    data: string;
    tournamentObject: tournamentDTO;
    homeTeamName: string;
    awayTeamName: string;
    homeSquad: matchDTO;
    awaySquad: matchDTO;
    stadiumName: string;
    homeScore: number;
    awayScore: number;
    }[]
};

export interface GameService{
    getGame(id: string): Promise<gameDTO>;
    listAllGames(): Promise<listGamesDTO>; // contrato para o serviço do produto agora dentro do implementation vamos o organizar
}