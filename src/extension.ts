import * as vscode from "vscode";

interface Segment {
  readonly type: "segment";
  readonly text: string;
}

interface Selection {
  readonly type: "selection";
  readonly format?:
    | "camel"
    | "pascal"
    | "snake"
    | "kebab"
    | "upper"
    | "lower"
    | "capitalize"
    | undefined;
}

interface Filler {
  readonly type: "filler";
  readonly text: string;
  readonly weight?: number | undefined;
}

type Content = Segment | Selection | Filler;

interface CommentTemplate {
  readonly lines: Content[][];
  readonly subtractIndentationWidth?: boolean | undefined;
  readonly width: number;
}

interface CommentStyles {
  readonly [section: string]: {
    readonly [style: string]: CommentTemplate;
  };
}

interface LanguageMapping {
  readonly [language: string]: string | string[];
}

const DEFAULT_COMMENT_STYLES: CommentStyles = {
  "/": {
    "Single Line": {
      width: 80,
      lines: [
        [
          {
            type: "segment",
            text: "// ",
          },
          {
            type: "selection",
          },
          {
            type: "segment",
            text: " ",
          },
          {
            type: "filler",
            text: "-",
          },
        ],
      ],
    },
    "Multi Line": {
      width: 80,
      lines: [
        [
          {
            type: "segment",
            text: "/",
          },
          {
            type: "filler",
            text: "*",
          },
          {
            type: "segment",
            text: " ",
          },
        ],
        [
          {
            type: "segment",
            text: " *",
          },
          {
            type: "filler",
            text: " ",
          },
          {
            type: "selection",
          },
          {
            type: "filler",
            text: " ",
          },
          {
            type: "segment",
            text: "* ",
          },
        ],
        [
          {
            type: "segment",
            text: " ",
          },
          {
            type: "filler",
            text: "*",
          },
          {
            type: "segment",
            text: "/",
          },
        ],
      ],
    },
  },
  "#": {
    "Single Line": {
      width: 80,
      lines: [
        [
          {
            type: "segment",
            text: "# ",
          },
          {
            type: "selection",
          },
          {
            type: "segment",
            text: " ",
          },
          {
            type: "filler",
            text: "-",
          },
        ],
      ],
    },
    "Multi Line": {
      width: 80,
      lines: [
        [
          {
            type: "filler",
            text: "#",
          },
        ],
        [
          {
            type: "segment",
            text: "#",
          },
          {
            type: "filler",
            text: " ",
          },
          {
            type: "selection",
          },
          {
            type: "filler",
            text: " ",
          },
          {
            type: "segment",
            text: "#",
          },
        ],
        [
          {
            type: "filler",
            text: "#",
          },
        ],
      ],
    },
  },
  "-": {
    "Single Line": {
      width: 80,
      lines: [
        [
          {
            type: "segment",
            text: "-- ",
          },
          {
            type: "selection",
          },
          {
            type: "segment",
            text: " ",
          },
          {
            type: "filler",
            text: "-",
          },
        ],
      ],
    },
    "Multi Line": {
      width: 80,
      lines: [
        [
          {
            type: "filler",
            text: "-",
          },
        ],
        [
          {
            type: "segment",
            text: "-- ",
          },
          {
            type: "filler",
            text: " ",
          },
          {
            type: "selection",
          },
          {
            type: "filler",
            text: " ",
          },
          {
            type: "segment",
            text: "--",
          },
        ],
        [
          {
            type: "filler",
            text: "-",
          },
        ],
      ],
    },
  },
};

const DEFAULT_LANGUAGE_MAPPING: LanguageMapping = {
  javascript: "/",
  typescript: "/",
  python: "#",
  json: "/",
  ruby: "#",
  bash: "#",
  shellscript: "#",
  php: ["/", "#"],
  java: "/",
  c: "/",
  cpp: "/",
  csharp: "/",
  go: "/",
  rust: "/",
  sql: "-",
  mysql: "-",
  plsql: "-",
  tsql: "-",
  pgsql: "-",
  sqlite: "-",
};

function loadCommentStyles(
  config: vscode.WorkspaceConfiguration
): CommentStyles {
  return config.get<CommentStyles>("commentStyles", DEFAULT_COMMENT_STYLES);
}

function loadLanguageMapping(
  config: vscode.WorkspaceConfiguration
): LanguageMapping {
  return config.get<LanguageMapping>(
    "languageMapping",
    DEFAULT_LANGUAGE_MAPPING
  );
}

function getStyleKeys(
  commentStyles: CommentStyles,
  languageMapping: LanguageMapping,
  languageId: string
): string[] {
  const styleKeys = languageMapping[languageId];
  if (styleKeys === undefined) {
    return Object.keys(commentStyles);
  }

  if (typeof styleKeys === "string") {
    return [styleKeys];
  }

  if (!Array.isArray(styleKeys)) {
    throw new Error(
      `Invalid language mapping for ${languageId}: expected string or array, got ${typeof styleKeys}`
    );
  }

  if (styleKeys.length === 0) {
    throw new Error(`Empty language mapping for ${languageId}`);
  }

  for (const styleKey of styleKeys) {
    if (!commentStyles[styleKey]) {
      throw new Error(
        `Invalid style key "${styleKey}" in language mapping for ${languageId}`
      );
    }
  }

  return styleKeys;
}

function formatSelection(text: string, format?: string): string {
  if (!format || !text) {
    return text;
  }

  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  if (words.length === 0) {
    return text;
  }

  switch (format) {
    case "camel":
      return words
        .map((word, i) => {
          if (!word.match(/\w/)) {
            return word;
          }
          return i === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join("");

    case "pascal":
      return words
        .map((word) => {
          if (!word.match(/\w/)) {
            return word;
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join("");

    case "snake":
      return words.map((word) => word.toLowerCase()).join("_");

    case "kebab":
      return words.map((word) => word.toLowerCase()).join("-");

    case "upper":
      return text.toUpperCase();

    case "lower":
      return text.toLowerCase();

    case "capitalize":
      return text
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");

    default:
      return text;
  }
}

function renderComment(
  template: CommentTemplate,
  selection: string = "",
  indentation: number = 0
): string {
  const linesWidth = template.subtractIndentationWidth
    ? template.width - indentation
    : template.width;

  if (linesWidth <= 0) {
    throw new Error("Comment width is too small");
  }

  const resultLines: string[] = [];
  template.lines.forEach((line, lineIdx) => {
    let totalWeight = 0;
    let fixedWidth = 0;
    let fillerCount = 0;
    let finalContents: (string | Filler)[] = new Array(line.length);

    line.forEach((content, contentIdx) => {
      switch (content.type) {
        case "segment":
          fixedWidth += content.text.length;
          finalContents[contentIdx] = content.text;
          break;
        case "selection":
          const formattedText = formatSelection(selection, content.format);
          fixedWidth += formattedText.length;
          finalContents[contentIdx] = formattedText;
          break;
        case "filler":
          totalWeight += content.weight || 1;
          finalContents[contentIdx] = content;
          fillerCount++;
          break;
      }
    });

    const missingWidth = linesWidth - fixedWidth;
    if (missingWidth < 0) {
      throw new Error("Comment width is too small");
    }

    if (fillerCount === 0 || missingWidth === 0) {
      if (lineIdx === 0) {
        resultLines.push(finalContents.join(""));
      } else {
        resultLines.push(" ".repeat(indentation) + finalContents.join(""));
      }
      return;
    }

    let availableFillersWidth = missingWidth;
    let finalLine = "";
    let visistedFillerCount = 0;
    finalContents.forEach((finalContent) => {
      if (typeof finalContent === "string") {
        finalLine += finalContent;
        return;
      }

      visistedFillerCount++;
      const normalizedWeight = (finalContent.weight || 1) / totalWeight;
      let fillerWidth = Math.floor(missingWidth * normalizedWeight);
      availableFillersWidth -= fillerWidth;
      if (visistedFillerCount === fillerCount) {
        fillerWidth += availableFillersWidth;
      }
      const fillerText = finalContent.text;
      if (fillerText.length > 1) {
        const completeRepeats = Math.floor(fillerWidth / fillerText.length);
        const remainder = fillerWidth % fillerText.length;
        finalLine +=
          fillerText.repeat(completeRepeats) +
          fillerText.substring(0, remainder);
      } else {
        finalLine += finalContent.text.repeat(fillerWidth);
      }
    });

    if (lineIdx === 0) {
      resultLines.push(finalLine);
    } else {
      resultLines.push(" ".repeat(indentation) + finalLine);
    }
  });

  return resultLines.join("\n");
}

export class CommentHeaderGenerator {
  private static readonly COMMAND = "commentHeaderGenerator.wrapComment";

  constructor(private readonly context: vscode.ExtensionContext) {
    this.initialize();
  }

  private initialize(): void {
    const disposable = vscode.commands.registerCommand(
      CommentHeaderGenerator.COMMAND,
      this.wrapComment.bind(this)
    );
    this.context.subscriptions.push(disposable);
  }

  private async wrapComment(): Promise<void> {
    try {
      const editor = this.getActiveEditor();
      const config = vscode.workspace.getConfiguration(
        "commentHeaderGenerator"
      );

      let selectedText: string | undefined = "";
      const selection = editor.selection;
      if (!selection.isEmpty) {
        selectedText = editor.document.getText(selection).trim();
      }

      const indentation = this.getIndentationLevel(editor, selection);

      const commentStyles = loadCommentStyles(config);
      const languageMapping = loadLanguageMapping(config);
      const styleKeys = getStyleKeys(
        commentStyles,
        languageMapping,
        editor.document.languageId
      );

      let styleKey: string | undefined;
      if (styleKeys.length === 1) {
        styleKey = styleKeys[0];
      } else {
        styleKey = await vscode.window.showQuickPick(styleKeys, {
          placeHolder: "Choose a comment style",
        });

        if (!styleKey) {
          return;
        }
      }

      const styles = commentStyles[styleKey];
      if (!styles) {
        throw new Error(`No styles found for key "${styleKey}"`);
      }

      const styleNames = Object.keys(styles);
      if (styleNames.length === 0) {
        throw new Error(`No styles found for key "${styleKey}"`);
      }

      let styleName: string | undefined;
      if (styleNames.length === 1) {
        styleName = styleNames[0];
      } else {
        styleName = await vscode.window.showQuickPick(styleNames, {
          placeHolder: "Choose a comment style",
        });

        if (!styleName) {
          return;
        }
      }

      const template = styles[styleName];
      if (!template) {
        throw new Error(`No template found for style "${styleName}"`);
      }

      if (!selectedText) {
        selectedText = await vscode.window.showInputBox({
          placeHolder:
            "Enter comment text (or leave empty for a blank comment)",
          prompt: "No text is selected. Enter the text for your comment.",
        });

        if (selectedText === undefined) {
          return; // User cancelled
        }
      }

      const commentBlock = renderComment(template, selectedText, indentation);

      if (!editor.selection.isEmpty) {
        await this.replaceSelection(editor, commentBlock);
      } else {
        await this.insertAtCursor(editor, commentBlock);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  private getActiveEditor(): vscode.TextEditor {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      throw new Error("No active editor found");
    }
    return editor;
  }

  private getIndentationLevel(
    editor: vscode.TextEditor,
    selection: vscode.Selection
  ): number {
    const line = editor.document.lineAt(selection.start.line);
    const indentText = line.text.substring(
      0,
      line.firstNonWhitespaceCharacterIndex
    );
    return indentText.length;
  }

  private async replaceSelection(
    editor: vscode.TextEditor,
    text: string
  ): Promise<void> {
    await editor.edit((editBuilder) => {
      editBuilder.replace(editor.selection, text);
    });
  }

  private async insertAtCursor(
    editor: vscode.TextEditor,
    text: string
  ): Promise<void> {
    await editor.edit((editBuilder) => {
      editBuilder.insert(editor.selection.active, text);
    });
  }

  private handleError(error: unknown): void {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    vscode.window.showErrorMessage(`Failed to create comment: ${message}`);
  }
}

export function activate(context: vscode.ExtensionContext): void {
  new CommentHeaderGenerator(context);
}

export function deactivate(): void {}
