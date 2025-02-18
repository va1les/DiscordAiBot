const { readdir } = require("fs/promises");
const path = require("path");

const restEvents = ["restDebug", "handlerSweep", "hashSweep", "invalidRequestWarning", "rateLimited", "response"];

module.exports = async (client) => {
	const eventsBasePath = path.join(__dirname, "../events");

	for (const folder of await readdir(eventsBasePath)) {
		const folderPath = `${eventsBasePath}/${folder}`;

		for (const file of await readdir(folderPath)) {
			try {
				const eventPath = path.join(folderPath, file);
				const event = require(eventPath);

				if (event.once) {
					client.once(event.name, (...args) => event.execute(...args))
				} else if (restEvents.includes(event.name)) {
					client.rest.on(event.name, (...args) => event.execute(...args, client))
				} else {
					client.on(event.name, (...args) => event.execute(...args, client))
				}
			} catch (error) {
				console.error(`[EventHandler] Error loading an event from a file ${file}: ${error.message}`.red.bold);
			};
		};
	};
};
