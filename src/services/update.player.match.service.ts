import type { PlayerRepository } from "../repositories/product/player.repository.js";
import type {
  PlayerMatchUpdate,
  SquadRepository,
} from "../repositories/product/squad.repository.js";

export type UpdatePlayerMatchDTO = PlayerMatchUpdate & {
  gameId: string;
  playerId: string;
};

export class UpdatePlayerMatchService {
  public constructor(
    private readonly squadRepository: SquadRepository,
    private readonly playerRepository: PlayerRepository,
  ) {}

  public async execute(input: UpdatePlayerMatchDTO): Promise<void> {
    const current = await this.squadRepository.findPlayerMatch(
      input.gameId,
      input.playerId,
    );
    if (!current) throw new Error("Player is not registered in this game");

    const player = await this.playerRepository.find(input.playerId);
    if (!player) throw new Error(`Player ${input.playerId} does not exist`);

    validateMatchUpdate(input);

    const update: PlayerMatchUpdate = {
      ...(input.shirtNumber !== undefined
        ? { shirtNumber: input.shirtNumber }
        : {}),
      ...(input.position !== undefined ? { position: input.position } : {}),
      ...(input.whatSide !== undefined ? { whatSide: input.whatSide } : {}),
      ...(input.goalsScored !== undefined
        ? { goalsScored: input.goalsScored }
        : {}),
      ...(input.assists !== undefined ? { assists: input.assists } : {}),
      ...(input.yellowCards !== undefined
        ? { yellowCards: input.yellowCards }
        : {}),
      ...(input.redCards !== undefined ? { redCards: input.redCards } : {}),
    };

    const nextGoals = input.goalsScored ?? current.goalsScored;
    const nextAssists = input.assists ?? current.assists;
    const nextYellowCards = input.yellowCards ?? current.yellowCards;
    const nextRedCards = input.redCards ?? current.redCards;

    await this.squadRepository.updatePlayerMatch(
      input.gameId,
      input.playerId,
      update,
    );
    await this.playerRepository.update(
      input.playerId,
      undefined,
      player.totalGoals + nextGoals - current.goalsScored,
      player.totalAssists + nextAssists - current.assists,
      player.totalRedCards + nextRedCards - current.redCards,
      player.totalYellowCards + nextYellowCards - current.yellowCards,
    );
  }
}

function validateMatchUpdate(input: PlayerMatchUpdate) {
  const stats = [
    input.goalsScored,
    input.assists,
    input.yellowCards,
    input.redCards,
  ];
  if (stats.some((value) => value !== undefined && value < 0)) {
    throw new Error("Player match statistics cannot be negative");
  }
  if (input.shirtNumber !== undefined && input.shirtNumber <= 0) {
    throw new Error("Shirt number must be greater than zero");
  }
  if (input.position !== undefined && !input.position.trim()) {
    throw new Error("Position cannot be empty");
  }
}