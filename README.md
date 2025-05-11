# Comment Header Generator

![Comment Header Generator](assets/icon.png)

A Visual Studio Code extension that helps you create beautifully formatted comment headers and dividers with a single command.

## Features

- Create single-line or multi-line comment headers with custom text
- Automatically format comments based on the current language
- Support for multiple comment styles (C-style, Shell/Python-style, SQL-style)
- Text formatting options (camelCase, PascalCase, snake_case, etc.)
- Automatic indentation handling
- Customizable comment styles via settings

![TypeScript Demo](assets/demo_ts.gif)

![Python Demo](assets/demo_py.gif)

## Usage

1. Select text (optional) or place cursor where you want to insert a comment
2. Right-click and select "Wrap in Comment Block" from context menu, or:
3. Open the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and type "Wrap in Comment Block"
4. If no text is selected, you'll be prompted to enter comment text
5. Choose the comment style if multiple options are available

## Supported Languages

The extension automatically detects the appropriate comment style based on the language:

- **C-style comments (`*`)**: JavaScript, TypeScript, Java, C, C++, C#, Go, Rust, JSON, etc.
- **Hash comments (`#`)**: Python, Ruby, Bash, Shell scripts, etc.
- **Dash comments (`-`)**: SQL, MySQL, PLSQL, TSQL, etc.

PHP supports both C-style and hash comments.

## Examples

### Single Line Comments

```javascript
// This is a comment header ----------------------------------------------------
```

```python
# This is a comment header -----------------------------------------------------
```

```sql
-- This is a comment header ----------------------------------------------------
```

### Multi-line Comments

```javascript
/******************************************************************************
 *                          This is a comment header                          *
 ******************************************************************************/
```

```python
################################################################################
#                           This is a comment header                           #
################################################################################
```

```sql
--------------------------------------------------------------------------------
--                          This is a comment header                          --
--------------------------------------------------------------------------------
```

## Configuration

You can customize the comment styles and language mappings in your VS Code settings:

### Comment Styles

```json
"commentHeaderGenerator.commentStyles": {
  "*": {
    "Single Line": {
      "width": 80,
      "lines": [
        [
          { "type": "segment", "text": "// " },
          { "type": "selection" },
          { "type": "segment", "text": " " },
          { "type": "filler", "text": "-" }
        ]
      ]
    },
    "Multi Line": { ... }
  },
  "#": { ... },
  "-": { ... }
}
```

### Language Mappings

```json
"commentHeaderGenerator.languageMapping": {
  "javascript": "*",
  "python": "#",
  "sql": "-",
  "php": ["*", "#"]
}
```

## Advanced Configuration

### Comment Structure Elements

The extension uses three types of content elements:

- **segment**: Static text like comment markers (`//`, `#`, etc.)
- **selection**: The text you want to wrap in a comment
- **filler**: Characters that fill the remaining space (like dashes or asterisks)

### Text Formatting Options

When using a selection element, you can specify a format:

- `camel`: camelCaseFormatting
- `pascal`: PascalCaseFormatting
- `snake`: snake_case_formatting
- `kebab`: kebab-case-formatting
- `upper`: UPPERCASE FORMATTING
- `lower`: lowercase formatting

### Multi-Character Fillers

You can use multi-character patterns as fillers:

```json
{ "type": "filler", "text": "-*-" }
```

### Weighted Fillers

Control space distribution with weights:

```json
[
  { "type": "filler", "text": "=", "weight": 2 },
  { "type": "filler", "text": "-", "weight": 1 }
]
```

### Indentation Handling

Preserve indentation in the document:

```json
{
  "width": 80,
  "subtractIndentationWidth": true,
  "lines": [ ... ]
}
```

## License

MIT

## Author

[André Freire](https://github.com/anfreire)

## Contribute

Feedback and contributions are welcome! Please check out the [repository](https://github.com/anfreire/Comment-Header-Generator).
