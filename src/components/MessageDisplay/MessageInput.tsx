import React, { useState, KeyboardEvent } from 'react';

interface MessageInputProps {
  channelId: string;
  onSendMessage: (channelId: string, content: string) => Promise<void>;
}

export const MessageInput: React.FC<MessageInputProps> = ({ channelId, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      await onSendMessage(channelId, message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="message-input">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        disabled={isLoading}
      />
      <button 
        onClick={handleSubmit}
        disabled={isLoading || !message.trim()}
      >
        Send
      </button>
    </div>
  );
}; 