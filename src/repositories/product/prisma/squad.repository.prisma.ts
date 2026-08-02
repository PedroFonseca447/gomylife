import { Squad, type SquadPlayerProps } from "../../../entities/squad.js";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import type {
  PlayerMatchUpdate,
  SquadRepository,
} from "../squad.repository.js";

export class SquadRepositoryPrisma implements SquadRepository {
  private constructor(readonly prisma: PrismaClient) {}

  public static build(prisma: PrismaClient) {
    return new SquadRepositoryPrisma(prisma);
  }

  public async save(squad: Squad): Promise<void> {
    await this.prisma.squad.create({
      data: {
        gameId: squad.gameId,
        players: {
          create: squad.players.map(({ idPlayer, ...matchData }) => ({
            ...matchData,
            player: { connect: { idPlayer } },
          })),
        },
      },
    });
  }

  public async list(): Promise<Squad[]> {
    const squads = await this.prisma.squad.findMany({
      include: { players: true },
    });
    return squads.map((squad) => this.toDomain(squad));
  }

  public async find(idSquad: string): Promise<Squad | null> {
    const squad = await this.prisma.squad.findUnique({
      where: { idSquad },
      include: { players: true },
    });
    return squad ? this.toDomain(squad) : null;
  }

  public async findByGameId(gameId: string): Promise<Squad | null> {
    const squad = await this.prisma.squad.findUnique({
      where: { gameId },
      include: { players: true },
    });
    return squad ? this.toDomain(squad) : null;
  }

  public async findPlayerMatch(
    gameId: string,
    playerId: string,
  ): Promise<SquadPlayerProps | null> {
    const squad = await this.prisma.squad.findUnique({
      where: { gameId },
      select: { idSquad: true },
    });
    if (!squad) return null;

    const participation = await this.prisma.dataPlayerMatch.findUnique({
      where: {
        idPlayer_idSquad: { idPlayer: playerId, idSquad: squad.idSquad },
      },
    });
    return participation ? this.toPlayerMatch(participation) : null;
  }

  public async addPlayer(
    gameId: string,
    player: SquadPlayerProps,
  ): Promise<void> {
    const squad = await this.requireSquad(gameId);
    const { idPlayer, ...matchData } = player;
    await this.prisma.dataPlayerMatch.create({
      data: {
        ...matchData,
        player: { connect: { idPlayer } },
        squad: { connect: { idSquad: squad.idSquad } },
      },
    });
  }

  public async updatePlayerMatch(
    gameId: string,
    playerId: string,
    data: PlayerMatchUpdate,
  ): Promise<void> {
    const squad = await this.requireSquad(gameId);
    await this.prisma.dataPlayerMatch.update({
      where: {
        idPlayer_idSquad: { idPlayer: playerId, idSquad: squad.idSquad },
      },
      data,
    });
  }

  public async removePlayer(gameId: string, playerId: string): Promise<void> {
    const squad = await this.requireSquad(gameId);
    await this.prisma.dataPlayerMatch.delete({
      where: {
        idPlayer_idSquad: { idPlayer: playerId, idSquad: squad.idSquad },
      },
    });
  }

  private async requireSquad(gameId: string) {
    const squad = await this.prisma.squad.findUnique({
      where: { gameId },
      select: { idSquad: true },
    });
    if (!squad) throw new Error(`Squad for game ${gameId} does not exist`);
    return squad;
  }

  private toPlayerMatch(player: {
    idPlayer: string;
    goalsScored: number;
    assists: number;
    yellowCards: number;
    redCards: number;
    shirtNumber: number;
    position: string;
    whatSide: string;
  }): SquadPlayerProps {
    return {
      idPlayer: player.idPlayer,
      goalsScored: player.goalsScored,
      assists: player.assists,
      yellowCards: player.yellowCards,
      redCards: player.redCards,
      shirtNumber: player.shirtNumber,
      position: player.position,
      whatSide: player.whatSide,
    };
  }

  private toDomain(squad: {
    idSquad: string;
    gameId: string;
    players: Array<Parameters<SquadRepositoryPrisma["toPlayerMatch"]>[0]>;
  }): Squad {
    return Squad.restore({
      squadId: squad.idSquad,
      gameId: squad.gameId,
      players: squad.players.map((player) => this.toPlayerMatch(player)),
    });
  }
}