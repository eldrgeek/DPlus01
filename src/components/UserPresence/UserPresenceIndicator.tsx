import React from 'react';
import { Presence } from 'discord.js';

interface UserPresenceIndicatorProps {
  presence?: Presence;
  username: string;
}

export const UserPresenceIndicator: React.FC<UserPresenceIndicatorProps> = ({ 
  presence, 
  username 
}) => {
  const getStatusColor = () => {
    if (!presence) return '#747f8d'; // gray for offline
    switch (presence.status) {
      case 'online': return '#43b581';
      case 'idle': return '#faa61a';
      case 'dnd': return '#f04747';
      default: return '#747f8d';
    }
  };

  const getStatusText = () => {
    if (!presence) return 'Offline';
    const activity = presence.activities[0];
    if (activity) {
      return `${activity.type.toString().toLowerCase()} ${activity.name}`;
    }
    return presence.status.charAt(0).toUpperCase() + presence.status.slice(1);
  };

  return (
    <div className="user-presence">
      <div 
        className="status-indicator"
        style={{ 
          backgroundColor: getStatusColor(),
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          display: 'inline-block',
          marginRight: '8px'
        }}
      />
      <span className="username">{username}</span>
      <span className="status-text">{getStatusText()}</span>
    </div>
  );
}; 