import { Application, Router } from "oak";
import {
	Contact,
	contact_all,
	contact_search,
	createContact,
	getContact,
	updateContact,
	deleteContact,
} from "/db.ts";
import { State } from "/state.ts";
import { rIndex } from "/html/route/rIndex.ts";
import { rContacts } from "/html/route/rContacts.ts";
import { rNewContact } from "/html/route/rNewContact.ts";
import { rShow } from "/html/route/rShow.ts";
import { rEdit } from "/html/route/rEdit.ts";

const app = new Application();
const api = new Router();

api.get("/", ctx => {
	// ctx.response.body = rIndex();
	ctx.response.redirect("/contacts");
});

api.get("/contacts", async ctx => {
	const q = ctx.request.url.searchParams.get("q") || "";

	const state: State = {
		q,
		contacts: q ? contact_search(q) : await contact_all(),
	};

	ctx.response.body = rContacts(state);
});

api.get("/contacts/new", ctx => {
	const contact: Contact = {
		first: "",
		last: "",
		phone: "",
		email: "",
		id: "",

		errors: {},
	};

	ctx.response.body = rNewContact(contact);
});

api.post("/contacts/new", async ctx => {
	const form = await ctx.request.body({ type: "form" }).value;

	const input_contact: Contact = {
		first: form.get("first_name") || "",
		last: form.get("last_name") || "",
		phone: form.get("phone") || "",
		email: form.get("email") || "",
		id: "",

		errors: {},
	};

	console.log(input_contact);
	// attempt to store contact
	const contact = await createContact(input_contact);

	for (const _errorType in contact.errors) {
		ctx.response.body = rNewContact(contact);
		return;
	}
	ctx.response.redirect("/contacts");
});

api.get("/contacts/:uuid", async ctx => {
	const contact = await getContact(ctx.params.uuid);

	if (contact) {
		ctx.response.body = rShow(contact);
	} else {
		ctx.response.redirect("/contacts");
	}
});

api.get("/contacts/:uuid/edit", async ctx => {
	const contact = await getContact(ctx.params.uuid);

	if (contact) {
		ctx.response.body = rEdit(contact);
	} else {
		ctx.response.redirect("/contacts");
	}
});

api.post("/contacts/:uuid/edit", async ctx => {
	const form = await ctx.request.body({ type: "form" }).value;

	const contact = await updateContact({
		first: form.get("first_name") || "",
		last: form.get("last_name") || "",
		phone: form.get("phone") || "",
		email: form.get("email") || "",
		id: ctx.params.uuid,

		errors: {},
	});

	for (const _errorType in contact.errors) {
		ctx.response.body = rEdit(contact);
		return;
	}
	ctx.response.redirect(`/contacts/${contact.id}`);
});

api.post("/contacts/:uuid/delete", async ctx => {
	deleteContact(ctx.params.uuid);
	ctx.response.redirect(`/contacts`);
});

//
//
app.use(api.routes());

app.use(async (context, next) => {
	try {
		// console.log(context.request.url.pathname);
		// console.log(`${Deno.cwd()}/src/static`);
		await context.send({
			path: context.request.url.pathname,
			root: `${Deno.cwd()}/src/static`,
		});
	} catch (_e) {
		// console.error(_e);
		await next();
	}
});

app.use(api.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
	console.log(
		`Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`
	);
});

// await app.listen({ port: 8000 });
await app.listen({ hostname: "0.0.0.0", port: 8000 });
