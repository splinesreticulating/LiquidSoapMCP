# Liquidsoap 2.4.0 documentation overview

Liquidsoap version 2.4.0 is the latest major release of the **Liquidsoap** multimedia scripting language.  This version consolidates the documentation into a set of web pages under the `doc‑2.4.0` prefix on the official Liquidsoap site.  Below is an overview of the available documentation and the major language features to help you build an MCP server or otherwise consume the material.

## General features of the Liquidsoap language

Liquidsoap is a domain‑specific language designed for describing streaming media systems.  It draws inspiration from functional languages like OCaml but uses a friendlier syntax similar to Ruby or JavaScript【196780565161291†L103-L107】.  The language’s type system is a major distinguishing feature: every expression has a type, and a typechecking algorithm ensures that the program receives values of the expected types without any run‑time checks【196780565161291†L110-L116】.  Liquidsoap also performs **type inference**, so most types don’t need to be written out; the system will infer them automatically【196780565161291†L118-L121】.  The functional nature of Liquidsoap means functions can be defined easily and passed as arguments to other functions, which is very useful for handling events or defining transitions in streaming scripts【196780565161291†L124-L133】.

Liquidsoap treats media streams as **sources** that generate audio/video data.  These sources can produce streams with arbitrary numbers of audio or video channels and even MIDI channels【196780565161291†L135-L142】.  Many of the standard functions are themselves written in Liquidsoap; the default `stdlib.liq` is automatically loaded and provides numerous useful libraries【196780565161291†L145-L150】.  Because of the strong type system and extensive standard library, scripts are both safe and expressive.

## What’s new in version 2.4.0

The 2.4.0 release introduces notable enhancements to the language and core, including breaking changes that require attention when migrating from previous versions.  According to the official change log【654277316961016†L104-L132】:

- **Language improvements:** function arguments can now be destructured using the same patterns as variable assignment, the syntax for labelled arguments has been enhanced, and warnings are issued when erasing top‑level variables【654277316961016†L110-L119】.  The `null` value is now a first‑class constant; calls to `null()` are deprecated but still supported【654277316961016†L116-L118】.  A new variable `liquidsoap.script.path` exposes the current script’s file path【654277316961016†L119-L120】.
- **Core changes:** callback functions have moved to source methods and are executed asynchronously by default【654277316961016†L122-L125】.  A new file‑to‑file `decoder.add` API makes external decoders easier to implement【654277316961016†L126-L127】.  A default `insert_metadata` method has been added to every source while the older `insert_metadata` operator is deprecated【654277316961016†L128-L129】.  Client‑certificate support is now available for TLS transports【654277316961016†L129-L132】.
- **Utilities:** the release adds `cron.parse`, `cron.add` and `cron.remove` to support scheduling of cron‑like asynchronous tasks【654277316961016†L133-L137】.  There is also a new LUFS‑based per‑track loudness correction function【654277316961016†L133-L138】.  Many existing functions have been renamed or deprecated (for example, `replaygain` has been replaced by a unified `normalize_track_gain`)【654277316961016†L156-L159】.

These changes mean that scripts written for earlier versions may need adjustments, particularly for callbacks and deprecated functions.  When building a knowledge base, ensure that examples and guides target version 2.4.0 exclusively.

## Structure of the official 2.4.0 documentation

The official documentation is split into multiple web pages under `https://www.liquidsoap.info/doc-2.4.0/…`.  The **documentation index** page provides a high‑level overview and links to tutorials, reference sections and specific guides.  Key sections include【37877187989726†L95-L134】:

| Section | Purpose |
|---|---|
| **Quickstart and tutorials** | General tutorials such as the Quickstart, FAQ and Cookbook help new users learn the language and create basic streams. |
| **Script language** | A detailed manual for the Liquidsoap scripting language.  It explains syntax, types, functions, pattern matching and modules【196780565161291†L95-L151】. |
| **Core API** | A comprehensive reference covering built‑in functions and operators.  Functions are grouped into categories such as “Input,” “Output,” “Sound Processing,” “Visualization,” etc., and each function shows its signature and arguments【571326325356024†L95-L133】. |
| **Extra API / Deprecated API** | Additional modules and functions not part of the core, and documentation on deprecated operators. |
| **Protocols and settings** | Lists supported protocols (HTTP, Icecast, HLS, etc.) and configuration settings for the runtime environment. |
| **Basic and core concepts** | Explanations of core concepts such as sources, clocks, requests, stream contents, and execution phases. |
| **Specific tutorials** | Detailed guides for common tasks (e.g., blank detection, metadata customization, HTTP input, HLS output, crossfading, dynamic source creation).  These tutorials show how to assemble sources and outputs for typical radio scenarios【37877187989726†L143-L166】. |

### Accessing the documentation

You can access these pages directly from the index.  For example:

- **Script language manual:** `https://www.liquidsoap.info/doc-2.4.0/language.html`
- **Core API:** `https://www.liquidsoap.info/doc-2.4.0/reference.html`
- **Protocols:** `https://www.liquidsoap.info/doc-2.4.0/protocols.html`
- **Settings:** `https://www.liquidsoap.info/doc-2.4.0/settings.html`
- **FFmpeg support:** `https://www.liquidsoap.info/doc-2.4.0/ffmpeg.html`

The **Core API** page is very extensive; each category lists numerous functions with descriptions, types and argument information【571326325356024†L95-L133】.  When building an MCP server, it may be useful to index each function and section separately so that you can fetch only the relevant function documentation when answering user questions.

### The Liquidsoap book

While not tied to a specific version, the *Liquidsoap Book* provides a comprehensive introduction to streaming concepts, Liquidsoap installation, the language, and full radio station workflows.  It is available as a PDF (276 pages) on the Liquidsoap website.  The scripting language chapter is used as the basis for the `language.html` manual【196780565161291†L95-L99】.  You may want to incorporate selected chapters as supplementary reading but prioritise the 2.4.0 web manual for version‑specific details.

## Recommendations for building a Liquidsoap MCP server

To avoid the confusion that arises from mixing documentation from multiple versions, you can build a simple HTTP server that serves only the version 2.4.0 documentation.  Here are some practical suggestions:

1. **Pin the version:** Set the server to always respond with version 2.4.0 documentation and reject queries for other versions.  Include a method (e.g., `get_version()`) that returns `"2.4.0"` so that the LLM knows which version is in use.

2. **Organise by sections:** Break the documentation into logical sections (language, core API categories, protocols, settings, tutorials).  Each section can be an endpoint; for example, `/docs/language/typing` could return the “Typing” portion of the language manual【196780565161291†L110-L121】.

3. **Include the change log:** Provide the 2.4.0 change log (from the OCaml package page) so that the LLM can justify why certain functions or behaviors differ from earlier versions【654277316961016†L110-L132】.  Highlight breaking changes (e.g., callback handling and deprecated functions) to help developers update scripts.

4. **Provide examples:** The documentation index links to many examples and tutorials.  Consider including these examples (e.g., crossfading, blank detection, HLS output) in your server under an `/examples/` path so the LLM can fetch concrete code snippets.

5. **Update your own scripts:** If you already have Liquidsoap scripts (e.g., `radio.liq`), add them to the MCP server so the LLM can analyse and edit your scripts in the context of version 2.4.0.  This will help avoid pulling random outdated examples from the LLM’s pre‑training.

## Summary

Liquidsoap 2.4.0 brings important language and core updates, including destructuring function arguments, improved labelled arguments, asynchronous callbacks and new cron utilities【654277316961016†L104-L137】.  The official documentation for this version is hosted under `https://www.liquidsoap.info/doc-2.4.0/`, where the **script language** and **core API** manuals provide detailed descriptions of language features and built‑in functions【571326325356024†L95-L133】.  Building a custom MCP server with this documentation allows an LLM to answer questions consistently and accurately without mixing information from earlier versions.
