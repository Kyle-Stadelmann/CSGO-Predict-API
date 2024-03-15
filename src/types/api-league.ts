import { Id } from "./id.js";
import { User } from "./user.js";

export interface League {
	id: Id;
	name: string;
	tournamentId: Id;
	tournamentName: string;
	finished: boolean;
	leagueDays: LeagueDay[];
	userScores: UserScore[];
	maxScore: number;
	settings: LeagueSettings;
}

export interface UserScore {
	userId: string;
	score: number;
}

export interface LeagueDay {
	day: number;
	userDayScores: UserLeagueDayResults[];
	maxScore: number;
	maxRunningDayScore: number;
}

export interface UserLeagueDayResults {
	user: User;
	dayNumber: number;
	dayScore: number;
	runningDayScore: number;
	predictions: PredictionResult[];
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
