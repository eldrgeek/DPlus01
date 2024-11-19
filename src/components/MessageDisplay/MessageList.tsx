import React from 'react';
import { Message } from 'discord.js';
import { MessageItem } from './MessageItem';
import { MessageInput } from './MessageInput';

interface MessageListProps {
  messages: Message[];
  channelId: string;
  onSendMessage: (channelId: string, content: string) => Promise<void>;
  onAddReaction: (messageId: string, emoji: string) => Promise<void>;
  onRemoveReaction: (messageId: string, emoji: string) => Promise<void>;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  channelId,
  onSendMessage,
  onAddReaction,
  onRemoveReaction 
}) => {
  return (
    <div className="message-list-container">
      <div className="message-list">
        {messages.map((message) => (
          <MessageItem 
            key={message.id} 
            message={message}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
          />
        ))}
      </div>
      <MessageInput 
        channelId={channelId}
        onSendMessage={onSendMessage}
      />
    </div>
  );
}; 