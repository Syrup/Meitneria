const { EmbedBuilder } = require("discord.js");
const util = require("util");

// Import necessary modules

module.exports = {
  name: "eval",
  description: "Evaluate JavaScript code",
  run(client, message, args) {
    // Check if the user has permission to use this command
    if (!client.config.developers.includes(message.author.id)) return;

    // Join the arguments into a single string
    const code = args.join(" ");

    try {
      // Evaluate the code
      const result = util.inspect(eval(code), { depth: 0 });

      // Send the result as a message
      const embed = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle("Evaluation Result")
        .setDescription(`\`\`\`js\n${result}\`\`\``);
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      // If there's an error, send the error message
      const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("Evaluation Error")
        .setDescription(`\`\`\`js\n${error}\`\`\``);
      message.channel.send({ embeds: [embed] });
    }
  },
};
