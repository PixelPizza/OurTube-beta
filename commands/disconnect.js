const {MessageEmbed} = require('discord.js');
const {blue} = require('../colors.json');
const {muscialEmojis} = require('../config.json');

module.exports = {
    name: "disconnect",
    description: "let the bot disconnect from a voice channel",
    aliases: ['dis'],
    args: false,
    guildOnly: true,
    async execute(message, args, client){
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle(`${muscialEmojis[Math.floor(Math.random() * muscialEmojis.length)]} Disconnect ${muscialEmojis[Math.floor(Math.random() * muscialEmojis.length)]}`)
            .setDescription(`disconnected from \`${message.member.voice.channel.name}\``);

        message.member.voice.channel.leave();
        client.connection = null;
        client.dispatcher = null;
        client.loop = false;
        client.queue = [];
        message.channel.send(embedMsg);
    }
}