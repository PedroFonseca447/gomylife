import { Tournament } from "../../entities/tournament.js";
import { HttpError } from "../http-error.js";
import { tournamentResponse } from "../presenters.js";
import { object, routeParam, stringField } from "../validation.js";
export class TournamentController {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    create = async (request, response) => {
        const body = object(request.body);
        const saved = await this.repository.save(Tournament.create(stringField(body, "name"), stringField(body, "country"), stringField(body, "year")));
        response.status(201).json(tournamentResponse(saved));
    };
    list = async (_request, response) => {
        const tournaments = await this.repository.list();
        response.json(tournaments.map(tournamentResponse));
    };
    find = async (request, response) => {
        const tournament = await this.repository.find(routeParam(request.params.id, "id"));
        if (!tournament) {
            throw new HttpError(404, "Tournament not found");
        }
        response.json(tournamentResponse(tournament));
    };
}
//# sourceMappingURL=tournament.controller.js.map