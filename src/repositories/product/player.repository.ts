import type { Player } from "../../entities/player";

export interface PlayerRepository{
    save(player: Player): Promise<void>;
    find(id: String): Promise<Player | null>;
    update(id: string, data: Player): Promise<void>;
    list(): Promise<Player []>;
}