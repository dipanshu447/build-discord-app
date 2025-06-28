# Discord Bot Template (JavaScript)

This is a clean, beginner-friendly **Discord bot template** built using [discord.js](https://discord.js.org/).  
It is designed to work out of the box with automatic **command** and **event** handling.

> This template was generated using [`create-discord-bot`](https://github.com/dipanshu447/create-discord-bot)

## Features

- Supports **slash commands** out of the box
- Auto-loads all commands inside the `commands/` folder (organized however you like)
- Auto-loads all events inside the `events/` folder
- Pre-configured **ESLint**
- Simple `.env` configuration

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your environment variables
Rename `.env.example` to `.env` and fill in your values:

```env
DISCORD_TOKEN=<your bot token here>
APP_ID=<your application ID>
GUILD_ID=<your development server ID>
```

## Available Scripts
| Script             | Description                         |
| ------------------ | ----------------------------------- |
| `npm start`        | Starts the Discord bot              |
| `npm run register` | Registers all commands with Discord |
| `npm run lint`     | Runs ESLint on your codebase        |

## How It Works
### 📁 commands/
You can organize your commands into subfolders inside `commands/` (e.g., `fun`, `moderation`, `utility`, etc.).
Each `.js` file should export a valid Discord command object. 

When you run:

```bash
npm run register
```
All commands are automatically registered with Discord.

### 📁 events/
Just add any event file (e.g., `messageCreate.js`, `ready.js`, `interactionCreate.js`) inside the `events/` folder.
All events are automatically registered when you start the bot:

```bash
npm start
```
If you want to customize event behavior, you can do that inside `index.js`.

## Powered By
This template is part of the [create-discord-bot](https://github.com/dipanshu447/create-discord-bot) project.
It aims to give you a great starting point to build your own feature-rich Discord bot.