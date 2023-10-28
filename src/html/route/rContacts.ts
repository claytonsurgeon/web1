import { State } from "/state.ts";
import { rHTML } from "../rHTML.ts";
import { Contacts } from "/db.ts";

export const rContacts = (state: State): string => {
	const count = Object.keys(state.contacts).length;
	return rHTML(
		tForm(state.q) + tTable(state.contacts) + tAddContact() + tPaging(state.count, state.page)
	);
};
const tForm = (q = ""): string => {
	return html`
		<form action="/contacts" method="get" class="tool-bar">
			<label for="search">Search Term</label>
			<input id="search" type="search" name="q" value="${q}" />
			<input type="submit" value="Search" />
		</form>
	`;
};

const tTable = (contacts: Contacts): string => {
	let rows = "";

	for (const id in contacts) {
		const contact = contacts[id];
		rows += html` <tr>
			<td>${contact.first}</td>
			<td>${contact.last}</td>
			<td>${contact.phone}</td>
			<td>${contact.email}</td>
			<td>
				<a href="/contacts/${contact.id}/edit">Edit</a>
				<a href="/contacts/${id}">View</a>
			</td>
		</tr>`;
	}

	return html`
		<table>
			<thead>
				<tr>
					<th>First</th>
					<th>Last</th>

					<th>Phone</th>
					<th>Email</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				${rows}
			</tbody>
		</table>
	`;
};

const tAddContact = (): string => {
	return html`
		<p>
			<a href="/contacts/new">Add Contact</a>
		</p>
	`;
};

const tPaging = (count: number, page: number): string => html`
	<div>
		<span>
			${page > 0 ? html`<a href="/contacts?page=${page - 1}">Previous</a>` : ""}
			${(page + 1) * 8 < count ? html`<a href="/contacts?page=${page + 1}">Next</a>` : ""}
		</span>
	</div>
`;
