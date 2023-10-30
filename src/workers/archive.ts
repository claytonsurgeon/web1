/// <reference lib="deno.worker" />

self.onmessage = async event => {
	const { data } = event;

	console.log(event);

	// Logic to generate file contents based on data
	const fileContent = `Hello, ${data.name}! This is your generated file.`;

	// Post the file content back to main thread
	self.postMessage(fileContent);
};
