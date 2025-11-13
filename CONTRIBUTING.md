# Contributing to LiquidSoap MCP Server

Thank you for your interest in contributing! This project aims to make LiquidSoap more accessible through AI assistance.

## How to Contribute

### Reporting Issues

- Check if the issue already exists
- Provide a clear description of the problem
- Include relevant LiquidSoap version information
- Share example code or scripts if applicable

### Suggesting Enhancements

- Describe the enhancement and its benefits
- Explain how it would help LiquidSoap users
- Consider backward compatibility

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm run build
   npm run dev  # Test locally
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add: brief description of your changes"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**

## Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/LiquidSoapMCP.git
cd LiquidSoapMCP

# Install dependencies
npm install

# Build
npm run build

# Watch mode for development
npm run watch
```

## Code Style

- Use TypeScript with strict type checking
- Follow existing naming conventions
- Keep functions focused and modular
- Add JSDoc comments for public APIs

## Adding New Tools

When adding a new tool to the MCP server:

1. Add the tool definition to the `tools` array
2. Implement the handler in the `CallToolRequestSchema` switch statement
3. Update the README with the new tool documentation
4. Add examples if applicable

## Adding Examples

To add a new LiquidSoap code example:

1. Add it to the `examples` object in `src/index.ts`
2. Use clear, working code that follows LiquidSoap 2.4.0 best practices
3. Include comments explaining key concepts
4. Update the README to list the new example

## Testing

Before submitting a PR:

- Build successfully with `npm run build`
- Test the server with an MCP client (e.g., Claude Desktop)
- Verify all tools work as expected
- Check that documentation is accurate

## Documentation

- Keep README.md up to date
- Document new features and tools
- Include usage examples
- Update the changelog

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue for any questions about contributing!
