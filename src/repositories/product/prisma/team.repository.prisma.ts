import { Team } from "../../../entities/team.js";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { TeamRepository } from "../team.repository.js";

export class TeamRepositoryPrisma implements TeamRepository {
  private constructor(private readonly prisma: PrismaClient) {}

  public static build(prisma: PrismaClient) {
    return new TeamRepositoryPrisma(prisma);
  }

  public async save(team: Team): Promise<Team> {
    const saved = await this.prisma.team.upsert({
      where: { name: team.name },
      update: {
        colorPrimary: team.colorPrimary,
        colorSecondary: team.colorSecondary,
      },
      create: {
        name: team.name,
        colorPrimary: team.colorPrimary,
        colorSecondary: team.colorSecondary,
      },
    });
    return Team.restore(saved);
  }

  public async find(id: string): Promise<Team | null> {
    const team = await this.prisma.team.findUnique({ where: { id } });
    return team ? Team.restore(team) : null;
  }

  public async findByName(name: string): Promise<Team | null> {
    const team = await this.prisma.team.findUnique({
      where: { name: name.trim() },
    });
    return team ? Team.restore(team) : null;
  }

  public async list(): Promise<Team[]> {
    const teams = await this.prisma.team.findMany({ orderBy: { name: "asc" } });
    return teams.map((team) => Team.restore(team));
  }

  public async incrementStats(
    name: string,
    scored: number,
    conceded: number,
  ): Promise<Team> {
    if (scored < 0 || conceded < 0) {
      throw new Error("Statistics increment cannot be negative");
    }
    const team = await this.prisma.team.update({
      where: { name: name.trim() },
      data: {
        allTimeScored: { increment: scored },
        allTimeConceded: { increment: conceded },
      },
    });
    return Team.restore(team);
  }
}