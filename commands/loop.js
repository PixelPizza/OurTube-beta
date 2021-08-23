const {MessageEmbed} = require('discord.js');
const {blue} = require('../colors.json');

module.exports = {
    name: "loop",
    description: "loop current song",
    args: false,
    guildOnly: true,
    needsVoice: true,
    execute(message, args, client){
        const guildId = message.guild.id,
            settings = client.settings.get(guildId),
            embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("🔂 Loop");
        
        if (!settings.connection){
            embedMsg
                .setColor(red)
                .setTitle("Not connected")
                .setDescription("I'm not connected to a voice channel!");

            return message.channel.send(embedMsg);
        }

        if (!settings.loop){
            settings.loop = true;
            embedMsg.setDescription(`Now looping current song`);
        } else {
            settings.loop = false;
            embedMsg.setDescription(`Stopped looping current song`);
        }

        client.settings.set(guildId, settings);
        message.channel.send(embedMsg);
    }
}