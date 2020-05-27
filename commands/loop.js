module.exports = {
    name: "loop",
    description: "loop current song",
    args: false,
    guildOnly: true,
    execute(message, args, client){
        client.loop = !client.loop;
    }
}