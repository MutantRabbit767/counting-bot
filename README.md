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
**If you don't know how to get a database and a url.**
If you want to start with a free 500MB database thats always online, you can head over to [MongoDB](https://www.mongodb.com/) and create an account. Upon signing up you will be brought to a page that asks you to make an organization and a project, pick JavaScript for the preffered language. On the right side of the page that it redirects you to, there will be an option for a *Shared Cluster* under that, press *Create Cluster*. From here you can pick AWS and pick a region thats closest to you (for fast read and write times), the rest you can leave defaulted, just click *Create Cluster*. Very nice! You created your first cluster. Now on the left side of the tab click *Network Access*, and then click *add IP Adcress*, select your IP or click allow from anywhere. Now on the left side click on *Add a new Database user* and make whatever username you see fit, generate or make your own password **make sure to copy and paste the password into a document of some sort**. Now click on *Clusters* and click *Collections*, then click *Add my own data* and make a database name and a random collection name, the collection name can be deleted after your first data stored, so don't worry about what you put in that field. Now that you have done that click on *Clusters* again from the left side of the menu, and click *Connect*. Now click *Connect your application*, click copy and paste that into the double quotation marks from the last section of this README, make sure to replace the <password> with the password you made earlier and replace <dbname> with the database name from what you made earlier.
 *If you followed the instructions properly, your bot should now be working!*



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
