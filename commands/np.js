const {MessageEmbed} = require('discord.js');
const {getInfo} = require('ytdl-getinfo');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "np",
    description: "see what's currently playing",
    args: false,
    guildOnly: true,
    needsVoice: true,
    execute(message, args, client){
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Now Playing");

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

        getInfo(client.settings.queue[0]).then(info => {
            let result = info.items[0];
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
            let video = `${result.creator} | [${result.fulltitle}](https://www.youtube.com/watch?v=${client.settings.queue[0]}) | \`${duration}\``;
            embedMsg.setDescription(video);
            message.channel.send(embedMsg);
        });
    }
}