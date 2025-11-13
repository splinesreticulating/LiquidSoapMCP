# LiquidSoap MCP Server

A Model Context Protocol (MCP) server that provides comprehensive access to LiquidSoap 2.4.0 documentation, examples, and script assistance.

## Overview

This MCP server enables AI assistants like Claude to help you work with LiquidSoap by providing:

- **Version-specific documentation** for LiquidSoap 2.4.0
- **API reference search** to find functions and operators
- **Code examples** for common streaming tasks
- **Changelog and migration information** from earlier versions
- **Basic script validation** to catch deprecated usage and syntax issues
- **Documentation caching** for faster responses

## Features

### Tools

1. **get_version** - Returns the supported LiquidSoap version (2.4.0)
2. **list_sections** - Lists all available documentation sections
3. **get_documentation** - Fetches specific documentation sections:
   - `language` - Complete language reference
   - `reference` - Core API with all built-in functions
   - `protocols` - Supported protocols (HTTP, Icecast, HLS, etc.)
   - `settings` - Runtime configuration settings
   - `ffmpeg` - FFmpeg integration
   - `quickstart` - Getting started tutorial
   - `cookbook` - Common recipes and patterns
   - `encoding_formats` - Audio/video encoding formats

4. **search_functions** - Search for functions by name or keyword
5. **get_changelog** - View 2.4.0 changelog and breaking changes
6. **get_examples** - Get code examples for:
   - Basic streaming
   - Crossfading
   - Fallback sources
   - Metadata manipulation
   - Audio normalization (LUFS)
   - Blank detection
   - HLS output
   - Harbor (HTTP input)
   - Cron scheduling
   - Encoding formats

7. **validate_script_syntax** - Basic validation for deprecated functions and syntax issues

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### From npm (once published)

```bash
npm install -g liquidsoap-mcp-server
```

### From source

```bash
git clone https://github.com/yourusername/LiquidSoapMCP.git
cd LiquidSoapMCP
npm install
npm run build
```

## Usage

### With Claude Desktop

Add this configuration to your Claude Desktop config file:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "liquidsoap": {
      "command": "npx",
      "args": ["-y", "liquidsoap-mcp-server"]
    }
  }
}
```

Or if installed from source:

```json
{
  "mcpServers": {
    "liquidsoap": {
      "command": "node",
      "args": ["/absolute/path/to/LiquidSoapMCP/build/index.js"]
    }
  }
}
```

### With Other MCP Clients

The server communicates via stdio and follows the MCP protocol. You can integrate it with any MCP-compatible client by running:

```bash
liquidsoap-mcp-server
```

## Example Usage

Once configured, you can ask Claude questions like:

- "Show me the LiquidSoap 2.4.0 language documentation"
- "Search for functions related to crossfading"
- "Give me an example of HLS output"
- "What's new in LiquidSoap 2.4.0?"
- "Validate this LiquidSoap script for deprecated functions"
- "How do I normalize audio levels in LiquidSoap?"
- "Show me how to use Harbor for live input"

## Why LiquidSoap 2.4.0?

This server exclusively targets LiquidSoap 2.4.0 to avoid confusion from mixing documentation across versions. Version 2.4.0 introduces important changes:

- Function argument destructuring
- Enhanced labelled arguments
- Asynchronous callbacks by default
- First-class `null` constant
- New cron utilities (`cron.add`, `cron.parse`, `cron.remove`)
- LUFS-based loudness normalization
- Deprecated functions (e.g., `null()`, old `insert_metadata`, `replaygain`)

## Development

### Build

```bash
npm run build
```

### Watch mode

```bash
npm run watch
```

### Run locally

```bash
npm run dev
```

## Project Structure

```
LiquidSoapMCP/
├── src/
│   └── index.ts          # Main server implementation
├── build/                # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Ideas for Enhancement

- Add more code examples and patterns
- Implement fuzzy search for functions
- Add script linting with more comprehensive rules
- Cache documentation locally for offline use
- Add support for custom user scripts library
- Integration with liquidsoap --check for real validation

## License

MIT

## Resources

- [LiquidSoap Official Website](https://www.liquidsoap.info/)
- [LiquidSoap 2.4.0 Documentation](https://www.liquidsoap.info/doc-2.4.0/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## Acknowledgments

Built for the LiquidSoap community to make working with this powerful streaming language easier and more accessible with AI assistance.
