const {} = require('discord.js');
const ytdl = require('ytdl-core-discord');

module.exports = {
    name: "play",
    description: "add music to the current queue",
    aliases: ['p'],
    agrs: true,
    usage: "<search query>",
    guildOnly: true,
    async execute(message, args, client, queue){
        let query = args.join(" ");
        let info = await ytdl.getInfo(query);
        //query = info.items[0].id;
        //queue.push(query);
        console.log(info);
        return queue;
    }
}