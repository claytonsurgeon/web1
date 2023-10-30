/// <reference lib="deno.worker" />

self.onmessage = async event => {
	const { data } = event;

	console.log("[worker]", event.data);

	// Logic to generate file contents based on data
	const fileContent = `Hello, master! This is your generated file.`;

	// Post the file content back to main thread
	self.postMessage(fileContent);

	if (data.command === "start") {
		let progress = 0;

		for (let i = 0; i < 10; i++) {
			await new Promise(resolve => setTimeout(resolve, 1000 * Math.random()));

			progress = (i + 1) / 10;

			if (progress < 1) {
				self.postMessage({ status: "running", progress });
			}
		}

		self.postMessage({ status: "complete", progress: 1 });
	}
};
