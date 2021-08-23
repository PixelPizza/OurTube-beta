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
    async execute(message, args, client) {
        const guildId = message.guild.id,
            embedMsg = new MessageEmbed()
            .setColor(blue)
            .setTitle("Search Results")
            .setDescription("type a number of this list to play that song")
            .setTimestamp()
            .setFooter("type cancel to cancel");

        const cancelEmbed = new MessageEmbed()
            .setColor(blue)
            .setTitle("Search")
            .setDescription("Search canceled");

        const query = args.join(" ");
        
        let results;
        try {
            results = await search(query, {
                maxResults: 25,
                key: process.env.YOUTUBE_API_KEY,
                type: 'video'
            });
        } catch (error) {
            console.log(error.response.data);
        }

        if (!results){
            cancelEmbed
                .setColor(red)
                .setDescription(`No videos found`);

            return message.channel.send(cancelEmbed);
        }

        results = results.results;

        if (!results.length){
            cancelEmbed
                .setColor(red)
                .setDescription(`No videos found`);

            return message.channel.send(cancelEmbed);
        }

        var atResult = 1;
        results.forEach(result => {
            let title = result.channelTitle.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
            let resultTitle = result.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
            embedMsg.addField(`${atResult}. ${title}`, `[${resultTitle}](${result.link})`);
            atResult++;
        });

        async function playSong(){
            const settings = client.settings.get(guildId);
            if (settings.connection){
                if (!settings.queue.length){
                    setTimeout(function() {
                        playSong();
                    }, 1000);
                    return;
                }
                settings.dispatcher = settings.connection.play(await ytdl(settings.queue[0]), {type: "opus", highWaterMark: 50});
                settings.dispatcher.on('finish', () => {
                    if (!settings.loop){
                        settings.queue.shift();
                    }
                    setTimeout(function() {
                        playSong();
                    }, 1000);
                });
            } else {
                settings.dispatcher = null;
            }
            client.settings.set(guildId, settings);
        }

        async function collectPlay(mess){
            const settings = client.settings.get(guildId);
            const filter = m => m.author === message.author;
            const collector = message.channel.createMessageCollector(filter, {max: 1});
            collector.on('collect', async msg => {
                if (msg.content.toLowerCase() === "cancel"){
                    return mess.edit(cancelEmbed);
                }
                if (msg.content.toLowerCase() === "random"){
                    msg.content = `${Math.floor(Math.random() * results.length)}`;
                }
                if (isNaN(msg.content) || parseInt(msg.content) > results.length || parseInt(msg.content) < 1){
                    return collectPlay(mess);
                }
                if (!settings.connection){
                    settings.connection = await message.member.voice.channel.join();
                }
                const index = parseInt(msg.content) - 1;
                const videoId = results[index].id;
                let resultTitle = results[index].title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
                settings.queue.push(videoId);
                const link = `[${resultTitle}](${results[index].link})`;
                if (settings.queue.length === 1){
                    settings.nowPlaying = videoId;
                    cancelEmbed.setDescription(`Now Playing ${link}`);
                    mess.edit(cancelEmbed);
                    return playSong();
                }
                client.settings.set(guildId, settings);
                cancelEmbed.setDescription(`${link} has been added to the queue`);
                mess.edit(cancelEmbed);
            });
        }

        message.channel.send(embedMsg).then(msg => {
            collectPlay(msg);
        }).catch(console.error);
    }
}