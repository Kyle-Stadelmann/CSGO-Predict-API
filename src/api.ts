import axios, { AxiosResponse } from "axios";
import * as ApiLeague from "./types/api-league.js";
import * as EnrichedLeague from "./types/league.js";
import { Match, MatchResult } from "./types/match-result.js";
import { Id } from "./types/id.js";
import { generateError } from "./util.js";
import { DayPredictions } from "./types/prediction.js";
import { User } from "./types/user.js";

const uri = process.env.REACT_APP_BACKEND_URI;

export async function getLeagueById(leagueId: Id): Promise<EnrichedLeague.League> {
	let leagueResponse: AxiosResponse<ApiLeague.League>;
	try {
		leagueResponse = await axios<ApiLeague.League>({
			method: "get",
			url: `${uri}/league/id/${leagueId}`,
			responseType: "json",
			withCredentials: true
		});
	} catch (e) {
		throw generateError(e);
	}

	return enrichLeague(leagueResponse.data);
}

export async function getCurrentDayMatches(tournamentId: Id): Promise<Match[]> {
	let currentDayResponse: AxiosResponse<Match[]>;
	try {
		currentDayResponse = await axios<Match[]>({
			method: "get",
			url: `${uri}/match/tournamentId/${tournamentId}`,
			responseType: "json",
			withCredentials: true
		});
	} catch (e) {
		throw generateError(e);
	}

	return currentDayResponse.data;
}

export async function getResultsFromDay(tournamentId: Id, day: number): Promise<MatchResult[]> {
	let resultsResponse: AxiosResponse<MatchResult[]>;
	try {
		resultsResponse = await axios<MatchResult[]>({
			method: "get",
			url: `${uri}/match/results/tournamentId/${tournamentId}/day/${day}`,
			responseType: "json",
			withCredentials: true
		});
	} catch (e) {
		throw generateError(e);
	}

	return resultsResponse.data;
}

export async function submitDayPredictions(dayPreds: DayPredictions) {
	try {
		await axios<DayPredictions>({
			method: "put",
			url: `${uri}/match/predictions`,
			data: dayPreds,
			responseType: "json",
			withCredentials: true
		});
	} catch (e) {
		throw generateError(e);
	}
}

export async function authPredictionUser(token: string): Promise<User> {
	let authResponse: AxiosResponse<User>;
	try {
		authResponse = await axios<User>({
			method: "post",
			url: `${uri}/auth/`,
			responseType: "json",
			data: {"token": token},
			withCredentials: true
		});
	} catch (e) {
		throw generateError(e);
	}

	return authResponse.data;
}


function enrichLeague(league: ApiLeague.League): EnrichedLeague.League {
	const ldm = getLeagueDaysMap(league.leagueDays);
	const usm = getUserTotalScoresMap(league.userScores);

	const enrichedLeague: EnrichedLeague.League = {
		id: league.id,
		tournamentId: league.tournamentId,
		finished: league.finished,
		daysMap: ldm,
		userScores: usm,
	};

	return enrichedLeague;
}

function getUserTotalScoresMap(userScores: ApiLeague.UserScore[]): Map<string, number> {
	const usm = new Map<string, number>();

	userScores.forEach((us) => {
		usm.set(us.userId, us.score);
	});

	return usm;
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
			userId: apiUserDayScore.userId,
			dayNumber: apiUserDayScore.dayNumber,
			dayScore: apiUserDayScore.dayScore,
			predictions: getPredictionsMap(apiUserDayScore.predictions),
		};
		usm.set(apiUserDayScore.userId, userDayScore);
	});

	return usm;
}

function getLeagueDaysMap(leagueDays: ApiLeague.LeagueDay[]): Map<number, EnrichedLeague.LeagueDay> {
	const ldm = new Map<number, EnrichedLeague.LeagueDay>();

	leagueDays.forEach((apiLeagueDay) => {
		const leagueDay: EnrichedLeague.LeagueDay = {
			day: apiLeagueDay.day,
			userScores: getUserDayScoresMap(apiLeagueDay.userDayScores),
		};
		ldm.set(apiLeagueDay.day, leagueDay);
	});

	return ldm;
}
