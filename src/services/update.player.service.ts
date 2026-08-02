import type { PlayerRepository } from "../repositories/product/player.repository.js";

export type UpdatePlayerDTO = {
  playerId: string;
  name: string;
};

export class UpdatePlayerService {
  public constructor(private readonly playerRepository: PlayerRepository) {}

  public async execute(input: UpdatePlayerDTO): Promise<void> {
    const player = await this.playerRepository.find(input.playerId);
    if (!player) throw new Error(`Player ${input.playerId} does not exist`);

    const name = input.name.trim();
    if (!name) throw new Error("Player name is required");

    const playerWithSameName = await this.playerRepository.findByName(name);
    if (playerWithSameName && playerWithSameName.id !== input.playerId) {
      throw new Error(`Another player named ${name} already exists`);
    }

    await this.playerRepository.update(input.playerId, name);
  }
}