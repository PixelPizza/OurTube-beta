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
    async execute(message, args, client) {
        const embedMsg = new MessageEmbed()
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

        async function collectPlay(mess){
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
                if (!client.connection){
                    client.connection = await message.member.voice.channel.join();
                }
                const index = parseInt(msg.content) - 1;
                const videoId = results[index].id;
                let resultTitle = results[index].title.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
                client.queue.push(videoId);
                const link = `[${resultTitle}](${results[index].link})`;
                if (client.queue.length === 1){
                    client.nowPlaying = videoId;
                    cancelEmbed.setDescription(`Now Playing ${link}`);
                    mess.edit(cancelEmbed);
                    return playSong();
                }
                cancelEmbed.setDescription(`${link} has been added to the queue`);
                mess.edit(cancelEmbed);
            });
        }

        message.channel.send(embedMsg).then(msg => {
            collectPlay(msg);
        }).catch(console.error);
    }
}