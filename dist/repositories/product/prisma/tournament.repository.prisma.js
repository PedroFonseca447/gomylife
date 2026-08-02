import { Tournament } from "../../../entities/tournament.js";
export class TournamentRepositoryPrisma {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    static build(prisma) {
        return new TournamentRepositoryPrisma(prisma);
    }
    async save(tournament) {
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
    async find(id) {
        const tournament = await this.prisma.tournament.findUnique({
            where: { id },
        });
        return tournament ? Tournament.restore(tournament) : null;
    }
    async findByName(name) {
        const tournament = await this.prisma.tournament.findUnique({
            where: { name: name.trim() },
        });
        return tournament ? Tournament.restore(tournament) : null;
    }
    async list() {
        const tournaments = await this.prisma.tournament.findMany({
            orderBy: { name: "asc" },
        });
        return tournaments.map((tournament) => Tournament.restore(tournament));
    }
}
//# sourceMappingURL=tournament.repository.prisma.js.map