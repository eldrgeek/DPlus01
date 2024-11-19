import { Client, GatewayIntentBits } from 'discord.js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const TOKEN = process.env.DISCORD_BOT_TOKEN;

if (!TOKEN) {
  throw new Error('DISCORD_BOT_TOKEN is not defined in environment variables');
}

async function fetchGuildInfo() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
    ]
  });

  try {
    await client.login(TOKEN);

    console.log('\nAccessible Guilds and Channels:\n');

    client.guilds.cache.forEach(guild => {
      console.log(`Guild: ${guild.name} (${guild.id})`);
      
      guild.channels.cache.forEach(channel => {
        if (channel.type === 0) { // 0 is text channel
          console.log(`  └─ Channel: ${channel.name} (${channel.id})`);
        }
      });
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.destroy();
  }
}

fetchGuildInfo().catch(console.error); 