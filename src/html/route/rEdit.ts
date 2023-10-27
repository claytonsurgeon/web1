import { State } from "/state.ts";
import { rHTML } from "../rHTML.ts";
import { Contact } from "/db.ts";

export const rEdit = (contact: Contact): string =>
	rHTML(
		`
<form action="/contacts/${contact.id}/edit" method="post">
	<fieldset>
		<legend>Contact Values</legend>
			<p>
				<label for="email">Email</label>
				<input name="email" id="email" type="email" placeholder="Email" value="${contact.email}">
				<span class="error">${contact.errors?.email || ""}</span>
			</p>
			<p>
				<label for="first_name">First Name</label>
				<input name="first_name" id="first_name" type="text" placeholder="First Name" value="${
					contact.first
				}">
				<span class="error">${contact.errors?.first || ""}</span>
			</p>
			<p>
				<label for="last_name">Last Name</label>
				<input name="last_name" id="last_name" type="text" placeholder="Last Name" value="${contact.last}">
				<span class="error">${contact.errors?.last || ""}</span>
			</p>
			<p>
				<label for="phone">Phone</label>
				<input name="phone" id="phone" type="text" placeholder="Phone" value="${contact.phone}">
				<span class="error">${contact.errors?.phone || ""}</span>
			</p>
			<button>Save</button>
	</fieldset>
</form>

<form action="/contacts/${contact.id}/delete" method="post">
	<button>Delete Contact</button>
</form>

<p>
	<a href="/contacts">Back</a>
</p>
	`
	);
