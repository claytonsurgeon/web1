import { app } from "./src/server.ts";

declare global {
	// deno-lint-ignore no-explicit-any no-var
	var html: (strings: TemplateStringsArray, ...values: any[]) => string;
}

// deno-lint-ignore no-explicit-any
globalThis.html = (strings: TemplateStringsArray, ...values: any[]) =>
	String.raw({ raw: strings }, ...values);

Promise.all([
	app.listen({ hostname: "0.0.0.0", port: 5173 }),
	app.listen({ hostname: "0.0.0.0", port: 8000 }),
]);
