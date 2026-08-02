import type { SquadPlayerProps } from "../entities/squad.js";
import type { PlayerRepository } from "../repositories/product/player.repository.js";
import type { SquadRepository } from "../repositories/product/squad.repository.js";

export type AddPlayerToGameDTO = SquadPlayerProps & { gameId: string };

export class AddPlayerToGameService {
  public constructor(
    private readonly squadRepository: SquadRepository,
    private readonly playerRepository: PlayerRepository,
  ) {}

  public async execute(input: AddPlayerToGameDTO): Promise<void> {
    const squad = await this.squadRepository.findByGameId(input.gameId);
    if (!squad) throw new Error(`Game ${input.gameId} has no squad`);

    const player = await this.playerRepository.find(input.idPlayer);
    if (!player) throw new Error(`Player ${input.idPlayer} does not exist`);

    const existing = await this.squadRepository.findPlayerMatch(
      input.gameId,
      input.idPlayer,
    );
    if (existing) throw new Error("Player is already registered in this game");

    const stats = [
      input.goalsScored,
      input.assists,
      input.yellowCards,
      input.redCards,
    ];
    if (stats.some((value) => value < 0)) {
      throw new Error("Player match statistics cannot be negative");
    }

    const { gameId, ...participation } = input;
    await this.squadRepository.addPlayer(gameId, participation);
    await this.playerRepository.update(
      input.idPlayer,
      undefined,
      player.totalGoals + input.goalsScored,
      player.totalAssists + input.assists,
      player.totalRedCards + input.redCards,
      player.totalYellowCards + input.yellowCards,
    );
  }
}