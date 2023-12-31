import { rHTML } from "../rHTML.ts";
import { Contact } from "../../types.ts";

export const rShow = (contact: Contact): string =>
	rHTML(html`
		<h1>${contact.first} ${contact.last}</h1>

		<div>
			<div>Phone: ${contact.phone}</div>
			<div>Email: ${contact.email}</div>
		</div>

		<p>
			<a href="/contacts/${contact.id}/edit">Edit</a>
			<a href="/contacts">Back</a>
		</p>
	`);
