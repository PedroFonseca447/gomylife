import type { Game } from "../entities/game.js";
import type { Team } from "../entities/team.js";
import type { Tournament } from "../entities/tournament.js";

export function tournamentResponse(tournament: Tournament) {
  return {
    id: tournament.id,
    name: tournament.name,
    country: tournament.country,
    year: tournament.year,
  };
}

export function teamResponse(team: Team) {
  return {
    id: team.id,
    name: team.name,
    colorPrimary: team.colorPrimary,
    colorSecondary: team.colorSecondary,
    allTimeScored: team.allTimeScored,
    allTimeConceded: team.allTimeConceded,
  };
}

export function gameResponse(game: Game) {
  return {
    id: game.id,
    date: game.date,
    stadiumName: game.stadiumName,
    homeScore: game.homeScore,
    awayScore: game.awayScore,
    tournament: tournamentResponse(game.tournament),
    teams: game.teams.map((participation) => ({
      side: participation.side,
      matchScored: participation.matchScored,
      matchConceded: participation.matchConceded,
      team: teamResponse(participation.team),
    })),
  };
}