import type { PrismaClient } from "../../generated/prisma/client.js";
import type { Squad } from "../../entities/squad";
import type { SquadRepository } from "../squad.repository";

export class SquadPrismaRepository implements SquadRepository {


    private constructor(readonly prisma: PrismaClient){}

    public build (prisma: PrismaClient){
        return new SquadPrismaRepository(prisma);
    }


    public async findSquad(gameId: string, reference: "home" | "away"): Promise<Squad | undefined> {
        throw new Error("Method not implemented.");
    }
    
    public async save(squad: Squad): Promise<void> {

        const newSquad = {
            reference: squad.reference,
            gameId: squad.gameId,
            playerSquad: squad.playersSquad
        }

        await this.prisma.squad.create({
            data: {
                gameId: newSquad.gameId,
                reference: newSquad.reference,                
                players: {
                    create: squad.playersSquad.map((player) => ({
                        shirtNumber: player.shirtNumber,
                        position: player.position,
                        player: {
                            connectOrCreate : {
                                where: {
                                    id: player.playerId,
                                },
                                create: {
                                    id: player.playerId,
                                    name: player.playerName,
                                    totalGoals: player.goalsScored,
                                    totalAssists: player.assists,
                                    totalYellowCards: player.yellowCards,
                                    totalRedCards: player.redCards,

                                },
                            }
                        }
                    })) 
                },
            }
        })
 

    }
    public async list(): Promise<Squad[]> {
        throw new Error("Method not implemented.");
    }
    public async update(squad: Squad): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public async find(id: string): Promise<Squad | undefined> { // aqui passa id e time
        throw new Error("Method not implemented.");
    }
}
