import { Team } from "../../entities/team.js";
import { HttpError } from "../http-error.js";
import { teamResponse } from "../presenters.js";
import { object, routeParam, stringField } from "../validation.js";
export class TeamController {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    create = async (request, response) => {
        const body = object(request.body);
        const saved = await this.repository.save(Team.create(stringField(body, "name"), stringField(body, "colorPrimary"), stringField(body, "colorSecondary")));
        response.status(201).json(teamResponse(saved));
    };
    list = async (_request, response) => {
        const teams = await this.repository.list();
        response.json(teams.map(teamResponse));
    };
    find = async (request, response) => {
        const team = await this.repository.find(routeParam(request.params.id, "id"));
        if (!team) {
            throw new HttpError(404, "Team not found");
        }
        response.json(teamResponse(team));
    };
}
//# sourceMappingURL=team.controller.js.map