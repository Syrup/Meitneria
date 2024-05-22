module.exports = {
  event: "interactionCreate",
  /**
   *
   * @param {import("../core/MeitneriaClient")} client
   * @param {import("discord.js").Interaction} interaction
   */
  run: async (client, interaction) => {
    if (interaction.isCommand()) {
      const command = client.slashCommands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.run(client, interaction);
      } catch (error) {
        client.logger.error(error);
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }
    }
  },
};
