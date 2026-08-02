import type { Request, Response } from "express";
import { Team } from "../../entities/team.js";
import type { TeamRepository } from "../../repositories/product/team.repository.js";
import { HttpError } from "../http-error.js";
import { teamResponse } from "../presenters.js";
import { object, routeParam, stringField } from "../validation.js";

export class TeamController {
  public constructor(private readonly repository: TeamRepository) {}

  public create = async (request: Request, response: Response) => {
    const body = object(request.body);
    const saved = await this.repository.save(
      Team.create(
        stringField(body, "name"),
        stringField(body, "colorPrimary"),
        stringField(body, "colorSecondary"),
      ),
    );
    response.status(201).json(teamResponse(saved));
  };

  public list = async (_request: Request, response: Response) => {
    const teams = await this.repository.list();
    response.json(teams.map(teamResponse));
  };

  public find = async (request: Request, response: Response) => {
    const team = await this.repository.find(routeParam(request.params.id, "id"));
    if (!team){
      throw new HttpError(404, "Team not found");
    } 
    response.json(teamResponse(team));
  };
}