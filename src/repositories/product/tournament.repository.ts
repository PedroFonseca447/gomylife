import type { Tournament } from "../../entities/tournament.js";

export interface TournamentRepository {
  save(tournament: Tournament): Promise<Tournament>;
  find(id: string): Promise<Tournament | null>;
  findByName(name: string): Promise<Tournament | null>;
  list(): Promise<Tournament[]>;
}