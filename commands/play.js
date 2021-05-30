const {MessageEmbed} = require('discord.js');
const {getInfo} = require('ytdl-getinfo');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "play",
    description: "add music to the current queue",
    aliases: ['p'],
    agrs: true,
    usage: "<search query>",
    guildOnly: true,
    async execute(message, args, client){
        const embedMsg = new MessageEmbed()
                .setColor(blue)
                .setTitle(`${play} Play`);

        if (!client.connection){
            client.connection = await message.member.voice.channel.join();
        }
        let query = args.join(" ");
        getInfo(query).then(async info => {
            if (!info.items.length){
                embedMsg
                    .setColor(red)
                    .setDescription(`No videos found`);
                
                return message.channel.send(embedMsg);
            }
            const videoId = info.items[0].id;
            const link = `[${info.items[0].fulltitle}](https://youtube.com/watch?v=${info.items[0].id})`;
            if (!client.queue.length){
                embedMsg.setDescription(`Now Playing ${link}`);
                client.nowPlaying = videoId;
            } else {
                embedMsg.setDescription(`${link} has been added to the queue`);
            }
            client.queue.push(videoId);
            message.channel.send(embedMsg);
        });
    }
}
