const {} = require('discord.js');
const ytdl = require('ytdl-core-discord');
const {getInfo} = require('ytdl-getinfo');

module.exports = {
    name: "play",
    description: "add music to the current queue",
    aliases: ['p'],
    agrs: true,
    usage: "<search query>",
    guildOnly: true,
    async execute(message, args, client, queue){
        let query = args.join(" ");
        getInfo(query).then(async info => {
            return info.items[0].id;
        });
    }
}