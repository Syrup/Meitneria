/** @param {import("../core/MeitneriaClient")} client */
module.exports = (client) => {
  const { glob } = require("glob");

  const files = glob.sync(`${process.cwd()}/events/**/*.js`);

  for (const file of files) {
    const event = require(file);
    client.logger.info(`[EVENTS] Loaded ${event.event}`);

    event.once
      ? client.once(event.event, event.run.bind(null, client))
      : client.on(event.event, event.run.bind(null, client));
  }
};
