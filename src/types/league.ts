import { Id } from "./id.js";
import { User } from "./user.js";

export interface League {
	id: Id;
	name: string;
	tournamentId: Id;
	tournamentName: string;
	finished: boolean;
	daysMap: Map<number, LeagueDay>; // day number -> LeagueDay
	userScores: Map<User, number>; // user -> total score so far
	maxScore: number;
	settings: LeagueSettings;
}

export interface LeagueDay {
	day: number;
	userScores: Map<string, UserLeagueDayResults>; // userId -> UserLeagueDayResults
	maxScore: number;
	maxRunningDayScore: number;
}

export interface UserLeagueDayResults {
	user: User;
	dayNumber: number;
	dayScore: number;
	runningDayScore: number;
	predictions: Map<Id, PredictionResult>; // matchId -> PredictionResult
}

export interface PredictionResult {
	matchId: Id;
	predictionTeamId: Id;
	wasCorrect: boolean;
}

export interface LeagueSettings {
	allowMidDayMatches: boolean;
	allowPlayoffPredictions: boolean;
	allowDefaultPredictions: boolean;
}
