import { State } from "/state.ts";
import { rHTML } from "../rHTML.ts";
import { Contact, Contacts } from "/db.ts";
// import { tForm, tTable, tAddContact } from "../template/tContacts.ts";

export const rContacts = (state: State): string => {
	return rHTML(tForm(state.contacts, state.q) + tTable(state.contacts) + tAddContact());
};

export const tForm = (contacts: Contacts, q = ""): string => {
	return `
<form action="/contacts" method="get" class="tool-bar">
	<label for="search">Search Term</label>
	<input id="search" type="search" name="q" value="${q}"/>
	<input type="submit" value="Search"/>
</form>
	`;
};

export const tTable = (contacts: Contacts): string => {
	let rows = "";

	for (const id in contacts) {
		const contact = contacts[id];
		rows += `
		<tr>
			<td>${contact.first}</td>
			<td>${contact.last}</td>
			<td>${contact.phone}</td>
			<td>${contact.email}</td>
			<td>
				<a href="/contacts/${contact.id}/edit" >Edit</a>
				<a href="/contacts/${id}">View</a>
			</td>
		</tr>`;
	}

	return `
<table>
<thead>
<tr>
	<th>First</th> <th>Last</th> <th>Phone</th> <th>Email</th> <th></th>
</tr>
</thead>
<tbody>
	${rows}
</tbody>
</table>
	`;
};

export const tAddContact = (): string => {
	return `
<p>
	<a href="/contacts/new">Add Contact</a>
</p>
	`;
};

export const tContacts = (contacts: Contacts, q = ""): string =>
	tForm(contacts, q) + tTable(contacts) + tAddContact();
