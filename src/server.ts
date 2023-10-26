import { Application, Router } from "oak";
import { contact_all, contact_search } from "./db.ts";
import { State } from "./state.ts";
import { rApp } from "./template/rApp.ts";

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

	ctx.response.body = rApp(state);
});

api.get("/contacts/new", ctx => {
	ctx.response.body = "hi";
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
