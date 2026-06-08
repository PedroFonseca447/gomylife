import type { PlayerStatsDTO } from "./player.service.js";
export type SquadDTO = {
    reference: "home" | "away",
    gameId: string,
    squad: PlayerStatsDTO[],
    }
export interface SquadService{
    getSquad(gameId: string, reference: "home" | "away"): Promise<SquadDTO>;
    
}