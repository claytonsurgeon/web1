import { rHTML } from "../rHTML.ts";

export const rIndex = (): string =>
	rHTML(html`
		<div>
			<a href="/contacts">Contacts</a>
			<a href="/settings">Settings</a>
			<a href="/help">Help</a>
		</div>
	`);
