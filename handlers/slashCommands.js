const { glob } = require("glob");

/** @param {import("../core/MeitneriaClient")} client */
module.exports = (client) => {
  const files = glob.sync(`${process.cwd()}/slashCommands/**/*.js`);

  for (const file of files) {
    const command = require(file);
    client.logger.info(`[SLASH COMMANDS] Loaded /${command.data.name}`);

    client.slashCommands.set(command.data.name, command);
  }
};
