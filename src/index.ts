#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

const LIQUIDSOAP_VERSION = "2.4.0";
const DOC_BASE_URL = `https://www.liquidsoap.info/doc-${LIQUIDSOAP_VERSION}`;

// Documentation sections mapping
const DOC_SECTIONS = {
  language: {
    url: `${DOC_BASE_URL}/language.html`,
    description: "Complete language reference including syntax, types, functions, and modules",
  },
  reference: {
    url: `${DOC_BASE_URL}/reference.html`,
    description: "Core API reference with all built-in functions and operators",
  },
  protocols: {
    url: `${DOC_BASE_URL}/protocols.html`,
    description: "Supported protocols (HTTP, Icecast, HLS, etc.)",
  },
  settings: {
    url: `${DOC_BASE_URL}/settings.html`,
    description: "Runtime configuration settings",
  },
  ffmpeg: {
    url: `${DOC_BASE_URL}/ffmpeg.html`,
    description: "FFmpeg integration and filters",
  },
  quickstart: {
    url: `${DOC_BASE_URL}/quick_start.html`,
    description: "Getting started tutorial",
  },
  cookbook: {
    url: `${DOC_BASE_URL}/cookbook.html`,
    description: "Common recipes and patterns",
  },
  encoding_formats: {
    url: `${DOC_BASE_URL}/encoding_formats.html`,
    description: "Audio and video encoding formats",
  },
};

// Cache for fetched documentation
const docCache = new Map<string, { content: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

/**
 * Fetch documentation with caching
 */
async function fetchDocumentation(url: string): Promise<string> {
  const cached = docCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.content;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const content = await response.text();
    docCache.set(url, { content, timestamp: Date.now() });
    return content;
  } catch (error) {
    throw new Error(`Failed to fetch documentation: ${error}`);
  }
}

/**
 * Extract text content from HTML
 */
function extractTextFromHtml(html: string): string {
  // Remove script and style elements
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Remove HTML tags but preserve line breaks
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<\/div>/gi, "\n");
  text = text.replace(/<\/li>/gi, "\n");
  text = text.replace(/<[^>]+>/g, "");

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  // Clean up whitespace
  text = text.replace(/\n\s*\n\s*\n/g, "\n\n");
  text = text.trim();

  return text;
}

/**
 * Search for functions in the documentation
 */
async function searchFunctions(query: string): Promise<string> {
  const referenceUrl = DOC_SECTIONS.reference.url;
  const html = await fetchDocumentation(referenceUrl);

  // Extract function definitions (this is a simplified search)
  const lines = html.split("\n");
  const results: string[] = [];
  const queryLower = query.toLowerCase();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.toLowerCase().includes(queryLower)) {
      // Get context around the match
      const start = Math.max(0, i - 2);
      const end = Math.min(lines.length, i + 3);
      const context = lines.slice(start, end).join("\n");
      results.push(extractTextFromHtml(context));
    }
  }

  if (results.length === 0) {
    return `No functions found matching "${query}". Try a different search term.`;
  }

  return `Found ${results.length} matches for "${query}":\n\n${results.slice(0, 10).join("\n---\n")}`;
}

/**
 * Get examples for common tasks
 */
function getExamples(task: string): string {
  const examples: Record<string, string> = {
    "basic-stream": `# Basic radio stream from a playlist
playlist = playlist("/path/to/playlist.m3u")
output.icecast(%mp3, host="localhost", port=8000, password="hackme", mount="radio", playlist)`,

    "crossfade": `# Crossfade between tracks
playlist = playlist("/path/to/playlist.m3u")
playlist = crossfade(playlist)
output.icecast(%mp3, host="localhost", port=8000, password="hackme", mount="radio", playlist)`,

    "fallback": `# Fallback to another source when primary fails
primary = input.http("http://primary-stream.com/live")
backup = playlist("/path/to/backup.m3u")
radio = fallback(track_sensitive=false, [primary, backup])
output.icecast(%mp3, host="localhost", port=8000, password="hackme", mount="radio", radio)`,

    "metadata": `# Add custom metadata
s = playlist("/path/to/playlist.m3u")
s = insert_metadata(s)
s.insert_metadata([("artist", "Custom Artist"), ("title", "Custom Title")])
output.icecast(%mp3, host="localhost", port=8000, password="hackme", mount="radio", s)`,

    "normalize": `# Normalize audio levels using LUFS
playlist = playlist("/path/to/playlist.m3u")
playlist = normalize_track_gain(playlist)
output.icecast(%mp3, host="localhost", port=8000, password="hackme", mount="radio", playlist)`,

    "blank-detection": `# Detect and skip blank audio
playlist = playlist("/path/to/playlist.m3u")
playlist = blank.strip(playlist)
output.icecast(%mp3, host="localhost", port=8000, password="hackme", mount="radio", playlist)`,

    "hls-output": `# Output as HLS stream
radio = playlist("/path/to/playlist.m3u")
output.file.hls(
  playlist="live.m3u8",
  "/path/to/output/",
  radio
)`,

    "harbor": `# Accept input via HTTP (Harbor)
live = input.harbor("live", port=8080, password="hackme")
playlist = playlist("/path/to/playlist.m3u")
radio = fallback(track_sensitive=false, [live, playlist])
output.icecast(%mp3, host="localhost", port=8000, password="hackme", mount="radio", radio)`,

    "cron": `# Schedule tasks with cron
# Play a jingle every hour at minute 0
jingle = single("/path/to/jingle.mp3")
cron.add(predicate="0 * * * *", fun() begin
  jingle.seek(0.0)
end)`,

    "encoding-formats": `# Different encoding formats

# MP3
%mp3(bitrate=128)

# AAC
%fdkaac(bitrate=64, afterburner=true, aot="mpeg4_aac_lc")

# Opus
%opus(bitrate=96, application="audio", signal="music")

# Vorbis
%vorbis(quality=0.5)

# FLAC
%flac(compression=5)`,
  };

  const taskLower = task.toLowerCase();
  for (const [key, example] of Object.entries(examples)) {
    if (key.includes(taskLower) || taskLower.includes(key)) {
      return `Example for "${task}":\n\n${example}`;
    }
  }

  // Return all available examples
  const availableExamples = Object.keys(examples).join(", ");
  return `No specific example found for "${task}". Available examples: ${availableExamples}`;
}

/**
 * Main server
 */
const server = new Server(
  {
    name: "liquidsoap-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
const tools: Tool[] = [
  {
    name: "get_version",
    description: "Get the LiquidSoap version this server supports (2.4.0)",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_documentation",
    description: "Fetch a specific section of the LiquidSoap 2.4.0 documentation",
    inputSchema: {
      type: "object",
      properties: {
        section: {
          type: "string",
          description: `Documentation section to fetch. Available: ${Object.keys(DOC_SECTIONS).join(", ")}`,
          enum: Object.keys(DOC_SECTIONS),
        },
        max_length: {
          type: "number",
          description: "Maximum length of returned content in characters (default: 50000)",
        },
      },
      required: ["section"],
    },
  },
  {
    name: "search_functions",
    description: "Search for functions or operators in the LiquidSoap API reference",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search term (function name, keyword, or description)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_changelog",
    description: "Get the changelog and breaking changes for LiquidSoap 2.4.0",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_examples",
    description: "Get code examples for common LiquidSoap tasks",
    inputSchema: {
      type: "object",
      properties: {
        task: {
          type: "string",
          description: "Task to get an example for (e.g., 'crossfade', 'fallback', 'normalize', 'hls-output', 'harbor', 'cron', 'blank-detection', 'metadata', 'encoding-formats')",
        },
      },
      required: ["task"],
    },
  },
  {
    name: "list_sections",
    description: "List all available documentation sections with descriptions",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "validate_script_syntax",
    description: "Provide basic syntax validation and best practices for a LiquidSoap script",
    inputSchema: {
      type: "object",
      properties: {
        script: {
          type: "string",
          description: "LiquidSoap script code to validate",
        },
      },
      required: ["script"],
    },
  },
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_version": {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                version: LIQUIDSOAP_VERSION,
                documentation_base: DOC_BASE_URL,
                server_version: "1.0.0",
              }, null, 2),
            },
          ],
        };
      }

      case "list_sections": {
        const sections = Object.entries(DOC_SECTIONS).map(([key, info]) => ({
          name: key,
          url: info.url,
          description: info.description,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(sections, null, 2),
            },
          ],
        };
      }

      case "get_documentation": {
        if (!args) {
          throw new Error("Missing arguments");
        }
        const section = args.section as string;
        const maxLength = (args.max_length as number) || 50000;

        if (!DOC_SECTIONS[section as keyof typeof DOC_SECTIONS]) {
          throw new Error(`Unknown section: ${section}. Available: ${Object.keys(DOC_SECTIONS).join(", ")}`);
        }

        const docInfo = DOC_SECTIONS[section as keyof typeof DOC_SECTIONS];
        const html = await fetchDocumentation(docInfo.url);
        let text = extractTextFromHtml(html);

        if (text.length > maxLength) {
          text = text.substring(0, maxLength) + "\n\n[Content truncated. Use max_length parameter to adjust.]";
        }

        return {
          content: [
            {
              type: "text",
              text: `# LiquidSoap 2.4.0 - ${section}\n\nSource: ${docInfo.url}\n\n${text}`,
            },
          ],
        };
      }

      case "search_functions": {
        if (!args) {
          throw new Error("Missing arguments");
        }
        const query = args.query as string;
        const results = await searchFunctions(query);

        return {
          content: [
            {
              type: "text",
              text: results,
            },
          ],
        };
      }

      case "get_changelog": {
        const changelog = `# LiquidSoap 2.4.0 Changelog

## Language Improvements

- **Function argument destructuring**: Function arguments can now be destructured using the same patterns as variable assignment
- **Enhanced labelled arguments**: Improved syntax for labelled function arguments
- **Top-level variable warnings**: Warnings issued when erasing top-level variables
- **First-class null**: The \`null\` value is now a first-class constant; calls to \`null()\` are deprecated
- **Script path variable**: New variable \`liquidsoap.script.path\` exposes the current script's file path

## Core Changes

- **Asynchronous callbacks**: Callback functions have moved to source methods and execute asynchronously by default
- **New decoder API**: New file-to-file \`decoder.add\` API makes external decoders easier to implement
- **Insert metadata method**: Default \`insert_metadata\` method added to every source; older \`insert_metadata\` operator is deprecated
- **TLS client certificates**: Client-certificate support now available for TLS transports

## New Utilities

- **Cron support**: Added \`cron.parse\`, \`cron.add\`, and \`cron.remove\` for scheduling cron-like asynchronous tasks
- **LUFS loudness correction**: New LUFS-based per-track loudness correction function
- **Unified normalization**: \`replaygain\` replaced by unified \`normalize_track_gain\`

## Breaking Changes

- Callbacks moved to source methods and are asynchronous by default
- \`insert_metadata\` operator deprecated (use source method instead)
- \`null()\` function calls deprecated (use \`null\` constant)
- Many functions renamed or deprecated (see migration guide)

## Migration Guide

When migrating from earlier versions:

1. Update callback functions to use source methods
2. Replace \`insert_metadata\` operator calls with source methods
3. Replace \`null()\` with \`null\` constant
4. Check for deprecated function warnings and update to new names
5. Review asynchronous callback behavior

For complete details, see: https://www.liquidsoap.info/doc-2.4.0/migrating.html`;

        return {
          content: [
            {
              type: "text",
              text: changelog,
            },
          ],
        };
      }

      case "get_examples": {
        if (!args) {
          throw new Error("Missing arguments");
        }
        const task = args.task as string;
        const example = getExamples(task);

        return {
          content: [
            {
              type: "text",
              text: example,
            },
          ],
        };
      }

      case "validate_script_syntax": {
        if (!args) {
          throw new Error("Missing arguments");
        }
        const script = args.script as string;
        const issues: string[] = [];
        const warnings: string[] = [];

        // Basic validation checks
        if (script.includes("null()")) {
          warnings.push("⚠️  Use of deprecated null() function. Use 'null' constant instead.");
        }

        if (script.includes("insert_metadata(") && !script.includes(".insert_metadata(")) {
          warnings.push("⚠️  Deprecated insert_metadata operator. Use source.insert_metadata() method instead.");
        }

        if (script.includes("replaygain")) {
          warnings.push("⚠️  'replaygain' is deprecated. Use 'normalize_track_gain' instead.");
        }

        // Check for common syntax issues
        const lines = script.split("\n");
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          // Check for unmatched parentheses
          const openParens = (line.match(/\(/g) || []).length;
          const closeParens = (line.match(/\)/g) || []).length;
          if (openParens !== closeParens && !line.startsWith("#")) {
            issues.push(`Line ${i + 1}: Unmatched parentheses`);
          }
        }

        // Check for output without proper configuration
        if (script.includes("output.") && !script.match(/output\.\w+\([^)]*\)/)) {
          warnings.push("⚠️  Output statement may be incomplete or missing required parameters");
        }

        let result = "# Script Validation Results\n\n";

        if (issues.length === 0 && warnings.length === 0) {
          result += "✅ No obvious syntax issues or deprecated usage detected.\n\n";
          result += "Note: This is a basic check. Run 'liquidsoap --check script.liq' for comprehensive validation.";
        } else {
          if (issues.length > 0) {
            result += "## Issues\n" + issues.join("\n") + "\n\n";
          }
          if (warnings.length > 0) {
            result += "## Warnings\n" + warnings.join("\n") + "\n\n";
          }
          result += "Run 'liquidsoap --check script.liq' for comprehensive validation.";
        }

        return {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("LiquidSoap MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
