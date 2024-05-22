const { EmbedBuilder } = require("discord.js");
const util = require("util");

module.exports = {
  name: "eval",
  description: "Evaluate JavaScript code",
  /**
   *
   * @param {import("../../core/MeitneriaClient")} client
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
    console.log(flags, code);

    try {
      const result = util.inspect(eval(code), { depth: 0 });

      const embed = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle("Evaluation Result")
        .setDescription(`\`\`\`js\n${result}\`\`\``);
      flags.includes("--silent")
        ? null
        : message.channel.send({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("Evaluation Error")
        .setDescription(`\`\`\`js\n${error}\`\`\``);
      message.channel.send({ embeds: [embed] });
    }
  },
};
