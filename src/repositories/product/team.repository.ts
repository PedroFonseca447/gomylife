import type { Team } from "../../entities/team";

export interface TeamRepository{
    save(team: Team): Promise<void>;
    list(): Promise<Team[]>;
    find(id: string): Promise<Team | null>;
} 