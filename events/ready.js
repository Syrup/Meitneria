module.exports = {
  event: "ready",
  once: true,
  /** @param {import("../core/MeitneriaClient")} client */
  run(client) {
    client.logger.info("Logged in as " + client.user.tag);

    client.slashCommands.forEach((command) => {
      if (command.global) {
        // Load global slash commands
        client.application.commands
          .create(command.data.toJSON())
          .catch(client.logger.error);
        client.logger.debug(
          `[SLASH COMMANDS] Registering /${command.data.name} (global)`
        );
      } else {
        // Load guild only slash commands
        client.guilds.cache
          .get(client.config.guildId)
          .commands.create(command.data.toJSON())
          .catch(client.logger.error);
        client.logger.debug(
          `[SLASH COMMANDS] Registering /${command.data.name} (guild)`
        );
      }
    });
  },
};
