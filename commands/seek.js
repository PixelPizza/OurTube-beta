const  {MessageEmbed} = require('discord.js');
const  {blue} = require('../colors.json');
const  {muscialEmojis} = require('../config.json');

module.exports = {
    name: "Seek",
    description: "Choose a timestamp for the song to skip to",
    aliases: ['s'],
    args: false,
    guildOnly: true,
    
client.on('message', async (message) => { const args = message.content.slice(settings.prefix.length).trim().split(/ +/g); c
const command = args.shift().toLowerCase(); if(command === 'seek'){ // If provided 10 seconds, it would send the Milliseconds stamp (10 * 1000) let song = await client.player.seek(message, parseInt(message.args[0] * 1000)).catch(err => { return message.channel.send(error.message); }); message.channel.send(Seeked to ${message.args[0]} second of ${song.name}.); } });

        

