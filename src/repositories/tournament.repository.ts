import type { Tournament } from "../entities/tournament.js";

export interface TournamentRepository{
    save(tournament: Tournament): Promise<void>;
    list(): Promise<Tournament[]>;
    update(tournament: Tournament): Promise<void>;
    find(id: string): Promise<Tournament | undefined>;
}