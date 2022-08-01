const { MessageEmbed, Message } = require("discord.js");

module.exports ={
    name: 'commands',
    aliases: ['help'],
    description: "list of commands",
    execute(client, message, cmd, args, Discord){
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#33FFEC')
        .setTitle('Jamboozle')
        .setDescription('Here are a few commands to get you started:')
        .addFields(
            {name: '?help', value: 'Returns a list of commands'},
            {name: '?p or ?play', value: 'Plays the track from the URL provided'},
            {name: '?s or ?skip', value: 'Skips to the next song in the queue'},
            {name: '?q or ?queue', value: 'Shows the current music queue'},
            {name: '?stop or ?clear', value: 'Clears the current queue'}
        )
        .setImage('https://i.imgur.com/i8nXrSN.png')

        message.channel.send({embeds:[newEmbed]});
    }

    
}