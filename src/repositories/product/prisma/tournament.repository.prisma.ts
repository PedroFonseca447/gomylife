//aqui se implementa o basico de um repositorio para uma tabela
// seu update, delete, create e get JEHEHEH, nada de regra de negocio paenas o que é necessário
import type { PrismaClient } from "../../../generated/prisma/client.js";
import { Tournament } from "../../../entities/tournament";
import type { TournamentRepository } from "../tournament.repository.js";


export class TournamentRepositoryPrisma implements TournamentRepository{

    private constructor(readonly prisma: PrismaClient){}

    public static build(prisma : PrismaClient){
        return new TournamentRepositoryPrisma(prisma);
    }


    public async save(tournament: Tournament): Promise<void>{
        const newTournament = {
            id: tournament.id,
            name: tournament.name,
            country: tournament.country,
            year: tournament.year
        }

        if(!newTournament.id || !newTournament.name ||!newTournament.country){
            throw new Error("campo nulo")
        }

        await this.prisma.tournament.create({
            data:{
                id: newTournament.id,
                name: newTournament.name,
                country: newTournament.country,
                year: newTournament.year
            }
        })
    }

    public async list(): Promise<Tournament[]>{

       const allTournamentsList = await this.prisma.tournament.findMany();


       const allTournaments: Tournament[] = allTournamentsList.map((index) => { // todo esse malabariosm e para arrumar a classe de torneio
            const {id, name, year, country} = index; 
            return Tournament.restore({ id, name, country, year });
       })



       return allTournaments;
    }

    public async findByIdentity(name: string, country: string, year: string): Promise<Tournament | null> {
       const tournament = await this.prisma.tournament.findFirst({
            where: { name, country, year }
       });

       return tournament ? Tournament.restore(tournament) : null;
    }
    public async find(id: string): Promise<Tournament | null>{
       if(!id){
            throw new Error("Adicione um id valido")
       }

       const tournamentConsult = await this.prisma.tournament.findUnique({
            where:{
                id: id,
            }
       })

       if(!tournamentConsult){
            return null
       }

       const { name, year, country} = tournamentConsult;

       const tournamentObj = Tournament.restore({ id, name, country, year })

       return tournamentObj
    }
}