import type { PlayerRepository } from "../repositories/product/player.repository.js";
import type { SquadRepository } from "../repositories/product/squad.repository.js";

export type RemovePlayerFromGameDTO = {
  gameId: string;
  playerId: string;
};

export class RemovePlayerFromGameService {
  public constructor(
    private readonly squadRepository: SquadRepository,
    private readonly playerRepository: PlayerRepository,
  ) {}

  public async execute(input: RemovePlayerFromGameDTO): Promise<void> {
    const participation = await this.squadRepository.findPlayerMatch(
      input.gameId,
      input.playerId,
    );
    if (!participation) throw new Error("Player is not registered in this game");

    const player = await this.playerRepository.find(input.playerId);
    if (!player) throw new Error(`Player ${input.playerId} does not exist`);

    await this.squadRepository.removePlayer(input.gameId, input.playerId);
    await this.playerRepository.update(
      input.playerId,
      undefined,
      Math.max(0, player.totalGoals - participation.goalsScored),
      Math.max(0, player.totalAssists - participation.assists),
      Math.max(0, player.totalRedCards - participation.redCards),
      Math.max(0, player.totalYellowCards - participation.yellowCards),
    );
  }
}