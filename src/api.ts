import axios, { AxiosResponse } from "axios";
import * as ApiLeague from "./types/api-league.js";
import * as EnrichedLeague from "./types/league.js";
import { Match, MatchResult } from "./types/match-result.js";
import { Id } from "./types/id.js";
import { generateError } from "./util.js";
import { DayPredictions } from "./types/prediction.js";
import { User } from "./types/user.js";
import { PlayoffPredictions } from "./types/playoff-prediction.js";
import { Team } from "./types/team.js";
import { Reminder } from "./types/reminder.js";
import { AuthResponse } from "./types/auth-response.js";
import { LeagueSummary } from "./types/league.js";

const url = process.env.BACKEND_URL;

export async function getLeaguesForUser(userId: Id, backendToken: string): Promise<LeagueSummary[]> {
	let leaguesResponse: AxiosResponse<LeagueSummary[]>;
	try {
		leaguesResponse = await axios<LeagueSummary[]>({
			method: "get",
			url: `${url}/league/userId/${userId}`,
			responseType: "json",
			headers: {
				Authorization: `Bearer ${backendToken}`,
			},
		});
	} catch (e) {
		throw generateError(e);
	}

	return leaguesResponse.data;
}

export async function getLeagueById(leagueId: Id, backendToken: string): Promise<EnrichedLeague.League> {
	let leagueResponse: AxiosResponse<ApiLeague.League>;
	try {
		leagueResponse = await axios<ApiLeague.League>({
			method: "get",
			url: `${url}/league/id/${leagueId}`,
			responseType: "json",
			headers: {
				Authorization: `Bearer ${backendToken}`,
			},
		});
	} catch (e) {
		throw generateError(e);
	}

	return enrichLeague(leagueResponse.data);
}

export async function getCurrentDayMatches(leagueId: Id, backendToken: string): Promise<Match[]> {
	let currentDayResponse: AxiosResponse<Match[]>;
	try {
		currentDayResponse = await axios<Match[]>({
			method: "get",
			url: `${url}/match/leagueId/${leagueId}`,
			responseType: "json",
			headers: {
				Authorization: `Bearer ${backendToken}`,
			},
		});
		currentDayResponse.data.forEach((m) => (m.date = new Date(m.date)));
	} catch (e) {
		throw generateError(e);
	}

	return currentDayResponse.data;
}

export async function getResultsFromDay(leagueId: Id, day: number, backendToken: string): Promise<MatchResult[]> {
	let resultsResponse: AxiosResponse<MatchResult[]>;
	try {
		resultsResponse = await axios<MatchResult[]>({
			method: "get",
			url: `${url}/match/results/leagueId/${leagueId}/day/${day}`,
			responseType: "json",
			headers: {
				Authorization: `Bearer ${backendToken}`,
			},
		});
		resultsResponse.data.forEach((m) => (m.date = new Date(m.date)));
	} catch (e) {
		throw generateError(e);
	}

	return resultsResponse.data;
}

export async function submitDayPredictions(dayPreds: DayPredictions, backendToken: string) {
	try {
		await axios<DayPredictions>({
			method: "put",
			url: `${url}/match/predictions`,
			data: dayPreds,
			responseType: "json",
			headers: {
				Authorization: `Bearer ${backendToken}`,
			},
		});
	} catch (e) {
		throw generateError(e);
	}
}

export async function authPredictionUser(token: string): Promise<AuthResponse> {
	let authResponse: AxiosResponse<AuthResponse>;
	try {
		authResponse = await axios<AuthResponse>({
			method: "post",
			url: `${url}/auth/`,
			responseType: "json",
			data: { token: token },
		});
	} catch (e) {
		throw generateError(e);
	}

	return authResponse.data;
}

export async function getDayPredictions(
	userId: string,
	leagueId: Id,
	backendToken: string
): Promise<DayPredictions | undefined> {
	let dayPredsResponse: AxiosResponse<DayPredictions>;
	try {
		dayPredsResponse = await axios<DayPredictions>({
			method: "get",
			url: `${url}/match/predictions/userId/${userId}/leagueId/${leagueId}`,
			responseType: "json",
			headers: {
				Authorization: `Bearer ${backendToken}`,
			},
		});
		dayPredsResponse.data.date = new Date(dayPredsResponse.data.date);
	} catch (e: any) {
		if (e.response?.status === 404) {
			return undefined;
		}
		throw generateError(e);
	}

	return dayPredsResponse.data;
}

export async function getPlayoffPredictions(
	userId: string,
	leagueId: Id,
	backendToken: string
): Promise<PlayoffPredictions | undefined> {
	let playoffPredsResponse: AxiosResponse<PlayoffPredictions>;
	try {
		playoffPredsResponse = await axios<PlayoffPredictions>({
			method: "get",
			url: `${url}/prediction/playoff/userId/${userId}/leagueId/${leagueId}`,
			responseType: "json",
			headers: {
				Authorization: `Bearer ${backendToken}`,
			},
		});
		playoffPredsResponse.data.date = new Date(playoffPredsResponse.data.date);
	} catch (e: any) {
		if (e.response?.status === 404) {
			return undefined;
		}
		throw generateError(e);
	}

	return playoffPredsResponse.data;
}

export async function submitPlayoffPredictions(playoffPreds: PlayoffPredictions, backendToken: string) {
	try {
		await axios<PlayoffPredictions>({
			method: "put",
			url: `${url}/prediction/playoff`,
			data: playoffPreds,
			responseType: "json",
			headers: {
				Authorization: `Bearer ${backendToken}`,
			},
		});
	} catch (e) {
		throw generateError(e);
	}
}

export async function getUsersToRemind(leagueId: Id, password: string) {
	let reminderResponse: AxiosResponse<Reminder>;
	try {
		reminderResponse = await axios<Reminder>({
			method: "get",
			url: `${url}/reminder/voting/leagueId/${leagueId}`,
			auth: { username: "", password: password },
			responseType: "json",
		});

		reminderResponse.data.firstMatchDate = new Date(reminderResponse.data.firstMatchDate);
	} catch (e) {
		throw generateError(e);
	}

	return reminderResponse.data;
}

function enrichLeague(league: ApiLeague.League): EnrichedLeague.League {
	const ldm = getLeagueDaysMap(league.leagueDays);
	const usm = getUserTotalScoresMap(league.userScores);
	const tm = getTeamsMap(league.teams);

	const enrichedLeague: EnrichedLeague.League = {
		id: league.id,
		name: league.name,
		tournamentId: league.tournamentId,
		tournamentName: league.tournamentName,
		teams: tm,
		finished: league.finished,
		daysMap: ldm,
		userScores: usm,
		maxScore: league.maxScore,
		settings: league.settings,
	};

	return enrichedLeague;
}

function getUserTotalScoresMap(userScores: ApiLeague.UserScore[]): Map<User, number> {
	const usm = new Map<User, number>();

	userScores.forEach((us) => {
		usm.set(us.user, us.score);
	});

	return usm;
}

function getTeamsMap(teams: Team[]): Map<Id, Team> {
	const tm = new Map<Id, Team>();

	teams.forEach((team) => {
		tm.set(team.id, team);
	});

	return tm;
}

function getPredictionsMap(predictions: ApiLeague.PredictionResult[]): Map<Id, EnrichedLeague.PredictionResult> {
	const predsMap = new Map<Id, EnrichedLeague.PredictionResult>();

	predictions.forEach((apiPrediction) => {
		const prediction: EnrichedLeague.PredictionResult = {
			matchId: apiPrediction.matchId,
			predictionTeamId: apiPrediction.predictionTeamId,
			wasCorrect: apiPrediction.wasCorrect,
		};
		predsMap.set(apiPrediction.matchId, prediction);
	});

	return predsMap;
}

function getUserDayScoresMap(
	userDayScores: ApiLeague.UserLeagueDayResults[]
): Map<string, EnrichedLeague.UserLeagueDayResults> {
	const usm = new Map<string, EnrichedLeague.UserLeagueDayResults>();

	userDayScores.forEach((apiUserDayScore) => {
		const userDayScore: EnrichedLeague.UserLeagueDayResults = {
			user: apiUserDayScore.user,
			dayNumber: apiUserDayScore.dayNumber,
			dayScore: apiUserDayScore.dayScore,
			runningDayScore: apiUserDayScore.runningDayScore,
			predictions: getPredictionsMap(apiUserDayScore.predictions),
		};
		usm.set(apiUserDayScore.user.id, userDayScore);
	});

	return usm;
}

function getLeagueDaysMap(leagueDays: ApiLeague.LeagueDay[]): Map<number, EnrichedLeague.LeagueDay> {
	const ldm = new Map<number, EnrichedLeague.LeagueDay>();

	leagueDays.forEach((apiLeagueDay) => {
		const leagueDay: EnrichedLeague.LeagueDay = {
			day: apiLeagueDay.day,
			userScores: getUserDayScoresMap(apiLeagueDay.userDayScores),
			maxScore: apiLeagueDay.maxScore,
			maxRunningDayScore: apiLeagueDay.maxRunningDayScore,
		};
		ldm.set(apiLeagueDay.day, leagueDay);
	});

	return ldm;
}
