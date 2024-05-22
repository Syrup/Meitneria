module.exports = {
  event: "messageCreate",
  /**
   * @param {import('../core/MeitneriaClient')} client
   * @param {import("discord.js").Message} message
   */
  run(client, message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(client.config.prefix)) return;

    const args = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;
    if (
      command.devOnly &&
      !client.config.developers.includes(message.author.id)
    )
      return message.reply(
        "Haha! Nice try, this command is only available to developers."
      );

    command.run(client, message, args);
  },
};
