/**
 * LiveDemo - Interactive inline demo component like AG Grid or Bootstrap
 *
 * Shows live rendered output alongside source code.
 * Uses react-live editor for consistent experience with main demo.
 * Supports runtime compilation of Form classes.
 */

import React, { useState, useMemo, ReactNode } from "react";
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
  LuminoButton,
} from "lumino/react";

// =============================================================================
// TYPES
// =============================================================================

type ViewMode = "preview" | "code" | "split";

interface LiveDemoProps {
  /** Title of the demo */
  title?: string;
  /** Description of what the demo shows */
  description?: string;
  /** The live rendered component (optional if FormClass is provided) */
  children?: ReactNode;
  /** Source code to display */
  code: string;
  /** Language for syntax highlighting */
  language?: "typescript" | "tsx" | "javascript";
  /** Initial view mode */
  defaultView?: ViewMode;
  /** Height of the demo area (default: auto) */
  height?: string | number;
  /** Show copy button */
  showCopy?: boolean;
  /** Additional class name */
  className?: string;
  /** Form class to instantiate and render (fallback) */
  FormClass?: new () => Form<any>;
  /** Entity class to instantiate as initial values */
  EntityClass?: new () => any;
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
// FORM COMPILER
// =============================================================================

interface CompileResult {
  form: Form<any> | null;
  initialValues: any;
  error: string | null;
}

function compileFormCode(
  code: string,
  fallbackForm: Form<any> | null,
  fallbackInitialValues: any
): CompileResult {
  try {
    // Remove import statements
    const codeWithoutImports = code
      .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*/g, "")
      .replace(/import\s+['"][^'"]+['"];?\s*/g, "")
      .replace(/export\s+/g, "");

    // Remove interface/type declarations
    const cleanCode = codeWithoutImports
      .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, "")
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, "")
      .replace(/\s+as\s+\w+/g, "");

    // Transpile TypeScript to JavaScript
    const jsCode = transform(cleanCode, {
      transforms: ["typescript"],
    }).code;

    // Create scope with Lumino imports
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
      LuminoButton,
    };

    // Find Form class name
    const formClassMatch = jsCode.match(/class\s+(\w+Form)\s+extends\s+Form/);
    // Find Entity class name
    const entityClassMatch = jsCode.match(/class\s+(\w+Entity|\w+)\s*\{[^}]*=\s*["']/);

    if (!formClassMatch) {
      return { form: fallbackForm, initialValues: fallbackInitialValues, error: "No Form class found" };
    }

    const formClassName = formClassMatch[1];

    // Build return code
    let returnCode = `return { FormClass: ${formClassName}`;

    if (entityClassMatch) {
      const entityClassName = entityClassMatch[1];
      returnCode += `, EntityClass: ${entityClassName}`;
    }
    returnCode += " };";

    const wrappedCode = `${jsCode}\n${returnCode}`;

    // Create and execute function
    const scopeKeys = Object.keys(scope);
    const scopeValues = Object.values(scope);

    // eslint-disable-next-line no-new-func
    const factory = new Function(...scopeKeys, wrappedCode);
    const result = factory(...scopeValues);

    const formInstance = new result.FormClass();
    const initialValues = result.EntityClass ? new result.EntityClass() : undefined;

    return { form: formInstance, initialValues, error: null };
  } catch (err) {
    return {
      form: fallbackForm,
      initialValues: fallbackInitialValues,
      error: err instanceof Error ? err.message : "Compilation error",
    };
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LiveDemo({
  title,
  description,
  children,
  code,
  defaultView = "split",
  height,
  showCopy = true,
  className = "",
  FormClass,
  EntityClass,
}: LiveDemoProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);
  const [copied, setCopied] = useState(false);
  const [currentCode, setCurrentCode] = useState(code);
  const [hasChanges, setHasChanges] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);

  // Create initial form instance from FormClass prop (fallback)
  const fallbackForm = useMemo(() => {
    if (FormClass) {
      return new FormClass();
    }
    return null;
  }, [FormClass]);

  const fallbackInitialValues = useMemo(() => {
    if (EntityClass) {
      return new EntityClass();
    }
    return undefined;
  }, [EntityClass]);

  // Live compiled form state
  const [liveForm, setLiveForm] = useState<Form<any> | null>(fallbackForm);
  const [liveInitialValues, setLiveInitialValues] = useState<any>(fallbackInitialValues);

  // Form key to force re-render when form changes
  const [formKey, setFormKey] = useState(0);

  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode);
    setHasChanges(true);
  };

  const handleRun = () => {
    const result = compileFormCode(currentCode, fallbackForm, fallbackInitialValues);
    if (result.form) {
      setLiveForm(result.form);
      setLiveInitialValues(result.initialValues);
      setFormKey(k => k + 1);
    }
    setCompileError(result.error);
    setHasChanges(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerStyle: React.CSSProperties = height
    ? { minHeight: typeof height === "number" ? `${height}px` : height }
    : {};

  // Determine what to render in preview
  const previewContent = children ? (
    children
  ) : liveForm ? (
    <FormRenderer key={formKey} form={liveForm} initialValues={liveInitialValues} />
  ) : null;

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
          {/* Run button - only show if FormClass provided */}
          {FormClass && (
            <button
              className={`live-demo-run-btn ${hasChanges ? "has-changes" : ""}`}
              onClick={handleRun}
              title="Run code (compile and preview)"
            >
              <PlayIcon />
              <span>Run</span>
            </button>
          )}
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
      <div className="live-demo-content" style={containerStyle}>
        {/* Code Panel - LEFT SIDE */}
        {(viewMode === "code" || viewMode === "split") && (
          <div className={`live-demo-code ${viewMode === "split" ? "split" : ""}`}>
            <div className="live-demo-editor-area">
              <LiveProvider
                code={currentCode}
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
          </div>
        )}

        {/* Preview Panel - RIGHT SIDE */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`live-demo-preview ${viewMode === "split" ? "split" : ""}`}
          >
            <div className="live-demo-preview-inner">
              {compileError ? (
                <div className="live-demo-error">{compileError}</div>
              ) : (
                previewContent
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MINI DEMO - COMPACT VERSION FOR INLINE USE
// =============================================================================

interface MiniDemoProps {
  /** The live rendered component */
  children: ReactNode;
  /** Source code to display */
  code: string;
  /** Language for syntax highlighting */
  language?: "typescript" | "tsx" | "javascript";
  /** Show code below preview (default: collapsed) */
  showCodeByDefault?: boolean;
}

export function MiniDemo({
  children,
  code,
  showCodeByDefault = false,
}: MiniDemoProps) {
  const [showCode, setShowCode] = useState(showCodeByDefault);
  const [copied, setCopied] = useState(false);
  const [currentCode, setCurrentCode] = useState(code);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mini-demo">
      {/* Preview */}
      <div className="mini-demo-preview">
        {children}
      </div>

      {/* Toggle bar */}
      <div className="mini-demo-bar">
        <button
          className="mini-demo-toggle"
          onClick={() => setShowCode(!showCode)}
        >
          <CodeIcon />
          <span>{showCode ? "Hide Code" : "Show Code"}</span>
        </button>
        <button
          className="mini-demo-copy"
          onClick={handleCopy}
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>

      {/* Collapsible code */}
      {showCode && (
        <div className="mini-demo-code">
          <LiveProvider
            code={currentCode}
            theme={themes.vsDark}
            noInline={true}
          >
            <ReactLiveEditor
              onChange={setCurrentCode}
              style={{
                fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
                fontSize: 13,
                lineHeight: 1.6,
              }}
            />
          </LiveProvider>
        </div>
      )}
    </div>
  );
}

export default LiveDemo;
