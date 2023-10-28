import { Contacts } from "/db.ts";

export interface State {
	contacts: Contacts;
	count: number;
	page: number;
	q?: string;
}
