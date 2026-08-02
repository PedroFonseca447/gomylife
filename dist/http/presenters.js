export function tournamentResponse(tournament) {
    return {
        id: tournament.id,
        name: tournament.name,
        country: tournament.country,
        year: tournament.year,
    };
}
export function teamResponse(team) {
    return {
        id: team.id,
        name: team.name,
        colorPrimary: team.colorPrimary,
        colorSecondary: team.colorSecondary,
        allTimeScored: team.allTimeScored,
        allTimeConceded: team.allTimeConceded,
    };
}
export function gameResponse(game) {
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
//# sourceMappingURL=presenters.js.map