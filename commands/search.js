const {MessageEmbed} = require('discord.js');
const {blue, red} = require('../colors.json');
const {youtube_api_key} = require('../config.json');
const search = require('youtube-search');
const opts = {
    maxResults: 25,
    key: youtube_api_key,
    type: 'video'
}

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
        
        let results = await search(query, opts)

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
            let title = result.channelTitle.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
            let resultTitle = result.title.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
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
                client.dispatcher = client.connection.play(await ytdl(client.queue[0]), {type: "opus"});
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
                if (isNaN(msg.content) || parseInt(msg.content) > results.length || parseInt(msg.content) < 1){
                    return collectPlay(mess);
                }
                if (!client.connection){
                    client.connection = await message.member.voice.channel.join();
                }
                const videoId = results[parseInt(msg.content) - 1].id;
                client.queue.push(videoId);
                playSong();
            });
        }

        message.channel.send(embedMsg).then(msg => {
            collectPlay(msg);
        });
    }
}