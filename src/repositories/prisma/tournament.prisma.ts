import type { PrismaClient } from "../../generated/prisma/client.js";
import { Tournament } from "../../entities/tournament.js";
import type { TournamentRepository } from "../tournament.repository.js";

export class TournamentPrismaRepository implements TournamentRepository {
    private constructor(private readonly prisma: PrismaClient) {}

    public static build(prisma: PrismaClient) {
        return new TournamentPrismaRepository(prisma);
    }

    public async save(tournament: Tournament): Promise<void> {
        await this.prisma.tournament.create({
            data: {
                id: tournament.id,
                name: tournament.name,
                country: tournament.country,
            },
        });
    }

    public async list(): Promise<Tournament[]> {
        const allTournaments = await this.prisma.tournament.findMany();

        return allTournaments.map((tournament) => Tournament.restore(tournament));
    }

    public async update(tournament: Tournament): Promise<void> {
        await this.prisma.tournament.update({
            where: {
                id: tournament.id,
            },
            data: {
                name: tournament.name,
                country: tournament.country,
            },
        });
    }

    public async find(id: string, needId: boolean): Promise<Tournament | undefined> {
        void needId;

        const tournament = await this.prisma.tournament.findUnique({
            where: { id },
        });

        return tournament ? Tournament.restore(tournament) : undefined;
    }
}
