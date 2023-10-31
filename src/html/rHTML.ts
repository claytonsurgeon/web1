export const rHTML = (main: string): string => {
	return html`
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1, viewport-fit=cover"
				/>

				<meta name="theme-color" content="#FFF" />

				<title>Web1</title>
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Zohing" />

				<!-- <link rel="stylesheet" href="/css/reset.css" /> -->
				<!-- <link rel="stylesheet" href="/css/global.css" /> -->
				<!-- <link rel="stylesheet" href="/css/color.css" /> -->
				<link rel="stylesheet" href="/css/style.css" />
				<link rel="stylesheet" href="https://unpkg.com/missing.css@1.1.1" />

				<script
					src="https://unpkg.com/htmx.org@1.9.6"
					integrity="sha384-FhXw7b6AlE/jyjlZH5iHa/tTe9EpJ1Y55RjcgPbjeWMskSxZt1v9qkxLJWNJaGni"
					crossorigin="anonymous"
				></script>
				<script defer src="https://unpkg.com/alpinejs"></script>
				<script defer src="//unpkg.com/hyperscript.org"></script>

				<script>
					function overflowMenu(subtree = document) {
						document.querySelectorAll("[data-overflow-menu]").forEach(menuRoot => {
							const button = menuRoot.querySelector("[aria-haspopup]");
							const menu = menuRoot.querySelector("[role=menu]");
							const items = [...menu.querySelectorAll("[role=menuitem]")];

							const isOpen = () => !menu.hidden;
							items.forEach(item => item.setAttribute("tabindex", "-1"));

							function toggleMenu(open = !isOpen()) {
								if (open) {
									menu.hidden = false;
									button.setAttribute("aria-expanded", "true");
									items[0].focus();
								} else {
									menu.hidden = true;
									button.setAttribute("aria-expanded", "false");
								}
							}

							toggleMenu(isOpen());
							button.addEventListener("click", () => toggleMenu());
							menuRoot.addEventListener("blur", e => toggleMenu(false));

							window.addEventListener("click", function clickAway(event) {
								if (!menuRoot.isConnected) window.removeEventListener("click", clickAway);
								if (!menuRoot.contains(event.target)) toggleMenu(false);
							});

							const currentIndex = () => {
								const idx = items.indexOf(document.activeElement);
								if (idx === -1) return 0;
								return idx;
							};

							menu.addEventListener("keydown", e => {
								if (e.key === "ArrowUp") {
									items[currentIndex() - 1]?.focus();
								} else if (e.key === "ArrowDown") {
									items[currentIndex() + 1]?.focus();
								} else if (e.key === "Space") {
									items[currentIndex()].click();
								} else if (e.key === "Home") {
									items[0].focus();
								} else if (e.key === "End") {
									items[items.length - 1].focus();
								} else if (e.key === "Escape") {
									toggleMenu(false);
									button.focus();
								}
							});
						});
					}

					addEventListener("htmx:load", e => overflowMenu(e.target));
				</script>
			</head>
			<body hx-boost="true">
				<main>
					<header>
						<h1>
							<all-caps>contacts.app</all-caps>
							<sub-title>A Demo Contacts Application</sub-title>
						</h1>
					</header>
					<section class="counter">
						<output id="my-output">0</output>
						<button onclick="document.querySelector('#my-output').textContent++">
							Increment
						</button>
					</section>
					<div class="counter" x-data="{ count: 0 }">
						<output x-text="count"></output>
						<button x-on:click="count++">Increment</button>
					</div>
					<div>
						<a href="/contacts">Contacts</a>
						<a href="/settings">Settings</a>
						<a href="/help">Help</a>
					</div>
					${main}
				</main>
			</body>
		</html>
	`;
};
