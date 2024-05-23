const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  global: true,
  /**
   * @param {import("../../../core/MeitneriaClient")} client
   * @param {import("discord.js").CommandInteraction} msg
   */
  async run(client, msg) {
    await msg.deferReply();
    const clientPing = msg.client.ws.ping;
    const m = await msg.editReply({ content: "pinging..." });

    const msgPing = m.createdTimestamp - msg.createdTimestamp;
    await m.edit({
      content: `Pong! Client ping: ${clientPing}ms, Message ping: ${msgPing}ms`,
    });
  },
};
