import { rest } from 'msw';

export const handlers = [
  rest.get('/api/messages/:channelId', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: '1',
          content: 'Test message',
          author: { username: 'testuser' },
          createdAt: new Date().toISOString(),
          reactions: []
        }
      ])
    );
  })
]; 