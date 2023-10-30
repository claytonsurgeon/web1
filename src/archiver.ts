export class Archiver {
	private STATUS = "waiting";
	private PROGRESS = 0;
	private WORKER: Worker | null = null;

	status() {
		return this.STATUS;
	}

	progress() {
		return this.PROGRESS;
	}

	run() {
		if (this.STATUS != "waiting") return;

		this.STATUS = "running";
		this.PROGRESS = 0;
		this.WORKER = new Worker(new URL("./workers/archive.ts", import.meta.url).href, {
			type: "module",
		});

		this.WORKER.postMessage({ command: "start" });
		this.WORKER.onmessage = e => {
			console.log("[master]", e.data);

			// ignore superfluous messages
			if (e.data.status) {
				this.PROGRESS = e.data.progress;
				this.STATUS = e.data.status;

				if (e.data.status == "complete") {
					// this.reset();
				}
			}
		};
	}

	archive_file() {}

	reset() {
		this.WORKER?.terminate();
		this.WORKER = null;
		this.STATUS = "waiting";
		this.PROGRESS = 0;
	}
}

export const ARCHIVER = new Archiver();
