/**
 * useEvents Hook Page - Event bus subscriptions
 */

import { CodeBlock } from "../../components/CodeBlock";

const basicUsageCode = `import { useEvents } from "lumino/react";
import { useEffect } from "react";

function Dashboard() {
  const { on, emit } = useEvents();

  useEffect(() => {
    // Subscribe to event
    const unsubscribe = on("user:updated", (payload) => {
      console.log("User updated:", payload.user);
    });

    // Cleanup on unmount
    return unsubscribe;
  }, [on]);

  const handleRefresh = () => {
    emit("dashboard:refresh", { timestamp: Date.now() });
  };

  return <button onClick={handleRefresh}>Refresh</button>;
}`;

const formEventsCode = `import { useEvents } from "lumino/react";
import { useEffect } from "react";

function FormMonitor() {
  const { on } = useEvents();

  useEffect(() => {
    // Form submit
    const unsubscribeSubmit = on("form:submit", ({ formId, action, values }) => {
      console.log(\`Form \${formId} submitted action \${action}\`);
    });

    // Form change
    const unsubscribeChange = on("form:change", ({ formId, field, value }) => {
      console.log(\`Form \${formId} field \${field} changed to:\`, value);
    });

    // Form validation
    const unsubscribeValidate = on("form:validate", ({ formId, valid, errors }) => {
      if (!valid) {
        console.log(\`Form \${formId} has errors:\`, errors);
      }
    });

    return () => {
      unsubscribeSubmit();
      unsubscribeChange();
      unsubscribeValidate();
    };
  }, [on]);

  return null; // Background monitor
}`;

const pageEventsCode = `import { useEvents } from "lumino/react";
import { useEffect } from "react";

function PageMonitor() {
  const { on } = useEvents();

  useEffect(() => {
    // Page initialization
    const unsubscribeInit = on("page:init", ({ pageId, mode }) => {
      console.log(\`Page \${pageId} initializing in \${mode} mode\`);
    });

    // Page loaded
    const unsubscribeLoad = on("page:load", ({ pageId, mode }) => {
      console.log(\`Page \${pageId} loaded\`);
    });

    // Mode change
    const unsubscribeModeChange = on("page:modeChange", ({ pageId, previousMode, mode }) => {
      console.log(\`Page \${pageId} changed from \${previousMode} to \${mode}\`);
    });

    return () => {
      unsubscribeInit();
      unsubscribeLoad();
      unsubscribeModeChange();
    };
  }, [on]);

  return null;
}`;

const apiEventsCode = `import { useEvents } from "lumino/react";
import { useEffect } from "react";

function ApiMonitor() {
  const { on } = useEvents();

  useEffect(() => {
    // API request
    const unsubscribeRequest = on("api:request", ({ method, url }) => {
      console.log(\`API Request: \${method} \${url}\`);
    });

    // API success
    const unsubscribeSuccess = on("api:success", ({ method, url, response }) => {
      console.log(\`API Success: \${method} \${url}\`, response);
    });

    // API error
    const unsubscribeError = on("api:error", ({ method, url, error }) => {
      console.error(\`API Error: \${method} \${url}\`, error);
    });

    return () => {
      unsubscribeRequest();
      unsubscribeSuccess();
      unsubscribeError();
    };
  }, [on]);

  return null;
}`;

const customEventsCode = `import { useEvents } from "lumino/react";
import { useEffect } from "react";

// Emit custom events
function UserProfile() {
  const { emit } = useEvents();

  const handleSave = async () => {
    const user = await saveUser();
    emit("user:saved", { user, timestamp: Date.now() });
  };

  return <button onClick={handleSave}>Save Profile</button>;
}

// Subscribe to custom events
function NotificationBanner() {
  const { on } = useEvents();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = on("user:saved", ({ user }) => {
      setMessage(\`Saved profile for \${user.name}\`);
      setTimeout(() => setMessage(""), 3000);
    });

    return unsubscribe;
  }, [on]);

  return message ? <div className="banner">{message}</div> : null;
}`;

const onceCode = `import { useEvents } from "lumino/react";
import { useEffect } from "react";

function OnboardingTour() {
  const { once } = useEvents();

  useEffect(() => {
    // Subscribe to event, automatically unsubscribe after first fire
    const unsubscribe = once("app:initialized", () => {
      showOnboardingTour();
    });

    return unsubscribe;
  }, [once]);

  return null;
}`;

const offCode = `import { useEvents } from "lumino/react";

function Component() {
  const { on, off } = useEvents();

  const handleUserUpdate = (payload) => {
    console.log("User updated:", payload);
  };

  // Subscribe
  on("user:updated", handleUserUpdate);

  // Unsubscribe specific callback
  off("user:updated", handleUserUpdate);

  // Unsubscribe all callbacks for event
  off("user:updated");
}`;

const eventBusCode = `import { useEvents } from "lumino/react";

function AdvancedComponent() {
  const { eventBus } = useEvents();

  // Access raw event bus for advanced use cases
  eventBus.on("custom:event", callback);
  eventBus.emit("custom:event", payload);
  eventBus.off("custom:event", callback);
}`;

const filteringCode = `import { useEvents } from "lumino/react";
import { useEffect } from "react";

function EmployeeFormMonitor({ formId }: { formId: string }) {
  const { on } = useEvents();

  useEffect(() => {
    const unsubscribe = on("form:change", ({ formId: changedFormId, field, value }) => {
      // Filter events for specific form
      if (changedFormId === formId) {
        console.log(\`Field \${field} changed:\`, value);
      }
    });

    return unsubscribe;
  }, [on, formId]);

  return null;
}`;

const crossComponentCode = `// Component A - Emits event
function ShoppingCart() {
  const { emit } = useEvents();

  const addToCart = (product) => {
    // Add to cart logic...
    emit("cart:itemAdded", { product, quantity: 1 });
  };

  return <button onClick={() => addToCart(product)}>Add to Cart</button>;
}

// Component B - Listens to event (anywhere in app)
function CartBadge() {
  const { on } = useEvents();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const unsubscribe = on("cart:itemAdded", () => {
      setCount(prev => prev + 1);
    });

    return unsubscribe;
  }, [on]);

  return <span className="badge">{count}</span>;
}`;

const debuggingCode = `import { useEvents } from "lumino/react";
import { useEffect } from "react";

function EventLogger() {
  const { eventBus } = useEvents();

  useEffect(() => {
    // Log all events
    const allEvents = [
      "form:submit",
      "form:change",
      "page:init",
      "api:request",
      // ... etc
    ];

    const unsubscribers = allEvents.map(event =>
      eventBus.on(event, (payload) => {
        console.log(\`[Event] \${event}\`, payload);
      })
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [eventBus]);

  return null;
}`;

const typeSafetyCode = `import { useEvents } from "lumino/react";
import type { AllEvents, EventCallback } from "lumino/core";

function TypeSafeComponent() {
  const { on, emit } = useEvents();

  useEffect(() => {
    // Type-safe event subscription
    const unsubscribe = on("form:submit", (payload) => {
      // payload is typed as FormSubmitEvent
      console.log(payload.formId);
      console.log(payload.action);
      console.log(payload.values);
    });

    return unsubscribe;
  }, [on]);

  // Type-safe event emission
  const handleSubmit = () => {
    emit("form:submit", {
      formId: "employee-form",
      action: "save",
      values: { name: "John" }
    });
  };
}`;

export function UseEventsPage() {
  return (
    <>
      <h1 className="docs-page-title">useEvents</h1>
      <p className="docs-page-subtitle">
        Type-safe event bus subscriptions for cross-component communication.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          <code>useEvents()</code> provides access to the Lumino event bus for
          subscribing to and emitting events. It enables <strong>decoupled
          communication</strong> between components without prop drilling or
          complex state management.
        </p>
        <p>
          Lumino emits framework events (form, page, API) automatically, and you
          can emit custom events for your application logic.
        </p>
      </div>

      {/* Basic Usage */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic Usage</h2>
        <CodeBlock code={basicUsageCode} language="typescript" />
      </div>

      {/* Form Events */}
      <div className="docs-section">
        <h2 className="docs-section-title">Form Events</h2>
        <p>
          Listen to form lifecycle events:
        </p>
        <CodeBlock code={formEventsCode} language="typescript" />
        <p>
          Available form events:
        </p>
        <ul>
          <li><strong>form:init</strong> - Form initialized</li>
          <li><strong>form:load</strong> - Form loaded with data</li>
          <li><strong>form:ready</strong> - Form ready (after microtask)</li>
          <li><strong>form:change</strong> - Field value changed</li>
          <li><strong>form:validate</strong> - Form validated</li>
          <li><strong>form:submit</strong> - Form action executed</li>
          <li><strong>form:reset</strong> - Form reset</li>
          <li><strong>form:dirty</strong> - Dirty state changed</li>
        </ul>
      </div>

      {/* Page Events */}
      <div className="docs-section">
        <h2 className="docs-section-title">Page Events</h2>
        <CodeBlock code={pageEventsCode} language="typescript" />
        <p>
          Available page events:
        </p>
        <ul>
          <li><strong>page:init</strong> - Page initialized</li>
          <li><strong>page:load</strong> - Page loaded</li>
          <li><strong>page:modeChange</strong> - Mode changed</li>
          <li><strong>page:error</strong> - Page error occurred</li>
          <li><strong>page:destroy</strong> - Page unmounted</li>
        </ul>
      </div>

      {/* API Events */}
      <div className="docs-section">
        <h2 className="docs-section-title">API Events</h2>
        <CodeBlock code={apiEventsCode} language="typescript" />
        <p>
          Available API events:
        </p>
        <ul>
          <li><strong>api:request</strong> - API request started</li>
          <li><strong>api:success</strong> - API request succeeded</li>
          <li><strong>api:error</strong> - API request failed</li>
        </ul>
      </div>

      {/* Custom Events */}
      <div className="docs-section">
        <h2 className="docs-section-title">Custom Events</h2>
        <p>
          Emit and subscribe to custom application events:
        </p>
        <CodeBlock code={customEventsCode} language="typescript" />
      </div>

      {/* once */}
      <div className="docs-section">
        <h2 className="docs-section-title">Once (Single-Fire)</h2>
        <p>
          Subscribe to an event that auto-unsubscribes after first fire:
        </p>
        <CodeBlock code={onceCode} language="typescript" />
      </div>

      {/* off */}
      <div className="docs-section">
        <h2 className="docs-section-title">Unsubscribe (off)</h2>
        <CodeBlock code={offCode} language="typescript" />
      </div>

      {/* eventBus */}
      <div className="docs-section">
        <h2 className="docs-section-title">Event Bus Access</h2>
        <p>
          Access the raw event bus for advanced use cases:
        </p>
        <CodeBlock code={eventBusCode} language="typescript" />
      </div>

      {/* Filtering */}
      <div className="docs-section">
        <h2 className="docs-section-title">Event Filtering</h2>
        <p>
          Filter events within subscription callback:
        </p>
        <CodeBlock code={filteringCode} language="typescript" />
      </div>

      {/* Cross-Component */}
      <div className="docs-section">
        <h2 className="docs-section-title">Cross-Component Communication</h2>
        <p>
          Communicate between unrelated components:
        </p>
        <CodeBlock code={crossComponentCode} language="typescript" />
      </div>

      {/* Debugging */}
      <div className="docs-section">
        <h2 className="docs-section-title">Debugging Events</h2>
        <p>
          Log all events for debugging:
        </p>
        <CodeBlock code={debuggingCode} language="typescript" />
      </div>

      {/* Type Safety */}
      <div className="docs-section">
        <h2 className="docs-section-title">Type Safety</h2>
        <p>
          Events are fully type-safe with TypeScript:
        </p>
        <CodeBlock code={typeSafetyCode} language="typescript" />
      </div>

      {/* Return Type */}
      <div className="docs-section">
        <h2 className="docs-section-title">Return Type</h2>
        <CodeBlock
          code={`interface UseEventsReturn {
  on: <K extends keyof AllEvents>(
    event: K,
    callback: EventCallback<AllEvents[K]>
  ) => () => void;

  once: <K extends keyof AllEvents>(
    event: K,
    callback: EventCallback<AllEvents[K]>
  ) => () => void;

  off: <K extends keyof AllEvents>(
    event: K,
    callback?: EventCallback<AllEvents[K]>
  ) => void;

  emit: <K extends keyof AllEvents>(
    event: K,
    payload: AllEvents[K]
  ) => void;

  eventBus: EventBus;
}`}
          language="typescript"
        />
      </div>

      {/* Use Cases */}
      <div className="docs-section">
        <h2 className="docs-section-title">Common Use Cases</h2>
        <ul>
          <li><strong>Form monitoring</strong> - Track form changes globally</li>
          <li><strong>Analytics</strong> - Log user interactions</li>
          <li><strong>Notifications</strong> - Show toasts on specific events</li>
          <li><strong>State sync</strong> - Keep multiple components in sync</li>
          <li><strong>Auto-save</strong> - Save drafts on form changes</li>
          <li><strong>Real-time updates</strong> - Push server events to UI</li>
          <li><strong>Debugging</strong> - Log all events during development</li>
          <li><strong>Cross-component actions</strong> - Trigger actions from anywhere</li>
        </ul>
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li><strong>Always cleanup</strong> - Return unsubscribe from useEffect</li>
          <li><strong>Use descriptive event names</strong> - "user:saved" not "saved"</li>
          <li><strong>Include relevant payload</strong> - Provide data subscribers need</li>
          <li><strong>Filter in callbacks</strong> - Check formId, pageId when needed</li>
          <li><strong>Use once for one-time setup</strong> - Auto-cleanup after first fire</li>
          <li><strong>Namespace custom events</strong> - "feature:action" pattern</li>
          <li><strong>Don't overuse</strong> - Prefer props for parent-child communication</li>
          <li><strong>Type your events</strong> - Extend AllEvents interface for custom events</li>
        </ul>
      </div>

      {/* Events vs Props */}
      <div className="docs-section">
        <h2 className="docs-section-title">Events vs Props</h2>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Use Events When</th>
              <th>Use Props When</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Components are unrelated</td>
              <td>Parent-child relationship</td>
            </tr>
            <tr>
              <td>Multiple subscribers needed</td>
              <td>Single recipient</td>
            </tr>
            <tr>
              <td>Decoupling is important</td>
              <td>Direct connection is fine</td>
            </tr>
            <tr>
              <td>Framework events (form, page)</td>
              <td>Component-specific data</td>
            </tr>
            <tr>
              <td>Global actions (analytics)</td>
              <td>Local actions</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
