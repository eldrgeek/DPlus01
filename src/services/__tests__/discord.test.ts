import { DiscordService } from '../discord';
import { Client, Message } from 'discord.js';
import { jest, expect } from '@jest/globals';


jest.mock('discord.js');

describe('DiscordService', () => {
  const mockConfig = {
    guilds: [
      {
        id: '123',
        name: 'Test Guild',
        channels: [{ id: '456', name: 'test-channel' }]
      }
    ]
  };

  let service: DiscordService;

  beforeEach(() => {
    service = new DiscordService(mockConfig);
  });
  it('initializes with config', () => {
    expect(service).toBeDefined();
  });

  it('connects to Discord', async () => {
    process.env.DISCORD_BOT_TOKEN = 'test-token';
    await service.connect();
    expect(Client.prototype.login).toHaveBeenCalledWith('test-token');
  });
}); 