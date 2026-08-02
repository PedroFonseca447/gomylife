import type { Game } from "../../entities/game.js";

export interface GameRepository {
  save(game: Game): Promise<Game>;
  list(): Promise<Game[]>;
  find(id: string): Promise<Game | null>;
  delete(id: string): Promise<void>;
}