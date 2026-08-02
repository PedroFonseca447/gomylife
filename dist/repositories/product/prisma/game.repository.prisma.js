import { Game } from "../../../entities/game.js";
import { Team } from "../../../entities/team.js";
import { Tournament } from "../../../entities/tournament.js";
const gameRelations = {
    tournament: true,
    teams: { include: { team: true } },
};
export class GameRepositoryPrisma {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    static build(prisma) {
        return new GameRepositoryPrisma(prisma);
    }
    async save(game) {
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
    async list() {
        const games = await this.prisma.game.findMany({
            include: gameRelations,
            orderBy: { date: "desc" },
        });
        return games.map((game) => this.toDomain(game));
    }
    async find(id) {
        const game = await this.prisma.game.findUnique({
            where: { id },
            include: gameRelations,
        });
        return game ? this.toDomain(game) : null;
    }
    async delete(id) {
        await this.prisma.$transaction([
            this.prisma.dataTeamMatch.deleteMany({ where: { gameId: id } }),
            this.prisma.game.delete({ where: { id } }),
        ]);
    }
    toDomain(record) {
        return Game.restore({
            id: record.id,
            date: record.date,
            stadiumName: record.stadiumName,
            homeScore: record.homeScore,
            awayScore: record.awayScore,
            tournament: Tournament.restore(record.tournament),
            teams: record.teams.map((participation) => ({
                side: participation.side,
                matchScored: participation.matchScored,
                matchConceded: participation.matchConceded,
                team: Team.restore(participation.team),
            })),
        });
    }
}
//# sourceMappingURL=game.repository.prisma.js.map