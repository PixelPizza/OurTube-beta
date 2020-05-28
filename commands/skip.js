const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');

module.exports = {
    name: "skip",
    description: "skip current song",
    aliases: ['s'],
    args: false,
    guildOnly: true,
    execute(message, args, client){
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Skip")
            .setDescription(`Skipped Song`);

        if (!client.connection){
            embedMsg
                .setColor(red)
                .setTitle("Not connected")
                .setDescription(`I'm not connected to a voice channel!`);
            
            return message.channel.send(embedMsg);
        }

        if (!client.dispatcher || !client.queue.length){
            embedMsg
                .setColor(red)
                .setTitle("Not Playing")
                .setDescription(`I'm currently not playing anything!`);

            return message.channel.send(embedMsg);
        }

        async function playSong(){
            if (client.connection){
                if (!client.queue.length){
                    setTimeout(function() {
                        playSong();
                    }, 1000);
                    return;
                }
                client.dispatcher = client.connection.play(await ytdl(client.queue[0]), {type: "opus", highWaterMark: 50});
                client.dispatcher.on('finish', () => {
                    if (!client.loop){
                        client.queue.shift();
                    }
                    setTimeout(function() {
                        playSong();
                    }, 1000);
                });
            } else {
                client.dispatcher = null;
            }
        }

        client.queue.shift();
        playSong();
        message.channel.send(embedMsg);
    }
}