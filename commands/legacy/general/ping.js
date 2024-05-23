module.exports = {
  name: "ping",
  description: "Ping!",
  /**
   *
   * @param {import("../../../core/MeitneriaClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   */
  async run(client, message, args) {
    const msg = await message.channel.send("Pinging...");
    msg.edit(
      `Pong! Latency is ${
        msg.createdTimestamp - message.createdTimestamp
      }ms. API Latency is ${client.ws.ping}ms`
    );
  },
};
