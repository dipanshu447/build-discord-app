# create-discord-app

<div align="center">

   ![Discord Bot CLI](https://img.shields.io/badge/Discord-Bot%20CLI-5865F2?style=for-the-badge&logo=discord&logoColor=white)
   ![Node.js](https://img.shields.io/badge/Node.js-24+-339933?style=for-the-badge&logo=node.js&logoColor=white)
   ![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
   [![npm](https://img.shields.io/badge/npm-v1.0.0-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/create-discord-app)
   [![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge&logo=open-source-initiative&logoColor=white)](https://opensource.org/licenses/MIT)

**The fastest way to create production-ready Discord bots**

Interactive prompts • GitHub-powered templates • Smart conflict resolution • Auto-configured

[Installation](#installation) • [Usage](#usage) • [Features](#features) • [Contributing](#contributing)

</div>

---

## What is create-discord-app?

`create-discord-app` is a modern CLI tool that scaffolds production-ready Discord bot applications in seconds. It leverages GitHub-hosted templates and provides an intuitive setup experience with intelligent conflict resolution and automatic project configuration.

### Why choose create-discord-app?

- **Lightning Fast**: Get a fully configured Discord bot project in under 30 seconds
- **Interactive Experience**: Beautiful CLI prompts powered by [@clack/prompts](https://www.npmjs.com/package/@clack/prompts)
- **Smart Templating**: Templates fetched directly from GitHub using degit
- **Conflict Resolution**: Intelligent handling of existing files and directories
- **Production Ready**: Generated projects follow Discord.js best practices
- **Auto-Configuration**: Automatically sets up package.json with your details

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Usage](#usage)
- [CLI Options](#cli-options)
- [Features](#features)
- [Templates](#templates)
- [Error Handling](#error-handling)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

### Quick Start (Recommended)

```bash
npm create discord-app
```

### Alternative Methods

```bash
# Using npx (no installation required)
npx create-discord-app

# Global installation
npm install -g create-discord-app
create-discord-app
```

### Prerequisites

- **Node.js 18+** (v18+ recommended for optimal compatibility)
- **npm** or **yarn** package manager
- **Git** (for template fetching)

### Verify Installation

```bash
create-discord-app --version
```

## Quick Start

### Create a New Bot Project

```bash
npm create discord-app
```

Follow the interactive prompts:

![Terminal Preview](https://github.com/dipanshu447/create-discord-app/blob/main/.github/terminal-preview.jpg)

### Create in Current Directory

```bash
npm create discord-app .
```

### Skip All Prompts

```bash
npm create discord-app my-bot -- --yes
```

**Note**: When using `npm create`, add `--` before flags to pass them through npm.

## Tech Stack

- **Node.js**
- **ES Modules**
- **Clack Prompts** - Interactive CLI prompts
- **Degit** - Template cloning from GitHub
- **fs-extra** - Robust file operations
- **picocolors** - Minimal terminal styling

## Usage

### Basic Syntax

```bash
create-discord-app [project-name] [options]
```

### Interactive Mode (Default)

When you run `create-discord-app` without arguments, you'll be guided through an interactive setup:

1. **Project Name**: Enter your Discord bot project name
2. **Package Name**: Set the npm package name (auto-generated from project name)
3. **Language**: Choose your preferred programming language

### Examples

```bash
# Interactive setup
create-discord-app

# Create with project name
create-discord-app my-discord-bot

# Create in current directory
create-discord-app .

# Skip prompts with defaults
create-discord-app my-bot --yes

# Specify package name
create-discord-app my-bot --pkgname discord-bot

# Specify language
create-discord-app my-bot --lang js

# Combine options
create-discord-app my-bot --pkgname my-bot-pkg --lang js --yes
```

## CLI Options

| Option | Alias | Description | Example |
|--------|-------|-------------|---------|
| `--help` | `-h` | Show help information | `create-discord-app --help` |
| `--version` | `-v` | Show version number | `create-discord-app --version` |
| `--yes` | `-y` | Skip all prompts, use defaults | `create-discord-app my-bot --yes` |
| `--pkgname` | `-p` | Specify package name | `create-discord-app my-bot -p @orgbot` |
| `--lang` | `-l` | Set programming language | `create-discord-app my-bot -l js` |

### Flag Details

#### `--yes` / `-y` (Skip Prompts)

When using the `--yes` flag, the CLI will:
- Use the provided project name or default to `my-discord-bot`
- Generate a package name from the project name
- Default to JavaScript language
- Allow overwriting files in current directory (if using `.`)

#### `--pkgname` / `-p` (Package Name)

- Must follow npm package naming rules
- Automatically validates against npm naming conventions
- Pattern: `^(?:@[a-z0-9-*~][a-z0-9-*._~]*)?[a-z0-9-~][a-z0-9-._~]*$`

#### `--lang` / `-l` (Language)

Currently supported languages:
- `js` - JavaScript (fully supported)
- `ts` - TypeScript (coming soon)
- `py` - Python (coming soon)

## Features

### Interactive CLI Experience

Powered by [@clack/prompts](https://github.com/natemoo-re/clack), providing:
- Beautiful, consistent prompts
- Real-time validation
- Helpful hints and suggestions
- Accessible keyboard navigation

### GitHub-Powered Templates

Templates are fetched directly from GitHub using [degit](https://github.com/Rich-Harris/degit):
- Always up-to-date with the latest Discord.js practices
- No need to bundle templates with the CLI
- Easy to contribute new templates
- Supports different language variants

### Smart Conflict Resolution

The CLI intelligently handles existing files and directories:

#### Directory Conflicts
- Detects if target directory exists and is not empty
- Prompts for action: overwrite, ignore, or cancel
- Preserves existing files when possible

#### File Conflicts
- Scans for existing files that would be overwritten
- Allows selective overwriting
- Protects important files from accidental deletion

### Automatic Project Configuration

After template creation:
- Updates `package.json` with your specified package name
- Maintains all other template configurations
- Preserves template dependencies and scripts

### Production-Ready Output

Generated projects include:
- Modern Discord.js setup with slash commands
- Environment variable configuration
- Proper project structure
- Development and production scripts
- ESLint and Prettier configuration
- Comprehensive README with setup instructions

## Templates

Templates are hosted in the [create-discord-app-templates](https://github.com/dipanshu447/create-discord-app-templates) repository.

### Template Features

Each template includes:
- **Command Handler**: Modular command structure
- **Event System**: Discord.js event handling
- **Environment Config**: Secure token management
- **Error Handling**: Comprehensive error catching
- **Logging**: Built-in logging system
- **Deployment Ready**: Production configurations

## Error Handling

### Common Errors and Solutions

#### Invalid Package Name

```bash
✗ Invalid package name. Use: lowercase, numbers, -, ~, . only
```

**Solution**: Package names must follow npm conventions:
- Lowercase letters only
- Can contain numbers, hyphens, tildes, and dots

#### Directory Not Empty

```bash
✗ Folder already exists and is not empty. Please use a different name or choose a different option.
```

**Solution**: 
- Choose a different project name
- Use `create-discord-app .` to create in current directory with conflict resolution
- Manually clean the directory

#### Template Download Failed

```bash
✗ Could not locate or download the template files.
```

**Solution**:
- Check internet connection
- Verify GitHub access
- Try again (temporary network issues)

#### Unsupported Language

```bash
✗ Language "ts" is not supported.
Try one of: js
```

**Solution**: Currently only JavaScript is supported. TypeScript and Python support coming soon.

## Troubleshooting

### Node.js Version Issues

**Warning**: `Node.js v18+ is recommended for best compatibility.`

While the CLI works with older versions, Node.js 18+ is recommended for:
- Better ES modules support
- Improved performance
- Latest Discord.js compatibility

### Permission Issues

On macOS/Linux, you might encounter permission errors:

```bash
# Fix global installation permissions
sudo npm install -g create-discord-app

# Or use npx to avoid global installation
npx create-discord-app
```

### Template Access Issues

If templates fail to download:

```bash
# Check GitHub connectivity
ping github.com

# Clear npm cache
npm cache clean --force

# Try with npx
npx create-discord-app@latest
```

### Project Setup Issues

After project creation:

```bash
# Verify Node.js modules
cd your-project
npm install

# Check for missing dependencies
npm audit

# Verify Discord.js installation
node -e "console.log(require('discord.js').version)"
```

## Generated Project Structure

After running `create-discord-app`, you'll get a project structure like this:

```
my-discord-bot/
├── src/
│   ├── commands/              # Slash commands
│   │   └── ping.js           # Example ping command
│   ├── events/               # Discord.js events
│   │   ├── ready.js          # Bot ready event
│   │   └── interactionCreate.js # Interaction handler
│   ├── utils/                # Utility functions
│   └── index.js              # Main bot file
├── package.json              # Project configuration
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── README.md                # Project documentation
```

## Next Steps After Creation

After creating your Discord bot project:

### 1. Install Dependencies

```bash
cd your-project-name
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit with your bot token
nano .env
```

Add your Discord bot token:
```env
DISCORD_TOKEN=your-bot-token-here
DISCORD_CLIENT_ID=your-client-id-here
```

### 3. Register Commands

```bash
npm run register
```

### 4. Start Development

```bash
npm start
```
---

## Contributing

We welcome contributions! Here's how you can help:

### Report Issues

Found a bug? [Open an issue](https://github.com/dipanshu447/create-discord-app/issues) with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment details
- Screenshot of your terminal

### Suggest Features

Have an idea? [Create a feature request](https://github.com/dipanshu447/create-discord-app/issues) with:
- Detailed description of the feature
- Use cases and benefits
- Implementation ideas (if any)

### Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/dipanshu447/create-discord-app.git
   cd create-discord-app
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   # Manual test run
   npm start
   ```
> Note: Automated testing coming soon. For now, test using manual commands like npm start.

5. **Commit and push**
   ```bash
   git commit -m "Add amazing feature"
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

### Template Contributions

To add new templates or improve existing ones:

1. Visit [create-discord-app-templates](https://github.com/dipanshu447/create-discord-app-templates)
2. Fork the repository
3. Add your template in the appropriate language folder
4. Follow the existing template structure
5. Submit a pull request

### Development Guidelines

- **ES Modules**: Use modern JavaScript with ES modules
- **Error Handling**: Implement comprehensive error handling
- **User Experience**: Prioritize clear, helpful messages
- **Performance**: Optimize for speed and efficiency
- **Testing**: Add tests for new features

## Links

- **GitHub Repository**: [create-discord-app](https://github.com/dipanshu447/create-discord-app)
- **Template Repository**: [create-discord-app-templates](https://github.com/dipanshu447/create-discord-app-templates)
- **Issues & Support**: [GitHub Issues](https://github.com/dipanshu447/create-discord-app/issues)
- **Discord.js Documentation**: [discord.js.org](https://discord.js.org/)
- **Discord Developer Portal**: [discord.com/developers](https://discord.com/developers/applications)

## License

MIT © 2025 [Dipanshu Sahu](https://github.com/dipanshu447)

## Acknowledgments

- **[@clack/prompts](https://github.com/natemoo-re/clack)** - Beautiful CLI prompts
- **[degit](https://github.com/Rich-Harris/degit)** - Template cloning utility
- **[Discord.js](https://discord.js.org/)** - Discord API library
- **[fs-extra](https://github.com/jprichardson/node-fs-extra)** - Enhanced filesystem operations
- **[picocolors](https://github.com/alexeyraspopov/picocolors)** - Terminal colors

---

<div align="center">

**Made with ❤️ for the Discord developer community**

⭐ **Star this project** if you find it helpful!

[Report Bug](https://github.com/dipanshu447/create-discord-app/issues) • [Request Feature](https://github.com/dipanshu447/create-discord-app/issues) • [Contribute](https://github.com/dipanshu447/create-discord-app/pulls)

</div>