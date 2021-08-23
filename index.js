const dotenv = require("dotenv");
const fs = require('fs');
const {Client, Collection} = require('discord.js');

dotenv.config();

const client = new Client();
client.commands = new Collection();
client.settings = new Collection();

for (const file of fs.readdirSync('./commands').filter(file => file.endsWith('.js'))) {
    const command = require('./commands/' + file);
    client.commands.set(command.name, command);
}

for(const file of fs.readdirSync("./events/").filter(file => file.endsWith(".js"))){
    const event = require(`./events/${file}`);
    if(event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
        continue;
    }
    client.on(event.name, (...args) => event.execute(client, ...args));
}

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.login(process.env.BOT_TOKEN);
