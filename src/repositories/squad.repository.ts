import { Squad } from '../entities/squad.js';

export interface SquadRepository {
    save(squad: Squad): Promise<void>;
    list(): Promise<Squad[]>;
    update(squad: Squad): Promise<void>;
    findSquad(gameId: string, reference : "home" | "away"): Promise<Squad | undefined>;
}