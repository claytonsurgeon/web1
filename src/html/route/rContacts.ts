import { rHTML } from "../rHTML.ts";
import { Contacts, State } from "../../types.ts";
import { Archiver } from "../../archiver.ts";

export const rContacts = (state: State, archiver: Archiver): string => {
	return rHTML(
		tForm(state.q) +
			tArchiveUI(archiver) +
			tTable(state.contacts, state.count, state.page) +
			tAddContact(state.count) +
			tPaging(state.count, state.page)
	);
};
const tForm = (q = ""): string => {
	return html`
		<form action="/contacts" method="get" class="tool-bar">
			<label for="search-input">Search Term</label>
			<input
				id="search-input"
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

export const tArchiveUI = (archiver: Archiver): string => {
	const status = archiver.status();

	let content = "";

	if (status == "waiting") {
		content = html` <button hx-post="/contacts/archive">Download Contact Archive</button> `;
	} else if (status == "running") {
		content = html`
			<div hx-get="/contacts/archive" hx-trigger="load delay:500ms">
				Creating Archive...
				<div class="progress">
					<div
						id="archive-progress"
						class="progress-bar"
						role="progressbar"
						aria-valuenow="${archiver.progress() * 100}"
						style="width:${archiver.progress() * 100}%"
					></div>
				</div>
			</div>
		`;
	} else if (status == "complete") {
		content = html`
			<a hx-boost="false" href="/contacts/archive/file"
				>Archive Ready! Click here to download. &downarrow;</a
			>
			<button hx-delete="/contacts/archive">Clear Download</button>
		`;
	}

	return html` <div id="archive-ui" hx-target="this" hx-swap="outerHTML">${content}</div> `;

	// `;
};

const tTable = (contacts: Contacts, count: number, page: number): string => {
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
		<form>
			<button
				hx-delete="/contacts"
				hx-confirm="Are you sure you want to delete these contacts?"
				hx-target="body"
			>
				Delete Selected Contacts
			</button>

			<table>
				<thead>
					<tr>
						<th>Select</th>
						<th>First</th>
						<th>Last</th>

						<th>Phone</th>
						<th>Email</th>
						<th>Options</th>
					</tr>
				</thead>
				<tbody>
					${tRows(contacts)} ${more}
				</tbody>
			</table>
		</form>
	`;
};

export const tRows = (contacts: Contacts): string => {
	let rows = "";

	for (const id in contacts) {
		const contact = contacts[id];
		rows += html` <tr>
			<td><input type="checkbox" name="selected_contact_ids" value="${contact.id}" /></td>
			<td>${contact.first}</td>
			<td>${contact.last}</td>
			<td>${contact.phone}</td>
			<td>${contact.email}</td>
			<td>
				<a href="/contacts/${contact.id}/edit">Edit</a>
				<a href="/contacts/${id}">View</a>
				<a
					href="#"
					hx-swap="outerHTML swap:1s"
					hx-delete="/contacts/${contact.id}"
					hx-confirm="Are you sure you want to delete this contact?"
					hx-target="closest tr"
					>Delete</a
				>
			</td>
		</tr>`;
	}

	return rows;
};

const tAddContact = (count: number): string => {
	return html`
		<p>
			<a href="/contacts/new">Add Contact</a>
			<span hx-get="/contacts/count" hx-trigger="revealed">
				(totaling contacts...)
				<img id="spinner" class="htmx-indicator" src="/img/spinning-circles.svg" />
			</span>
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
