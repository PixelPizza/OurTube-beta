const fs = require('fs');
const {token, prefix, channels, voiceChannels} = require('./config.json');
const {blue, red} = require('./colors.json');
const {Client, Collection, MessageEmbed} = require('discord.js');
const client = new Client();
client.commands = new Collection();
client.queue = new Collection();
const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of cmdFiles) {
    const command = require('./commands/' + file);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    client.user.setActivity("still in development", {type: "WATCHING"});
    console.log('ready for music!');
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot || message.webhookID || message.channel.id !== channels.music) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    console.log(commandName);

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    const embedMsg = new MessageEmbed()
        .setColor(blue)
        .setThumbnail(message.author.displayAvatarURL())
        .setTimestamp()
        .setFooter(client.user.username, client.user.displayAvatarURL());

    if (!message.member.voice.channel || message.member.voice.channel.id !== voiceChannels.music){
        embedMsg
            .setColor(red)
            .setTitle("Error 404")
            .setDescription(`Voice channel not found`)
            .setThumbnail("https://cdn.shopify.com/s/files/1/1061/1924/products/Anguished_Face_Emoji_1024x1024.png");

        return message.channel.send(embedMsg);
    }

    if (command.guildOnly && message.channel.type !== 'text') {
        embedMsg.setColor('#ff0000').setTitle('**Channel only**').setDescription('I can\'t execute that command in DMs');
        return message.reply(embedMsg);
    }
    
    if (command.args && !args.length) {
        let reply = `There were no arguments given,  ${message.author}`;

        if (command.usage) {
            reply += `\nThe proper usage is: '${prefix}${command.name} ${command.usage}'`;
        }

        embedMsg
            .setColor(red)
            .setTitle('**No arguments**')
            .setDescription(reply);
        return message.channel.send(embedMsg);
    }

    try {
        command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        embedMsg
                .setColor(red)
                .setTitle('**Error**')
                .setDescription('there was an error trying to execute that command!');

        message.channel.send(embedMsg);
    }
});

client.login(token);