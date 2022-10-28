import axios from "axios";
import * as ApiLeague from "./types/api-league.js";
import * as EnrichedLeague from "./types/league.js";
import { Match, MatchResult } from "./types/match-result.js";
import { Id } from "./types/id.js";
import { throwError } from "./util.js";
import { DayPredictions } from "./types/prediction.js";
import { Agent } from "https";

const port = 3846;

const httpsAgent = new Agent({
	rejectUnauthorized: false,
});

export async function getLeagueById(leagueId: Id): Promise<EnrichedLeague.League> {
	const leagueResponse = await axios<ApiLeague.League>({
		method: "get",
		url: `https://localhost:${port}/league/id/${leagueId}`,
		responseType: "json",
		httpsAgent: httpsAgent,
	});

	if (leagueResponse.status !== 200) {
		// If non-200 status code, body will be string error message
		throwError(leagueResponse.data, leagueResponse.status, leagueResponse.statusText);
	}

	return enrichLeague(leagueResponse.data);
}

export async function getCurrentDayMatches(tournamentId: Id): Promise<Match[]> {
	const leagueResponse = await axios<Match[]>({
		method: "get",
		url: `https://localhost:${port}/match/tournamentId/${tournamentId}`,
		responseType: "json",
		httpsAgent: httpsAgent,
	});

	if (leagueResponse.status !== 200) {
		// If non-200 status code, body will be string error message
		throwError(leagueResponse.data, leagueResponse.status, leagueResponse.statusText);
	}

	return leagueResponse.data;
}

export async function getResultsFromDay(tournamentId: Id, day: number): Promise<MatchResult[]> {
	const leagueResponse = await axios<MatchResult[]>({
		method: "get",
		url: `https://localhost:${port}/match/results/tournamentId/${tournamentId}/day/${day}`,
		responseType: "json",
		httpsAgent: httpsAgent,
	});

	if (leagueResponse.status !== 200) {
		// If non-200 status code, body will be string error message
		throwError(leagueResponse.data, leagueResponse.status, leagueResponse.statusText);
	}

	return leagueResponse.data;
}

export async function submitDayPredictions(dayPreds: DayPredictions) {
	const leagueResponse = await axios<DayPredictions>({
		method: "put",
		url: `https://localhost:${port}/match/predictions`,
		data: dayPreds,
		responseType: "json",
		httpsAgent: httpsAgent,
	});

	if (leagueResponse.status !== 200) {
		// If non-200 status code, body will be string error message
		throwError(leagueResponse.data, leagueResponse.status, leagueResponse.statusText);
	}
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

function getUserTotalScoresMap(userScores: ApiLeague.UserScore[]): Map<Id, number> {
	const usm = new Map<Id, number>();

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
): Map<Id, EnrichedLeague.UserLeagueDayResults> {
	const usm = new Map<Id, EnrichedLeague.UserLeagueDayResults>();

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
