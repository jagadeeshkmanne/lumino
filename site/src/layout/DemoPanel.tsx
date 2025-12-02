/**
 * DemoPanel - Storybook-style demo panel with tabs
 *
 * Wraps demo content with Demo/Config/Data tabs like Storybook.
 * Uses custom tabs styled to match Storybook.
 * Config tab uses CodeViewerPanel from demos.
 */

import { useState, ReactNode } from "react";
import { useFormData } from "lumino/react";
import { CodeViewerPanel } from "./CodeViewerPanel";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";

// Import source files using Vite's ?raw imports
import EmployeeFormSource from "../demo/forms/EmployeeForm.ts?raw";
import EmployeeEntitySource from "../demo/entities/Employee.ts?raw";
import FormBuilderPageSource from "../demo/pages/FormBuilderPage.ts?raw";
import AddressFieldsSource from "../demo/components/AddressFields.ts?raw";
import ExperienceTableSource from "../demo/components/ExperienceTable.ts?raw";
import ExperienceDialogSource from "../demo/components/ExperienceDialog.ts?raw";
import AppSource from "../demo/app.ts?raw";

interface DemoPanelProps {
  /** The demo content to render */
  children: ReactNode;
  /** Title of the demo */
  title?: string;
  /** Description of the demo */
  description?: string;
}

type TabId = "demo" | "config" | "data";

// Source files for the code viewer
const sourceFiles = [
  { name: "EmployeeForm.ts", language: "typescript" as const, code: EmployeeFormSource },
  { name: "Employee.ts", language: "typescript" as const, code: EmployeeEntitySource },
  { name: "FormBuilderPage.ts", language: "typescript" as const, code: FormBuilderPageSource },
  { name: "AddressFields.ts", language: "typescript" as const, code: AddressFieldsSource },
  { name: "ExperienceTable.ts", language: "typescript" as const, code: ExperienceTableSource },
  { name: "ExperienceDialog.ts", language: "typescript" as const, code: ExperienceDialogSource },
  { name: "app.ts", language: "typescript" as const, code: AppSource },
];

export function DemoPanel({
  children,
  title,
  description,
}: DemoPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>("demo");
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const formData = useFormData();

  const formDataJson = JSON.stringify(formData, null, 2);

  // Highlight code
  const highlightCode = (code: string, language: string) => {
    try {
      return Prism.highlight(code, Prism.languages[language] || Prism.languages.javascript, language);
    } catch {
      return code;
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "demo", label: "Demo" },
    { id: "config", label: "Config" },
    { id: "data", label: "Data" },
  ];

  return (
    <div className="demo-panel">
      {/* Header */}
      {(title || description) && (
        <div className="demo-panel-header">
          {title && <h2 className="demo-panel-title">{title}</h2>}
          {description && <p className="demo-panel-description">{description}</p>}
        </div>
      )}

      {/* Custom Tabs */}
      <div className="demo-panel-tabs-container">
        <div className="demo-panel-tabbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`demo-panel-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <div className="demo-panel-content">
          {activeTab === "demo" && (
            <div className="demo-panel-canvas">
              {children}
            </div>
          )}

          {activeTab === "config" && (
            <div className="demo-panel-config-viewer">
              <CodeViewerPanel
                title="Source Code"
                files={sourceFiles}
                activeFileIndex={activeFileIndex}
                onFileSelect={setActiveFileIndex}
              />
            </div>
          )}

          {activeTab === "data" && (
            <div className="demo-panel-data">
              <div className="data-header">
                <span className="data-label">Form Data (Real-time)</span>
              </div>
              <pre className="data-json">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(formDataJson, "json"),
                  }}
                />
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DemoPanel;
