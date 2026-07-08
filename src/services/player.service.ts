export type PlayerGameStatsDTO = {
    goalsScored: number;
    yellowCards: number;
    redCards: number;
    assists: number;
}

export type PlayerStatsDTO = {
    id: string;
    name: string;
    totalGoals: number;
    totalYellowCards: number;
    totalRedCards: number;
    totalAssists: number;
    position: string;
    shirtNumber: number;
}

export interface PlayerService{
    addStatsByPlayer(id: string, stats: PlayerGameStatsDTO): Promise<void>;
    list(): Promise<PlayerStatsDTO[]>;
}
