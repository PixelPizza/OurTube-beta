const {} = require('discord.js');
const {getInfo} = require('ytdl-getinfo');

module.exports = {
    name: "play",
    description: "add music to the current queue",
    aliases: ['p'],
    agrs: true,
    usage: "<search query>",
    guildOnly: true,
    async execute(message, args, client){
        let query = args.join(" ");
        getInfo(query).then(async info => {
            const videoId = info.items[0].id;
            client.queue.push(videoId);
        });
    }
}