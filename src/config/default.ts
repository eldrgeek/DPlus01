import { DiscordConfig } from '../types/config';

export const defaultConfig: DiscordConfig = {
  guilds: [
    {
      id: "PASTE_GUILD_ID_HERE",
      name: "Your Server Name",
      channels: [
        {
          id: "PASTE_CHANNEL_ID_HERE",
          name: "general"
        }
      ]
    }
  ]
}; 