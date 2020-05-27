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
        const query = args.join(" ");
        getInfo(query).then(info => {
            console.log(info.items[0]);
        });
        const connection = await message.member.voice.channel.join();
        const dispatcher = connection.play(await ytdl(query), {type: "opus"});
        dispatcher.on('finish', () => {
            connection.disconnect();
        });
    }
}