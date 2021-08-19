const {MessageEmbed} = require('discord.js');
const {getInfo} = require('ytdl-getinfo');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "queue",
    description: "show the queue",
    aliases: ['q'],
    args: false,
    guildOnly: true,
    needsVoice: true,
    async execute(message, args, client){
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Queue");

        if (!client.settings.connection){
            embedMsg
                .setColor(red)
                .setDescription(`I'm not connected to a voice channel!`);

            return message.channel.send(embedMsg);
        }

        if (!client.settings.dispatcher || !client.settings.queue.length){
            embedMsg
                .setColor(red)
                .setDescription(`I'm not playing anything!`);

            return message.channel.send(embedMsg);
        }

        let count = 0;
        for(let videoId of client.settings.queue){
            let result = await getInfo(videoId);
            result = result.items[0];
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
            let video = `${result.creator} | [${result.fulltitle}](https://www.youtube.com/watch?v=${videoId}) | \`${duration}\``;
            if (!embedMsg.fields.length){
                embedMsg.addField("__Now Playing__", video);
            } else if (embedMsg.fields.length == 1) {
                embedMsg.addField("__Up Next__", `${count}. ${video}`);
            } else {
                embedMsg.fields[1].value = `${embedMsg.fields[1].value}\n\n${count}. ${video}`;
            }
            count++;
            if (count == client.settings.queue.length){
                message.channel.send(embedMsg);
            }
        }
    }
}