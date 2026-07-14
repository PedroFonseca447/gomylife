import type { Player } from '../entities/player.js';
import { Squad } from '../entities/squad.js';
import type { SquadPlayer } from '../generated/prisma/browser.js';

export interface SquadRepository {
    save(squad: Squad): Promise<void>;
    list(): Promise<Squad[]>;
    updatePlayer( gameID: string, reference: string, playerId: string, player: SquadPlayer): Promise<void>;
    findSquad(gameId: string, reference : "home" | "away"): Promise<Squad | null>;
}