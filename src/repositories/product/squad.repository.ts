import type { Squad, SquadPlayerProps } from "../../entities/squad.js";

export type PlayerMatchUpdate = Partial<
  Omit<SquadPlayerProps, "idPlayer">
>;

export interface SquadRepository {
  save(squad: Squad): Promise<void>;
  list(): Promise<Squad[]>;
  find(idSquad: string): Promise<Squad | null>;
  findByGameId(gameId: string): Promise<Squad | null>;
  findPlayerMatch(
    gameId: string,
    playerId: string,
  ): Promise<SquadPlayerProps | null>;
  addPlayer(gameId: string, player: SquadPlayerProps): Promise<void>;
  updatePlayerMatch(
    gameId: string,
    playerId: string,
    data: PlayerMatchUpdate,
  ): Promise<void>;
  removePlayer(gameId: string, playerId: string): Promise<void>;
}