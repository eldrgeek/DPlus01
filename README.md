# Discord Interface

A customizable Discord interface that allows users to configure their view through a text-based configuration.

## Features

- Real-time message display
- Message reactions support
- User presence indicators
- Markdown formatting
- Configurable channels and guilds
- Message history loading
- Custom emoji support

## Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME
```

2. Install dependencies:

`npm install`


3. Create a Discord Application:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to the "Bot" section and create a bot
   - Enable the following Privileged Gateway Intents:
     - Message Content Intent
     - Server Members Intent
     - Presence Intent
   - Copy the bot token

4. Create a `.env` file with your Discord credentials:
```
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback
DISCORD_BOT_TOKEN=your_bot_token
```
5. Get your guild and channel IDs:
```bash
npm run fetch-discord
```

6. Update the configuration in `src/config/default.ts` with your guild and channel IDs

7. Run the development server:
`npm start`

## Testing

- Run unit tests:
`npm test`
- Run tests in watch mode:
`npm test -- --watch`

- Run test coverage:
`npm run test:coverage`

- Run e2e tests:
`npm run test:e2e`

- Open Cypress test runner:
`npm run cypress:open`

## Project Structure
src/
├── components/ # React components
│ ├── App.tsx # Main application component
│ ├── ConfigEditor/ # Configuration editor components
│ ├── MessageDisplay/ # Message display components
│ └── UserPresence/ # User presence components
├── services/ # Service layer
│ └── discord.ts # Discord service
├── types/ # TypeScript type definitions
├── utils/ # Utility functions
└── styles/ # CSS styles

## Configuration

The interface can be configured through a JSON configuration file. Example:
```json
{
  "guilds": [
    {
      "id": "guild_id",
      "name": "Server Name",
      "channels": [
        {
          "id": "channel_id",
          "name": "general"
        }
      ]
    }
  ]
}
```
This JSON object represents a single guild with an ID of "guild_id" and a name of "Server Name". The guild has a single channel with an ID of "channel_id" and a name of "general".
## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Discord.js](https://discord.js.org/) for the Discord API wrapper
- [React](https://reactjs.org/) for the UI framework
- [TypeScript](https://www.typescriptlang.org/) for type safety