import type { Squad } from "../../entities/squad";
import type { SquadRepository } from "../squad.repository";

export class SquadPrismaRepository implements SquadRepository {
    findSquad(gameId: string, reference: "home" | "away"): Promise<Squad | undefined> {
        throw new Error("Method not implemented.");
    }
    
    public async save(squad: Squad): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public async list(): Promise<Squad[]> {
        throw new Error("Method not implemented.");
    }
    public async update(squad: Squad): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public async find(id: string): Promise<Squad | undefined> {
        throw new Error("Method not implemented.");
    }
}