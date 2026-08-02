import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { PlayerRepository } from "../player.repository";
import { Player } from "../../../entities/player";
type PlayerRecord = {
  idPlayer: string;
  name: string;
  totalGoals: number;
  totalYellowCards: number;
  totalRedCards: number;
  totalAssists: number;
};

export class PlayerRepositoryPrisma implements PlayerRepository {
  private constructor(readonly prisma: PrismaClient) {}

  public static build(prisma: PrismaClient) {
    return new PlayerRepositoryPrisma(prisma);
  }

  public async save(player: Player) {
    const newPlayerObj = {
      idPlayer: player.id,
      name: player.name,
      totalGoals: player.totalGoals,
      totalAssists: player.totalAssists,
      totalRedCards: player.totalRedCards,
      totalYellowCards: player.totalYellowCards,
    };

    //consult if player already exist

    const playerExist = await this.prisma.player.findUnique({
      where: {
        idPlayer: newPlayerObj.idPlayer,
      },
    });

    if (playerExist) {
      throw new Error("This player already be registered in service");
    }

    await this.prisma.player.create({
      data: {
        idPlayer: newPlayerObj.idPlayer,
        name: newPlayerObj.name,
        totalGoals: newPlayerObj.totalGoals,
        totalAssists: newPlayerObj.totalAssists,
        totalRedCards: newPlayerObj.totalRedCards,
        totalYellowCards: newPlayerObj.totalYellowCards,
      },
    });
  }

  public async list(): Promise<Player[]> {
    const allPlayersBase = await this.prisma.player.findMany();

    const players: Player[] = allPlayersBase.map((index: PlayerRecord) => {
      const {
        idPlayer,
        name,
        totalGoals,
        totalYellowCards,
        totalRedCards,
        totalAssists,
      } = index;

      return Player.restore({
        id: idPlayer,
        name,
        totalGoals,
        totalYellowCards,
        totalRedCards,
        totalAssists,
      });
    });

    return players;
  }

  public async findByName(name: string): Promise<Player | null> {
    const player = await this.prisma.player.findFirst({ where: { name } });

    return player
      ? Player.restore({
          id: player.idPlayer,
          name: player.name,
          totalGoals: player.totalGoals,
          totalYellowCards: player.totalYellowCards,
          totalRedCards: player.totalRedCards,
          totalAssists: player.totalAssists,
        })
      : null;
  }
  public async find(id: string): Promise<Player | null> {
    const playerExist = await this.prisma.player.findUnique({
      where: {
        idPlayer: id,
      },
    });

    if (!playerExist) {
      return null;
    }

    const { name, totalGoals, totalAssists, totalRedCards, totalYellowCards } =
      playerExist;

    const player = Player.restore({
      id,
      name,
      totalGoals,
      totalAssists,
      totalRedCards,
      totalYellowCards,
    });

    return player;
  }

  public async update(
    id: string,
    name?: string,
    totalGoals?: number,
    totalAssists?: number,
    totalRedCards?: number,
    totalYellowCards?: number,
  ) {
    const playerExist = await this.prisma.player.findUnique({
      where: {
        idPlayer: id,
      },
    });

    if (!playerExist) {
      throw new Error("This player doesn't exist to update them");
    }

    const data: {
      name?: string;
      totalGoals?: number;
      totalAssists?: number;
      totalRedCards?: number;
      totalYellowCards?: number;
    } = {};


    if(name !== undefined){
        data.name = name
    }

    if(totalGoals !== undefined){
        data.totalGoals = totalGoals
    }

    if(totalAssists !== undefined){
        data.totalAssists = totalAssists
    }

    if(totalRedCards !== undefined){
        data.totalRedCards = totalRedCards
    }

    if(totalYellowCards !== undefined){
        data.totalYellowCards = totalYellowCards
    }

    await this.prisma.player.update({
      where: {
        idPlayer: id,
      },
      data,
    });
  }
}
