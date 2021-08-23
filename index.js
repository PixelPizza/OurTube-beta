const dotenv = require("dotenv");
const fs = require('fs');

// Add environment variables from .env if the file exists
if(fs.existsSync(".env")) dotenv.config();
if(!fs.existsSync("blacklists.json")) fs.writeFileSync("blacklist.json", JSON.stringify([]));

const ytdl = require('ytdl-core-discord');
const {token, prefix} = require('./config.json');
const {blue, red} = require('./colors.json');
const {Client, Collection, MessageEmbed} = require('discord.js');
const client = new Client();
client.commands = new Collection();
client.settings = new Collection();
const cmdFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of cmdFiles) {
    const command = require('./commands/' + file);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    client.user.setActivity("Playing Music", {type: "STREAMING"});
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
    if(message.channel.type == "dm") return;

    const {guild} = message,
        guildId = guild.id;
    
    // set default guild settings
    if(!client.settings.has(guildId)) client.settings.set(guildId, {
        queue: [],
        connection: null,
        dispatcher: null,
        loop: false,
        volume: 50,
        prefix,
        replay: false,
        seek: 0,
        shuffle: false,
        nowPlaying: undefined
    });

    const settings = client.settings.get(guildId),
        embedMsg = new MessageEmbed()
        .setColor(blue)
        .setTimestamp();

    if (message.content === "<@714609617862393917>" || message.content === "<@!714609617862393917>"){
        embedMsg.setTitle("Prefix").setDescription(`My current prefix is \`${settings.prefix}\``);
        message.channel.send(embedMsg);
    }

    if (!message.content.startsWith(settings.prefix) || message.author.bot || message.webhookID) return;

    const args = message.content.slice(settings.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    console.log(commandName);

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    const clientMember = guild.members.cache.get(client.user.id);
    if (!clientMember.voice.channel){
        client.settings.set(guildId, {
            queue: [],
            connection: null,
            dispatcher: null,
            loop: false,
            volume: 50,
            prefix: settings.prefix,
            replay: false,
            seek: 0,
            shuffle: false,
            nowPlaying: undefined
        });
    }

    if (command.needsVoice && !message.member.voice.channel){
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

    async function playSong(guildId){
        const settings = client.settings.get(guildId);
        if (settings.connection){
            if (!settings.queue.length){
                setTimeout(function() {
                    playSong(guildId);
                }, 1000);
                return;
            }
            settings.dispatcher = settings.connection.play(await ytdl(settings.queue[0], {quality: 'highestaudio'}), {type: "opus", highWaterMark: 2000, seek: settings.seek});
            settings.dispatcher.setVolume(settings.volume / 100);
            settings.seek = 0;
            settings.dispatcher.on('finish', () => {
                if (!settings.loop && !settings.replay || command.name === "skip"){
                    settings.queue.shift();
                } else if (settings.replay){
                    settings.replay = false;
                }
                settings.nowPlaying = settings.queue[0];
                setTimeout(function() {
                    playSong(guildId);
                }, 1000);
            });
            settings.dispatcher.on('error', console.error);
        } else {
            settings.dispatcher = null;
        }
        client.settings.set(guildId, settings);
    }

    try {
        await command.execute(message, args, client);
        if (!settings.dispatcher && clientMember.voice.channel){
            playSong(guildId);
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

client.login(process.env.BOT_TOKEN);
