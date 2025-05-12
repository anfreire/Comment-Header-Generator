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

## [1.0.2] - 2025-05-11

### Added

- Defined JSON schema for `commentStyles` and `languageMapping`
- Added support for `subtractIndentationWidth` with type hints

## [1.0.3] - 2025-05-11

### Fixed

- Removed `enum` restriction on `commentHeaderGenerator.languageMapping` to allow custom comment style identifiers beyond the default `"*"`, `"#"` and `"-"`.

## [1.0.4] - 2025-05-12

### Added

- Added "capitalize" formatting option for comment text (capitalizes the first letter of each word)
- Improved README with comprehensive customization examples and clearer documentation

### Changed

- Changed default comment style identifier from "\*" to "/" to better reflect C-style comment syntax
- Updated all language mappings to use the new "/" identifier instead of "\*"