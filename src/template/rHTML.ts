export const rHTML = (body: string) => {
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

	</head>
	<body>
	${body}
	</body>
</html>
		`;
};
