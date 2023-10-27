export const rHTML = (main: string): string => {
	return `
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
		
		<link rel="stylesheet" href="/css/reset.css">
		<link rel="stylesheet" href="/css/global.css">
		<link rel="stylesheet" href="/css/color.css">
		<link rel="stylesheet" href="/css/style.css">
	</head>
	<body>
		<main>
			<header>
				<h1>
					<all-caps>contacts.app</all-caps>
					<sub-title>A Demo Contacts Application</sub-title>
				</h1>
			</header>
			${main}
		</main>
	</body>
</html>
		`;
};
