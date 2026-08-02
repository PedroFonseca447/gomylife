import type { Team } from "../../entities/team";

export interface TeamRepository{
    save(team: Team): Promise<void>;
    list(): Promise<Team[]>;
    find(id: string): Promise<Team | null>;
    findByName(name: string): Promise<Team | null>;
    update(id: string,  name?: string, colorPrimary?: string, colorSecondary?: string, allTimeScored?: number, allTimeConceded?: number ): Promise<void>;
} 