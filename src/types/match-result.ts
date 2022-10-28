import { Team } from "./team.js";
import { Id } from "./id.js";

export interface Match {
	id: Id;
	team1: Team;
	team2: Team;
	date: Date;
	format: string;
	eventId: Id;
	tournamentId: Id;
	stars: number;
	day: number;
}

export interface MatchResult extends Match {
	team1Score: number;
	team2Score: number;
	winner: Id;
}
