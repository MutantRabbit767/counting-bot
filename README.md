# counting-bot
Hello! Thanks for reading the Counting bots repository for this bot, if you would like to add this bot to your server click [here](https://discord.com/api/oauth2/authorize?client_id=759932294026362900&permissions=354368&scope=bot).

## Setup
### In the bot.js file
To setup this project you will first need to replace the database **URL** with *your* Mongo database url inside of the qoutation marks.
```javascript
mongoose.connect("mongodb+srv://<user>:<password>@<cluster-url><database-name>?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
  if (err) throw err;
}).then(() => {
  console.log("Connected!");
})
```

Then you will want to go to [Discords Developer Portal](https://discord.com/developers/applications/) and make yourself an app and a bot, then copy the token and paste it here.
```javascript
const token = 'your-bot-token-here';
```

### In the shards.js file
change your token to the same token used earlier.
```javascript
const token = 'your-token-here';
```

## Hosting
If you would like to host this on a personal PC or other device, open a terminal (make sure npm is installed) and make sure to be in the same directory as the bot files and then type
```bash
npm install
```
then (assuming you have node installed) type
```bash
node shards.js
```
and voila! Your bot should go online!!

## Liscense
[Read here!!!](https://github.com/MutantRabbit767/counting-bot/blob/master/LICENSE)
