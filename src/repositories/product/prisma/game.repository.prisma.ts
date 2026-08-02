import { Game, type TeamSide } from "../../../entities/game.js";
import { Team } from "../../../entities/team.js";
import { Tournament } from "../../../entities/tournament.js";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { GameRepository } from "../game.repository.js";

type GameRecord = {
  id: string;
  date: Date;
  stadiumName: string;
  homeScore: number;
  awayScore: number;
  tournament: {
    id: string;
    name: string;
    country: string;
    year: string;
  };
  teams: Array<{
    side: string;
    matchScored: number;
    matchConceded: number;
    team: {
      id: string;
      name: string;
      colorPrimary: string;
      colorSecondary: string;
      allTimeScored: number;
      allTimeConceded: number;
    };
  }>;
};

const gameRelations = {
  tournament: true,
  teams: { include: { team: true } },
} as const;

export class GameRepositoryPrisma implements GameRepository {
  private constructor(private readonly prisma: PrismaClient) {}

  public static build(prisma: PrismaClient) {
    return new GameRepositoryPrisma(prisma);
  }

  public async save(game: Game): Promise<Game> {
    const saved = await this.prisma.$transaction(async (transaction) => {
      await transaction.tournament.upsert({
        where: { name: game.tournament.name },
        update: {
          country: game.tournament.country,
          year: game.tournament.year,
        },
        create: {
          name: game.tournament.name,
          country: game.tournament.country,
          year: game.tournament.year,
        },
      });

      for (const participation of game.teams) {
        await transaction.team.upsert({
          where: { name: participation.team.name },
          update: {
            colorPrimary: participation.team.colorPrimary,
            colorSecondary: participation.team.colorSecondary,
            allTimeScored: { increment: participation.matchScored },
            allTimeConceded: { increment: participation.matchConceded },
          },
          create: {
            name: participation.team.name,
            colorPrimary: participation.team.colorPrimary,
            colorSecondary: participation.team.colorSecondary,
            allTimeScored: participation.matchScored,
            allTimeConceded: participation.matchConceded,
          },
        });
      }

      return transaction.game.create({
        data: {
          date: game.date,
          stadiumName: game.stadiumName,
          homeScore: game.homeScore,
          awayScore: game.awayScore,
          tournament: { connect: { name: game.tournament.name } },
          teams: {
            create: game.teams.map((participation) => ({
              side: participation.side,
              matchScored: participation.matchScored,
              matchConceded: participation.matchConceded,
              team: { connect: { name: participation.team.name } },
            })),
          },
        },
        include: gameRelations,
      });
    });

    return this.toDomain(saved);
  }

  public async list(): Promise<Game[]> {
    const games = await this.prisma.game.findMany({
      include: gameRelations,
      orderBy: { date: "desc" },
    });
    return games.map((game) => this.toDomain(game));
  }

  public async find(id: string): Promise<Game | null> {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: gameRelations,
    });
    return game ? this.toDomain(game) : null;
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.dataTeamMatch.deleteMany({ where: { gameId: id } }),
      this.prisma.game.delete({ where: { id } }),
    ]);
  }

  private toDomain(record: GameRecord): Game {
    return Game.restore({
      id: record.id,
      date: record.date,
      stadiumName: record.stadiumName,
      homeScore: record.homeScore,
      awayScore: record.awayScore,
      tournament: Tournament.restore(record.tournament),
      teams: record.teams.map((participation) => ({
        side: participation.side as TeamSide,
        matchScored: participation.matchScored,
        matchConceded: participation.matchConceded,
        team: Team.restore(participation.team),
      })),
    });
  }
}