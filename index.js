const Client = require("./core/MeitneriaClient");
const client = new Client();

// client.on("ready", () => {
//   client.logger.info("Logged in as " + client.user.tag)
// })

client.init();
