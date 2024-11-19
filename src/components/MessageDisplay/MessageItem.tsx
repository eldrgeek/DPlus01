import React from 'react';
import { Message, Presence, MessageReaction } from 'discord.js';
import { UserPresenceIndicator } from '../UserPresence/UserPresenceIndicator';
import { MessageReactions } from './MessageReactions';
import { MessageMarkdown } from './MessageMarkdown';

interface MessageItemProps {
  message: Message;
  presence?: Presence;
  onAddReaction: (messageId: string, emoji: string) => Promise<void>;
  onRemoveReaction: (messageId: string, emoji: string) => Promise<void>;
}

export const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  presence,
  onAddReaction,
  onRemoveReaction
}) => {
  const handleAddReaction = async (emoji: string) => {
    await onAddReaction(message.id, emoji);
  };

  const handleRemoveReaction = async (emoji: string) => {
    await onRemoveReaction(message.id, emoji);
  };

  return (
    <div className="message-item">
      <div className="message-header">
        <UserPresenceIndicator 
          presence={presence}
          username={message.author.username}
        />
        <span className="timestamp">
          {message.createdAt.toLocaleTimeString()}
        </span>
      </div>
      <div className="message-content">
        <MessageMarkdown content={message.content} />
      </div>
      <MessageReactions
        reactions={Array.from(message.reactions.cache.values())}
        onAddReaction={handleAddReaction}
        onRemoveReaction={handleRemoveReaction}
      />
    </div>
  );
}; 