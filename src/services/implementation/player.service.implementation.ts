import type { PlayerRepository } from "../../repositories/player.repository.js";
import type { PlayerGameStatsDTO, PlayerService, PlayerStatsDTO } from "../player.service.js";

export class PlayerServiceImplementation implements PlayerService{
   private constructor(readonly repository: PlayerRepository){
   }

   public static build(repository: PlayerRepository){
        return new PlayerServiceImplementation(repository);
   }

   public async addStatsByPlayer(id: string, stats: PlayerGameStatsDTO): Promise<void> {
        
        const aPlayer = await this.repository.find(id);

        if(!aPlayer){
            throw new Error(`Player ${id} not found`);
        }

        aPlayer.addGameStats(stats);
        
        await this.repository.update(aPlayer);
   }

   public async list(): Promise<PlayerStatsDTO[]>{
        const players = await this.repository.list();

        return players.map((player) => ({
            id: player.id,
            name: player.name,
            totalGoals: player.totalGoals,
            totalYellowCards: player.totalYellowCards,
            totalRedCards: player.totalRedCards,
            totalAssists: player.totalAssists,
        }));
   };
}
