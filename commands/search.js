const {MessageEmbed} = require('discord.js');
const ytdl = require('ytdl-core-discord');
const {blue, red} = require('../colors.json');
const search = require('youtube-search');

module.exports = {
    name: "search",
    description: "search for video's by name",
    args: true,
    usage: "<search query>",
    guildOnly: true,
    needsVoice: true,
    replaceHTML(string){
        return string.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
    },
    async playSong(client, guildId){
        const settings = client.settings.get(guildId);

        if (settings.connection){
            if (!settings.queue.length) return setTimeout(() => this.playSong(client, guildId), 1000);
            settings.dispatcher = settings.connection.play(await ytdl(settings.queue[0]), {type: "opus", highWaterMark: 50});
            settings.dispatcher.on('finish', () => {
                if (!settings.loop) settings.queue.shift();
                setTimeout(() => this.playSong(client, guildId), 1000);
            });
        } else {
            settings.dispatcher = null;
        }

        client.settings.set(guildId, settings);
    },
    async collectPlay(client, guildId, message, results, sentMessage){
        const settings = client.settings.get(guildId);
        
        message.channel.createMessageCollector(m => m.author === message.author, {max: 1}).on('collect', async msg => {
            const embedMsg = new MessageEmbed()
                .setColor(blue)
                .setTitle("Search")
                .setDescription("Search canceled");
            
            if (msg.content.toLowerCase() === "cancel") return sentMessage.edit(embedMsg);
            if (msg.content.toLowerCase() === "random") msg.content = `${Math.floor(Math.random() * results.length)}`;

            if (isNaN(msg.content) || parseInt(msg.content) > results.length || parseInt(msg.content) < 1) return this.collectPlay(client, guildId, message, results, sentMessage);
            
            if (!settings.connection) settings.connection = await message.member.voice.channel.join();

            const index = parseInt(msg.content) - 1;
            const videoId = results[index].id;
            settings.queue.push(videoId);
            const link = `[${this.replaceHTML(results[index].title)}](${results[index].link})`;

            if (settings.queue.length === 1){
                settings.nowPlaying = videoId;
                embedMsg.setDescription(`Now Playing ${link}`);
                sentMessage.edit(embedMsg);
                return this.playSong(client, guildId);
            }
            
            client.settings.set(guildId, settings);
            embedMsg.setDescription(`${link} has been added to the queue`);
            sentMessage.edit(embedMsg);
        });
    },
    async execute(message, args, client) {
        const embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Search Results")
            .setDescription("type a number of this list to play that song")
            .setTimestamp()
            .setFooter("type cancel to cancel");
        
        let results;
        try {
            results = await search(args.join(" "), {
                maxResults: 25,
                key: process.env.YOUTUBE_API_KEY,
                type: 'video'
            });
        } catch (error) {
            console.log(error.response.data);
        }

        if (!results || !results.results.length){
            const cancelEmbed = new MessageEmbed()
                .setColor(red)
                .setTitle("Search")
                .setDescription(`No videos found`);

            return message.channel.send(cancelEmbed);
        }

        results = results.results;

        results.forEach((result, index) =>
            embedMsg.addField(`${index + 1}. ${this.replaceHTML(result.channelTitle)}`, `[${this.replaceHTML(result.title)}](${result.link})`));

        this.collectPlay(client, message.guild.id, message, results, await message.channel.send(embedMsg));
    }
}