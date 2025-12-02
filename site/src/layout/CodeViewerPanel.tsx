/**
 * CodeViewerPanel Component
 *
 * React component that provides the UI for the code viewer with:
 * - Collapsible header
 * - Side menu for file navigation
 * - Prism.js syntax highlighting
 * - Line numbers
 * - Go to line feature
 * - Modern dark theme styling
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";

// =============================================================================
// TYPES
// =============================================================================

interface CodeFile {
  name: string;
  language: "typescript" | "tsx" | "javascript" | "json";
  code: string;
}

export interface CodeViewerPanelProps {
  title: string;
  files: CodeFile[];
  activeFileIndex: number;
  onFileSelect: (index: number) => void;
}

// =============================================================================
// FILE ICON COMPONENT
// =============================================================================

function FileIcon({ language }: { language: string }) {
  const getIconColor = () => {
    switch (language) {
      case "typescript":
      case "tsx":
        return "#3178c6"; // TypeScript blue
      case "javascript":
        return "#f7df1e"; // JavaScript yellow
      case "json":
        return "#cbcb41"; // JSON yellow
      default:
        return "#888";
    }
  };

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M3 1h7l4 4v10H3V1z"
        fill={getIconColor()}
        opacity="0.2"
      />
      <path
        d="M3 1h7l4 4v10H3V1z"
        stroke={getIconColor()}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M10 1v4h4"
        stroke={getIconColor()}
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

// =============================================================================
// CODE CONTENT COMPONENT
// =============================================================================

interface CodeContentProps {
  code: string;
  language: string;
  highlightedLine?: number | null;
  codeContainerRef: React.RefObject<HTMLDivElement>;
}

function CodeContent({ code, language, highlightedLine, codeContainerRef }: CodeContentProps) {
  const codeRef = useRef<HTMLElement>(null);
  const lines = code.split("\n");
  const lineHeight = 20.8; // 13px font * 1.6 line-height

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  // Scroll to highlighted line
  useEffect(() => {
    if (highlightedLine && codeContainerRef.current) {
      const scrollTop = (highlightedLine - 1) * lineHeight - 100; // Center it a bit
      codeContainerRef.current.scrollTop = Math.max(0, scrollTop);
    }
  }, [highlightedLine, codeContainerRef]);

  // Map tsx to jsx for Prism (it handles them the same way)
  const prismLanguage = language === "tsx" ? "tsx" : language;

  return (
    <div
      style={{
        display: "flex",
        minWidth: "fit-content",
      }}
    >
      {/* Line numbers - sticky left */}
      <div
        style={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          backgroundColor: "#1a1a1a",
          borderRight: "1px solid #3d3d3d",
          flexShrink: 0,
        }}
      >
        {lines.map((_, index) => {
          const isHighlighted = highlightedLine === index + 1;
          return (
            <div
              key={index}
              style={{
                padding: "0 12px 0 16px",
                textAlign: "right",
                userSelect: "none",
                fontSize: "13px",
                lineHeight: 1.6,
                fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
                color: isHighlighted ? "#fff" : "#666",
                backgroundColor: isHighlighted ? "#264f78" : "#1a1a1a",
                minWidth: "32px",
                boxSizing: "border-box",
              }}
            >
              {index + 1}
            </div>
          );
        })}
      </div>
      {/* Code content with Prism highlighting */}
      <pre
        style={{
          margin: 0,
          padding: "0 16px",
          backgroundColor: "transparent",
          fontSize: "13px",
          lineHeight: 1.6,
          fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
          flexGrow: 1,
        }}
      >
        <code ref={codeRef} className={`language-${prismLanguage}`}>
          {code}
        </code>
      </pre>
      {/* Highlight overlay */}
      {highlightedLine && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: (highlightedLine - 1) * lineHeight,
            height: lineHeight,
            backgroundColor: "#264f78",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CodeViewerPanel({
  title,
  files,
  activeFileIndex,
  onFileSelect,
}: CodeViewerPanelProps): JSX.Element {
  const activeFile = files[activeFileIndex] || files[0];
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const [goToLineValue, setGoToLineValue] = useState("");
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const totalLines = activeFile ? activeFile.code.split("\n").length : 0;

  const handleGoToLine = useCallback(() => {
    const lineNum = parseInt(goToLineValue, 10);
    if (!isNaN(lineNum) && lineNum > 0 && lineNum <= totalLines) {
      setHighlightedLine(lineNum);
    }
  }, [goToLineValue, totalLines]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleGoToLine();
    }
  }, [handleGoToLine]);

  // Clear highlight when file changes
  useEffect(() => {
    setHighlightedLine(null);
    setGoToLineValue("");
  }, [activeFileIndex]);

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: "8px",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Content area with side menu - always visible */}
      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
        }}
      >
          {/* Side menu - fixed with scroll */}
          <div
            style={{
              width: "200px",
              backgroundColor: "#1e1e1e",
              borderRight: "1px solid #3d3d3d",
              overflowY: "auto",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                padding: "8px 0",
              }}
            >
              {files.map((file, index) => {
                const isActive = index === activeFileIndex;
                return (
                  <div
                    key={file.name}
                    onClick={() => onFileSelect(index)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      backgroundColor: isActive ? "#37373d" : "transparent",
                      borderLeft: isActive ? "2px solid #0066cc" : "2px solid transparent",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "#2a2a2a";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <FileIcon language={file.language} />
                    <span
                      style={{
                        color: isActive ? "#fff" : "#ccc",
                        fontSize: "13px",
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
          <div
            style={{
              flex: 1,
              backgroundColor: "#1e1e1e",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* File name header with Go to Line */}
            <div
              style={{
                padding: "8px 16px",
                backgroundColor: "#252526",
                borderBottom: "1px solid #3d3d3d",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              <FileIcon language={activeFile?.language || "typescript"} />
              <span
                style={{
                  color: "#e0e0e0",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {activeFile?.name}
              </span>
              <span
                style={{
                  color: "#666",
                  fontSize: "11px",
                }}
              >
                ({totalLines} lines)
              </span>

              {/* Go to Line */}
              <div
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    color: "#888",
                    fontSize: "12px",
                  }}
                >
                  Go to line:
                </span>
                <input
                  type="number"
                  value={goToLineValue}
                  onChange={(e) => setGoToLineValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="1"
                  min="1"
                  max={totalLines}
                  style={{
                    width: "60px",
                    padding: "4px 8px",
                    backgroundColor: "#1e1e1e",
                    border: "1px solid #3d3d3d",
                    borderRadius: "4px",
                    color: "#e0e0e0",
                    fontSize: "12px",
                    outline: "none",
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGoToLine();
                  }}
                  style={{
                    padding: "4px 10px",
                    backgroundColor: "#3d3d3d",
                    border: "none",
                    borderRadius: "4px",
                    color: "#e0e0e0",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Go
                </button>
                <span
                  style={{
                    color: "#666",
                    fontSize: "11px",
                    textTransform: "uppercase",
                  }}
                >
                  {activeFile?.language}
                </span>
              </div>
            </div>

            {/* Code display - scrollable */}
            <div
              ref={codeContainerRef}
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "auto",
                position: "relative",
              }}
            >
              {activeFile && (
                <CodeContent
                  code={activeFile.code}
                  language={activeFile.language}
                  highlightedLine={highlightedLine}
                  codeContainerRef={codeContainerRef}
                />
              )}
            </div>
          </div>
        </div>
    </div>
  );
}

export default CodeViewerPanel;
