import type { Player } from "../../entities/player";
import type { PlayerRepository } from "../player.repository";

export class PlayerPrismaRepository  implements PlayerRepository{
    public async save(player: Player): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public async list(): Promise<Player[]> {
        throw new Error("Method not implemented.");
    }
    public async update(player: Player): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public async find(id: string): Promise<Player | undefined> {
        throw new Error("Method not implemented.");
    }
    
}