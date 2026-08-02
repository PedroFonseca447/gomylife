import type { Player } from "../../entities/player";

export interface PlayerRepository{
    save(player: Player): Promise<void>;
    find(id: string): Promise<Player | null>;
    findByName(name: string): Promise<Player | null>;
    update(id: string,  name?:  string, totalGoals?: number, totalAssists?: number, totalRedCards?: number, totalYellowCards?: number): Promise<void>;
    list(): Promise<Player []>;
}