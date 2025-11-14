<!-- SEO META TAGS -->
<meta name="description" content="Liquidsoap MCP Server — AI-powered, version-accurate Liquidsoap 2.4.0 documentation and code generation for Claude, ChatGPT, Cursor, and other MCP clients.">
<meta name="keywords" content="Liquidsoap, LiquidSoapMCP, MCP Server, AI streaming, web radio, Icecast, HLS, Claude, ChatGPT, LLM, Model Context Protocol, streaming automation, radio automation, .liq scripts, audio pipelines">
<meta property="og:title" content="LiquidSoap MCP Server">
<meta property="og:description" content="Give your AI assistant accurate Liquidsoap 2.4.0 documentation, examples, and script validation using the Model Context Protocol.">
<meta property="og:type" content="software">
<meta property="og:image" content="https://raw.githubusercontent.com/splinesreticulating/LiquidSoapMCP/main/assets/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<!-- END SEO TAGS -->

# LiquidSoap MCP Server  
### *AI-powered, version-accurate Liquidsoap scripting using the official 2.4.0 docs.*

<!-- BADGES -->
![GitHub Stars](https://img.shields.io/github/stars/splinesreticulating/LiquidSoapMCP?style=social)
![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![npm](https://img.shields.io/badge/npm-not_published-lightgrey)
![npm downloads](https://img.shields.io/badge/downloads-n/a-lightgrey)
<!-- END BADGES -->

LLMs get Liquidsoap wrong *all the time*—mixing 1.x docs, outdated blog posts, and half-remembered API examples.

**This MCP server fixes that.**

It gives your AI assistant (Claude, ChatGPT, Cursor, Windsurf, etc.) **real Liquidsoap 2.4.0 documentation, examples, and API references**, making it finally possible to:

- Understand `.liq` scripts  
- Generate correct 2.4.0 code  
- Fix errors and deprecated usage  
- Explore operators, functions, transitions, and patterns  
- Build web radio pipelines with confidence  

No hallucinations. No version drift. No mystery errors.

---

# Why this exists

Liquidsoap is incredibly powerful—but:

- Documentation varies heavily between versions  
- 1.x and 2.x syntax differs in subtle ways  
- LLMs blend outdated examples into their answers  
- Even the official docs are spread across sections, pages, and changelogs  

**This MCP server gives your AI one job:**  
*Stick to Liquidsoap 2.4.0 exactly.*

It exposes a clean, structured API around the official docs so your assistant becomes a reliable Liquidsoap expert.

---

# Features

## Version-Pinned Documentation (2.4.0)
- Full language reference  
- Core API functions & operators  
- Protocols (Icecast, HLS, HTTP, SRT, etc.)  
- Encoder/decoder options  
- Runtime settings  

## Smart Search
- Search functions/operators by name or keyword  
- Search through examples, patterns, and cookbook items  
- Search 2.4.0 changelog & migration notes

## Script Assistance
- Detect deprecated functions (e.g. `null()`, `insert_metadata`)  
- Warn about 1.x syntax  
- Highlight common design pitfalls  

## Example Library
Ready-to-use snippets:

- Crossfading  
- Fallback chains  
- Harbor live input  
- HLS output  
- Cron scheduling (`cron.add`, `cron.parse`)  
- Metadata rewriting  
- LUFS normalization  
- Blank detection  
- Multi-output pipelines  

## ⚡ Fast & Local  
- Docs cached and indexed for instant responses  
- No web requests needed once running  

---

# Demo (example)

*(Add GIF or screenshots here — I can help generate one.)*

Ask:

- “Explain what this Liquidsoap script does.”  
- “Add a fallback before the HLS output.”  
- “Show the docs for `crossfade`.”  
- “Fix deprecated functions in this script.”  
- “Rewrite this using Liquidsoap 2.4.0-style `null`.”  

Your AI responds using *only* the pinned 2.4.0 docs.

---

# Installation

## Prerequisites
- Node.js ≥ 18  
- Any MCP-compatible client

## Install via npm (recommended)

```bash
npm install -g liquidsoap-mcp-server
```

## Or run from source

```bash
git clone https://github.com/splinesreticulating/LiquidSoapMCP.git
cd LiquidSoapMCP
npm install
npm run build
```

---

# Usage

## Claude Desktop Example

**macOS:**  
`~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:**  
`%APPDATA%/Claude/claude_desktop_config.json`

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

## From source:

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

---

# Supported Tools

## Core Tools
- `get_version`
- `list_sections`
- `get_documentation(section)`
- `search_functions(query)`
- `get_changelog`
- `get_examples(topic)`
- `validate_script_syntax(script)`

## Documentation Sections
- `language`
- `reference`
- `protocols`
- `settings`
- `encoding_formats`
- `ffmpeg`
- `quickstart`
- `cookbook`

---

# Roadmap

- [ ] Liquidsoap script graph visualization  
- [ ] Integrate `liquidsoap --check` for full type validation  
- [ ] Multi-version switching (2.2.x, 2.3.x, etc.)  
- [ ] Fuzzy search & semantic function lookup  
- [ ] “Explain this error log” tool  
- [ ] Pattern/snippet library  

---

# Contributing

PRs welcome—especially:

- More examples  
- Better search  
- Doc parsing improvements  
- Additional validation rules  
- MCP integration templates  

---

# Resources

- https://www.liquidsoap.info/doc-2.4.0/  
- https://modelcontextprotocol.io/  
- https://github.com/modelcontextprotocol/typescript-sdk  

---

# Acknowledgments

Built for the Liquidsoap community — and for the DJs, webradio operators, self-hosters, and audio nerds who want Liquidsoap to be easier, safer, and more fun with AI assistance.

---

## Want to support the project?

**Please star the repo!**  
It helps others discover it and tells me this niche was worth carving out.
