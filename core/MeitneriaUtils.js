const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  Message,
} = require("discord.js");

class MeitneriaUtils {
  constructor() {}
  /**
   * @param {CommandInteraction | Message} interaction
   * @param {EmbedBuilder[]} pages
   * @param {number} timeout
   * @returns {Promise<Message> | Promise<CommandInteraction>}
   */
  async paginate(interaction, pages, timeout = 30 * 1_000) {
    let page = 0;

    const first = new ButtonBuilder()
      .setCustomId("pagefirst")
      .setLabel("⏮")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);
    const prev = new ButtonBuilder()
      .setCustomId("pageprev")
      .setLabel("◀️")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);
    const next = new ButtonBuilder()
      .setCustomId("pagenext")
      .setLabel("▶️")
      .setStyle(ButtonStyle.Secondary);
    const last = new ButtonBuilder()
      .setCustomId("pagelast")
      .setLabel("⏭")
      .setStyle(ButtonStyle.Secondary);
    const pageCount = new ButtonBuilder()
      .setCustomId("pagecount")
      .setLabel(`${page + 1}/${pages.length}`)
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true);

    const buttons = new ActionRowBuilder().addComponents([
      first,
      prev,
      next,
      last,
      pageCount,
    ]);

    let msg =
      interaction instanceof CommandInteraction
        ? await (interaction.deferred
            ? interaction.followUp({
                embeds: [pages[page]],
                components: [buttons],
                fetchReply: true,
              })
            : interaction.reply({
                embeds: [pages[page]],
                components: [buttons],
                fetchReply: true,
              }))
        : await interaction.channel.send({
            embeds: [pages[page]],
            components: [buttons],
          });
    let userId =
      interaction instanceof CommandInteraction
        ? interaction.user.id
        : interaction.author.id;

    const buttonCollector = await msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: timeout,
    });

    buttonCollector.on("collect", async (i) => {
      if (i.user.id !== userId) return;

      switch (i.customId) {
        case "pagefirst":
          page = 0;
          break;
        case "pageprev":
          page = page > 0 ? --page : 0;
          break;
        case "pagenext":
          page = page + 1 < pages.length ? ++page : pages.length - 1;
          break;
        case "pagelast":
          page = pages.length - 1;
          break;
        default:
          break;
      }

      pageCount.setLabel(`${page + 1}/${pages.length}`);
      first.setDisabled(page === 0);
      prev.setDisabled(page === 0);
      next.setDisabled(page === pages.length - 1);
      last.setDisabled(page === pages.length - 1);

      const updatedButtons = new ActionRowBuilder().addComponents([
        first,
        prev,
        next,
        last,
        pageCount,
      ]);

      await i
        .update({
          embeds: [pages[page]],
          components: [updatedButtons],
          ephemeral: true,
        })
        .catch((error) => {
          bot.logger.error("Error updating message:", error);
        });

      buttonCollector.resetTimer();
    });

    buttonCollector.on("end", async () => {
      const disabledButtons = new ActionRowBuilder().addComponents([
        first.setDisabled(true),
        prev.setDisabled(true),
        next.setDisabled(true),
        last.setDisabled(true),
        pageCount,
      ]);

      if (interaction instanceof CommandInteraction) {
        await interaction.editReply({
          embeds: [pages[page]],
          components: [disabledButtons],
        });
      } else {
        await msg.edit({
          embeds: [pages[page]],
          components: [disabledButtons],
        });
      }
    });

    return msg;
  }

  /** @param {string} str */
  splitArray(array, chunkSize) {
    const chunked = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunked.push(array.slice(i, i + chunkSize));
    }

    return chunked;
  }

  splitString(str, chunkSize) {
    const chunked = [];
    for (let i = 0; i < str.length; i += chunkSize) {
      chunked.push(str.slice(i, i + chunkSize));
    }

    return chunked;
  }

  splitStringInto(count, str) {
    const chunkSize = Math.ceil(str.length / count);
    return this.splitString(str, chunkSize);
  }

  splitArrayInto(count, array) {
    const chunkSize = Math.ceil(array.length / count);
    return this.splitArray(array, chunkSize);
  }
}

module.exports = MeitneriaUtils;
