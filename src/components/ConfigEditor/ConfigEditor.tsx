import React, { useState, useEffect } from 'react';
import { DiscordConfig } from '../../types/config';

interface ConfigEditorProps {
  initialConfig: DiscordConfig;
  onConfigChange: (config: DiscordConfig) => void;
}

export const ConfigEditor: React.FC<ConfigEditorProps> = ({
  initialConfig,
  onConfigChange,
}) => {
  const [configText, setConfigText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setConfigText(JSON.stringify(initialConfig, null, 2));
  }, [initialConfig]);

  const handleConfigChange = (newText: string) => {
    setConfigText(newText);
    try {
      const parsed = JSON.parse(newText) as DiscordConfig;
      setError(null);
      onConfigChange(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  };

  return (
    <div className="config-editor">
      <textarea
        value={configText}
        onChange={(e) => handleConfigChange(e.target.value)}
        rows={20}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}; 