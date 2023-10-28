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

				<link rel="stylesheet" href="/css/reset.css" />
				<link rel="stylesheet" href="/css/global.css" />
				<link rel="stylesheet" href="/css/color.css" />
				<link rel="stylesheet" href="/css/style.css" />
				<script
					src="https://unpkg.com/htmx.org@1.9.6"
					integrity="sha384-FhXw7b6AlE/jyjlZH5iHa/tTe9EpJ1Y55RjcgPbjeWMskSxZt1v9qkxLJWNJaGni"
					crossorigin="anonymous"
				></script>
			</head>
			<body hx-boost="true">
				<main>
					<header>
						<h1>
							<all-caps>contacts.app</all-caps>
							<sub-title>A Demo Contacts Application</sub-title>
						</h1>
					</header>
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
