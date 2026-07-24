import { Tournament } from "../../entities/tournament"

//aqui o lado mais tecnico, abstrai a leitura e ravacao de dados para algo mais palpavel, 

// pq temos um repositorio e seus produc

//operacoes com dados, aqi nao sabemos o que é uma operacao apenas o que definimos.
//tipo ele nao sabe o que e esse envio de otrnament, ele apenas lista torneios e salva
//a mais util é essa mesmo : ), a outra so para maiores regras de negocios o que no caso auqi nao habemos


export interface TournamentRepository{
    save(tournament: Tournament): Promise<void>;//assincrono
    list(): Promise<Tournament[]>; // retorna um objeto de torneio 
    find(id: string): Promise<Tournament | null>; // aqui nao precisamos de muito, como
    //nossos torneios sao bemm simples. com nennuma regra especifica podemos so comuniar ele em repositories
}