import type { PrismaClient } from "@prisma/client";
import type { Tournament } from "../../entities/tournament.js";
import type { TournamentRepository } from "../tournament.repository.js";
export class TournamentPrismaRepository  implements TournamentRepository{


    private constructor(readonly prisma: PrismaClient) {}

    public build(prisma: PrismaClient) {
        return new TournamentPrismaRepository(prisma);
    }
    public async save(tournament: Tournament): Promise<void> {

        const newTournament = {
            id: tournament.id,
            name: tournament.name,
            country: tournament.country
        }
        this.prisma.tournament.create({
            newTournament
        })
        throw new Error("Method not implemented.");
    }
    public async list(): Promise<Tournament[]> {
        throw new Error("Method not implemented.");
    }
    public async update(tournament: Tournament): Promise<void> {

        const updatedTournament = {
            id: tournament.id,
            name: tournament.name,
            country: tournament.country
        }

        this.prisma.tournaments.update({
            where: {
                id: tournament.id
            },
            updatedTournament
        })
        

        throw new Error("Method not implemented.");
    }
    public async find(id: string): Promise<Tournament | undefined> {
        throw new Error("Method not implemented.");
    }

}