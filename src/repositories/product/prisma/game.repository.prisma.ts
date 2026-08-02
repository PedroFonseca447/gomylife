import type { GameRepository, GameUpdateData } from "../game.repository.js";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import  { Game } from "../../../entities/game";

export class GameRepositoryPrisma implements GameRepository {
  private constructor(readonly prisma: PrismaClient) {}

  public static build(prisma: PrismaClient) {
    return new GameRepositoryPrisma(prisma);
  }

  public async save(game: Game) {
    const newGameObj = {
      id: game.id,
      date: game.date,
      tournamentId: game.tournamentId,
      homeTeamId: game.homeTeamId,
      teams: game.teams,
      awayTeamId: game.awayTeamId,
      stadiumName: game.stadiumName,
      homeScore: game.homeScore,
      awayScore: game.awayScore,
      squad: game.squad,
    };

    await this.prisma.game.create({
      data: {
        id: newGameObj.id,
        date: newGameObj.date,
        tournamentId: newGameObj.tournamentId,
        homeTeamId: newGameObj.homeTeamId,
        awayTeamId: newGameObj.awayTeamId,
        teams: {
          create: newGameObj.teams.map((team) => ({
            side: team.side,
            matchScored: team.matchScored,
            matchConceded: team.matchConceded,
            idGame: team.idGame,
            idTeam: team.idTeam,
          }))
        },
        stadiumName: newGameObj.stadiumName,
        homeScore: newGameObj.homeScore,
        awayScore: newGameObj.awayScore,
        squad: {
          create: {
            players: {
              create: game.squad.players.map(({ idPlayer, ...data }) => ({
                ...data,
                player: { connect: { idPlayer } },
              })),
            },
          },
        },
      },
    });

  }

  public async list() {
    const games = await this.prisma.game.findMany({
      include: {
        teams: true,
        squad: {
          include: {
            players: true,
          }
          }
      }
    })

    return games.map((game) => {
      return Game.restore({
          id: game.id,
          date: game.date,
          tournamentId: game.tournamentId,
          homeTeamId: game.homeTeamId,
          awayTeamId: game.awayTeamId,
          stadiumName: game.stadiumName,
          homeScore: game.homeScore,
          awayScore: game.awayScore,
          teams: game.teams.map((team) => ({
            side: team.side,
            matchScored: team.matchScored,
            matchConceded: team.matchConceded,
            idGame: team.idGame,
            idTeam: team.idTeam,
          })),
          squads: {
            ...(game.squad ? { squadId: game.squad.idSquad } : {}),
            gameId: game.id,
            players: game.squad?.players.map((player) => ({
              idPlayer: player.idPlayer,
              goalsScored: player.goalsScored,
              assists: player.assists,
              yellowCards: player.yellowCards,
              redCards: player.redCards,
              shirtNumber: player.shirtNumber,
              position: player.position,
              whatSide: player.whatSide,
            })) ?? [],
          }
      })
    })
   
  }

  public async find(id: string) {
    const gameFound = await this.prisma.game.findUnique({
      where: { id },
      include: {
        teams: true,
        squad: {
          include: {
            players: true,
          }
        }
      }
    })

    if(gameFound === null) {
      throw new Error("Game not found");
    }

     return Game.restore({
          id: gameFound.id,
          date: gameFound.date,
          tournamentId: gameFound.tournamentId,
          homeTeamId: gameFound.homeTeamId,
          awayTeamId: gameFound.awayTeamId,
          stadiumName: gameFound.stadiumName,
          homeScore: gameFound.homeScore,
          awayScore: gameFound.awayScore,
          teams: gameFound.teams.map((team) => ({
            side: team.side,
            matchScored: team.matchScored,
            matchConceded: team.matchConceded,
            idGame: team.idGame,
            idTeam: team.idTeam,
          })),
          squads: {
            ...(gameFound.squad ? { squadId: gameFound.squad.idSquad } : {}),
            gameId: gameFound.id,
            players: gameFound.squad?.players.map((player) => ({
              idPlayer: player.idPlayer,
              goalsScored: player.goalsScored,
              assists: player.assists,
              yellowCards: player.yellowCards,
              redCards: player.redCards,
              shirtNumber: player.shirtNumber,
              position: player.position,
              whatSide: player.whatSide,
            })) ?? [],
          }
      })
  }

  public async update(id: string, data: GameUpdateData): Promise<void> {
    const current = await this.prisma.game.findUnique({ where: { id } });
    if (!current) throw new Error(`Game ${id} does not exist`);

    const homeScore = data.homeScore ?? current.homeScore;
    const awayScore = data.awayScore ?? current.awayScore;
    const scalarData = {
      ...(data.date !== undefined ? { date: data.date } : {}),
      ...(data.stadiumName !== undefined
        ? { stadiumName: data.stadiumName }
        : {}),
      ...(data.homeScore !== undefined ? { homeScore: data.homeScore } : {}),
      ...(data.awayScore !== undefined ? { awayScore: data.awayScore } : {}),
    };

    await this.prisma.$transaction([
      this.prisma.game.update({ where: { id }, data: scalarData }),
      this.prisma.dataTeamMatch.update({
        where: {
          idGame_idTeam: { idGame: id, idTeam: current.homeTeamId },
        },
        data: { matchScored: homeScore, matchConceded: awayScore },
      }),
      this.prisma.dataTeamMatch.update({
        where: {
          idGame_idTeam: { idGame: id, idTeam: current.awayTeamId },
        },
        data: { matchScored: awayScore, matchConceded: homeScore },
      }),
    ]);
  }
  public async delete(id: string) {
    throw new Error("padrao");
  }
}
