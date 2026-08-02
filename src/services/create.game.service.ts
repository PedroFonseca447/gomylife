import { Game, type TeamGameData } from "../entities/game.js";
import { Player } from "../entities/player.js";
import type { SquadPlayerProps } from "../entities/squad.js";
import { Team } from "../entities/team.js";
import { Tournament } from "../entities/tournament.js";
import type { GameRepository } from "../repositories/product/game.repository.js";
import type { PlayerRepository } from "../repositories/product/player.repository.js";
import type { TeamRepository } from "../repositories/product/team.repository.js";
import type { TournamentRepository } from "../repositories/product/tournament.repository.js";

export type TournamentReference = {
  id?: string;
  name?: string;
  country?: string;
  year?: string;
};

export type TeamReference = {
  id?: string;
  name?: string;
  colorPrimary?: string;
  colorSecondary?: string;
};

export type MatchPlayerInput = Omit<SquadPlayerProps, "idPlayer"> & {
  id?: string;
  name?: string;
};

export type CreateMatchServiceDTO = {
  date: string;
  tournament: TournamentReference;
  homeTeam: TeamReference;
  awayTeam: TeamReference;
  stadiumName: string;
  homeScore: number;
  awayScore: number;
  players: MatchPlayerInput[];
};

export interface GameCreateService {
  execute(input: CreateMatchServiceDTO): Promise<Game>;
}

export class CreateGameService implements GameCreateService {
  public constructor(
    private readonly tournamentRepository: TournamentRepository,
    private readonly teamRepository: TeamRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly gameRepository: GameRepository,
  ) {}

  public async execute(input: CreateMatchServiceDTO): Promise<Game> {
    this.validateInput(input);

    const tournament = await this.resolveTournament(input.tournament);
    const homeTeam = await this.resolveTeam(input.homeTeam, "home");
    const awayTeam = await this.resolveTeam(input.awayTeam, "away");

    if (homeTeam.idTeam === awayTeam.idTeam) {
      throw new Error("Home team and away team must be different");
    }

    const resolvedPlayers = await Promise.all(
      input.players.map(async (player) => ({
        entity: await this.resolvePlayer(player),
        match: player,
      })),
    );

    const playerIds = resolvedPlayers.map(({ entity }) => entity.id);
    if (new Set(playerIds).size !== playerIds.length) {
      throw new Error("A player cannot appear twice in the same game");
    }

    const gameId = createObjectId();
    const teams: TeamGameData[] = [
      {
        idGame: gameId,
        idTeam: homeTeam.idTeam,
        side: "HOME",
        matchScored: input.homeScore,
        matchConceded: input.awayScore,
      },
      {
        idGame: gameId,
        idTeam: awayTeam.idTeam,
        side: "AWAY",
        matchScored: input.awayScore,
        matchConceded: input.homeScore,
      },
    ];

    const players: SquadPlayerProps[] = resolvedPlayers.map(
      ({ entity, match }) => ({
        idPlayer: entity.id,
        goalsScored: match.goalsScored,
        assists: match.assists,
        yellowCards: match.yellowCards,
        redCards: match.redCards,
        shirtNumber: match.shirtNumber,
        position: match.position,
        whatSide: match.whatSide,
      }),
    );

    const game = Game.restore({
      id: gameId,
      date: input.date,
      tournamentId: tournament.id,
      homeTeamId: homeTeam.idTeam,
      awayTeamId: awayTeam.idTeam,
      stadiumName: input.stadiumName,
      teams,
      homeScore: input.homeScore,
      awayScore: input.awayScore,
      squads: { gameId, players },
    });

    await this.gameRepository.save(game);

    homeTeam.addTeamStats({
      matchScored: input.homeScore,
      matchConceded: input.awayScore,
    });
    awayTeam.addTeamStats({
      matchScored: input.awayScore,
      matchConceded: input.homeScore,
    });

    await Promise.all([
      this.teamRepository.update(
        homeTeam.idTeam,
        undefined,
        undefined,
        undefined,
        homeTeam.allTimeTeamScored,
        homeTeam.allTimeTeamConceded,
      ),
      this.teamRepository.update(
        awayTeam.idTeam,
        undefined,
        undefined,
        undefined,
        awayTeam.allTimeTeamScored,
        awayTeam.allTimeTeamConceded,
      ),
      ...resolvedPlayers.map(async ({ entity, match }) => {
        entity.addGameStats(match);
        await this.playerRepository.update(
          entity.id,
          undefined,
          entity.totalGoals,
          entity.totalAssists,
          entity.totalRedCards,
          entity.totalYellowCards,
        );
      }),
    ]);

    return game;
  }

  private async resolveTournament(reference: TournamentReference) {
    if (reference.id) {
      const tournament = await this.tournamentRepository.find(reference.id);
      if (!tournament) {
        throw new Error(`Tournament ${reference.id} does not exist`);
      }
      return tournament;
    }

    const name = required(reference.name, "Tournament name");
    const country = required(reference.country, "Tournament country");
    const year = required(reference.year, "Tournament year");
    const existing = await this.tournamentRepository.findByIdentity(
      name,
      country,
      year,
    );

    if (existing){
        return existing;
    } 

    const tournament = Tournament.create(createObjectId(), name, country, year);
    await this.tournamentRepository.save(tournament);
    return tournament;
  }

  private async resolveTeam(reference: TeamReference, side: string) {
    if (reference.id) {
      const team = await this.teamRepository.find(reference.id);
      if (!team) throw new Error(`${side} team ${reference.id} does not exist`);
      return team;
    }

    const name = required(reference.name, `${side} team name`);
    const existing = await this.teamRepository.findByName(name);
    if (existing) return existing;

    const team = Team.create(
      createObjectId(),
      name,
      reference.colorPrimary ?? "#000000",
      reference.colorSecondary ?? "#FFFFFF",
      0,
      0,
    );
    await this.teamRepository.save(team);
    return team;
  }

  private async resolvePlayer(input: MatchPlayerInput) {
    if (input.id) {
      const player = await this.playerRepository.find(input.id);
      if (!player) throw new Error(`Player ${input.id} does not exist`);
      return player;
    }

    const name = required(input.name, "Player name");
    const existing = await this.playerRepository.findByName(name);
    if (existing) return existing;

    const player = Player.create(createObjectId(), name);
    await this.playerRepository.save(player);
    return player;
  }

  private validateInput(input: CreateMatchServiceDTO) {
    if (!input.date.trim()) {
        throw new Error("Game date is required");
    }
    if (!input.stadiumName.trim()) {
        throw new Error("Stadium name is required");
    }
    if (input.homeScore < 0 || input.awayScore < 0) {
      throw new Error("Scores must be greater than or equal to zero");
    }
  }
}

function createObjectId() {
  return Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function required(value: string | undefined, field: string) {
  if (!value?.trim()) {
    throw new Error(`${field} is required when id is absent`);
  }
  return value.trim();
}