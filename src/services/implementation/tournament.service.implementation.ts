import type { TournamentDTO,  TournamentService} from "../tournament.service.js";
import type { TournamentRepository } from "../../repositories/tournament.repository.js";
import { Tournament } from "../../entities/tournament.js";
export class TournamentServiceImplementation implements TournamentService {
    private constructor(readonly repository: TournamentRepository) {}

    public static build(repository: TournamentRepository) {
        return new TournamentServiceImplementation(repository);
    }
    public async list(): Promise<TournamentDTO[]> {
        const tournaments = await this.repository.list();
    
        const mappedTournaments: TournamentDTO[] = tournaments.map((tournament) => ({
          id: tournament.id,
          name: tournament.name,
          country: tournament.country,
        }));
        
        return mappedTournaments;
    }

    public async addTournament(name: string, country: string, id: string): Promise<void> {
       
       const newTournament =  Tournament.create(id, name, country);
       await this.repository.save(newTournament);
        
    }

    public async getTournament(id: string): Promise<TournamentDTO | null> {
        const tournament = await this.repository.find(id, false);
        if (!tournament) {
            return null;
        }
        return {
            id: tournament.id,
            name: tournament.name,
            country: tournament.country,
        };
    }
}