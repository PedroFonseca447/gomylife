import type { Request, Response } from "express";
import { Game } from "../../entities/game.js";
import { Team } from "../../entities/team.js";
import { Tournament } from "../../entities/tournament.js";
import type { GameRepository } from "../../repositories/product/game.repository.js";
import { HttpError } from "../http-error.js";
import { gameResponse } from "../presenters.js";
import { dateField, integerField, object, routeParam, stringField } from "../validation.js";

export class GameController {
  public constructor(private readonly repository: GameRepository) {}

  public create = async (request: Request, response: Response) => {
    const body = object(request.body);
    const tournamentBody = object(body.tournament, "tournament");
    const homeTeamBody = object(body.homeTeam, "homeTeam");
    const awayTeamBody = object(body.awayTeam, "awayTeam");
    const homeScore = integerField(body, "homeScore");
    const awayScore = integerField(body, "awayScore");

    const tournament = Tournament.create(
      stringField(tournamentBody, "name"),
      stringField(tournamentBody, "country"),
      stringField(tournamentBody, "year"),
    );
    const homeTeam = Team.create(
      stringField(homeTeamBody, "name"),
      stringField(homeTeamBody, "colorPrimary"),
      stringField(homeTeamBody, "colorSecondary"),
    );
    const awayTeam = Team.create(
      stringField(awayTeamBody, "name"),
      stringField(awayTeamBody, "colorPrimary"),
      stringField(awayTeamBody, "colorSecondary"),
    );

    const game = Game.create(
      dateField(body, "date"),
      tournament,
      [
        { team: homeTeam, side: "HOME", matchScored: homeScore, matchConceded: awayScore },
        { team: awayTeam, side: "AWAY", matchScored: awayScore, matchConceded: homeScore },
      ],
      stringField(body, "stadiumName"),
      homeScore,
      awayScore,
    );

    const saved = await this.repository.save(game);
    response.status(201).json(gameResponse(saved));
  };

  public list = async (_request: Request, response: Response) => {
    const games = await this.repository.list();
    response.json(games.map(gameResponse));
  };

  public find = async (request: Request, response: Response) => {
    const game = await this.repository.find(routeParam(request.params.id, "id"));
    if (!game) {
      throw new HttpError(404, "Game not found");
    } 
    response.json(gameResponse(game));
  };

  public delete = async (request: Request, response: Response) => {
    const id = routeParam(request.params.id, "id");
    const game = await this.repository.find(id);
    if (!game) {
      throw new HttpError(404, "Game not found");
    } 
    await this.repository.delete(id);
    response.status(204).send();
  };
}