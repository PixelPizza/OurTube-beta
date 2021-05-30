const fs = require('fs');
const ytdl = require('ytdl-core-discord');
var ffmpeg = require('ffmpeg');
const {token, prefix} = require('./config.json');
const {blue, red} = require('./colors.json');
const {Client, Collection, MessageEmbed} = require('discord.js');
const client = new Client();
client.commands = new Collection();
client.queue = [];
client.loop = false;
client.connection = null;
client.dispatcher = null;
client.volume = 50;
client.prefix = prefix;
client.replay = false;
client.seek = 0;
client.shuffle = false;
client.nowPlaying;
const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of cmdFiles) {
    const command = require('./commands/' + file);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    client.user.setActivity("Playing Music", {type: "Streaming"});
    console.log('ready for music!');
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    console.log(error.name);
});

client.on('error', error => {
    console.error('The websocket connection encountered an error:', error);
});

client.on('message', async message => {
    const embedMsg = new MessageEmbed()
        .setColor(blue)
        .setTimestamp();

    if (message.content === "<@714609617862393917>" || message.content === "<@!714609617862393917>"){
        embedMsg.setTitle("Prefix").setDescription(`My current prefix is \`${client.prefix}\``);
        message.channel.send(embedMsg);
    }

    if (!message.content.startsWith(client.prefix) || message.author.bot || message.webhookID) return;

    const args = message.content.slice(client.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    console.log(commandName);

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    const clientMember = message.guild.members.cache.get(client.user.id);
    if (!clientMember.voice.channel){
        client.connection = null;
        client.dispatcher = null;
        client.queue = [];
        client.loop = false;
        client.replay = false;
        client.volume = 50;
    }

    if (command.name != "prefix"){
        if (!message.member.voice.channel){
            embedMsg
                .setColor(red)
                .setTitle("Error 404")
                .setDescription(`Voice channel not found`)
                .setThumbnail("https://cdn.shopify.com/s/files/1/1061/1924/products/Anguished_Face_Emoji_1024x1024.png");

            return message.channel.send(embedMsg);
        }
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

    async function playSong(){
        if (client.connection){
            if (!client.queue.length){
                setTimeout(function() {
                    playSong();
                }, 1000);
                return;
            }
            client.dispatcher = client.connection.play(await ytdl(client.queue[0], {quality: 'highestaudio'}), {type: "opus", highWaterMark: 2000, seek: client.seek});
            client.dispatcher.setVolume(client.volume / 100);
            client.seek = 0;
            client.dispatcher.on('finish', () => {
                if (!client.loop && !client.replay || command.name === "skip"){
                    client.queue.shift();
                } else if (client.replay){
                    client.replay = false;
                }
                client.nowPlaying = client.queue[0];
                setTimeout(function() {
                    playSong();
                }, 1000);
            });
            client.dispatcher.on('error', console.error);
        } else {
            client.dispatcher = null;
        }
    }

    try {
        await command.execute(message, args, client);
        if (!client.dispatcher && clientMember.voice.channel){
            playSong();
        }
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
