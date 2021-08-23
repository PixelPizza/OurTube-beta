const ytdl = require('ytdl-core-discord');
const {prefix} = require('../config.json');
const {blue, red} = require('../colors.json');
const {MessageEmbed} = require("discord.js");

module.exports = {
	name: "message",
	async playSong(client, guildId, commandName){
		const settings = client.settings.get(guildId);
		if (settings.connection){
			if (!settings.queue.length) return setTimeout(() => playSong(guildId), 1000);
			settings.dispatcher = settings.connection.play(await ytdl(settings.queue[0], {quality: 'highestaudio'}), {type: "opus", highWaterMark: 2000, seek: settings.seek});
			settings.dispatcher.setVolume(settings.volume / 100);
			settings.seek = 0;
			settings.dispatcher.on('finish', () => {
				if (!settings.loop && !settings.replay || commandName === "skip"){
					settings.queue.shift();
				} else if (settings.replay){
					settings.replay = false;
				}
				settings.nowPlaying = settings.queue[0];
				setTimeout(() => playSong(client, guildId), 1000);
			}).on('error', console.error);
		} else {
			settings.dispatcher = null;
		}
		client.settings.set(guildId, settings);
	},
	async execute(client, message){
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

		if (message.content === `${client.user}` || message.content === `<@!${client.user.id}>`)
			return client.commands.get("prefix").execute(message, [], client);

		if (!message.content.startsWith(settings.prefix) || message.author.bot || message.webhookID) return;

		const args = message.content.slice(settings.prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();

		console.log(commandName);

		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return;

		const clientMember = guild.me;
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
			return message.channel.send(embedMsg
				.setColor(red)
				.setTitle("Error 404")
				.setDescription(`Voice channel not found`)
				.setThumbnail("https://cdn.shopify.com/s/files/1/1061/1924/products/Anguished_Face_Emoji_1024x1024.png"));
		}

		if(command.needsConnection && !settings.connection){
            return message.channel.send(embedMsg
                .setColor(red)
				.setTitle("Not connected")
                .setDescription(`I'm not connected to a voice channel!`));
		}

		if((command.needsDispatcher && !settings.dispatcher) || (command.needsQueue && !settings.queue.length)){
            return message.channel.send(embedMsg
                .setColor(red)
				.setTitle("Not playing")
                .setDescription(`I'm not playing anything!`));
		}

		if (command.guildOnly && message.channel.type !== 'text') {
			return message.reply(embedMsg
				.setColor('#ff0000')
				.setTitle('**Channel only**')
				.setDescription('I can\'t execute that command in DMs'));
		}
		
		if (command.args && !args.length) {
			let reply = `There were no arguments given,  ${message.author}`;

			if (command.usage) {
				reply += `\nThe proper usage is: '${settings.prefix}${command.name} ${command.usage}'`;
			}

			return message.channel.send(embedMsg
				.setColor(red)
				.setTitle('**No arguments**')
				.setDescription(reply));
		}

		try {
			await command.execute(message, args, client);
			if (!settings.dispatcher && clientMember.voice.channel){
				this.playSong(client, guildId, command.name);
			}
		} catch (error) {
			console.error(error);
			message.channel.send(embedMsg
				.setColor(red)
				.setTitle('**Error**')
				.setDescription('there was an error trying to execute that command!'));
		}
	}
}