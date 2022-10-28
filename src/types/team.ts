import { Id } from "./id.js";

export interface Country {
    name: string;
    code: string;
}

export interface Team {
	id: Id;
	name: string;
	logo_url?: string;
	country: Country;
	rank?: number;
}
