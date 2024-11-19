import { Client, GatewayIntentBits, Message, TextChannel, Presence, User, MessageReaction, PartialMessageReaction } from 'discord.js';
import { DiscordConfig } from '../types/config';

export class DiscordService {
  private client: Client;
  private config: DiscordConfig;
  private messageHandlers: ((message: Message, type?: 'new' | 'update') => void)[] = [];
  private presenceHandlers: ((presence: Presence) => void)[] = [];
  private reactionHandlers: ((reaction: MessageReaction | PartialMessageReaction, userId: string, type: 'add' | 'remove') => void)[] = [];
  private userPresences: Map<string, Presence> = new Map();

  constructor(config: DiscordConfig) {
    this.config = config;
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
      ]
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on('messageCreate', (message: Message) => {
      const isConfiguredChannel = this.config.guilds.some(guild => 
        guild.channels.some(channel => channel.id === message.channelId)
      );

      if (isConfiguredChannel) {
        this.messageHandlers.forEach(handler => handler(message));
      }
    });

    this.client.on('messageUpdate', async (oldMessage, newMessage) => {
      if (newMessage.partial) {
        try {
          await newMessage.fetch();
        } catch (error) {
          console.error('Failed to fetch updated message:', error);
          return;
        }
      }

      const isConfiguredChannel = this.config.guilds.some(guild => 
        guild.channels.some(channel => channel.id === newMessage.channelId)
      );

      if (isConfiguredChannel && newMessage instanceof Message) {
        this.messageHandlers.forEach(handler => handler(newMessage, 'update'));
      }
    });

    this.client.on('presenceUpdate', (oldPresence, newPresence) => {
      if (!newPresence?.userId) return;
      
      const isRelevantUser = this.config.guilds.some(guild => 
        guild.id === newPresence.guild?.id
      );

      if (isRelevantUser) {
        this.userPresences.set(newPresence.userId, newPresence);
        this.presenceHandlers.forEach(handler => handler(newPresence));
      }
    });

    this.client.on('messageReactionAdd', async (reaction, user) => {
      if (reaction.partial) {
        try {
          await reaction.fetch();
        } catch (error) {
          console.error('Failed to fetch reaction:', error);
          return;
        }
      }

      const isConfiguredChannel = this.config.guilds.some(guild => 
        guild.channels.some(channel => channel.id === reaction.message.channelId)
      );

      if (isConfiguredChannel) {
        this.reactionHandlers.forEach(handler => handler(reaction, user.id, 'add'));
      }
    });

    this.client.on('messageReactionRemove', async (reaction, user) => {
      if (reaction.partial) {
        try {
          await reaction.fetch();
        } catch (error) {
          console.error('Failed to fetch reaction:', error);
          return;
        }
      }

      const isConfiguredChannel = this.config.guilds.some(guild => 
        guild.channels.some(channel => channel.id === reaction.message.channelId)
      );

      if (isConfiguredChannel) {
        this.reactionHandlers.forEach(handler => handler(reaction, user.id, 'remove'));
      }
    });
  }

  public onMessage(handler: (message: Message) => void) {
    this.messageHandlers.push(handler);
  }

  public onPresenceUpdate(handler: (presence: Presence) => void) {
    this.presenceHandlers.push(handler);
  }

  public onReaction(handler: (reaction: MessageReaction | PartialMessageReaction, userId: string, type: 'add' | 'remove') => void) {
    this.reactionHandlers.push(handler);
  }

  public async connect() {
    if (!process.env.DISCORD_BOT_TOKEN) {
      throw new Error('DISCORD_BOT_TOKEN is not defined');
    }

    try {
      await this.client.login(process.env.DISCORD_BOT_TOKEN);
      console.log('Connected to Discord');
    } catch (error) {
      console.error('Failed to connect to Discord:', error);
      throw error;
    }
  }

  public async disconnect() {
    await this.client.destroy();
    console.log('Disconnected from Discord');
  }

  public async sendMessage(channelId: string, content: string) {
    const channel = await this.client.channels.fetch(channelId);
    if (channel && channel instanceof TextChannel) {
      try {
        await channel.send(content);
      } catch (error) {
        console.error(`Failed to send message to channel ${channelId}:`, error);
        throw error;
      }
    } else {
      throw new Error(`Channel ${channelId} not found or is not a text channel`);
    }
  }

  public updateConfig(newConfig: DiscordConfig) {
    this.config = newConfig;
  }

  private async loadChannelHistory(channelId: string, limit = 50): Promise<Message[]> {
    const channel = await this.client.channels.fetch(channelId);
    if (channel && channel instanceof TextChannel) {
      try {
        const messages = await channel.messages.fetch({ limit });
        return Array.from(messages.values()).reverse();
      } catch (error) {
        console.error(`Failed to load message history for channel ${channelId}:`, error);
        return [];
      }
    }
    return [];
  }

  public async loadInitialMessages(): Promise<Record<string, Message[]>> {
    const messages: Record<string, Message[]> = {};
    
    for (const guild of this.config.guilds) {
      for (const channel of guild.channels) {
        messages[channel.id] = await this.loadChannelHistory(channel.id);
      }
    }
    
    return messages;
  }

  public async loadInitialPresences(): Promise<Map<string, Presence>> {
    for (const guild of this.config.guilds) {
      const guildObj = this.client.guilds.cache.get(guild.id);
      if (guildObj) {
        const presences = guildObj.presences.cache;
        presences.forEach(presence => {
          if (presence.userId) {
            this.userPresences.set(presence.userId, presence);
          }
        });
      }
    }
    return this.userPresences;
  }

  public getUserPresence(userId: string): Presence | undefined {
    return this.userPresences.get(userId);
  }

  public async addReaction(messageId: string, channelId: string, emoji: string) {
    const channel = await this.client.channels.fetch(channelId);
    if (channel && channel instanceof TextChannel) {
      const message = await channel.messages.fetch(messageId);
      await message.react(emoji);
    }
  }

  public async removeReaction(messageId: string, channelId: string, emoji: string) {
    const channel = await this.client.channels.fetch(channelId);
    if (channel && channel instanceof TextChannel) {
      const message = await channel.messages.fetch(messageId);
      const reaction = message.reactions.cache.find(r => r.emoji.name === emoji);
      if (reaction) {
        await reaction.remove();
      }
    }
  }
} 