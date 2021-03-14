//This was made on my 14th birthday!!! -Mutant
const { Client, MessageEmbed } = require('discord.js');
const bot = new Client;
const token = 'your-token-goes-here';
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://<user>:<password>@<cluster-url><database-name>?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
    if (err) console.error(err)
}).then(() => {
    console.log("Connected!");
})

const serverSchema = new mongoose.Schema({
    serverid: String,
    lastPerson: String,
    countingChannel: String,
    counter: Number,
    PREFIX: String
})

const serverModel = mongoose.model("server", serverSchema);

bot.on('ready', ready => {
    console.log('Ready!');
    setInterval(()=>{
        bot.user.setActivity(`People count || c!help || ${bot.guilds.cache.size} guilds`, { type: 'LISTENING' })
        .catch(err => {
            if (err) console.error(err);
        });
    },10000)
})

bot.on('message', async (message) => {
    if (message.author.bot) {
        return;
    }
    
    const server = await serverModel.findOne({ serverid: message.guild?.id }, async (err, data) => {
        if (err) {
            sendMessage(message.channel, "Error please contact a developer...");
            console.error(err);
        } else {
            return data
        }
    })

    var PREFIX = server?.PREFIX || 'c!';
    var serverMade = server?true:false;
            
    if (message.content.startsWith(PREFIX)) {
        var cmdArguments=(message.content.slice(PREFIX.length).trim()).split(" ")
        switch(cmdArguments[0]){
            case `setchannel`:
                if (!message.member.permissions.has(['MANAGE_GUILD'])) {
                    return sendMessage(message.channel, "In order to use this command you must have the permission ``MANAGE_GUILD``");
                }
                if (serverMade) {
                    server.updateOne({ countingChannel: message.channel.id }).then(() => {
                        sendMessage(message.channel, `This channel was set to the counting channel! Current count: ${"`"}${server.counter}${"`"}, next number: ${"`"}${server.counter+1}${"`"}`);
                    }).catch(err => {
                        if (err) {
                            sendMessage(message.channel, 'I wasnt able to set this channel.');
                            console.error(err);
                        }
                    })
                } else {
                    serverModel({ serverid: message.guild.id, countingChannel: message.channel.id, PREFIX: 'c!', lastPerson: "0", counter: "0" }).save(err => {
                        if (err) {
                            sendMessage(message.channel, 'I wasnt able to set this channel.');
                            console.error(err);
                        } else {
                            sendMessage(message.channel, `This channel was set to the counting channel! Current count: ${"`"}0${"`"}, next number: ${"`"}1${"`"}`);
                        }
                    });
                }
            break;

            case `unsetchannel`:
                if (!message.member.permissions.has(['MANAGE_GUILD'])) {
                    return sendMessage(message.channel, "In order to use this command you must have the permission ``MANAGE_GUILD``");
                }
                if (serverMade) {
                    server.updateOne({ countingChannel: '0' }).then(() => {
                        sendMessage(message.channel, 'This channel was unset and is now a regular text channel!');
                    }).catch(err => {
                        if (err) {
                            sendMessage(message.channel, "I wasn't able to unset this channel...");
                            console.error(err);
                        }
                    })
                } else {
                    sendMessage(message.channel, "This channel is not a counting channel.");
                }
            break;

            case `clear`:
                if (!message.member.permissions.has(['MANAGE_GUILD'])) {
                    return sendMessage(message.channel, "In order to use this command you must have the permission ``MANAGE_GUILD``");
                }
                if (serverMade) {
                    server.updateOne({ counter: '0', lastPerson: '0' }).then(() => {
                        sendMessage(message.channel, "The count for this server has been set to ``0`` :)");
                    }).catch(err => {
                        if (err) {
                            sendMessage(message.channel, "I wasn't able to reset this servers count.");
                            console.error(err);
                        }
                    })
                } else {
                    serverModel({ serverid: message.guild.id, countingChannel: '0', PREFIX: 'c!', lastPerson: "0", counter: '0' }).save(err => {
                        if (err) {
                            sendMessage(message.channel, "I wasn't able to reset this servers count.");
                            console.error(err);
                        } else {
                            sendMessage(message.channel, "The count for this server has been set to ``0`` :)");
                        }
                    });
                }
            break;

            case `count`:
                sendMessage(message.channel, serverMade ? `The count for this server is ${"`"}${server.counter}${"`"}, next number is ${"`"}${server.counter+1}${"`"}` : `This channel is not a counting channel.`)
            break;
        
            case `help`:
                const help = new MessageEmbed()
                .setTitle('Help!')
                .setDescription("Below is the help you requested...")
                .addField("General", "After using the command ``c!setchannel`` that channel will be **dedicated** to counting! Counting will start at 0, and you need to count __up__ from there.\nKeep in mind that you **cannot** count more then twice in a row, you must alternate counting with another person.")
                .addField("Commands!", "``c!setchannel`` => this command will set the counting channel.\n``c!unsetchannel`` => this command will unset the counting channel turning it into a regular channel.\n``c!setprefix`` => this command will set the prefix for this bot in your server.\n``c!clear`` => this command will restart the server counter to **0**.\n``c!count`` => this command will show the current number this server is at incase you get lost.")
                .addField("Invite!", "If you would like to invite this bot, an invite can be found [here](https://discord.com/api/oauth2/authorize?client_id=759932294026362900&permissions=354368&scope=bot).")
                .setFooter("Thanks for using us!")
                .setTimestamp()
                .setColor('RANDOM');
                message.author.send(help).then(() => {
                    react(message, '👍')
                }).catch(err => {
                    if (err) {
                        sendMessage(message.channel, "Please enable ``DMS`` for this server to use this command.");
                    }
                })
            break;
            
            case `setprefix ${cmdArguments[1]}`:
                if (!message.member.permissions.has(['MANAGE_GUILD'])) {
                    return sendMessage(message.channel, "In order to use this command you must have the permission ``MANAGE_GUILD``");
                }
                var newPrefix = cmdArguments[1];
                if (serverMade) {
                    server.updateOne({ PREFIX: newPrefix }).then(() => {
                        sendMessage(message.channel, `Succesfully changed the prefix to ${"`"}${newPrefix}${"`"} :)`);
                    }).catch(err => {
                        if (err) {
                            sendMessage(message.channel, "Unfortunately i wasn't able to change the prefix for this server");
                            console.error(err);
                        }
                    })
                } else {
                    serverModel({ serverid: message.guild.id, countingChannel: '0', PREFIX: newPrefix, lastPerson: "0", counter: '0' }).save(err => {
                        if (err) {
                            sendMessage(message.channel, "Unfortunately i wasn't able to change the prefix for this server.");
                            console.error(err);
                        } else {
                            sendMessage(message.channel, `Succesfully changed the prefix to ${"`"}${newPrefix}${"`"} :)`);
                        }
                    });
                }
            break;
        }
    } else if (message.channel.id === server?.countingChannel){
        if (isNaN(message.content)) {
            deleteMessage(message)
        } else {
            if (server.lastPerson == message.author.id) {
                deleteMessage(message)
                message.author.send('You were the last person to count, so you cannot count again!').catch(err => { });
            } else {
                server.counter++;
                if (server.counter == parseInt(message.content)) {
                    server.updateOne({ counter: server.counter, lastPerson: message.author.id }).then(() => {
                        react(message, '👍')
                    }).catch(err => {
                        if (err) {
                            sendMessage(message.channel, 'A fatal error occoured...');
                            console.log('Error: ', err);
                        }
                    })
                } else {
                    await deleteMessage(message)
                    message.author.send(`That is the wrong number! Next number is: ${"`"}${server.counter}${"`"}.`).catch(err => { });
                }
            }
        }
    }
    

    async function deleteMessage(message){
        await message.delete().catch(err => {
            sendMessage(message.channel, "Error: invalid permissions, please enable ``MANAGE_MESSAGES`` for this bot.");
        })
    }

    function sendMessage(message, content, user){
        message.channel.send(content).catch(err => {})
    }

    function react(message, reaction){
        message.react(reaction).catch(err => {
            sendMessage(message.channel, "Error: Invalid permissions, please enable the permission ``ADD_REACTIONS`` to this bot.");
        });
    }
})

bot.login(token);
