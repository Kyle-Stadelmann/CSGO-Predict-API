import { Id } from "./id.js";

export interface DayPredictions {
	userId: Id;
	date: Date;
	leagueId: Id;
	predictions: Prediction[];
}

export interface Prediction {
	matchId: Id;
	choiceTeamId: Id;
}
