const {MessageEmbed} = require('discord.js');
const {getInfo} = require('ytdl-getinfo');
const {blue} = require('../colors.json');

module.exports = {
    name: "queue",
    description: "show the queue",
    aliases: ['q'],
    args: false,
    guildOnly: true,
    needsVoice: true,
    needsConnection: true,
    needsDispatcher: true,
    needsQueue: true,
    async execute(message, args, client){
        const settings = client.settings.get(message.guild.id),
            embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Queue");

        for(const index of settings.queue){
            const videoId = settings.queue[index];
            const result = (await getInfo(videoId)).items[0];
            let hours = Math.floor(result.duration / 3600);
            let seconds = result.duration % 3600;
            let minutes = Math.floor(seconds / 60);
            seconds = seconds % 60;
            if (seconds < 10){
                seconds = `0${seconds}`;
            }
            if (minutes < 10){
                minutes = `0${minutes}`;
            }
            let duration = `${minutes}:${seconds}`;
            if (hours > 0){
                if (hours < 10){
                    hours = `0${hours}`;
                }
                duration = `${hours}:${duration}`;
            }
            const video = `${result.creator} | [${result.fulltitle}](https://www.youtube.com/watch?v=${videoId}) | \`${duration}\``;
            if (!embedMsg.fields.length){
                embedMsg.addField("__Now Playing__", video);
                continue;
            }
            if (embedMsg.fields.length == 1) {
                embedMsg.addField("__Up Next__", `${index}. ${video}`);
                continue;
            }
            embedMsg.fields[1].value += `\n\n${index}. ${video}`;
        }

        message.channel.send(embedMsg);
    }
}