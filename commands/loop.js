const {MessageEmbed} = require('discord.js');
const {blue} = require('../colors.json');

module.exports = {
    name: "loop",
    description: "loop current song",
    args: false,
    guildOnly: true,
    execute(message, args, client){
        client.loop = !client.loop;
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle(":repeat_one: Loop")
        
        switch(client.loop){
            case true:
                embedMsg.setDescription(`Now looping current song`);
                break;
            case false:
                embedMsg.setDescription(`Stopped looping current song`);
                break;
        }
        message.channel.send(embedMsg);
    }
}