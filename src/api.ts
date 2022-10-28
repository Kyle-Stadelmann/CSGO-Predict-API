import axios from "axios";
import { League } from "./types/api-league.js";
import { Match, MatchResult } from "./types/match-result.js";
import { Id } from "./types/id.js";
import { throwError } from "./util.js";
import { DayPrediction } from "./types/api-prediction.js";
import { Prediction } from "./api-types/api-prediction.js";

async function getLeagueById(leagueId: Id): Promise<League> {
    const leagueResponse = await axios<League>({
        method: 'get',
        url: `https://localhost:3846/league/id/${leagueId}`,
        responseType: 'json'
    });
    
    if (leagueResponse.status !== 200) {
        // If non-200 status code, body will be string error message
        throwError(leagueResponse.data, leagueResponse.status, leagueResponse.statusText);
    }

    return leagueResponse.data;
}

async function getCurrentDayMatches(tournamentId: Id): Promise<Match[]> {
    const leagueResponse = await axios<Match[]>({
        method: 'get',
        url: `https://localhost:3846/match/tournamentId/${tournamentId}`,
        responseType: 'json'
    });
    
    if (leagueResponse.status !== 200) {
        // If non-200 status code, body will be string error message
        throwError(leagueResponse.data, leagueResponse.status, leagueResponse.statusText);
    }

    return leagueResponse.data;
}

async function getResultsFromDay(tournamentId: Id, day: number): Promise<MatchResult[]> {
    const leagueResponse = await axios<MatchResult[]>({
        method: 'get',
        url: `https://localhost:3846/match/results/tournamentId/${tournamentId}/day/${day}`,
        responseType: 'json'
    });
    
    if (leagueResponse.status !== 200) {
        // If non-200 status code, body will be string error message
        throwError(leagueResponse.data, leagueResponse.status, leagueResponse.statusText);
    }

    return leagueResponse.data;
}

async function putPrediction(pred: Prediction) {
    const leagueResponse = await axios<Prediction[]>({
        method: 'put',
        url: `https://localhost:3846/match/predictions`,
        responseType: 'json'
    });
    
    if (leagueResponse.status !== 200) {
        // If non-200 status code, body will be string error message
        throwError(leagueResponse.data, leagueResponse.status, leagueResponse.statusText);
    }
}