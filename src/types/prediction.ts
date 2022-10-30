import { Id } from "./id.js";

export interface DayPredictions {
	userId: string;
	date: Date;
	leagueId: Id;
	predictions: Prediction[];
}

export interface Prediction {
	matchId: Id;
	choiceTeamId: Id;
}
