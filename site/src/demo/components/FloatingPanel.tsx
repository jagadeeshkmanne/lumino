/**
 * FloatingPanel Component
 *
 * React component that provides a floating side panel with:
 * - Source Code tab with side menu file navigation
 * - Form Data tab showing real-time JSON
 * - Collapsible panel on the right side
 * - Line numbers and Go to Line feature
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import { useFormData } from "lumino/react";

// =============================================================================
// TYPES
// =============================================================================

interface CodeFile {
  name: string;
  language: "typescript" | "tsx" | "javascript" | "json";
  code: string;
}

export interface FloatingPanelProps {
  files: CodeFile[];
  formData?: Record<string, unknown>;
  defaultTab?: "code" | "data";
  defaultExpanded?: boolean;
}

// =============================================================================
// FILE ICON COMPONENT
// =============================================================================

function FileIcon({ language }: { language: string }) {
  const getIconColor = () => {
    switch (language) {
      case "typescript":
      case "tsx":
        return "#3178c6";
      case "javascript":
        return "#f7df1e";
      case "json":
        return "#cbcb41";
      default:
        return "#888";
    }
  };

  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 1h7l4 4v10H3V1z" fill={getIconColor()} opacity="0.2" />
      <path d="M3 1h7l4 4v10H3V1z" stroke={getIconColor()} strokeWidth="1" fill="none" />
      <path d="M10 1v4h4" stroke={getIconColor()} strokeWidth="1" fill="none" />
    </svg>
  );
}

// =============================================================================
// CODE CONTENT COMPONENT
// =============================================================================

function CodeContent({ code, language, highlightedLine }: {
  code: string;
  language: string;
  highlightedLine: number | null;
}) {
  const codeRef = useRef<HTMLElement>(null);
  const lines = code.split("\n");

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const prismLanguage = language === "tsx" ? "tsx" : language;

  return (
    <div style={{ display: "flex", minWidth: "fit-content" }}>
      {/* Line numbers */}
      <div
        style={{
          position: "sticky",
          left: 0,
          backgroundColor: "#1a1a1a",
          borderRight: "1px solid #3d3d3d",
          flexShrink: 0,
          zIndex: 1,
        }}
      >
        {lines.map((_, index) => {
          const isHighlighted = highlightedLine === index + 1;
          return (
            <div
              key={index}
              style={{
                padding: "0 10px",
                textAlign: "right",
                fontSize: "11px",
                lineHeight: 1.5,
                fontFamily: "'Fira Code', Monaco, Consolas, monospace",
                color: isHighlighted ? "#fff" : "#666",
                backgroundColor: isHighlighted ? "#264f78" : "transparent",
                minWidth: "24px",
              }}
            >
              {index + 1}
            </div>
          );
        })}
      </div>
      {/* Code */}
      <pre
        style={{
          margin: 0,
          padding: "0 12px",
          fontSize: "11px",
          lineHeight: 1.5,
          fontFamily: "'Fira Code', Monaco, Consolas, monospace",
          backgroundColor: "transparent",
        }}
      >
        <code ref={codeRef} className={`language-${prismLanguage}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const PANEL_WIDTH = "50vw"; // Half of viewport width

export function FloatingPanel({
  files,
  defaultTab = "code",
  defaultExpanded = false,
}: FloatingPanelProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [activeTab, setActiveTab] = useState<"code" | "data">(defaultTab);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [goToLineValue, setGoToLineValue] = useState("");
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // Get real-time form data using framework hook
  const formData = useFormData();

  const activeFile = files[activeFileIndex];
  const totalLines = activeFile ? activeFile.code.split("\n").length : 0;
  const formDataJson = JSON.stringify(formData, null, 2);

  const handleGoToLine = useCallback(() => {
    const lineNum = parseInt(goToLineValue, 10);
    if (!isNaN(lineNum) && lineNum > 0 && lineNum <= totalLines) {
      setHighlightedLine(lineNum);
      if (codeContainerRef.current) {
        const lineHeight = 16.5;
        codeContainerRef.current.scrollTop = Math.max(0, (lineNum - 1) * lineHeight - 100);
      }
    }
  }, [goToLineValue, totalLines]);

  useEffect(() => {
    setHighlightedLine(null);
    setGoToLineValue("");
  }, [activeFileIndex]);

  return (
    <>
      {/* Toggle button */}
      <div
        style={{
          position: "fixed",
          right: isExpanded ? PANEL_WIDTH : "0",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1000,
          transition: "right 0.3s ease",
        }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: "16px 8px",
            backgroundColor: "#0066cc",
            border: "none",
            borderRadius: "8px 0 0 8px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: 600,
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            boxShadow: "-2px 0 12px rgba(0,0,0,0.4)",
            letterSpacing: "1px",
          }}
        >
          {isExpanded ? "CLOSE" : "CODE & DATA"}
        </button>
      </div>

      {/* Floating panel */}
      {isExpanded && (
        <div
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            bottom: 0,
            width: PANEL_WIDTH,
            backgroundColor: "#1a1a1a",
            borderLeft: "1px solid #3d3d3d",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header tabs */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#252526",
              borderBottom: "1px solid #3d3d3d",
              flexShrink: 0,
            }}
          >
            <button
              onClick={() => setActiveTab("code")}
              style={{
                flex: 1,
                padding: "14px 16px",
                backgroundColor: activeTab === "code" ? "#1a1a1a" : "transparent",
                border: "none",
                borderBottom: activeTab === "code" ? "2px solid #0066cc" : "2px solid transparent",
                color: activeTab === "code" ? "#fff" : "#888",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              SOURCE CODE
            </button>
            <button
              onClick={() => setActiveTab("data")}
              style={{
                flex: 1,
                padding: "14px 16px",
                backgroundColor: activeTab === "data" ? "#1a1a1a" : "transparent",
                border: "none",
                borderBottom: activeTab === "data" ? "2px solid #0066cc" : "2px solid transparent",
                color: activeTab === "data" ? "#fff" : "#888",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              FORM DATA
            </button>
          </div>

          {/* Content */}
          {activeTab === "code" ? (
            <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
              {/* Side menu for files */}
              <div
                style={{
                  width: "160px",
                  backgroundColor: "#1e1e1e",
                  borderRight: "1px solid #3d3d3d",
                  overflowY: "auto",
                  flexShrink: 0,
                }}
              >
                <div style={{ padding: "8px 0" }}>
                  {files.map((file, index) => {
                    const isActive = index === activeFileIndex;
                    return (
                      <div
                        key={file.name}
                        onClick={() => setActiveFileIndex(index)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 10px",
                          cursor: "pointer",
                          backgroundColor: isActive ? "#37373d" : "transparent",
                          borderLeft: isActive ? "2px solid #0066cc" : "2px solid transparent",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = "#2a2a2a";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <FileIcon language={file.language} />
                        <span
                          style={{
                            color: isActive ? "#fff" : "#ccc",
                            fontSize: "11px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {file.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Code content area */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {/* File header with Go to Line */}
                <div
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#252526",
                    borderBottom: "1px solid #3d3d3d",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexShrink: 0,
                  }}
                >
                  <FileIcon language={activeFile?.language || "typescript"} />
                  <span style={{ color: "#e0e0e0", fontSize: "11px", fontWeight: 500 }}>
                    {activeFile?.name}
                  </span>
                  <span style={{ color: "#666", fontSize: "10px" }}>
                    ({totalLines} lines)
                  </span>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ color: "#666", fontSize: "10px" }}>Go to:</span>
                    <input
                      type="number"
                      value={goToLineValue}
                      onChange={(e) => setGoToLineValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleGoToLine()}
                      placeholder="line"
                      min={1}
                      max={totalLines}
                      style={{
                        width: "45px",
                        padding: "3px 6px",
                        backgroundColor: "#1e1e1e",
                        border: "1px solid #3d3d3d",
                        borderRadius: "3px",
                        color: "#e0e0e0",
                        fontSize: "10px",
                      }}
                    />
                    <button
                      onClick={handleGoToLine}
                      style={{
                        padding: "3px 8px",
                        backgroundColor: "#3d3d3d",
                        border: "none",
                        borderRadius: "3px",
                        color: "#e0e0e0",
                        fontSize: "10px",
                        cursor: "pointer",
                      }}
                    >
                      Go
                    </button>
                  </div>
                </div>

                {/* Code display */}
                <div
                  ref={codeContainerRef}
                  style={{
                    flex: 1,
                    overflow: "auto",
                    backgroundColor: "#1e1e1e",
                  }}
                >
                  {activeFile && (
                    <CodeContent
                      code={activeFile.code}
                      language={activeFile.language}
                      highlightedLine={highlightedLine}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Form data header */}
              <div
                style={{
                  padding: "10px 12px",
                  backgroundColor: "#1e1e1e",
                  borderBottom: "1px solid #3d3d3d",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#888", fontSize: "10px" }}>
                  Real-time form data (updates as you type)
                </span>
              </div>

              {/* Form data content */}
              <div
                style={{
                  flex: 1,
                  overflow: "auto",
                  backgroundColor: "#1e1e1e",
                  padding: "12px",
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    lineHeight: 1.5,
                    fontFamily: "'Fira Code', Monaco, Consolas, monospace",
                    color: "#9cdcfe",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {formDataJson}
                </pre>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default FloatingPanel;
