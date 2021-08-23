const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');
const {muscialEmojis} = require('../config.json');

module.exports = {
    name: "disconnect",
    description: "let the bot disconnect from a voice channel",
    aliases: ['dis'],
    args: false,
    guildOnly: true,
    needsVoice: true,
    async execute(message, args, client){
        const guildId = message.guild.id,
            settings = client.settings.get(guildId),
            embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle(`${muscialEmojis[Math.floor(Math.random() * muscialEmojis.length)]} Disconnect ${muscialEmojis[Math.floor(Math.random() * muscialEmojis.length)]}`)
            .setDescription(`disconnected from \`${message.member.voice.channel.name}\``);

        if (settings.connection){
            message.member.voice.channel.leave();
            client.settings.set(guildId, {
                queue: [],
                connection: null,
                dispatcher: null,
                loop: false,
                volume: 50,
                prefix: settings.prefix,
                replay: false,
                seek: 0,
                shuffle: false,
                nowPlaying: undefined
            });
        } else {
            embedMsg
                .setColor(red)
                .setTitle("Not connected")
                .setDescription("I'm not connected to a voice channel!");
        }
        message.channel.send(embedMsg);
    }
}