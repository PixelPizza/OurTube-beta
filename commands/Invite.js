module.exports = {
  name: "invite",
  execute(message, args, client) {
    message.channel.send(new MessageEmbed({
      title: "Music Bot invite links",
      description: stripIndents`
        Recommended: [Click here](${client.generateInvite(YOUR_PERMISSIONS_HERE)})
        Admin: [Click here](${client.generateInvite(Permissions.FLAGS.ADMINISTRATOR)})
      `,
      footer: "Thanks for choosing me"
    }));
  }
}
© 2021 GitHub, Inc.
