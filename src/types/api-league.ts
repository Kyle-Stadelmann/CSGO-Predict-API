import { Id } from "./id.js";

export interface League {
	id: Id;
	tournamentId: Id;
	finished: boolean;
	leagueDays: LeagueDay[];
	userScores: UserScore[];
}

export interface UserScore {
	userId: Id;
	score: number;
}

// Note: day 2 currently hardcoded as a skipped day since it would require mid day predictions
export interface LeagueDay {
	day: number;
	userDayScores: UserLeagueDayResults[];
}

export interface UserLeagueDayResults {
	userId: Id;
	dayNumber: number;
	dayScore: number;
	predictions: PredictionResults[];
}

export interface PredictionResults {
	matchId: Id;
	predictionTeamId: Id;
	wasCorrect: boolean;
}
