import { Id } from "./id.js";

export interface PlayoffPredictions {
	userId: string;
    leagueId: Id;
	teamIds: Id[];
	date: Date;
}
