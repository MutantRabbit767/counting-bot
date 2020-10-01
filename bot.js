//This was made on my 14th birthday!!! -Cohen Schellenberg

const { Client, MessageEmbed } = require('discord.js');
const bot = new Client;
const token = 'your-token-goes-here';
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://<user>:<password>@<cluster-url><database-name>?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
  if (err) throw err;
}).then(() => {
  console.log("Connected!");
})

const serverSchema = new mongoose.Schema({
  serverid: String,
  lastPerson: String,
  countingChannel: String,
  counter: String,
  PREFIX: String
})

const serverModel = mongoose.model("server", serverSchema);

bot.on('ready', ready => {
  bot.user.setActivity(`People count and spam c!help because im cool. Bot in ${bot.guilds.cache.size} guilds`, { type: 'LISTENING' }).then(() => {
    console.log('Ready!');
  }).catch(err => {
    if(err){
      console.log('Error: ', err);
    }
  });
})

bot.on('message', message => {
  if(message.author.bot){
    return;
  }
  var PREFIX;
  if(message.channel.type == 'dm'){
    PREFIX = 'c!';
    if(message.content.toLowerCase() == `${PREFIX}help`){
      const help = new MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle('Help!')
        .setDescription("Below is the help you requested...")
        .addField("General", "After using the command ``c!setchannel`` that channel will be **dedicated** to counting! Counting will start at 0, and you need to count __up__ from there.\nKeep in mind that you **cannot** count more then twice in a row, you must alternate counting with another person.")
        .addField("Commands!", "``c!setchannel`` => this command will set the counting channel.\n``c!unsetchannel`` => this command will unset the counting channel turning it into a regular channel.\n``c!setprefix`` => this command will set the prefix for this bot in your server.\n``c!clear`` => this command will restart the server counter to **0**.\n``c!count`` => this command will show the current number this server is at incase you get lost.")
        .addField("Invite!", "If you would like to invite this bot, an invite can be found [here](https://discord.com/api/oauth2/authorize?client_id=759932294026362900&permissions=354368&scope=bot).")
        .setFooter("Thanks for using us!")
        .setTimestamp()
        .setColor('RANDOM');
      message.author.send(help).then(() => {
        message.react('👍').catch(err => {
          message.channel.send("Error: Invalid permissions, please enable the permission ``ADD_REACTIONS`` to this bot.");
        });
      }).catch(err => {
        if(err){
          message.channel.send("Please enable ``DMS`` for this server to use this command.");
        }
      })
    }
  }else{
    var serverMade;
    const server = serverModel.findOne({ serverid: message.guild.id }, (err, data) => {
      if(err){
        message.channel.send("Error please contact a developer...");
        console.log("Error: ", err);
      }else{
        if(data){
          PREFIX = data.PREFIX;
          serverMade = true;
        }else{
          PREFIX = 'c!'
          serverMade = false;
        }
      }
      if(message.content.startsWith(PREFIX)){
        if(message.content.toLowerCase() == `${PREFIX}setchannel`){
          if(!message.member.permissions.has(['MANAGE_GUILD'])){
            return message.channel.send("In order to use this command you must have the permission ``MANAGE_GUILD``");
          }
          if(serverMade){
            server.updateOne({ countingChannel: message.channel.id }).then(() => {
              var count = parseInt(data.counter);
              count++;
              var black = "``";
              message.channel.send(`This channel was set to the counting channel! Current count: ${black}${data.counter}${black}, next number: ${black}${count}${black}`);
            }).catch(err => {
              if(err){
                message.channel.send('I wasnt able to set this channel.');
                console.log("Error: ", err);
              }
            })
          }else{
            serverModel({ serverid: message.guild.id, countingChannel: message.channel.id, PREFIX: 'c!', lastPerson: "0", counter: "0" }).save(err => {
              if(err){
                message.channel.send('I wasnt able to set this channel.');
                console.log("Error: ", err);
              }else{
                var black = "``";
                message.channel.send(`This channel was set to the counting channel! Current count: ${black}0${black}, next number: ${black}1${black}`);
              }
            });
          }
        }else if(message.content.toLowerCase() == `${PREFIX}unsetchannel`){
          if(!message.member.permissions.has(['MANAGE_GUILD'])){
            return message.channel.send("In order to use this command you must have the permission ``MANAGE_GUILD``");
          }
          if(serverMade){
            server.updateOne({ countingChannel: '0' }).then(() => {
              message.channel.send('This channel was unset and is now a regular text channel!');
            }).catch(err => {
              if(err){
                message.channel.send("I wasn't able to unset this channel...");
                console.log("Error: ", err);
              }
            })
          }else{
            serverModel({ serverid: message.guild.id, countingChannel: '0', PREFIX: 'c!', lastPerson: "0", counter: '0' }).save(err => {
              if(err){
                message.channel.send("I wasn't able to unset this channel...");
                console.log("Error: ", err);
              }else{
                message.channel.send("This channel was unset and is now a regular text channel!");
              }
            });
          }
        }else if(message.content.toLowerCase() == `${PREFIX}clear`){
          if(!message.member.permissions.has(['MANAGE_GUILD'])){
            return message.channel.send("In order to use this command you must have the permission ``MANAGE_GUILD``");
          }
          if(serverMade){
            server.updateOne({ counter: '0', lastPerson: '0' }).then(() => {
              message.channel.send("The count for this server has been set to ``0`` :)");
            }).catch(err => {
              if(err){
                message.channel.send("I wasn't able to reset this servers count.");
                console.log("Error: ", err);
              }
            })
          }else{
            serverModel({ serverid: message.guild.id, countingChannel: '0', PREFIX: 'c!', lastPerson: "0", counter: '0' }).save(err => {
              if(err){
                message.channel.send("I wasn't able to reset this servers count.");
                console.log("Error: ", err);
              }else{
                message.channel.send("The count for this server has been set to ``0`` :)");
              }
            });
          }
        }else if(message.content.toLowerCase() == `${PREFIX}count`){
          if(serverMade){
            var count = parseInt(data.counter);
            count++;
            var black = "``";
            message.channel.send(`The count for this server is ${black}${data.counter}${black}, next number is ${count}`);
          }else{
            serverModel({ serverid: message.guild.id, countingChannel: '0', PREFIX: 'c!', lastPerson: "0", counter: '0' }).save(err => {
              if(err){
                message.channel.send("A fatal error occourerd, please contact the developers...");
                console.log("Error: ", err);
              }else{
                message.channel.send('The count for this server is ``0``, next number is ``1``');
              }
            });
          }
        }else if(message.content.toLowerCase() == `${PREFIX}help`){
          const help = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('Help!')
            .setDescription("Below is the help you requested...")
            .addField("General", "After using the command ``c!setchannel`` that channel will be **dedicated** to counting! Counting will start at 0, and you need to count __up__ from there.\nKeep in mind that you **cannot** count more then twice in a row, you must alternate counting with another person.")
            .addField("Commands!", "``c!setchannel`` => this command will set the counting channel.\n``c!unsetchannel`` => this command will unset the counting channel turning it into a regular channel.\n``c!setprefix`` => this command will set the prefix for this bot in your server.\n``c!clear`` => this command will restart the server counter to **0**.\n``c!count`` => this command will show the current number this server is at incase you get lost.")
            .addField("Invite!", "If you would like to invite this bot, an invite can be found [here](https://discord.com/api/oauth2/authorize?client_id=759932294026362900&permissions=354368&scope=bot).")
            .setFooter("Thanks for using us!")
            .setTimestamp()
            .setColor('RANDOM');
          message.author.send(help).then(() => {
            message.react('👍').catch(err => {
              message.channel.send("Error: Invalid permissions, please enable the permission ``ADD_REACTIONS`` to this bot.");
            });
          }).catch(err => {
            if(err){
              message.channel.send("Please enable ``DMS`` for this server to use this command.");
            }
          })
        }else if(message.content.toLowerCase().startsWith(`${PREFIX}setprefix`)){
          if(!message.member.permissions.has(['MANAGE_GUILD'])){
            return message.channel.send("In order to use this command you must have the permission ``MANAGE_GUILD``");
          }
          var newPrefix = message.content.substring(PREFIX.length + 9).trim();
          if(serverMade){
            server.updateOne({ PREFIX: newPrefix }).then(() => {
              var black ="``";
              message.channel.send(`Succesfully changed the prefix to ${black}${newPrefix}${black} :)`);
            }).catch(err => {
              if(err){
                message.channel.send("Unfortunately i wasn't able to change the prefix for this server");
                console.log("Error: ", err);
              }
            })
          }else{
            serverModel({ serverid: message.guild.id, countingChannel: '0', PREFIX: newPrefix, lastPerson: "0", counter: '0' }).save(err => {
              if(err){
                message.channel.send("Unfortunately i wasn't able to change the prefix for this server.");
                console.log("Error: ", err);
              }else{
                var black ="``";
                message.channel.send(`Succesfully changed the prefix to ${black}${newPrefix}${black} :)`);                
              }
            });
          }
        }else if(message.content.toLowerCase().startsWith(`${PREFIX}updatestatus`) && message.author.id == "your-user-id-here"){
          bot.user.setActivity(`People count and spam c!help because im cool. Bot in ${bot.guilds.cache.size} guilds`, { type: 'LISTENING' }).then(() => {
            message.channel.send("Updated status!");
          }).catch(err => {
            if(err){
              message.channel.send("Error!");
              console.log('Error: ', err);
            }
          });
        }
      }else {
        if(data == null){
          return;
        }
        if(message.channel.id === data.countingChannel){        
          if(isNaN(message.content)){
            message.delete().catch(err => {
              message.channel.send("Error: invalid permissions, please enable ``MANAGE_MESSAGES`` for this bot.");
            });
          }else{
            var lastPerson = data.lastPerson;
            if(lastPerson == message.author.id){
              message.delete().catch(err => {
                message.channel.send("Error: Invalid permissions, please enable the permission ``MANAGE_MESSAGES`` for this bot.");
              });
              message.author.send('You were the last person to count, so you cannot count again!').catch(err => {});
              return;
            }else{
              var count = parseInt(data.counter);
              count++;
              if(count == parseInt(message.content)){
                server.updateOne({ counter: `${count}`, lastPerson: message.author.id }).then(() => {
                  message.react('👍').catch(err => {
                    message.channel.send("Error: Invalid permissions, please enable the permission ``ADD_REACTIONS`` to this bot.");
                  });
                }).catch(err => {
                  if(err){
                    message.channel.send('A fatal error occoured...');
                    console.log('Error: ', err);
                  }
                })
              }else{
                message.delete().then(() => {
                  var black = "``";
                  message.author.send(`That is the wrong number! Next number is: ${black}${count}${black}.`).catch(err => {});
                }).catch(err => {
                  message.channel.send("Error: invalid permissions, please enable the permission ``MANAGE_MESSAGES`` for this bot.");
                });
              }
            }
          }
        }
      }    
    })
  }
})

bot.login(token);
