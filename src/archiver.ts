export class Archiver {
	private STATUS = "Waiting";
	private PROGRESS = 0;
	private WORKER: Worker | null = null;

	status() {
		return this.STATUS;
	}

	progress() {
		return this.PROGRESS;
	}

	run() {
		if (this.STATUS != "Waiting") return;

		this.STATUS = "Running";
		this.PROGRESS = 0;
		this.WORKER = new Worker(new URL("./workers/archive.ts", import.meta.url).href, {
			type: "module",
		});

		this.WORKER.postMessage({ command: "start" });
		this.WORKER.onmessage = e => {
			console.log(e);
		};
	}

	async run_impl() {
		// const proms =
		for (let i = 0; i < 10; i++) {
			await new Promise(res => {
				setTimeout(() => res(null), 1000);
			});
		}
	}

	archive_file() {}

	reset() {
		this.STATUS = "Waiting";
		this.WORKER?.terminate();
		this.WORKER = null;
	}
}
