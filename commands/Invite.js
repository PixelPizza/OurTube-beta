const {MessageEmbed, Client, Message} = require("discord.js"),
  {stripIndents} = require("common-tags");

module.exports = {
  name: "invite",
  /**
   * Execute the invite command
   * @param {Message} message The message that was sent
   * @param {string[]} args The arguments that were used for this command
   * @param {Client} client The client used to execute the command
   */
  async execute(message, args, client) {
    message.channel.send(new MessageEmbed({
      title: "Music Bot invite links",
      description: stripIndents`
        Recommended: [Click here](${await client.generateInvite({
          permissions: [
            "SEND_MESSAGES",
            "EMBED_LINKS",
            "MANAGE_MESSAGES",
            "MANAGE_GUILD"
          ]
        })})
        Admin: [Click here](${await client.generateInvite("ADMINISTRATOR")})
      `,
      footer: "Thanks for choosing me"
    }));
  }
}
