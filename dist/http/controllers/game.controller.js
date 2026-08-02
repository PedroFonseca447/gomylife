import { Game } from "../../entities/game.js";
import { Team } from "../../entities/team.js";
import { Tournament } from "../../entities/tournament.js";
import { HttpError } from "../http-error.js";
import { gameResponse } from "../presenters.js";
import { dateField, integerField, object, routeParam, stringField } from "../validation.js";
export class GameController {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    create = async (request, response) => {
        const body = object(request.body);
        const tournamentBody = object(body.tournament, "tournament");
        const homeTeamBody = object(body.homeTeam, "homeTeam");
        const awayTeamBody = object(body.awayTeam, "awayTeam");
        const homeScore = integerField(body, "homeScore");
        const awayScore = integerField(body, "awayScore");
        const tournament = Tournament.create(stringField(tournamentBody, "name"), stringField(tournamentBody, "country"), stringField(tournamentBody, "year"));
        const homeTeam = Team.create(stringField(homeTeamBody, "name"), stringField(homeTeamBody, "colorPrimary"), stringField(homeTeamBody, "colorSecondary"));
        const awayTeam = Team.create(stringField(awayTeamBody, "name"), stringField(awayTeamBody, "colorPrimary"), stringField(awayTeamBody, "colorSecondary"));
        const game = Game.create(dateField(body, "date"), tournament, [
            { team: homeTeam, side: "HOME", matchScored: homeScore, matchConceded: awayScore },
            { team: awayTeam, side: "AWAY", matchScored: awayScore, matchConceded: homeScore },
        ], stringField(body, "stadiumName"), homeScore, awayScore);
        const saved = await this.repository.save(game);
        response.status(201).json(gameResponse(saved));
    };
    list = async (_request, response) => {
        const games = await this.repository.list();
        response.json(games.map(gameResponse));
    };
    find = async (request, response) => {
        const game = await this.repository.find(routeParam(request.params.id, "id"));
        if (!game) {
            throw new HttpError(404, "Game not found");
        }
        response.json(gameResponse(game));
    };
    delete = async (request, response) => {
        const id = routeParam(request.params.id, "id");
        const game = await this.repository.find(id);
        if (!game) {
            throw new HttpError(404, "Game not found");
        }
        await this.repository.delete(id);
        response.status(204).send();
    };
}
//# sourceMappingURL=game.controller.js.map