import { Contacts } from "../db.ts";
import { rHTML } from "./rHTML.ts";

export const rForm = (contacts: Contacts, q = ""): string => {
	return `
<form action="/contacts" method="get" class="tool-bar">
	<label for="search">Search Term</label>
	<input id="search" type="search" name="q" value="${q}"/>
	<input type="submit" value="Search"/>
</form>
	`;
};

export const rTable = (contacts: Contacts): string => {
	let rows = "";

	for (const id in contacts) {
		const contact = contacts[id];
		rows += `
		<tr>
			<td>${contact.first}</td>
			<td>${contact.last}</td>
			<td>${contact.phone}</td>
			<td>${contact.email}</td>
			<td><a href="/contacts/${contact.id}/edit">Edit</a>
			<a href="/contacts/${id}">View</a></td>
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

export const rAddContact = (): string => {
	return `
<p>
	<a href="/contacts/new">Add Contact</a>
</p>
	`;
};

export const rContacts = (contacts: Contacts, q = ""): string =>
	rForm(contacts, q) + rTable(contacts) + rAddContact();