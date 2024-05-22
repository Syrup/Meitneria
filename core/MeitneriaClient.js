const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const { pino } = require("pino");
const ansi = require("ansi-colors");
const { default: PinoPretty } = require("pino-pretty");

class MeitneriaClient extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
      ],
      partials: [Partials.Channel, Partials.User, Partials.Message],
    });

    this.env = process.env.NODE_ENV;
    /** @type {Collection<string, {name: string, description: string, aliases?: string[], run(client: MeitneriaClient, msg: import("discord.js").Message)}>} */
    this.commands = new Collection();
    /** @type {Collection<string, {data: import("discord.js").SlashCommandBuilder, global: boolean, run(client: MeitneriaClient, msg: import("discord.js").CommandInteraction)}>} */
    this.slashCommands = new Collection();
    this.config = require("../config.json");
    this.logger = pino(
      {
        level: this.env === "development" ? "debug" : "info",
      },
      pino.multistream([
        {
          stream: fs.createWriteStream("logs.log"),
        },
        {
          stream: fs.createWriteStream("logs.debug.log"),
          level: "debug",
        },
        {
          stream: process.stdout,
          level: this.env === "development" ? "debug" : "info",
        },
      ])
    );
  }

  async init() {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "meitneria",
    });
    if (this.env === "development") mongoose.set("debug", true);
    if (this.env === "development") this.logger.warn("IN DEBUG MODE");
    this.logger.info("Connected to MongoDB");
    this.login(process.env.TOKEN);

    // Handlers
    require("../handlers/events")(this);
    require("../handlers/commands")(this);
    require("../handlers/slashCommands")(this);

    // Logging
    this.on("debug", (message) => {
      this.logger.debug(message);
    });
    this.on("warn", (message) => {
      this.logger.warn(message);
    });
    this.on("error", (message) => {
      this.logger.error(message);
    });
  }
}

module.exports = MeitneriaClient;
