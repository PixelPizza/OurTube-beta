const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "prefix",
    description: "change prefix",
    usage: "<prefix>",
    guildOnly: true,
    execute(message, args, client){
        const guildId = message.guild.id,
            settings = client.settings.get(guildId),
            embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Prefix");

        if (!args.length){
            embedMsg.setDescription(`The current prefix is \`${settings.prefix}\``);
            return message.channel.send(embedMsg);
        }

        if (args.length > 1){
            embedMsg
                .setColor(red)
                .setDescription(`${settings.prefix}${this.name} takes one argument! The proper usage is ${settings.prefix}${this.name} ${this.usage}`);
            
            return message.channel.send(embedMsg);
        }

        if (args[0].length > 30){
            embedMsg
                .setColor(red)
                .setDescription(`The maximum length of the prefix is 30 characters!`);

            return message.channel.send(embedMsg);
        }

        settings.prefix = args[0];
        embedMsg.setDescription(`The prefix has been set to \`${settings.prefix}\``);
        client.settings.set(guildId, settings);
        message.channel.send(embedMsg);
    }
}