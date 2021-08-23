const {MessageEmbed} = require('discord.js');
const {getInfo} = require('ytdl-getinfo');
const {blue} = require('../colors.json');

module.exports = {
    name: "np",
    description: "see what's currently playing",
    args: false,
    guildOnly: true,
    needsVoice: true,
    needsConnection: true,
    needsDispatcher: true,
    needsQueue: true,
    async execute(message, args, client){
        const settings = client.settings.get(message.guild.id);

        const result = (await getInfo(settings.queue[0])).items[0];
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
        message.channel.send(new MessageEmbed()
            .setColor(blue)
            .setTitle("Now Playing")
            .setDescription(`${result.creator} | [${result.fulltitle}](https://www.youtube.com/watch?v=${settings.queue[0]}) | \`${duration}\``));
    }
}