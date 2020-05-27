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
    async execute(message, args, client){
        const connection = await message.member.voice.channel.join();
        const dispatcher = connection.play(await ytdl(args.join(" ")), {type: "opus"});
        dispatcher.on('finish', () => {
            connection.disconnect();
        });
    }
}