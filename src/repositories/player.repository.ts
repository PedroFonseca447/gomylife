import type { Player } from "../entities/player.js";

export interface PlayerRepository{
    save(player: Player): Promise<void>;
    list(): Promise<Player[]>;
    update(player: Player): Promise<void>;
    find(id: string): Promise<Player | undefined>;
}
