import { State } from "../state.ts";
import { rForm, rTable, rAddContact } from "./rContacts.ts";
import { rHTML } from "./rHTML.ts";

export const rApp = (state: State): string => {
	return rHTML(rForm(state.contacts, state.q) + rTable(state.contacts) + rAddContact());
};
