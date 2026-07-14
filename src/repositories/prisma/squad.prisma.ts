import type {  PrismaClient } from "../../generated/prisma/client.js";
import { Squad } from "../../entities/squad";
import type { SquadRepository } from "../squad.repository";
import type { SquadPlayer } from "../../generated/prisma/browser.js";

export class SquadPrismaRepository implements SquadRepository {


    private constructor(readonly prisma: PrismaClient){}

    public build (prisma: PrismaClient){
        return new SquadPrismaRepository(prisma);
    }


    public async findSquad(gameId: string, reference: "home" | "away"): Promise<Squad | null> {
      
        const objFind = {
            id: gameId,
            referenceGame: reference,
        }
      
        const squadGame = await this.prisma.squad.findFirst({
            where: {
                gameId: objFind.id,
                reference: objFind.referenceGame
            },
            //obribado a usar o include para montar o objeto
            include: {
                players: {
                    include: {
                        player:true
                    }
                }
            }
      })

      if(!squadGame){
            return null;
      }

      if (squadGame.reference !== "home" && squadGame.reference !== "away") {
        throw new Error(`Referência de squad inválida: ${squadGame.reference}`);
      }

      return Squad.restore({ // um metodo ja criado por nos, que apenas pega a volta de obj do prisma e computa isso para um restore : )
            gameId: squadGame.gameId,
            reference: squadGame.reference,
            playersSquad: squadGame.players.map((squadPlayer) => ({
            playerId: squadPlayer.playerId,
            playerName: squadPlayer.player.name,
            goalsScored: squadPlayer.goalsScored,
            assists: squadPlayer.assists,
            yellowCards: squadPlayer.yellowCards,
            redCards: squadPlayer.redCards,
            shirtNumber: squadPlayer.shirtNumber ?? 0,
            position: squadPlayer.position ?? "",
            })),
        });

       
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
                        goalsScored: player.goalsScored,
                        assists: player.assists,
                        yellowCards: player.yellowCards,
                        redCards: player.redCards,
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
    public async updatePlayer(gameID: string, reference: string, playerId: string, player: SquadPlayer): Promise<void> { // foca em ajustar um jogador por partida

            const upPlayer = {
                position: player.position,
                number: player.shirtNumber
            }


            const squadGame = await this.prisma.squad.findFirst({
                    where: {
                        gameId: gameID,
                        reference: reference
                    },
                    //obribado a usar o include para montar o objeto
                    include: {
                        players: {
                            include: {
                                player:true
                            }
                        }
                    }
            })

            if(!squadGame){
                    return;
            }

            //confere se elçe ta no jogo
            const squadPlayer = await this.prisma.squadPlayer.findFirst({
                where:{
                    squadId: squadGame.id,
                    playerId
                }
            })

            if(!squadPlayer){
                return;
            }
            // se sim cata ele na tabela do squadPlayer vinculado ao jogo e atualiza na tab temporaria
            await this.prisma.squadPlayer.update({
                where: {
                    id: squadPlayer.id
                },
                data:{
                    position: upPlayer.position,
                    shirtNumber: upPlayer.number
                }
            })

     
    }
    public async find(id: string): Promise<Squad | undefined> { // aqui passa id e time
        throw new Error("Method not implemented.");
    }
}
