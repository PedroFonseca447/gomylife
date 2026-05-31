import type { GameRepository } from "../../repositories/game.repository.js";
import type { gameDTO, GameService, listGamesDTO } from "../game.service.js";

export class GameServiceImplementation implements GameService{
    private constructor(readonly repository: GameRepository){

    }

    public static build(repository: GameRepository){
        return new GameServiceImplementation(repository);
    }

    public async getGame(id: string): Promise<gameDTO> {
        const aGame = await this.repository.find(id);

        if(!aGame){
            throw new Error(`O jogo ${id} não foi encontrado` )
        }

        const outPutGame: gameDTO = {
            id: aGame.id,
            data: aGame.data,
            tournamentObject: {
                name: aGame.tournamentObject.name,
                country: aGame.tournamentObject.country
            },
            homeTeamName: aGame.homeTeamName,
            awayTeamName: aGame.awayTeamName,
            stadiumName: aGame.stadiumName,
            homeScore: aGame.homeScore,
            awayScore: aGame.awayScore
        }

        return outPutGame;
    }


    public async listAllGames(): Promise<listGamesDTO> {
        throw new Error('sdadas')
    }

}
