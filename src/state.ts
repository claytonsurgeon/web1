import { Contacts } from "/db.ts";

export interface State {
	contacts: Contacts;
	q?: string;
}
