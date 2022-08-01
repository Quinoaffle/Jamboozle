const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const client = new Discord.Client({intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });
const prefix = '?';
const fs = require('fs');


client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler =>{
    require(`./${handler}.js`)(client, Discord);
})

client.login('ODg4Mjg1MjQ5MjMzMTEzMDk4.YUQeGg.u_tW_Au7UCj2i680HNJ3JQ1nGNk');

// node index.js