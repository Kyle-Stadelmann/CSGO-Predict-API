import { Id } from "./id.js";

export interface League {
	id: Id;
	tournamentId: Id;
	finished: boolean;
	daysMap: Map<number, LeagueDay>; // day number -> LeagueDay
	userScores: Map<Id, number>; // userId -> total score so far
}

// Note: day 2 currently hardcoded as a skipped day since it would require mid day predictions
export interface LeagueDay {
	day: number;
	userScores: Map<Id, UserLeagueDayResults>; // userId -> UserLeagueDayResults
}

export interface UserLeagueDayResults {
	userId: Id;
	dayNumber: number;
	dayScore: number;
	predictions: Map<Id, PredictionResult>; // matchId -> PredictionResults
}

export interface PredictionResult {
	matchId: Id;
	predictionTeamId: Id;
	wasCorrect: boolean;
}
