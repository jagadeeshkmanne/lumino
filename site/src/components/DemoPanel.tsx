/**
 * DemoPanel - Storybook-style panel with Demo/Config/Data tabs
 */

import React, { useState } from "react";
import { CodeBlock } from "./CodeBlock";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode | string;
  language?: string;
}

interface DemoPanelProps {
  demo: React.ReactNode;
  configCode: string;
  dataCode?: string;
}

export function DemoPanel({ demo, configCode, dataCode }: DemoPanelProps) {
  const [activeTab, setActiveTab] = useState("demo");

  const tabs: Tab[] = [
    { id: "demo", label: "Demo", content: demo },
    { id: "config", label: "Config", content: configCode, language: "typescript" },
  ];

  if (dataCode) {
    tabs.push({ id: "data", label: "Data", content: dataCode, language: "json" });
  }

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className="demo-panel">
      <div className="demo-panel-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`demo-panel-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="demo-panel-content">
        {activeTab === "demo" ? (
          <div className="demo-panel-canvas">
            {demo}
          </div>
        ) : (
          <CodeBlock
            code={activeTabData?.content as string}
            language={activeTabData?.language || "typescript"}
          />
        )}
      </div>
    </div>
  );
}

// Simpler version with just Canvas and Code tabs
interface SimpleDemoPanelProps {
  children: React.ReactNode;
  code: string;
  language?: string;
}

export function SimpleDemoPanel({ children, code, language = "typescript" }: SimpleDemoPanelProps) {
  const [activeTab, setActiveTab] = useState<"canvas" | "code">("canvas");

  return (
    <div className="demo-panel">
      <div className="demo-panel-tabs">
        <button
          className={`demo-panel-tab ${activeTab === "canvas" ? "active" : ""}`}
          onClick={() => setActiveTab("canvas")}
        >
          Canvas
        </button>
        <button
          className={`demo-panel-tab ${activeTab === "code" ? "active" : ""}`}
          onClick={() => setActiveTab("code")}
        >
          Code
        </button>
      </div>
      <div className="demo-panel-content">
        {activeTab === "canvas" ? (
          <div className="demo-panel-canvas">
            {children}
          </div>
        ) : (
          <CodeBlock code={code} language={language} />
        )}
      </div>
    </div>
  );
}
