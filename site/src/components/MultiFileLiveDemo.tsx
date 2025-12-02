/**
 * MultiFileLiveDemo - Multi-file live demo component like CodeSandbox/StackBlitz
 *
 * Shows multiple files in a tabbed interface with live preview.
 * Users can switch between files and edit them, then click Run to see changes.
 */

import { useState, useMemo } from "react";
import { LiveProvider, LiveEditor as ReactLiveEditor } from "react-live";
import { themes } from "prism-react-renderer";
import { transform } from "sucrase";
import { Form, Page, Dialog, Validators, Component } from "lumino/core";
import {
  FormRenderer,
  PageRenderer,
  LuminoTextInput,
  LuminoNumberInput,
  LuminoTextArea,
  LuminoSelect,
  LuminoMultiSelect,
  LuminoAutocomplete,
  LuminoCheckbox,
  LuminoSwitch,
  LuminoRadioGroup,
  LuminoCheckboxGroup,
  LuminoDatePicker,
  LuminoTimePicker,
  LuminoButton,
  LuminoTabs,
} from "lumino/react";
import {
  LumTable,
  LumTHead,
  LumTBody,
  LumTR,
  LumTH,
  LumTD,
  LumText,
  LumBox,
} from "lumino/react/components/Containers";

// =============================================================================
// TYPES
// =============================================================================

type ViewMode = "preview" | "code" | "split";

export interface DemoFile {
  /** File name to display in tab */
  name: string;
  /** File content (code) */
  content: string;
  /** Language for syntax highlighting */
  language?: "typescript" | "tsx" | "css" | "json";
  /** Is this the main entry file that creates the Form? */
  isEntry?: boolean;
  /** Is this file read-only? */
  readOnly?: boolean;
}

interface MultiFileLiveDemoProps {
  /** Title of the demo */
  title?: string;
  /** Description of what the demo shows */
  description?: string;
  /** The initial Page instance (fallback) */
  page: Page<any>;
  /** Array of files to display */
  files: DemoFile[];
  /** Initial view mode */
  defaultView?: ViewMode;
  /** Show copy button */
  showCopy?: boolean;
  /** Additional class name */
  className?: string;
}

// =============================================================================
// ICONS
// =============================================================================

function CodeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8l3.147-3.146zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146z"/>
    </svg>
  );
}

function PreviewIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
      <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
    </svg>
  );
}

function SplitIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3zm8.5-1v12H14a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H8.5zm-1 0H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h5.5V2z"/>
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2z"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
    </svg>
  );
}


function FileIcon({ type }: { type?: string }) {
  if (type === "css") {
    return (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="#2196F3">
        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
      </svg>
    );
  }
  if (type === "json") {
    return (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="#FFC107">
        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
      </svg>
    );
  }
  // TypeScript/TSX
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="#3178C6">
      <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
    </svg>
  );
}

// =============================================================================
// TYPESCRIPT COMPILER HELPER
// =============================================================================

/**
 * Transpile TypeScript code from multiple files and create a Page instance
 */
function compileMultiFilePage(
  files: Record<string, string>,
  entryFileName: string,
  fallbackPage: Page<any>
): { page: Page<any>; error: string | null } {
  try {
    // Combine all TypeScript files (entry file last so its class is available)
    let combinedCode = "";

    // First add non-entry files
    for (const [fileName, content] of Object.entries(files)) {
      if (fileName !== entryFileName && (fileName.endsWith(".ts") || fileName.endsWith(".tsx"))) {
        combinedCode += content + "\n\n";
      }
    }

    // Then add entry file
    if (files[entryFileName]) {
      combinedCode += files[entryFileName];
    }

    // Remove import statements (we provide dependencies via scope)
    // Use [\s\S]*? to match across newlines for multi-line imports
    const codeWithoutImports = combinedCode
      .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*/g, "")
      .replace(/import\s+['"][^'"]+['"];?\s*/g, "")
      .replace(/export\s+/g, ""); // Remove export keywords

    // Remove interface declarations (not needed at runtime) - use multiline pattern
    // Also remove type assertions like "as any", "as Type", etc.
    // Also remove type alias declarations and type-only exports
    const codeWithoutInterfaces = codeWithoutImports
      .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, "") // Multiline interface removal
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, "") // Type alias removal (type Foo = ...)
      .replace(/type\s*\{[^}]*\};?/g, "") // Type-only export remnants (type { Foo, Bar };)
      .replace(/\s+as\s+\w+/g, ""); // Remove "as Type" assertions

    // Transpile TypeScript to JavaScript
    const jsCode = transform(codeWithoutInterfaces, {
      transforms: ["typescript"],
    }).code;

    // Create a module-like scope with all Lumino imports available
    const scope = {
      Form,
      Page,
      Dialog,
      Validators,
      Component,
      LuminoTextInput,
      LuminoNumberInput,
      LuminoTextArea,
      LuminoSelect,
      LuminoMultiSelect,
      LuminoAutocomplete,
      LuminoCheckbox,
      LuminoSwitch,
      LuminoRadioGroup,
      LuminoCheckboxGroup,
      LuminoDatePicker,
      LuminoTimePicker,
      LuminoButton,
      LuminoTabs,
      // Container components for table/grid layouts
      LumTable,
      LumTHead,
      LumTBody,
      LumTR,
      LumTH,
      LumTD,
      LumText,
      LumBox,
    };

    // Find all class names that extend Page
    const classMatches = jsCode.matchAll(/class\s+(\w+)\s+extends\s+Page/g);
    const classNames = Array.from(classMatches).map(m => m[1]);

    if (classNames.length === 0) {
      return { page: fallbackPage, error: "No Page class found in code" };
    }

    // Use the last class (from entry file)
    const className = classNames[classNames.length - 1];

    // Create function that returns the page instance
    const wrappedCode = `
      ${jsCode}
      return new ${className}();
    `;

    // Create function with scope variables
    const scopeKeys = Object.keys(scope);
    const scopeValues = Object.values(scope);

    // eslint-disable-next-line no-new-func
    const factory = new Function(...scopeKeys, wrappedCode);
    const pageInstance = factory(...scopeValues);

    return { page: pageInstance, error: null };
  } catch (err) {
    return {
      page: fallbackPage,
      error: err instanceof Error ? err.message : "Compilation error",
    };
  }
}


// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function MultiFileLiveDemo({
  title,
  description,
  page: initialPage,
  files: initialFiles,
  defaultView = "split",
  showCopy = true,
  className = "",
}: MultiFileLiveDemoProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);
  const [copied, setCopied] = useState(false);
  const [activeFile, setActiveFile] = useState(initialFiles[0]?.name || "");
  const [compileError, setCompileError] = useState<string | null>(null);
  const [livePage, setLivePage] = useState<Page<any>>(initialPage);
  const [hasChanges, setHasChanges] = useState(false);

  // Store editable content for each file
  const [fileContents, setFileContents] = useState<Record<string, string>>(() => {
    const contents: Record<string, string> = {};
    for (const file of initialFiles) {
      contents[file.name] = file.content;
    }
    return contents;
  });

  // Find the entry file
  const entryFileName = initialFiles.find(f => f.isEntry)?.name || initialFiles[0]?.name || "";

  // Handle code changes for active file
  const handleCodeChange = (newCode: string) => {
    setFileContents(prev => ({
      ...prev,
      [activeFile]: newCode,
    }));
    setHasChanges(true);
  };

  // Manual run - compile and update page when user clicks Run button
  const handleRun = () => {
    const { page, error } = compileMultiFilePage(fileContents, entryFileName, initialPage);
    setLivePage(page);
    setCompileError(error);
    setHasChanges(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fileContents[activeFile] || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Create a unique key for PageRenderer to force re-render when page changes
  const pageKey = useMemo(() => Math.random().toString(36), [livePage]);

  // Get current file info
  const currentFile = initialFiles.find(f => f.name === activeFile);
  const currentContent = fileContents[activeFile] || "";

  return (
    <div className={`live-demo multi-file ${className}`}>
      {/* Header */}
      <div className="live-demo-header">
        <div className="live-demo-header-left">
          {title && <span className="live-demo-title">{title}</span>}
          {description && <span className="live-demo-description">{description}</span>}
        </div>
        <div className="live-demo-header-right">
          {/* View mode toggle */}
          <div className="live-demo-view-toggle">
            <button
              className={`live-demo-view-btn ${viewMode === "preview" ? "active" : ""}`}
              onClick={() => setViewMode("preview")}
              title="Preview only"
            >
              <PreviewIcon />
            </button>
            <button
              className={`live-demo-view-btn ${viewMode === "split" ? "active" : ""}`}
              onClick={() => setViewMode("split")}
              title="Split view"
            >
              <SplitIcon />
            </button>
            <button
              className={`live-demo-view-btn ${viewMode === "code" ? "active" : ""}`}
              onClick={() => setViewMode("code")}
              title="Code only"
            >
              <CodeIcon />
            </button>
          </div>
          {/* Run button */}
          <button
            className={`live-demo-run-btn ${hasChanges ? "has-changes" : ""}`}
            onClick={handleRun}
            title="Run code (compile and preview)"
          >
            <PlayIcon />
            <span>Run</span>
          </button>
          {/* Copy button */}
          {showCopy && (
            <button
              className="live-demo-copy-btn"
              onClick={handleCopy}
              title={copied ? "Copied!" : "Copy code"}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="live-demo-content">
        {/* Code Panel with File Tabs */}
        {(viewMode === "code" || viewMode === "split") && (
          <div className={`live-demo-code ${viewMode === "split" ? "split" : ""}`}>
            {/* File Tabs */}
            <div className="live-demo-file-tabs">
              {initialFiles.map(file => (
                <button
                  key={file.name}
                  className={`live-demo-file-tab ${activeFile === file.name ? "active" : ""}`}
                  onClick={() => setActiveFile(file.name)}
                  title={file.name}
                >
                  <FileIcon type={file.language} />
                  <span>{file.name}</span>
                  {file.isEntry && <span className="entry-badge">entry</span>}
                </button>
              ))}
            </div>

            {/* Code Editor */}
            <div className="live-demo-editor-area">
              <LiveProvider
                code={currentContent}
                theme={themes.vsDark}
                noInline={true}
              >
                <ReactLiveEditor
                  onChange={handleCodeChange}
                  disabled={currentFile?.readOnly}
                  style={{
                    fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
                    fontSize: 13,
                    lineHeight: 1.6,
                    minHeight: "100%",
                  }}
                />
              </LiveProvider>
            </div>
          </div>
        )}

        {/* Preview Panel - Live rendered page */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className={`live-demo-preview ${viewMode === "split" ? "split" : ""}`}>
            <div className="live-demo-preview-inner">
              {compileError ? (
                <div className="live-demo-error">{compileError}</div>
              ) : (
                <PageRenderer
                  key={pageKey}
                  page={livePage}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MultiFileLiveDemo;
