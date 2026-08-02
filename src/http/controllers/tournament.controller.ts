import type { Request, Response } from "express";
import { Tournament } from "../../entities/tournament.js";
import type { TournamentRepository } from "../../repositories/product/tournament.repository.js";
import { HttpError } from "../http-error.js";
import { tournamentResponse } from "../presenters.js";
import { object, routeParam, stringField } from "../validation.js";

export class TournamentController {
  public constructor(private readonly repository: TournamentRepository) {}

  public create = async (request: Request, response: Response) => {
    const body = object(request.body);
    const saved = await this.repository.save(
      Tournament.create(
        stringField(body, "name"),
        stringField(body, "country"),
        stringField(body, "year"),
      ),
    );
    response.status(201).json(tournamentResponse(saved));
  };

  public list = async (_request: Request, response: Response) => {
    const tournaments = await this.repository.list();
    response.json(tournaments.map(tournamentResponse));
  };

  public find = async (request: Request, response: Response) => {
    const tournament = await this.repository.find(routeParam(request.params.id, "id"));
    if (!tournament){
      throw new HttpError(404, "Tournament not found");
    } 
    response.json(tournamentResponse(tournament));
  };
}