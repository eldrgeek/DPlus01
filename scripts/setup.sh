#!/bin/bash

# Initialize npm project if not already done
[ ! -f package.json ] && npm init -y

# Install dependencies
npm install discord.js @types/node dotenv typescript ts-node
npm install --save-dev @types/react @types/react-dom

# Create tsconfig.json if it doesn't exist
cat > tsconfig.json << EOL
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "lib": ["dom", "es6", "es2017", "esnext.asynciterable"],
    "skipLibCheck": true,
    "sourceMap": true,
    "outDir": "./dist",
    "moduleResolution": "node",
    "removeComments": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "resolveJsonModule": true,
    "baseUrl": "."
  },
  "exclude": ["node_modules"],
  "include": ["./src/**/*.ts", "./src/**/*.tsx"]
}
EOL

# Create .env file
cat > .env << EOL
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback
DISCORD_BOT_TOKEN=your_bot_token
EOL

# Install discord.js for the utility script
npm install discord.js

# Create utility script directory
mkdir -p src/utils

# Run utility script to get guild/channel info
echo "Fetching Discord information..."
ts-node src/utils/fetchDiscordInfo.ts

# Start development server
npm start 