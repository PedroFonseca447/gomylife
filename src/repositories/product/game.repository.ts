import type { Game } from "../../entities/game.js";

export type GameUpdateData = {
  date?: string;
  stadiumName?: string;
  homeScore?: number;
  awayScore?: number;
};

export interface GameRepository {
  save(game: Game): Promise<void>;
  list(): Promise<Game[]>;
  find(id: string): Promise<Game>;
  update(id: string, data: GameUpdateData): Promise<void>;
  delete(id: string): Promise<void>;
}