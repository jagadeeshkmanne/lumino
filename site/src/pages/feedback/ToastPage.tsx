/**
 * Toast Page
 *
 * Documents the LuminoToast component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React, { useState } from "react";
import { LiveDemo } from "../../components/LiveDemo";

function ToastDemoComponent() {
  const [toasts, setToasts] = useState<Array<{ id: number; type: string; message: string }>>([]);
  const [toastId, setToastId] = useState(0);

  const showToast = (type: string, message: string) => {
    const id = toastId;
    setToastId(id + 1);

    const newToast = { id, type, message };
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const dismissToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getToastStyles = (type: string): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      animation: 'slideIn 0.3s ease-out',
    };

    const typeStyles: Record<string, React.CSSProperties> = {
      success: {
        backgroundColor: '#10b981',
        color: '#ffffff',
      },
      error: {
        backgroundColor: '#ef4444',
        color: '#ffffff',
      },
      warning: {
        backgroundColor: '#f59e0b',
        color: '#ffffff',
      },
      info: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
      },
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIconForType = (type: string) => {
    const icons: Record<string, string> = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type];
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <button
          onClick={() => showToast('success', 'Operation completed successfully!')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#10b981')}
        >
          Show Success
        </button>

        <button
          onClick={() => showToast('error', 'Something went wrong. Please try again.')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
        >
          Show Error
        </button>

        <button
          onClick={() => showToast('warning', 'Your session will expire in 5 minutes.')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#d97706')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f59e0b')}
        >
          Show Warning
        </button>

        <button
          onClick={() => showToast('info', 'New updates are available.')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
        >
          Show Info
        </button>
      </div>

      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '400px',
      }}>
        {toasts.map(toast => (
          <div key={toast.id} style={getToastStyles(toast.type)}>
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}>
              {getIconForType(toast.type)}
            </span>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '0 4px',
                opacity: 0.8,
                transition: 'opacity 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '0.8')}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export function ToastPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Toast</h1>
      <p className="docs-page-subtitle">
        A notification component for displaying brief messages that appear
        temporarily and auto-dismiss.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
      </div>

      {/* Interactive Demo */}
      <div className="docs-section">
        <h2>Interactive Demo</h2>
        <LiveDemo
          code={`function ToastDemo() {
  const [toasts, setToasts] = React.useState([]);
  const [toastId, setToastId] = React.useState(0);

  const showToast = (type, message) => {
    const id = toastId;
    setToastId(id + 1);

    const newToast = { id, type, message };
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getToastStyles = (type) => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '6px',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: 500,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      animation: 'slideIn 0.3s ease-out',
    };

    const typeStyles = {
      success: {
        backgroundColor: '#10b981',
        color: '#ffffff',
      },
      error: {
        backgroundColor: '#ef4444',
        color: '#ffffff',
      },
      warning: {
        backgroundColor: '#f59e0b',
        color: '#ffffff',
      },
      info: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
      },
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIconForType = (type) => {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type];
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <button
          onClick={() => showToast('success', 'Operation completed successfully!')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
        >
          Show Success
        </button>

        <button
          onClick={() => showToast('error', 'Something went wrong. Please try again.')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
        >
          Show Error
        </button>

        <button
          onClick={() => showToast('warning', 'Your session will expire in 5 minutes.')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d97706'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f59e0b'}
        >
          Show Warning
        </button>

        <button
          onClick={() => showToast('info', 'New updates are available.')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          Show Info
        </button>
      </div>

      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '400px',
      }}>
        {toasts.map(toast => (
          <div key={toast.id} style={getToastStyles(toast.type)}>
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}>
              {getIconForType(toast.type)}
            </span>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => dismissToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '0 4px',
                opacity: 0.8,
                transition: 'opacity 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <style>{\`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      \`}</style>
    </div>
  );
}`}
        >
          <ToastDemoComponent />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoToast, useToast } from "lumino/react";
// Or use via lumino context
import { useLumino } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Toast Options</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Option</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>message</code></td>
              <td>string | ReactNode</td>
              <td>-</td>
              <td>Toast message content</td>
            </tr>
            <tr>
              <td><code>type</code></td>
              <td>"success" | "error" | "warning" | "info"</td>
              <td>"info"</td>
              <td>Toast type/style</td>
            </tr>
            <tr>
              <td><code>duration</code></td>
              <td>number</td>
              <td>5000</td>
              <td>Auto-dismiss time (ms)</td>
            </tr>
            <tr>
              <td><code>dismissible</code></td>
              <td>boolean</td>
              <td>true</td>
              <td>Show close button</td>
            </tr>
            <tr>
              <td><code>position</code></td>
              <td>ToastPosition</td>
              <td>"top-right"</td>
              <td>Screen position</td>
            </tr>
            <tr>
              <td><code>action</code></td>
              <td>ToastAction</td>
              <td>-</td>
              <td>Action button config</td>
            </tr>
            <tr>
              <td><code>icon</code></td>
              <td>ReactNode</td>
              <td>auto</td>
              <td>Custom icon</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage with useLumino</h2>
        <pre className="docs-code">{`import { useLumino } from "lumino/react";

function NotificationExample() {
  const { ui } = useLumino();

  const showSuccess = () => {
    ui.notify("Operation completed successfully!", "success");
  };

  const showError = () => {
    ui.notify("Something went wrong. Please try again.", "error");
  };

  const showWarning = () => {
    ui.notify("Your session will expire in 5 minutes.", "warning");
  };

  const showInfo = () => {
    ui.notify("New updates are available.", "info");
  };

  return (
    <div>
      <LuminoButton onClick={showSuccess}>Success Toast</LuminoButton>
      <LuminoButton onClick={showError}>Error Toast</LuminoButton>
      <LuminoButton onClick={showWarning}>Warning Toast</LuminoButton>
      <LuminoButton onClick={showInfo}>Info Toast</LuminoButton>
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Toast with useToast Hook</h2>
        <pre className="docs-code">{`import { useToast } from "lumino/react";

function ToastHookExample() {
  const toast = useToast();

  const showToast = () => {
    toast.success("Item saved successfully!");
  };

  const showErrorToast = () => {
    toast.error("Failed to save item.");
  };

  return (
    <div>
      <LuminoButton onClick={showToast}>Show Success</LuminoButton>
      <LuminoButton onClick={showErrorToast}>Show Error</LuminoButton>
    </div>
  );
}

// toast methods
toast.success(message, options?)
toast.error(message, options?)
toast.warning(message, options?)
toast.info(message, options?)
toast.dismiss(toastId)
toast.dismissAll()`}</pre>
      </div>

      <div className="docs-section">
        <h2>Custom Duration</h2>
        <pre className="docs-code">{`// Short toast (2 seconds)
ui.notify("Quick message", "info", { duration: 2000 });

// Long toast (10 seconds)
ui.notify("Important message - read carefully", "warning", {
  duration: 10000
});

// Persistent toast (won't auto-dismiss)
ui.notify("Action required", "error", { duration: 0 });`}</pre>
      </div>

      <div className="docs-section">
        <h2>Toast Positions</h2>
        <pre className="docs-code">{`// Available positions
type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

// Set position per toast
ui.notify("Top left toast", "info", { position: "top-left" });
ui.notify("Bottom center toast", "info", { position: "bottom-center" });

// Configure default position globally
const app = lumino()
  .toastConfig({
    position: "bottom-right",
  })
  .build();`}</pre>
      </div>

      <div className="docs-section">
        <h2>Toast with Action</h2>
        <pre className="docs-code">{`// Simple action
ui.notify("Item deleted", "success", {
  action: {
    label: "Undo",
    onClick: () => {
      undoDelete();
    },
  },
});

// Action with async handler
ui.notify("Changes saved", "success", {
  action: {
    label: "View",
    onClick: async () => {
      await navigateTo("/items/123");
    },
  },
});

// Destructive action styling
ui.notify("Are you sure?", "warning", {
  action: {
    label: "Delete",
    variant: "danger",
    onClick: () => deleteItem(),
  },
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Custom Icons</h2>
        <pre className="docs-code">{`// Custom icon
ui.notify("File uploaded", "success", {
  icon: <LuminoIcon name="upload" />,
});

// No icon
ui.notify("Simple message", "info", {
  icon: null,
});

// Default icons by type:
// success: checkmark circle
// error: x circle
// warning: exclamation triangle
// info: info circle`}</pre>
      </div>

      <div className="docs-section">
        <h2>Rich Content</h2>
        <pre className="docs-code">{`// Toast with rich content
ui.notify(
  <div>
    <strong>New message from John</strong>
    <p style={{ margin: "4px 0 0", opacity: 0.8 }}>
      Hey, can you review the latest PR?
    </p>
  </div>,
  "info",
  {
    duration: 8000,
    action: {
      label: "View",
      onClick: () => openMessage(),
    },
  }
);

// Toast with multiple lines
ui.notify(
  <>
    <div>File upload complete</div>
    <div style={{ fontSize: "0.9em", opacity: 0.8 }}>
      3 files uploaded successfully
    </div>
  </>,
  "success"
);`}</pre>
      </div>

      <div className="docs-section">
        <h2>Managing Toasts</h2>
        <pre className="docs-code">{`// Dismiss specific toast
const toastId = ui.notify("Processing...", "info", { duration: 0 });
// Later...
ui.dismissToast(toastId);

// Dismiss all toasts
ui.dismissAllToasts();

// Update existing toast
const id = ui.notify("Uploading...", "info", { duration: 0 });
// After upload completes:
ui.updateToast(id, {
  message: "Upload complete!",
  type: "success",
  duration: 3000,
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Promise-based Toasts</h2>
        <pre className="docs-code">{`// Async operation with loading toast
async function saveData() {
  const toastId = ui.notify("Saving...", "info", { duration: 0 });

  try {
    await api.save(data);
    ui.updateToast(toastId, {
      message: "Saved successfully!",
      type: "success",
      duration: 3000,
    });
  } catch (error) {
    ui.updateToast(toastId, {
      message: "Failed to save",
      type: "error",
      duration: 5000,
    });
  }
}

// Using toast.promise helper
toast.promise(
  saveData(),
  {
    loading: "Saving...",
    success: "Saved successfully!",
    error: "Failed to save",
  }
);`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Form Builder</h2>
        <pre className="docs-code">{`class UserForm extends Form<User> {
  configure() {
    // Form configuration...
  }

  async onSubmit(data: User) {
    try {
      await this.api.saveUser(data);
      this.ui.notify("User saved successfully!", "success");
      this.close();
    } catch (error) {
      if (error.code === "DUPLICATE_EMAIL") {
        this.ui.notify("Email already exists", "error");
        this.setFieldError("email", "This email is already registered");
      } else {
        this.ui.notify("Failed to save user", "error");
      }
    }
  }

  async onDelete() {
    await this.api.deleteUser(this.data.id);
    this.ui.notify("User deleted", "success", {
      action: {
        label: "Undo",
        onClick: async () => {
          await this.api.restoreUser(this.data.id);
          this.ui.notify("User restored", "success");
        },
      },
    });
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Global Configuration</h2>
        <pre className="docs-code">{`const app = lumino()
  .toastConfig({
    // Default position for all toasts
    position: "top-right",

    // Default duration (ms)
    duration: 5000,

    // Maximum visible toasts at once
    maxToasts: 5,

    // Pause auto-dismiss on hover
    pauseOnHover: true,

    // Stack behavior: newest first or last
    newestOnTop: true,

    // Animation
    animation: "slide", // "slide" | "fade" | "none"

    // Container class for custom styling
    containerClassName: "my-toast-container",
  })
  .build();`}</pre>
      </div>

      <div className="docs-section">
        <h2>Accessibility</h2>
        <pre className="docs-code">{`// Toasts automatically use ARIA live regions
// Success/info: role="status", aria-live="polite"
// Error/warning: role="alert", aria-live="assertive"

// For critical messages, ensure enough display time
ui.notify("Critical error - data may be lost", "error", {
  duration: 0,  // Require manual dismissal
  dismissible: true,
});

// Provide context in the message
ui.notify("Form saved successfully", "success");  // Good
ui.notify("Success", "success");  // Too vague`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Keep messages concise</strong> - Users should understand
            quickly
          </li>
          <li>
            <strong>Use appropriate types</strong> - Success for positive,
            error for failures
          </li>
          <li>
            <strong>Provide undo for destructive actions</strong> - Let users
            recover from mistakes
          </li>
          <li>
            <strong>Don't overuse</strong> - Too many toasts overwhelm users
          </li>
          <li>
            <strong>Set appropriate durations</strong> - Longer for important
            messages
          </li>
          <li>
            <strong>Consider positioning</strong> - Don't block important UI
            elements
          </li>
        </ul>
      </div>
    </div>
  );
}
