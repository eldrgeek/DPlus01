import React, { useEffect, useState, useCallback } from 'react';
import { Message, Presence } from 'discord.js';
import { ConfigEditor } from './ConfigEditor/ConfigEditor';
import { MessageList } from './MessageDisplay/MessageList';
import { DiscordService } from '../services/discord';
import { defaultConfig } from '../config/default';
import { DiscordConfig } from '../types/config';
import '../styles/markdown.css';

export const App: React.FC = () => {
  const [config, setConfig] = useState<DiscordConfig>(defaultConfig);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [discordService, setDiscordService] = useState<DiscordService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [presences, setPresences] = useState<Map<string, Presence>>(new Map());

  useEffect(() => {
    const service = new DiscordService(config);
    
    const initializeDiscord = async () => {
      try {
        await service.connect();
        const [initialMessages, initialPresences] = await Promise.all([
          service.loadInitialMessages(),
          service.loadInitialPresences()
        ]);
        setMessages(initialMessages);
        setPresences(initialPresences);
      } catch (error) {
        console.error('Failed to initialize Discord:', error);
      } finally {
        setIsLoading(false);
      }
    };

    service.onMessage((message, type = 'new') => {
      setMessages(prev => {
        const channelMessages = [...(prev[message.channelId] || [])];
        
        if (type === 'update') {
          const index = channelMessages.findIndex(m => m.id === message.id);
          if (index !== -1) {
            channelMessages[index] = message;
            return { ...prev, [message.channelId]: channelMessages };
          }
        }
        
        return {
          ...prev,
          [message.channelId]: [...channelMessages, message]
        };
      });
    });

    service.onPresenceUpdate((presence) => {
      setPresences(prev => new Map(prev).set(presence.userId!, presence));
    });

    initializeDiscord();
    setDiscordService(service);

    return () => {
      service.disconnect();
    };
  }, [config]);

  const handleConfigChange = (newConfig: DiscordConfig) => {
    setConfig(newConfig);
    discordService?.updateConfig(newConfig);
  };

  const handleSendMessage = useCallback(async (channelId: string, content: string) => {
    if (!discordService) {
      throw new Error('Discord service not initialized');
    }
    await discordService.sendMessage(channelId, content);
  }, [discordService]);

  const handleAddReaction = useCallback(async (channelId: string, messageId: string, emoji: string) => {
    if (!discordService) return;
    await discordService.addReaction(channelId, messageId, emoji);
  }, [discordService]);

  const handleRemoveReaction = useCallback(async (channelId: string, messageId: string, emoji: string) => {
    if (!discordService) return;
    await discordService.removeReaction(channelId, messageId, emoji);
  }, [discordService]);

  if (isLoading) {
    return <div className="loading">Connecting to Discord...</div>;
  }

  return (
    <div className="app">
      <div className="config-panel">
        <ConfigEditor
          initialConfig={config}
          onConfigChange={handleConfigChange}
        />
      </div>
      <div className="messages-panel">
        {config.guilds.map(guild => (
          <div key={guild.id} className="guild-section">
            <h2>{guild.name}</h2>
            {guild.channels.map(channel => (
              <div key={channel.id} className="channel-section">
                <h3>{channel.name}</h3>
                <MessageList
                  messages={messages[channel.id] || []}
                  channelId={channel.id}
                  onSendMessage={handleSendMessage}
                  onAddReaction={(messageId, emoji) => handleAddReaction(channel.id, messageId, emoji)}
                  onRemoveReaction={(messageId, emoji) => handleRemoveReaction(channel.id, messageId, emoji)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}; 