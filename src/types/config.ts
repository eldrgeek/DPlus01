export interface ChannelConfig {
  id: string;
  name: string;
}

export interface GuildConfig {
  id: string;
  name: string;
  channels: ChannelConfig[];
}

export interface DiscordConfig {
  guilds: GuildConfig[];
} 