import type { GameRepository } from "../../repositories/game.repository.js";
import type { gameDTO, GameService, listGamesDTO } from "../game.service.js";

export class GameServiceImplementation implements GameService {
  private constructor(readonly repository: GameRepository) {}

  public static build(repository: GameRepository) {
    return new GameServiceImplementation(repository);
  }

  public async getGame(id: string): Promise<gameDTO> {
    const aGame = await this.repository.find(id);

    if (!aGame) {
      throw new Error(`O jogo ${id} não foi encontrado`);
    }

    const outPutGame: gameDTO = {
      id: aGame.id,
      data: aGame.data,
      tournamentObject: {
        name: aGame.tournamentObject.name,
        country: aGame.tournamentObject.country,
      },
      homeTeamName: aGame.homeTeamName,
      awayTeamName: aGame.awayTeamName,
      stadiumName: aGame.stadiumName,
      homeScore: aGame.homeScore,
      awayScore: aGame.awayScore,
    };

    return outPutGame;
  }

  public async listAllGames(): Promise<listGamesDTO> {
    const games = await this.repository.list();

    const mapped = games.map((game) => ({
      id: game.id,
      data: game.data,
      tournamentObject: {
        name: game.tournamentObject.name,
        country: game.tournamentObject.country,
      },
      homeTeamName: game.homeTeamName,
      awayTeamName: game.awayTeamName,
      homeSquad: {
        reference:"home",
        gameId: game.id,
        playersSquad: game.homeSquad.playersSquad.map((player) => ({
          playerId: player.playerId,
          goalsScored: player.goalsScored,
          assists: player.assists,
          yellowCards: player.yellowCards,
          redCards: player.redCards,
          shirtNumber: player.shirtNumber,
          position: player.position,
        })),
      },
      awaySquad: {
        reference: "away",
        gameId: game.id,
        playersSquad: game.awaySquad.playersSquad.map((player) => ({
          playerId: player.playerId,
          goalsScored: player.goalsScored,
          assists: player.assists,
          yellowCards: player.yellowCards,
          redCards: player.redCards,
          shirtNumber: player.shirtNumber,
          position: player.position,
        })),
      },
      stadiumName: game.stadiumName,
      homeScore: game.homeScore,
      awayScore: game.awayScore,
    }));

    const outPut: listGamesDTO = {
      games: mapped,
    };
    return outPut;
  }
}
