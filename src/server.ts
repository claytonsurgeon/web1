import { Application, Router } from "oak";
import { Contacts, contact_all, contact_search } from "./db.ts";
import { rContacts } from "./template/rContacts.ts";

const app = new Application();
const api = new Router();

api.get("/", async ctx => {
	ctx.response.redirect("/contacts");
});
api.get("/contacts", async ctx => {
	const q = ctx.request.url.searchParams.get("q") || "";

	const constacts_set = q ? contact_search(q) : contact_all();
	ctx.response.body = rContacts(constacts_set as unknown as Contacts, "", q);
});

app.use(api.routes());
app.use(api.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
	console.log(
		`Listening on: ${secure ? "https://" : "http://"}${hostname ?? "localhost"}:${port}`
	);
});

await app.listen({ hostname: "0.0.0.0", port: 8000 });
