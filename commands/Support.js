module.exports = {
  name: "support",
  description: "get the invite link of the support server",
  execute(message, args){
    message.channel.send(new MessageEmbed({
      color: "RED",
      title: "Support",
      description: "Here is the invite for the [support server](https://discord.gg/xf2zskzg48)"
    }));
  }
}

