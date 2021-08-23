const {MessageEmbed} = require('discord.js');
const {blue} = require('../colors.json');

module.exports = {
    name: "replay",
    description: "play current song from the beginning",
    args: false,
    guildOnly: true,
    needsVoice: true,
    needsConnection: true,
    needsDispatcher: true,
    execute(message, args, client){
        const guildId = message.guild.id,
            settings = client.settings.get(guildId);

        settings.replay = true;
        settings.dispatcher.end();
        client.settings.set(guildId, settings);
        message.channel.send(new MessageEmbed()
            .setColor(blue)
            .setTitle("Replay")
            .setDescription(`Replaying current song`));
    }
}