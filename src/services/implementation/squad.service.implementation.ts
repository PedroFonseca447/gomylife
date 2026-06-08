import type { SquadRepository } from "../../repositories/squad.repository.js";
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
                name: player.playerId,
                totalGoals: player.goalsScored,
                totalYellowCards: player.yellowCards,
                totalRedCards: player.redCards,
                totalAssists: player.assists,
            }))
                
        }
        return outPutSquad;
       }


        }


