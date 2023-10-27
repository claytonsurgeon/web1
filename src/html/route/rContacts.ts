import { State } from "/state.ts";
import { rHTML } from "../rHTML.ts";
import { tForm, tTable, tAddContact } from "../template/tContacts.ts";

export const rContacts = (state: State): string => {
	return rHTML(tForm(state.contacts, state.q) + tTable(state.contacts) + tAddContact());
};
