import type { TournamentDTO,  TournamentService} from "../tournament.service.js";
import type { TournamentRepository } from "../../repositories/tournament.repository.js";
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
}