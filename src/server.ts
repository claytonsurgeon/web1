import { Application, Router } from "oak";
import { Contact, contact_all, contact_search } from "/db.ts";
import { State } from "/state.ts";
import { rContacts } from "/html/route/rContacts.ts";
import { rNewContact } from "/html/route/rNewContact.ts";

const app = new Application();
const api = new Router();

api.get("/", ctx => {
	ctx.response.redirect("/contacts");
});

api.get("/contacts", ctx => {
	const q = ctx.request.url.searchParams.get("q") || "";

	const state: State = {
		q,
		contacts: q ? contact_search(q) : contact_all(),
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
	};

	ctx.response.body = rNewContact(contact);
});

api.post("/contacts/new", async ctx => {
	const form = await ctx.request.body({ type: "form" }).value;
	// console.log(form.get("email"));
	const contact: Contact = {
		first: form.get("first_name") || "",
		last: form.get("last_name") || "",
		phone: form.get("phone") || "",
		email: form.get("email") || "",
		id: "",
	};

	console.log(contact);
	// attempt to store contact

	if (false) {
		ctx.response.redirect("/contacts");
	} else {
		ctx.response.body = rNewContact(contact);
	}
});

app.use(api.routes());

app.use(async (context, next) => {
	try {
		console.log(context.request.url.pathname);
		console.log(`${Deno.cwd()}/src/static`);
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
