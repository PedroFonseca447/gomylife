import type { PrismaClient } from "../../generated/prisma/client.js";
import type { Game } from "../../entities/game";
import type { GameRepository } from "../game.repository";


export class GamePrismaRepository  implements GameRepository{

    private constructor(readonly repository: PrismaClient) {}

    public build(prisma: PrismaClient) {
        return new GamePrismaRepository(prisma); 
    }
    public async save(game: Game): Promise<void> {

        //implementar as coisas em prism
        throw new Error("Method not implemented.");
    }
    public async list(): Promise<Game[]> {
        throw new Error("Method not implemented.");
    }
    public async updateGame(game: Game): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public async find(id: string): Promise<Game> {
        throw new Error("Method not implemented.");
    }
    
}
