import { Team } from "../../../entities/team.js";
export class TeamRepositoryPrisma {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    static build(prisma) {
        return new TeamRepositoryPrisma(prisma);
    }
    async save(team) {
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
    async find(id) {
        const team = await this.prisma.team.findUnique({ where: { id } });
        return team ? Team.restore(team) : null;
    }
    async findByName(name) {
        const team = await this.prisma.team.findUnique({
            where: { name: name.trim() },
        });
        return team ? Team.restore(team) : null;
    }
    async list() {
        const teams = await this.prisma.team.findMany({ orderBy: { name: "asc" } });
        return teams.map((team) => Team.restore(team));
    }
    async incrementStats(name, scored, conceded) {
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
//# sourceMappingURL=team.repository.prisma.js.map