
/* 
a ideia nesse arquivo é criar um contrato uma interface que liga service. entities entre outras. sem que precise reconhecer todo 
*/
import type { Game } from "../entities/game.js";

export interface GameRepository{

    //quem faz o contrato entre camadas usa isso aqui. Meio que é uma declaracao de DTO
    save(game: Game): Promise<void>;
    list(): Promise<Game[]>;
    updateGame(game: Game): Promise<void>;
    find(id:string): Promise<Game>; 
}