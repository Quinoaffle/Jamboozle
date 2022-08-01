module.exports ={
    name: 'ping',
    description: 'Ping command!',
    execute(client, message, cmd, args){
        messageCreate.channel.send('pong');
    }
}