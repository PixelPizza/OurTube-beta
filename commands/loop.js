const {MessageEmbed} = require('discord.js');
const {blue} = require('../colors.json');

module.exports = {
    name: "loop",
    description: "loop current song",
    args: false,
    guildOnly: true,
    needsVoice: true,
    needsConnection: true,
    execute(message, args, client){
        const guildId = message.guild.id,
            settings = client.settings.get(guildId);
        
        settings.loop = !settings.loop;
        client.settings.set(guildId, settings);
        message.channel.send(new MessageEmbed()
            .setColor(blue)
            .setTitle("🔂 Loop")
            .setDescription(settings.loop ? "Now looping current song" : "Stopped looping current song"));
    }
}