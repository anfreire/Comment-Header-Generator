# Change Log

All notable changes to the "Comment Header Generator" extension will be documented in this file.

## [1.0.0] - 2025-05-11

### Added
- Initial release of Comment Header Generator
- Support for C-style (`*`), Shell/Python-style (`#`), and SQL-style (`-`) comments
- Single-line and multi-line comment formats
- Text formatting options (camelCase, PascalCase, snake_case, kebab-case, UPPERCASE, lowercase)
- Automatic language detection
- Indentation handling
- Configurable comment styles through settings
- Support for multiple comment styles per language (e.g., PHP)

## [1.0.2] - 2025-06-11

### Added
- Defined JSON schema for `commentStyles` and `languageMapping`
- Added support for `subtractIndentationWidth` with type hints