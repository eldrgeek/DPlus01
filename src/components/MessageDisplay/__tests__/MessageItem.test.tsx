import React from 'react';
import '@testing-library/jest-dom';
// import type { jest } from '@jest/globals';
import { jest, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Message } from 'discord.js';
import { MessageItem } from '../MessageItem';


// Mock the discord.js Message class
jest.mock('discord.js', () => ({
  Message: jest.fn()
}), { virtual: true });

describe('MessageItem', () => {
  const mockMessage = {
    id: '123',
    content: 'Test message',
    author: { username: 'testuser' },
    createdAt: new Date(),
    reactions: { cache: new Map() }
  } as unknown as Message;

  const mockHandlers = {
    onAddReaction: jest.fn<(messageId: string, emoji: string) => Promise<void>>(),
    onRemoveReaction: jest.fn<(messageId: string, emoji: string) => Promise<void>>()
  };

  it('renders message content', () => {
    render(
      <MessageItem
        message={mockMessage}
        onAddReaction={mockHandlers.onAddReaction}
        onRemoveReaction={mockHandlers.onRemoveReaction}
      />
    );

    expect(screen.queryByText('Test message')).toBeDefined();
    expect(screen.queryByText('testuser')).toBeDefined();
  });
}); 