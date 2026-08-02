import type { Team } from "../../entities/team.js";

export interface TeamRepository {
  save(team: Team): Promise<Team>;
  find(id: string): Promise<Team | null>;
  findByName(name: string): Promise<Team | null>;
  list(): Promise<Team[]>;
  incrementStats(
    name: string,
    scored: number,
    conceded: number,
  ): Promise<Team>;
}