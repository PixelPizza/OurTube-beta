const {MessageEmbed} = require('discord.js');
const {blue} = require('../colors.json');

module.exports = {
    name: "loop",
    description: "loop current song",
    args: false,
    guildOnly: true,
    execute(message, args, client){
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle(":repeat_one: Loop");

        if (!client.loop){
            client.loop = true;
            embedMsg.setDescription(`Now looping current song`);
        } else {
            client.loop = false;
            embedMsg.setDescription(`Stopped looping current song`);
        }
        
        message.channel.send(embedMsg);
    }
}