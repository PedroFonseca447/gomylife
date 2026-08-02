import { Tournament } from "../../../entities/tournament.js";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { TournamentRepository } from "../tournament.repository.js";

export class TournamentRepositoryPrisma implements TournamentRepository {
  private constructor(private readonly prisma: PrismaClient) {}

  public static build(prisma: PrismaClient) {
    return new TournamentRepositoryPrisma(prisma);
  }

  public async save(tournament: Tournament): Promise<Tournament> {
    const saved = await this.prisma.tournament.upsert({
      where: { name: tournament.name },
      update: {
        country: tournament.country,
        year: tournament.year,
      },
      create: {
        name: tournament.name,
        country: tournament.country,
        year: tournament.year,
      },
    });
    return Tournament.restore(saved);
  }

  public async find(id: string): Promise<Tournament | null> {
    const tournament = await this.prisma.tournament.findUnique({
      where: { id },
    });
    return tournament ? Tournament.restore(tournament) : null;
  }

  public async findByName(name: string): Promise<Tournament | null> {
    const tournament = await this.prisma.tournament.findUnique({
      where: { name: name.trim() },
    });
    return tournament ? Tournament.restore(tournament) : null;
  }

  public async list(): Promise<Tournament[]> {
    const tournaments = await this.prisma.tournament.findMany({
      orderBy: { name: "asc" },
    });
    return tournaments.map((tournament) => Tournament.restore(tournament));
  }
}