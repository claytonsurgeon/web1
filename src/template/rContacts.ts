import { Contacts } from "../db.ts";
import { rHTML } from "./rHTML.ts";

export const rContacts = (contacts: Contacts, slot = "", q = "") => {
	return rHTML(`
	${slot}
<form action="/contacts" method="get" class="tool-bar">
	<label for="search">Search Term</label>
	<input id="search" type="search" name="q" value="${q}"/>
	<input type="submit" value="Search"/>
</form>
	`);
};
