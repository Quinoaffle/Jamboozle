const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioResource, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const { exit } = require('process');
const queue = new Map();
const player = createAudioPlayer();
const songs = [];
const queue_constructor = {
    voice_channel: null,
    text_channel: null,
    connection: null,
    songs: []
}

async function test(){
    await new Promise(resolve => setTimeout(resolve, 3000));
}

module.exports = {

    name: 'play',
    aliases: ['skip', 'stop', 'p', 'queue', 'status', 'q'],
    description: 'joins and plays music',
    async execute(client, message, cmd, args) {

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            message.channel.send('You need to be in a VC first!');
        }            
        
        const server_queue = queue.get(message.guild.id);

        if(cmd === 'p' || cmd === 'play'){
            if(!args.length) return message.channel.send('You need to provide a URL or song to search!'); 
            let song = {};

            if(ytdl.validateURL(args[0])){
                const song_info = await ytdl.getInfo(args[0]);
                song = {title: song_info.videoDetails.title, url: song_info.videoDetails.video_url}
            } else{
                    //Search for vid and return first result
                    const vidFind = async (query) =>{
                    const vidRes = await ytSearch(query);
                    return (vidRes.videos.length > 1) ? vidRes.videos[0]:null;
                }
                const video = await vidFind(args.join(''));
                if(video){
                    song = {title: video.title, url: video.url}
                } else{
                    message.channel.send('Unable to find video');
                }
            }
        

            if(!server_queue){
                queue_constructor.voice_channel = voiceChannel,
                queue_constructor.text_channel = message.channel,
                    
                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);
            
                try{

                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                }).subscribe(player);
                queue_constructor.connection = connection;

                video_player(message.guild, message, queue_constructor.songs[0]);
                } catch(err){
                queue.delete(message.guild.id);
                message.channel.send('There was an error connecting')
                throw err;
                }

            } else{
                queue_constructor.songs.push(song);
                return message.channel.send(`:thumbsup: **${song.title}** added to queue`)
            }
        }
        else if(cmd === 'skip' || cmd === 's') {
            skip_song(message.guild, message, queue_constructor.songs[0]);
        }
        else if(cmd === 'stop' || cmd === 'clear') stop_song(message.guild, message, queue_constructor.songs[0]);

        else if(cmd === 'status'){
            message.channel.send(''+player.AudioPlayerStatus+'');
        }
        else if(cmd === 'queue' || cmd === 'q') {
            print_queue(message.guild, message, queue_constructor);
        }
    }

}


const video_player = (guild, message, song) =>{
    const stream = ytdl(song.url, {filter: 'audioonly'})
    const resource = createAudioResource(stream);
    message.channel.send(`:thumbsup: Now Playing **${song.title}**`)
    play_media(resource, guild, message, queue_constructor.songs[0]);
    exit;
}

async function play_media(resource, guild, message, song){
   await player.play(resource);
   //const OldStat = AudioPlayerStatus;
 //  player.on(AudioPlayerStatus.Idle, () =>{
      // if (OldStat === Playing){
           // queue_constructor.songs.shift();
           // video_player(guild, message, queue_constructor.songs[0]);
           // queue.delete(guild.id);
           //message.channel.send(`Queue Deleted`)
      // }
     //  else{
          // return;
      // }
    //});
}


const skip_song = (guild, message, song) => {
    queue_constructor.songs.shift();
    video_player(guild, message, queue_constructor.songs[0]);
}

const stop_song = (guild, message, song) => {
    queue_constructor.songs.shift();
    video_player(guild, message, queue_constructor.songs[0]);
}

const print_queue = (guild, message, queue_constructor) => {
    const printQueue = JSON.stringify(queue_constructor.songs);
    message.channel.send(`${printQueue}`)
}

//node index.js
