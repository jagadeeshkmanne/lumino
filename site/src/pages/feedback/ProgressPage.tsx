/**
 * Progress Page
 *
 * Documents the LuminoProgress and LuminoSpinner components.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React, { useState, useEffect } from "react";
import { LiveDemo } from "../../components/LiveDemo";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function ProgressBarDemo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getColor = (value: number) => {
    if (value < 30) return "#ef4444";
    if (value < 70) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{
          fontSize: "14px",
          fontWeight: 500,
          marginBottom: "8px",
          color: "#374151"
        }}>
          Upload Progress: {progress}%
        </div>
        <div style={{
          width: "100%",
          height: "8px",
          background: "#e5e7eb",
          borderRadius: "4px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: getColor(progress),
            transition: "all 0.3s ease",
            borderRadius: "4px"
          }} />
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{
          fontSize: "12px",
          fontWeight: 500,
          marginBottom: "6px",
          color: "#6b7280"
        }}>
          Small
        </div>
        <div style={{
          width: "100%",
          height: "4px",
          background: "#e5e7eb",
          borderRadius: "2px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "#3b82f6",
            transition: "all 0.3s ease",
            borderRadius: "2px"
          }} />
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{
          fontSize: "12px",
          fontWeight: 500,
          marginBottom: "6px",
          color: "#6b7280"
        }}>
          Medium
        </div>
        <div style={{
          width: "100%",
          height: "8px",
          background: "#e5e7eb",
          borderRadius: "4px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "#8b5cf6",
            transition: "all 0.3s ease",
            borderRadius: "4px"
          }} />
        </div>
      </div>

      <div>
        <div style={{
          fontSize: "12px",
          fontWeight: 500,
          marginBottom: "6px",
          color: "#6b7280"
        }}>
          Large
        </div>
        <div style={{
          width: "100%",
          height: "12px",
          background: "#e5e7eb",
          borderRadius: "6px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "#ec4899",
            transition: "all 0.3s ease",
            borderRadius: "6px"
          }} />
        </div>
      </div>
    </div>
  );
}

function SpinnerDemo() {
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;

  return (
    <div style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}>
      <style>{keyframes}</style>

      <div style={{
        display: "flex",
        gap: "32px",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "20px",
            height: "20px",
            border: "2px solid #e5e7eb",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <div style={{
            marginTop: "8px",
            fontSize: "12px",
            color: "#6b7280"
          }}>
            Small
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "32px",
            height: "32px",
            border: "3px solid #e5e7eb",
            borderTopColor: "#8b5cf6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <div style={{
            marginTop: "8px",
            fontSize: "12px",
            color: "#6b7280"
          }}>
            Medium
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e5e7eb",
            borderTopColor: "#10b981",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <div style={{
            marginTop: "8px",
            fontSize: "12px",
            color: "#6b7280"
          }}>
            Large
          </div>
        </div>
      </div>

      <div style={{
        marginTop: "32px",
        paddingTop: "24px",
        borderTop: "1px solid #e5e7eb"
      }}>
        <div style={{
          fontSize: "14px",
          fontWeight: 500,
          marginBottom: "16px",
          color: "#374151"
        }}>
          Loading State
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px",
          background: "#f9fafb",
          borderRadius: "6px"
        }}>
          <div style={{
            width: "24px",
            height: "24px",
            border: "3px solid #e5e7eb",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            Loading data...
          </span>
        </div>
      </div>

      <div style={{
        marginTop: "24px"
      }}>
        <div style={{
          fontSize: "14px",
          fontWeight: 500,
          marginBottom: "16px",
          color: "#374151"
        }}>
          Pulse Animation
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "center"
        }}>
          <div style={{
            width: "12px",
            height: "12px",
            background: "#3b82f6",
            borderRadius: "50%",
            animation: "pulse 1.5s ease-in-out infinite"
          }} />
          <div style={{
            width: "12px",
            height: "12px",
            background: "#3b82f6",
            borderRadius: "50%",
            animation: "pulse 1.5s ease-in-out 0.2s infinite"
          }} />
          <div style={{
            width: "12px",
            height: "12px",
            background: "#3b82f6",
            borderRadius: "50%",
            animation: "pulse 1.5s ease-in-out 0.4s infinite"
          }} />
        </div>
      </div>
    </div>
  );
}

export function ProgressPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Progress & Spinner</h1>
      <p className="docs-page-subtitle">
        Loading indicators for showing progress of operations and async loading states.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Interactive Demo: Progress Bars</h2>
        <LiveDemo
          code={`function ProgressBarDemo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const getColor = (value: number) => {
    if (value < 30) return "#ef4444";
    if (value < 70) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{
          fontSize: "14px",
          fontWeight: 500,
          marginBottom: "8px",
          color: "#374151"
        }}>
          Upload Progress: {progress}%
        </div>
        <div style={{
          width: "100%",
          height: "8px",
          background: "#e5e7eb",
          borderRadius: "4px",
          overflow: "hidden"
        }}>
          <div style={{
            width: \`\${progress}%\`,
            height: "100%",
            background: getColor(progress),
            transition: "all 0.3s ease",
            borderRadius: "4px"
          }} />
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{
          fontSize: "12px",
          fontWeight: 500,
          marginBottom: "6px",
          color: "#6b7280"
        }}>
          Small
        </div>
        <div style={{
          width: "100%",
          height: "4px",
          background: "#e5e7eb",
          borderRadius: "2px",
          overflow: "hidden"
        }}>
          <div style={{
            width: \`\${progress}%\`,
            height: "100%",
            background: "#3b82f6",
            transition: "all 0.3s ease",
            borderRadius: "2px"
          }} />
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div style={{
          fontSize: "12px",
          fontWeight: 500,
          marginBottom: "6px",
          color: "#6b7280"
        }}>
          Medium
        </div>
        <div style={{
          width: "100%",
          height: "8px",
          background: "#e5e7eb",
          borderRadius: "4px",
          overflow: "hidden"
        }}>
          <div style={{
            width: \`\${progress}%\`,
            height: "100%",
            background: "#8b5cf6",
            transition: "all 0.3s ease",
            borderRadius: "4px"
          }} />
        </div>
      </div>

      <div>
        <div style={{
          fontSize: "12px",
          fontWeight: 500,
          marginBottom: "6px",
          color: "#6b7280"
        }}>
          Large
        </div>
        <div style={{
          width: "100%",
          height: "12px",
          background: "#e5e7eb",
          borderRadius: "6px",
          overflow: "hidden"
        }}>
          <div style={{
            width: \`\${progress}%\`,
            height: "100%",
            background: "#ec4899",
            transition: "all 0.3s ease",
            borderRadius: "6px"
          }} />
        </div>
      </div>
    </div>
  );
}`}
        >
          <ProgressBarDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Interactive Demo: Spinners</h2>
        <LiveDemo
          code={`function SpinnerDemo() {
  const keyframes = \`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  \`;

  return (
    <div style={{ padding: "24px", background: "#fff", borderRadius: "8px" }}>
      <style>{keyframes}</style>

      <div style={{
        display: "flex",
        gap: "32px",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "20px",
            height: "20px",
            border: "2px solid #e5e7eb",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <div style={{
            marginTop: "8px",
            fontSize: "12px",
            color: "#6b7280"
          }}>
            Small
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "32px",
            height: "32px",
            border: "3px solid #e5e7eb",
            borderTopColor: "#8b5cf6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <div style={{
            marginTop: "8px",
            fontSize: "12px",
            color: "#6b7280"
          }}>
            Medium
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e5e7eb",
            borderTopColor: "#10b981",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <div style={{
            marginTop: "8px",
            fontSize: "12px",
            color: "#6b7280"
          }}>
            Large
          </div>
        </div>
      </div>

      <div style={{
        marginTop: "32px",
        paddingTop: "24px",
        borderTop: "1px solid #e5e7eb"
      }}>
        <div style={{
          fontSize: "14px",
          fontWeight: 500,
          marginBottom: "16px",
          color: "#374151"
        }}>
          Loading State
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px",
          background: "#f9fafb",
          borderRadius: "6px"
        }}>
          <div style={{
            width: "24px",
            height: "24px",
            border: "3px solid #e5e7eb",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }} />
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            Loading data...
          </span>
        </div>
      </div>

      <div style={{
        marginTop: "24px"
      }}>
        <div style={{
          fontSize: "14px",
          fontWeight: 500,
          marginBottom: "16px",
          color: "#374151"
        }}>
          Pulse Animation
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          justifyContent: "center"
        }}>
          <div style={{
            width: "12px",
            height: "12px",
            background: "#3b82f6",
            borderRadius: "50%",
            animation: "pulse 1.5s ease-in-out infinite"
          }} />
          <div style={{
            width: "12px",
            height: "12px",
            background: "#3b82f6",
            borderRadius: "50%",
            animation: "pulse 1.5s ease-in-out 0.2s infinite"
          }} />
          <div style={{
            width: "12px",
            height: "12px",
            background: "#3b82f6",
            borderRadius: "50%",
            animation: "pulse 1.5s ease-in-out 0.4s infinite"
          }} />
        </div>
      </div>
    </div>
  );
}`}
        >
          <SpinnerDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoProgress, LuminoSpinner } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Progress Props</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>value</code></td>
              <td>number</td>
              <td>0</td>
              <td>Progress value (0-100)</td>
            </tr>
            <tr>
              <td><code>variant</code></td>
              <td>"determinate" | "indeterminate"</td>
              <td>"determinate"</td>
              <td>Progress type</td>
            </tr>
            <tr>
              <td><code>size</code></td>
              <td>"sm" | "md" | "lg"</td>
              <td>"md"</td>
              <td>Bar height</td>
            </tr>
            <tr>
              <td><code>color</code></td>
              <td>"primary" | "success" | "warning" | "error"</td>
              <td>"primary"</td>
              <td>Bar color</td>
            </tr>
            <tr>
              <td><code>showValue</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Display percentage</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td>string</td>
              <td>-</td>
              <td>Label above bar</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Spinner Props</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>size</code></td>
              <td>"sm" | "md" | "lg" | number</td>
              <td>"md"</td>
              <td>Spinner size</td>
            </tr>
            <tr>
              <td><code>color</code></td>
              <td>"primary" | "secondary" | "inherit"</td>
              <td>"primary"</td>
              <td>Spinner color</td>
            </tr>
            <tr>
              <td><code>thickness</code></td>
              <td>number</td>
              <td>4</td>
              <td>Stroke thickness</td>
            </tr>
            <tr>
              <td><code>label</code></td>
              <td>string</td>
              <td>-</td>
              <td>Accessible label</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Progress Bar</h2>
        <pre className="docs-code">{`import { LuminoProgress } from "lumino/react";

function BasicProgress() {
  return (
    <div>
      <LuminoProgress value={25} />
      <LuminoProgress value={50} />
      <LuminoProgress value={75} />
      <LuminoProgress value={100} />
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Indeterminate Progress</h2>
        <pre className="docs-code">{`// When progress is unknown
<LuminoProgress variant="indeterminate" />

// Use for loading states where progress can't be measured
<LuminoProgress
  variant="indeterminate"
  label="Loading..."
/>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Progress with Value Display</h2>
        <pre className="docs-code">{`// Show percentage
<LuminoProgress value={65} showValue />

// Custom format
<LuminoProgress
  value={65}
  showValue
  formatValue={(value) => \`\${value}% complete\`}
/>

// With label
<LuminoProgress
  value={45}
  label="Upload Progress"
  showValue
/>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Progress Colors</h2>
        <pre className="docs-code">{`<LuminoProgress value={75} color="primary" />
<LuminoProgress value={75} color="success" />
<LuminoProgress value={75} color="warning" />
<LuminoProgress value={75} color="error" />

// Dynamic color based on value
function DynamicProgress({ value }) {
  const getColor = (val) => {
    if (val < 30) return "error";
    if (val < 70) return "warning";
    return "success";
  };

  return (
    <LuminoProgress
      value={value}
      color={getColor(value)}
      showValue
    />
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Progress Sizes</h2>
        <pre className="docs-code">{`<LuminoProgress size="sm" value={60} />  {/* 4px height */}
<LuminoProgress size="md" value={60} />  {/* 8px height */}
<LuminoProgress size="lg" value={60} />  {/* 12px height */}`}</pre>
      </div>

      <div className="docs-section">
        <h2>File Upload Progress</h2>
        <pre className="docs-code">{`function FileUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);

    await uploadFile(file, {
      onProgress: (percent) => setProgress(percent),
    });

    setUploading(false);
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />

      {uploading && (
        <LuminoProgress
          value={progress}
          label={\`Uploading... \${progress}%\`}
          showValue
          color={progress === 100 ? "success" : "primary"}
        />
      )}
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Spinner</h2>
        <pre className="docs-code">{`import { LuminoSpinner } from "lumino/react";

function BasicSpinners() {
  return (
    <div>
      <LuminoSpinner size="sm" />
      <LuminoSpinner size="md" />
      <LuminoSpinner size="lg" />
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Spinner in Loading States</h2>
        <pre className="docs-code">{`function LoadingContent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <LuminoSpinner size="lg" />
        <p>Loading data...</p>
      </div>
    );
  }

  return <div>{/* Render data */}</div>;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Spinner in Buttons</h2>
        <pre className="docs-code">{`function SubmitButton() {
  const [loading, setLoading] = useState(false);

  return (
    <LuminoButton
      onClick={async () => {
        setLoading(true);
        await submit();
        setLoading(false);
      }}
      disabled={loading}
    >
      {loading ? (
        <>
          <LuminoSpinner size="sm" color="inherit" />
          <span>Saving...</span>
        </>
      ) : (
        "Save"
      )}
    </LuminoButton>
  );
}

// Or use the built-in loading prop
<LuminoButton loading={isLoading}>
  Save
</LuminoButton>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Full Page Loading</h2>
        <pre className="docs-code">{`// Using Lumino's global loader
const { ui } = useLumino();

ui.showLoader();                    // Show loading overlay
ui.showLoader("Loading data...");   // With message
ui.hideLoader();                    // Hide overlay

// Custom full page spinner
function PageLoader({ message }) {
  return (
    <div className="page-loader-overlay">
      <div className="page-loader-content">
        <LuminoSpinner size="lg" />
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Inline Loading</h2>
        <pre className="docs-code">{`// Inline spinner with text
function LoadingText() {
  return (
    <span className="loading-text">
      <LuminoSpinner size="sm" />
      <span>Loading...</span>
    </span>
  );
}

// Card loading state
function LoadingCard() {
  return (
    <LuminoCard>
      <div className="card-loading">
        <LuminoSpinner />
        <p>Fetching latest data...</p>
      </div>
    </LuminoCard>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Multi-Step Progress</h2>
        <pre className="docs-code">{`function MultiStepProgress({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="multi-step-progress">
      <div className="step-info">
        Step {currentStep} of {totalSteps}
      </div>
      <LuminoProgress value={progress} />
    </div>
  );
}

// With step labels
function StepProgressBar({ steps, currentIndex }) {
  return (
    <div className="step-progress">
      <div className="steps">
        {steps.map((step, index) => (
          <div
            key={index}
            className={\`step \${index <= currentIndex ? "completed" : ""}\`}
          >
            {step.label}
          </div>
        ))}
      </div>
      <LuminoProgress
        value={(currentIndex / (steps.length - 1)) * 100}
      />
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Form Builder</h2>
        <pre className="docs-code">{`class DataForm extends Form<Entity> {
  configure() {
    // Form config...
  }

  async onLoad() {
    this.ui.showLoader("Loading form data...");
    try {
      const data = await this.api.fetch();
      this.setData(data);
    } finally {
      this.ui.hideLoader();
    }
  }

  async onSubmit(data: Entity) {
    // The form automatically shows spinner on submit button
    // when loading prop is set
    await this.api.save(data);
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Skeleton Loading</h2>
        <pre className="docs-code">{`import { LuminoSkeleton } from "lumino/react";

// Text skeleton
<LuminoSkeleton variant="text" />
<LuminoSkeleton variant="text" width="60%" />

// Rectangle skeleton
<LuminoSkeleton variant="rect" width={200} height={100} />

// Circle skeleton (avatars)
<LuminoSkeleton variant="circle" width={40} height={40} />

// Card skeleton
function CardSkeleton() {
  return (
    <LuminoCard>
      <LuminoSkeleton variant="rect" height={200} />
      <div style={{ padding: 16 }}>
        <LuminoSkeleton variant="text" />
        <LuminoSkeleton variant="text" width="80%" />
      </div>
    </LuminoCard>
  );
}

// Table skeleton
<LuminoSkeleton variant="table" rows={5} columns={4} />`}</pre>
      </div>

      <div className="docs-section">
        <h2>Accessibility</h2>
        <pre className="docs-code">{`// Progress bar accessibility
<LuminoProgress
  value={75}
  aria-label="File upload progress"
  role="progressbar"
  aria-valuenow={75}
  aria-valuemin={0}
  aria-valuemax={100}
/>

// Spinner accessibility
<LuminoSpinner
  aria-label="Loading content"
  role="status"
/>

// Announce loading state changes
<div aria-live="polite">
  {loading && <LuminoSpinner label="Loading..." />}
</div>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use determinate when possible</strong> - Shows users
            actual progress
          </li>
          <li>
            <strong>Provide context</strong> - Add labels explaining what's
            loading
          </li>
          <li>
            <strong>Avoid spinner overuse</strong> - Consider skeleton loading
            for better UX
          </li>
          <li>
            <strong>Match spinner to context</strong> - Use appropriate sizes
            for buttons vs pages
          </li>
          <li>
            <strong>Color for status</strong> - Use success color when
            progress completes
          </li>
          <li>
            <strong>Accessible labels</strong> - Screen readers need to know
            what's loading
          </li>
        </ul>
      </div>
    </div>
  );
}
