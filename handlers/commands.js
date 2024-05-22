const { glob } = require("glob");

/** @param {import("../core/MeitneriaClient")} client */
module.exports = (client) => {

  const files = glob.sync(`${process.cwd()}/commands/**/*.js`);

  for (const file of files) {
    const command = require(file);
    client.logger.info(`[COMMANDS] Loaded ${command.name}`);

    client.commands.set(command.name, command)
  }
};
