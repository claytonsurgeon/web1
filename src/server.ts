// import "../window.ts";

import { Application, Router } from "oak";
import { Contact, Contacts, State } from "./types.ts";
import {
	contact_all,
	contact_search,
	createContact,
	getContact,
	updateContact,
	deleteContact,
	validateEmail,
	getContacts,
	getContactsCount,
} from "./db.ts";

import { rIndex } from "./html/route/rIndex.ts";
import { rContacts, tRows } from "./html/route/rContacts.ts";
import { rNewContact } from "./html/route/rNewContact.ts";
import { rShow } from "./html/route/rShow.ts";
import { rEdit } from "./html/route/rEdit.ts";

export const app = new Application();
const api = new Router();

app.use(async (context, next) => {
	if (!context.request.url.pathname.includes("css")) {
		console.log(
			`[${new Date().toLocaleTimeString()}] ${context.request.method} ${
				context.request.url.pathname
			}`
		);
	}
	await next(); // Important: This line calls the next middleware in the stack.
});

api.get("/", ctx => {
	// ctx.response.body = rIndex();
	ctx.response.redirect("/contacts");
});

api.get("/contacts", async ctx => {
	const q = ctx.request.url.searchParams.get("q")?.toLowerCase() || "";
	const page = Number(ctx.request.url.searchParams.get("page") || "0");

	if (q) {
		const contacts = await contact_search(q);
		const state: State = {
			q,
			page,
			count: 0,
			contacts,
		};

		if (ctx.request.headers.get("hx-trigger") == "search-input") {
			ctx.response.body = tRows(contacts);
			// ctx.response.body = rContacts(state);
		} else {
			ctx.response.body = rContacts(state);
		}
	} else {
		const contacts = await getContacts(page * 8, 8);
		const count = await getContactsCount();

		const state: State = {
			q,
			page,
			count,
			contacts,
		};

		if (ctx.request.headers.get("hx-trigger") == "search-input") {
			ctx.response.body = tRows(contacts);
		} else {
			ctx.response.body = rContacts(state);
		}
	}

	// const contacts = q ? contact_search(q) : await contact_all();
	// const count = Object.keys(contacts).length;
});

api.delete("/contacts", async ctx => {
	// deleteContact(ctx.params.uuid);
	const form = await ctx.request.body({ type: "form" }).value;
	console.log("deleting", form.getAll("selected_contact_ids"));
	const ids = form.getAll("selected_contact_ids");

	await Promise.all(ids.map(deleteContact));

	ctx.response.status = 303;
	ctx.response.redirect(`/contacts`);

	// if (ctx.request.headers.get("HX-Trigger") == "delete btn") {
	// 	ctx.response.status = 303;
	// 	ctx.response.redirect(`/contacts`);
	// } else {
	// 	ctx.response.body = "";
	// }
});

api.get("/contacts/count", async ctx => {
	const count = await getContactsCount();
	// await new Promise(res => {
	// 	setTimeout(() => res(null), 5000);
	// });

	ctx.response.body = `(${count} total Contacts)`;
});

api.get("/contacts/validate-email/:id?", async ctx => {
	const email = ctx.request.url.searchParams.get("email") || "";

	const email_validation_error = await validateEmail(email, ctx.params.id);

	console.log({ email, email_validation_error });

	ctx.response.body = email_validation_error;
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

// api.get("/contacts/-/email", async ctx => {
// 	const email = ctx.request.url.searchParams.get("email") || "";

// 	const email_validation_error = await validateEmail(email);

// 	console.log({ email, email_validation_error });

// 	ctx.response.body = email_validation_error;
// });
// api.get("/contacts/:uuid/email", async ctx => {
// 	const email = ctx.request.url.searchParams.get("email") || "";

// 	const email_validation_error = await validateEmail(email, ctx.params.uuid);

// 	console.log({ email, email_validation_error });

// 	ctx.response.body = email_validation_error;
// });

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

api.delete("/contacts/:uuid", async ctx => {
	deleteContact(ctx.params.uuid);

	if (ctx.request.headers.get("HX-Trigger") == "delete btn") {
		ctx.response.status = 303;
		ctx.response.redirect(`/contacts`);
	} else {
		ctx.response.body = "";
	}
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
