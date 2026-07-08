import { Squad } from "../../entities/squad.js";
import type { SquadRepository } from "../../repositories/squad.repository.js";
import type { PlayerStatsDTO } from "../player.service.js";
import type { SquadService } from "../squad.service.js";
import type {SquadDTO} from "../squad.service.js";



export class SquadServiceImplementation  implements SquadService {
    private constructor(readonly repository: SquadRepository){
    }

    public static build(repository: SquadRepository){
        return new SquadServiceImplementation(repository);
     }

     public async getSquad(gameId: string, reference: "home" | "away"){
        const squad = await this.repository.findSquad(gameId, reference);
        if(!squad){
            throw new Error(`Squad ${reference} do jogo ${gameId} não encontrado`);
        }

        const outPutSquad: SquadDTO = {
            reference: squad.reference,
            gameId: squad.gameId,
            squad: squad.playersSquad.map((player) => ({
                id: player.playerId,
                name: player.playerName,
                totalGoals: player.goalsScored,
                totalYellowCards: player.yellowCards,
                totalRedCards: player.redCards,
                totalAssists: player.assists,
                position: player.position,
                shirtNumber: player.shirtNumber,
            }))
                
        }
        return outPutSquad;
       }


       public async addSquad(gameId: string, reference: "home" | "away", squad: PlayerStatsDTO[]): Promise<void> {
            const newSquad = Squad.create(reference, gameId, squad.map((player) => ({
                playerId: player.id,
                playerName: player.name,
                goalsScored: player.totalGoals,
                assists: player.totalAssists,
                yellowCards: player.totalYellowCards,
                redCards: player.totalRedCards,
                position: player.position,
                shirtNumber: player.shirtNumber,
            })));
            await this.repository.save(newSquad);
       }
}


