# create-discord-app

<div align="center">

![Discord Bot CLI](https://img.shields.io/badge/Discord-Bot%20CLI-5865F2?style=for-the-badge\&logo=discord\&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)
[![npm](https://img.shields.io/badge/npm-v1.0.0-CB3837?style=for-the-badge\&logo=npm\&logoColor=white)](https://www.npmjs.com/package/@dipanshu/discord-app)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge\&logo=open-source-initiative\&logoColor=white)](https://opensource.org/licenses/MIT)

**The fastest way to create production-ready Discord bots**

Interactive prompts • GitHub-powered templates • Smart conflict resolution • Auto-configured

[Installation](#installation) • [Usage](#usage) • [Features](#features) • [Tech Stack](#tech-stack) • [Contributing](#contributing)

</div>

---

## What is create-discord-app?

`@dipanshu/discord-app` is a modern CLI tool that scaffolds production-ready Discord bot applications in seconds. It leverages GitHub-hosted templates and provides an intuitive setup experience with intelligent conflict resolution and automatic project configuration.

> ⚠️ This package is named `@dipanshu/discord-app` instead of the usual `create-discord-app` because the base name was already taken on npm.

### Built with ❤️ during my 100 Days of Code

This tool was created by [Dipanshu Sahu](https://github.com/dipanshu447) as part of [#100DaysOfCode](https://github.com/dipanshu447/100-days-of-reactjs) journey to make Discord bot development easier and faster for everyone.

### Why choose this CLI?

* **Lightning Fast**: Get a fully configured Discord bot project in under 30 seconds
* **Interactive Experience**: Beautiful CLI prompts powered by [@clack/prompts](https://www.npmjs.com/package/@clack/prompts)
* **Smart Templating**: Templates fetched directly from GitHub using degit
* **Conflict Resolution**: Intelligent handling of existing files and directories
* **Production Ready**: Generated projects follow Discord.js best practices
* **Auto-Configuration**: Automatically sets up package.json with your details

## Tech Stack

This CLI is built using the following technologies:

* **Node.js** — Runtime environment
* **JavaScript (ESM)** — Modern module system and syntax
* **[@clack/prompts](https://github.com/natemoo-re/clack)** — For beautiful and interactive terminal prompts
* **[degit](https://github.com/Rich-Harris/degit)** — For fetching templates from GitHub
* **[fs-extra](https://github.com/jprichardson/node-fs-extra)** — Extra filesystem utilities
* **[picocolors](https://github.com/alexeyraspopov/picocolors)** — Minimal terminal styling

## Naming Notice

This CLI is invoked using `npm create discord-app`, which maps to the scoped npm package `@dipanshu/discord-app`. The original name `create-discord-app` was already taken on npm, so this version uses a scoped name to:

* Avoid conflicts with existing packages
* Clearly identify the author (Dipanshu Sahu)
* Maintain a familiar developer experience with `npm create` and `npx`

Despite the name difference, the CLI command remains clean and intuitive:

```bash
npm create @dipanshu/discord-app
```

This ensures compatibility while keeping the branding aligned with its purpose.

## Installation

### Quick Start (Recommended)

```bash
npm create @dipanshu/discord-app
```

### Alternative Methods

```bash
# Using npx (no installation required)
npx @dipanshu/discord-app

# Global installation
npm install -g @dipanshu/discord-app
create-discord-app
```

### Prerequisites

* **Node.js 18+** (v18+ recommended for optimal compatibility)
* **npm** or **yarn** package manager
* **Git** (for template fetching)

### Verify Installation

```bash
create-discord-app --version
```

## Quick Start

### Create a New Bot Project

```bash
npm create @dipanshu/discord-app
```

Follow the interactive prompts.

### Create in Current Directory

```bash
npm create @dipanshu/discord-app .
```

### Skip All Prompts

```bash
npm create @dipanshu/discord-app my-bot -- --yes
```

**Note**: When using `npm create`, add `--` before flags to pass them through npm.

## Usage

### Basic Syntax

```bash
create-discord-app [project-name] [options]
```

### Examples

```bash
create-discord-app
create-discord-app my-bot
create-discord-app .
create-discord-app my-bot --yes
create-discord-app my-bot --pkgname my-pkg --lang js --yes
```

## Features

* Interactive CLI with smart prompts
* GitHub template fetching using `degit`
* Auto config of project settings
* ESLint and Prettier support out of the box
* Safe directory and file handling
* Easily extendable and contributor-friendly

## Templates

Templates are hosted in the [`@dipanshu/discord-app-templates`](https://github.com/dipanshu447/create-discord-app-templates) repository.

Each template includes:

* Slash command setup
* Event handler boilerplate
* .env example file
* Best practices structure

---

## Troubleshooting

* Use Node 18+
* Ensure Git is installed
* Try `npx @dipanshu/discord-app@latest` if facing cache issues

## License

MIT © 2025 [Dipanshu Sahu](https://github.com/dipanshu447)

---

<div align="center">

**Made with ❤️ for the Discord developer community**

⭐ Star this project if you find it helpful!

[Report Bug](https://github.com/dipanshu447/create-discord-app/issues) • [Request Feature](https://github.com/dipanshu447/create-discord-app/issues) • [Contribute](https://github.com/dipanshu447/create-discord-app/pulls)

</div>