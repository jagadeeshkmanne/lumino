/**
 * LuminoLiveDemo - Live demo component for actual Lumino forms
 *
 * Shows Lumino Form class definition code alongside a live rendered form.
 * Uses Sucrase to transpile TypeScript in the browser for true live editing!
 *
 * Reuses the same CSS classes as LiveDemo for consistent styling.
 */

import { useState, useMemo } from "react";
import { LiveProvider, LiveEditor as ReactLiveEditor } from "react-live";
import { themes } from "prism-react-renderer";
import { transform } from "sucrase";
import { Form, Validators } from "lumino/core";
import {
  FormRenderer,
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
} from "lumino/react";

// =============================================================================
// TYPES
// =============================================================================

type ViewMode = "preview" | "code" | "split";

interface LuminoLiveDemoProps {
  /** Title of the demo */
  title?: string;
  /** Description of what the demo shows */
  description?: string;
  /** The initial Form instance (fallback) */
  form: Form<any>;
  /** Source code to display (the Form class definition) */
  code: string;
  /** Initial form values */
  initialValues?: Record<string, any>;
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

// =============================================================================
// TYPESCRIPT COMPILER HELPER
// =============================================================================

/**
 * Transpile TypeScript code and create a Form instance
 */
function compileAndCreateForm(
  tsCode: string,
  fallbackForm: Form<any>
): { form: Form<any>; error: string | null } {
  try {
    // Remove import statements (we provide dependencies via scope)
    const codeWithoutImports = tsCode
      .replace(/import\s+.*?from\s+['"][^'"]+['"];?\s*/g, "")
      .replace(/import\s+['"][^'"]+['"];?\s*/g, "");

    // Remove interface declarations (not needed at runtime)
    const codeWithoutInterfaces = codeWithoutImports
      .replace(/interface\s+\w+\s*\{[^}]*\}/g, "");

    // Transpile TypeScript to JavaScript
    const jsCode = transform(codeWithoutInterfaces, {
      transforms: ["typescript"],
    }).code;

    // Create a module-like scope with all Lumino imports available
    const scope = {
      Form,
      Validators,
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
    };

    // Find the class name
    const classMatch = jsCode.match(/class\s+(\w+)\s+extends\s+Form/);
    if (!classMatch) {
      return { form: fallbackForm, error: "No Form class found in code" };
    }

    const className = classMatch[1];

    // Create function that returns the form instance
    const wrappedCode = `
      ${jsCode}
      return new ${className}();
    `;

    // Create function with scope variables
    const scopeKeys = Object.keys(scope);
    const scopeValues = Object.values(scope);

    // eslint-disable-next-line no-new-func
    const factory = new Function(...scopeKeys, wrappedCode);
    const formInstance = factory(...scopeValues);

    return { form: formInstance, error: null };
  } catch (err) {
    return {
      form: fallbackForm,
      error: err instanceof Error ? err.message : "Compilation error",
    };
  }
}

// =============================================================================
// MAIN COMPONENT - Reuses LiveDemo CSS classes
// =============================================================================

export function LuminoLiveDemo({
  title,
  description,
  form: initialForm,
  code,
  initialValues = {},
  defaultView = "split",
  showCopy = true,
  className = "",
}: LuminoLiveDemoProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);
  const [copied, setCopied] = useState(false);
  const [editableCode, setEditableCode] = useState(code);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [liveForm, setLiveForm] = useState<Form<any>>(initialForm);
  const [hasChanges, setHasChanges] = useState(false);

  // Handle code changes - just track that there are unsaved changes
  const handleCodeChange = (newCode: string) => {
    setEditableCode(newCode);
    setHasChanges(true);
  };

  // Manual run - compile and update form when user clicks Run button
  const handleRun = () => {
    const { form, error } = compileAndCreateForm(editableCode, initialForm);
    setLiveForm(form);
    setCompileError(error);
    setHasChanges(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editableCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Create a unique key for FormRenderer to force re-render when form changes
  const formKey = useMemo(() => Math.random().toString(36), [liveForm]);

  return (
    <div className={`live-demo ${className}`}>
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
        {/* Code Panel */}
        {(viewMode === "code" || viewMode === "split") && (
          <div
            className={`live-demo-code ${viewMode === "split" ? "split" : ""}`}
          >
            <LiveProvider
              code={editableCode}
              theme={themes.vsDark}
              noInline={true}
            >
              <ReactLiveEditor
                onChange={handleCodeChange}
                style={{
                  fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
                  fontSize: 13,
                  lineHeight: 1.6,
                  minHeight: "100%",
                }}
              />
            </LiveProvider>
          </div>
        )}

        {/* Preview Panel - Live rendered form */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`live-demo-preview ${viewMode === "split" ? "split" : ""}`}
          >
            <div className="live-demo-preview-inner">
              {compileError ? (
                <div className="live-demo-error">{compileError}</div>
              ) : (
                <FormRenderer key={formKey} form={liveForm} initialValues={initialValues} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LuminoLiveDemo;
