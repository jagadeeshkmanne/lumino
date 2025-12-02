/**
 * LiveEditor - True live code editing with instant preview
 *
 * Uses react-live for in-browser code editing and compilation.
 * Edit code on the left, see live results on the right - instantly!
 */

import React, { useState } from "react";
import { LiveProvider, LiveEditor as ReactLiveEditor, LiveError, LivePreview } from "react-live";
import { themes } from "prism-react-renderer";

// =============================================================================
// TYPES
// =============================================================================

interface LiveEditorProps {
  /** Initial code to display */
  code: string;
  /** Scope - components and functions available in the code */
  scope?: Record<string, unknown>;
  /** Title for the demo */
  title?: string;
  /** Description */
  description?: string;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Disable editing */
  disabled?: boolean;
  /** Language (jsx or tsx display) */
  language?: "jsx" | "tsx";
  /** No inline rendering - just show code */
  noInline?: boolean;
  /** Allow fullscreen mode */
  allowFullscreen?: boolean;
}

// =============================================================================
// ICONS
// =============================================================================

function MaximizeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707zm0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707zm-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707z"/>
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z"/>
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
      <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
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

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function LiveEditor({
  code,
  scope = {},
  title,
  description,
  showLineNumbers = true,
  disabled = false,
  language = "jsx",
  noInline = false,
  allowFullscreen = true,
}: LiveEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentCode, setCurrentCode] = useState(code.trim());
  const [copied, setCopied] = useState(false);

  const handleReset = () => {
    setCurrentCode(code.trim());
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`live-editor ${isFullscreen ? "live-editor-fullscreen" : ""}`}>
      {/* Header */}
      <div className="live-editor-header">
        <div className="live-editor-header-left">
          {title && <span className="live-editor-title">{title}</span>}
          {description && <span className="live-editor-description">{description}</span>}
        </div>
        <div className="live-editor-header-right">
          {/* Reset button */}
          <button
            className="live-editor-action-btn"
            onClick={handleReset}
            title="Reset code"
          >
            <ResetIcon />
          </button>
          {/* Copy button */}
          <button
            className="live-editor-action-btn"
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy code"}
          >
            <CopyIcon />
            {copied && <span className="live-editor-copied">Copied!</span>}
          </button>
          {/* Fullscreen toggle */}
          {allowFullscreen && (
            <button
              className="live-editor-action-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
            </button>
          )}
        </div>
      </div>

      <LiveProvider
        code={currentCode}
        scope={scope}
        theme={themes.vsDark}
        noInline={noInline}
      >
        <div className="live-editor-content">
          {/* Code Editor */}
          <div className="live-editor-code">
            <div className="live-editor-code-header">
              <span className="live-editor-code-label">CODE</span>
              <span className="live-editor-code-hint">Edit me!</span>
            </div>
            <div className="live-editor-code-area">
              <ReactLiveEditor
                disabled={disabled}
                onChange={setCurrentCode}
                style={{
                  fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
                  fontSize: 13,
                  lineHeight: 1.6,
                  minHeight: "100%",
                }}
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="live-editor-preview">
            <div className="live-editor-preview-header">
              <span className="live-editor-preview-label">PREVIEW</span>
              <span className="live-editor-preview-hint">Live output</span>
            </div>
            <div className="live-editor-preview-area">
              <LivePreview />
            </div>
          </div>
        </div>

        {/* Error Display */}
        <LiveError className="live-editor-error" />
      </LiveProvider>

      {/* Fullscreen overlay backdrop */}
      {isFullscreen && (
        <div
          className="live-editor-backdrop"
          onClick={() => setIsFullscreen(false)}
        />
      )}
    </div>
  );
}

// =============================================================================
// COMPACT VERSION - Stacked layout
// =============================================================================

interface CompactLiveEditorProps {
  /** Initial code to display */
  code: string;
  /** Scope - components and functions available in the code */
  scope?: Record<string, unknown>;
  /** No inline rendering */
  noInline?: boolean;
}

export function CompactLiveEditor({
  code,
  scope = {},
  noInline = false,
}: CompactLiveEditorProps) {
  return (
    <div className="compact-live-editor">
      <LiveProvider
        code={code.trim()}
        scope={scope}
        theme={themes.vsDark}
        noInline={noInline}
      >
        {/* Preview first */}
        <div className="compact-live-preview">
          <LivePreview />
        </div>

        {/* Then code */}
        <div className="compact-live-code">
          <ReactLiveEditor
            style={{
              fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
              fontSize: 12,
              lineHeight: 1.5,
            }}
          />
        </div>

        <LiveError className="live-editor-error" />
      </LiveProvider>
    </div>
  );
}

export default LiveEditor;
