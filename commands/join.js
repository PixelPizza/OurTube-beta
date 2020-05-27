const {MessageEmbed} = require('discord.js');
const {blue} = require('../colors.json');
const {muscialEmojis} = require('../config.json');

module.exports = {
    name: "join",
    description: "let the bot join a voice channel",
    aliases: ['j'],
    args: false,
    guildOnly: true,
    async execute(message, args, client){
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle(`${muscialEmojis[Math.floor(Math.random() * muscialEmojis.length)]} Join ${muscialEmojis[Math.floor(Math.random() * muscialEmojis.length)]}`)
            .setDescription(`Joined \`${message.member.voice.channel.name}\``);

        if (!client.connection){
            client.connection = await message.member.voice.channel.join();
        }
        message.channel.send(embedMsg);
    }
}