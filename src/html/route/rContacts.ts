import { State } from "/state.ts";
import { rHTML } from "../rHTML.ts";
import { Contacts } from "/db.ts";

export const rContacts = (state: State): string => {
	return rHTML(
		tForm(state.q) +
			tTable(state.contacts, state.q, state.count, state.page) +
			tAddContact(state.count) +
			tPaging(state.count, state.page)
	);
};
const tForm = (q = ""): string => {
	return html`
		<form action="/contacts" method="get" class="tool-bar">
			<label for="search">Search Term</label>
			<input
				id="search"
				type="search"
				name="q"
				value="${q}"
				hx-get="/contacts"
				hx-trigger="search, input delay:250ms"
				hx-target="tbody"
				hx-replace-url="true"
				hx-indicator="#spinner"
			/>
			<input type="submit" value="Search" />
			<img
				id="spinner"
				class="htmx-indicator"
				src="/img/spinning-circles.svg"
				alt="Request In Flight..."
			/>
		</form>
	`;
};

const tTable = (contacts: Contacts, q: string | undefined, count: number, page: number): string => {
	console.log({ page, count });

	const more =
		(page + 1) * 8 >= count
			? ""
			: html`
					<tr>
						<td colspan="5" style="text-align: center">
							<button
								hx-target="closest tr"
								hx-swap="outerHTML"
								hx-select="tbody > tr"
								hx-get="/contacts?page=${page + 1}"
							>
								Load More
							</button>
						</td>
					</tr>
			  `;

	// const more =
	// 	(page + 1) * 8 >= count || q
	// 		? ""
	// 		: html`
	// 				<tr>
	// 					<td colspan="5" style="text-align: center">
	// 						<button
	// 							hx-trigger="revealed"
	// 							hx-target="closest tr"
	// 							hx-swap="outerHTML"
	// 							hx-select="tbody > tr"
	// 							hx-get="/contacts?page=${page + 1}"
	// 						>
	// 							Load More
	// 						</button>
	// 					</td>
	// 				</tr>
	// 		  `;

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
				${tRows(contacts)} ${more}
			</tbody>
		</table>
	`;
};

export const tRows = (contacts: Contacts): string => {
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

	return rows;
};

const tAddContact = (count: number): string => {
	return html`
		<p><a href="/contacts/new">Add Contact</a> <span>(${count} total Contacts)</span></p>
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
