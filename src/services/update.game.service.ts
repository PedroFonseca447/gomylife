import type { GameUpdateData, GameRepository } from "../repositories/product/game.repository.js";
import type { TeamRepository } from "../repositories/product/team.repository.js";

export type UpdateGameDTO = GameUpdateData & { gameId: string };

export class UpdateGameService {
  public constructor(
    private readonly gameRepository: GameRepository,
    private readonly teamRepository: TeamRepository,
  ) {}

  public async execute(input: UpdateGameDTO): Promise<void> {
    const game = await this.gameRepository.find(input.gameId);
    const homeScore = input.homeScore ?? game.homeScore;
    const awayScore = input.awayScore ?? game.awayScore;

    if (homeScore < 0 || awayScore < 0) {
      throw new Error("Scores must be greater than or equal to zero");
    }
    if (input.date !== undefined && !input.date.trim()) {
      throw new Error("Game date cannot be empty");
    }
    if (input.stadiumName !== undefined && !input.stadiumName.trim()) {
      throw new Error("Stadium name cannot be empty");
    }

    const [homeTeam, awayTeam] = await Promise.all([
      this.teamRepository.find(game.homeTeamId),
      this.teamRepository.find(game.awayTeamId),
    ]);
    if (!homeTeam || !awayTeam) {
      throw new Error("One or more teams from this game no longer exist");
    }

    homeTeam.addTeamStats({
      matchScored: homeScore - game.homeScore,
      matchConceded: awayScore - game.awayScore,
    });
    awayTeam.addTeamStats({
      matchScored: awayScore - game.awayScore,
      matchConceded: homeScore - game.homeScore,
    });

    const update: GameUpdateData = {
      ...(input.date !== undefined ? { date: input.date.trim() } : {}),
      ...(input.stadiumName !== undefined
        ? { stadiumName: input.stadiumName.trim() }
        : {}),
      ...(input.homeScore !== undefined ? { homeScore: input.homeScore } : {}),
      ...(input.awayScore !== undefined ? { awayScore: input.awayScore } : {}),
    };

    await this.gameRepository.update(input.gameId, update);
    await Promise.all([
      this.teamRepository.update(
        homeTeam.idTeam,
        undefined,
        undefined,
        undefined,
        homeTeam.allTimeTeamScored,
        homeTeam.allTimeTeamConceded,
      ),
      this.teamRepository.update(
        awayTeam.idTeam,
        undefined,
        undefined,
        undefined,
        awayTeam.allTimeTeamScored,
        awayTeam.allTimeTeamConceded,
      ),
    ]);
  }
}