import React from 'react';
import { MessageReaction } from 'discord.js';

interface MessageReactionsProps {
  reactions: MessageReaction[];
  onAddReaction: (emoji: string) => Promise<void>;
  onRemoveReaction: (emoji: string) => Promise<void>;
}

const commonEmojis = ['👍', '👎', '❤️', '😄', '😢', '🎉'];

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions,
  onAddReaction,
  onRemoveReaction,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);

  return (
    <div className="message-reactions">
      {reactions.map((reaction) => (
        <div 
          key={reaction.emoji.name} 
          className="reaction-item"
          onClick={() => onRemoveReaction(reaction.emoji.name!)}
        >
          <span className="emoji">{reaction.emoji.name}</span>
          <span className="count">{reaction.count}</span>
        </div>
      ))}
      
      <div className="emoji-picker">
        <button 
          className="add-reaction"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          +
        </button>
        
        {showEmojiPicker && (
          <div className="emoji-list">
            {commonEmojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  onAddReaction(emoji);
                  setShowEmojiPicker(false);
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 