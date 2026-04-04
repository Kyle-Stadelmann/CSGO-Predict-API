import { Id } from "./id.js";
import { Team } from "./team.js";
import { User } from "./user.js";

export interface LeagueSummary {
	id: Id;
	name: string;
	tournamentId: Id;
	tournamentName: string;
	startDate: Date;
	finished: boolean;
	settings: LeagueSettings;
	public: boolean;
}

export interface DetailedLeagueSummary extends LeagueSummary {
	memberCount: number;
	creator: User;
}

export interface League {
	id: Id;
	name: string;
	tournamentId: Id;
	tournamentName: string;
	teams: Map<Id, Team>; // teamId -> Team
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
