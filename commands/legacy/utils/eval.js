const { EmbedBuilder, Colors } = require("discord.js");
const util = require("util");

module.exports = {
  name: "eval",
  description: "Evaluate JavaScript code",
  devOnly: true,
  /**
   *
   * @param {import("../../../core/MeitneriaClient")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   */
  run(client, message, args) {
    if (!client.config.developers.includes(message.author.id)) return;

    /** @type {[] | ["--async"] | ["--silent"] | ["--async", "--silent"]} */
    const flags = args.filter((arg) => arg.startsWith("--"));
    args = args.filter((arg) => !arg.startsWith("--"));
    const code = flags.includes("--async")
      ? `(async () => {\n${args.join(" ")}\n})();`
      : args.join(" ");

    try {
      let result = util.inspect(eval(code), { depth: 0 });
      if (result.length > 2000) result = result.slice(0, 2000) + "...";
      if (result.includes(client.token))
        result = result.replaceAll(client.token, "<TOKEN>");
      if (result.includes(process.env.MONGO_URI))
        result = result.replaceAll(process.env.MONGO_URI, "<MONGO_URI>");

      const embed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle("Evaluation Result")
        .setDescription(`\`\`\`js\n${result}\n\`\`\``);
      flags.includes("--silent")
        ? null
        : message.channel.send({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setTitle("Evaluation Error")
        .setDescription(`\`\`\`js\n${error}\n\`\`\``);
      message.channel.send({ embeds: [embed] });
    }
  },
};
