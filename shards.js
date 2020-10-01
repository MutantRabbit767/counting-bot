const { ShardingManager } = require('discord.js');
const token = 'your-token-goes-here';

console.log("Sharding manager created!");

const shards = new ShardingManager('bot.js', {
  token: token,
  totalShards: 'auto'
})

shards.on("shardCreate", shard => {
  console.log(`Shard number ${shard.id} was created!`);
})

shards.spawn();
