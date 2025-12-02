/**
 * EventEmitter Class Documentation
 */

import React from "react";

export function EventEmitterPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">EventEmitter Class</h1>
      <p className="docs-page-subtitle">
        Type-safe event emitter for custom events, form events, page events,
        and application-level events.
      </p>

      <div className="docs-section">
        <h2>Overview</h2>
        <p>
          The <code>EventEmitter</code> class is the core of Lumino's event system. It provides
          a type-safe publish-subscribe pattern with support for priorities, wildcard listeners,
          one-time subscriptions, and async event handlers.
        </p>
        <pre className="docs-code">{`import { EventEmitter, eventEmitter } from "lumino/core";

// Use the global singleton
eventEmitter.on("form:submit", (payload) => {
  console.log("Form submitted:", payload);
});

// Or create your own instance
const myEmitter = new EventEmitter();`}</pre>
      </div>

      <div className="docs-section">
        <h2>Type Safety</h2>
        <p>
          EventEmitter is generic over an event map type, providing full type safety:
        </p>
        <pre className="docs-code">{`// Define your event types
interface MyEvents {
  "user:selected": { userId: number; name: string };
  "order:placed": { orderId: string; total: number };
  "cart:updated": { items: number };
}

// Create a typed emitter
const emitter = new EventEmitter<MyEvents>();

// TypeScript enforces correct event names and payloads
emitter.on("user:selected", (payload) => {
  // payload is typed as { userId: number; name: string }
  console.log(payload.userId, payload.name);
});

emitter.emit("user:selected", {
  userId: 123,
  name: "John Doe"
});

// TypeScript error - wrong event name
emitter.on("user:clicked", () => {}); // ✗

// TypeScript error - wrong payload shape
emitter.emit("order:placed", { orderId: 123 }); // ✗`}</pre>
      </div>

      <div className="docs-section">
        <h2>Core Methods</h2>

        <h3>on(event, callback, options?)</h3>
        <p>Subscribe to an event. Returns an unsubscribe function.</p>
        <pre className="docs-code">{`const unsubscribe = eventEmitter.on("form:submit", (payload) => {
  console.log("Form submitted:", payload.formId);
});

// With priority (higher numbers execute first)
const unsubscribe2 = eventEmitter.on(
  "form:submit",
  (payload) => { ... },
  { priority: 10 }
);

// Cleanup
unsubscribe();`}</pre>

        <h3>once(event, callback, options?)</h3>
        <p>Subscribe to an event that fires only once, then automatically unsubscribes.</p>
        <pre className="docs-code">{`eventEmitter.once("app:ready", () => {
  console.log("App is ready - this only fires once");
});

// With priority
eventEmitter.once(
  "page:load",
  (payload) => { ... },
  { priority: 5 }
);`}</pre>

        <h3>onAny(callback, options?)</h3>
        <p>Subscribe to all events (wildcard subscription).</p>
        <pre className="docs-code">{`const unsubscribe = eventEmitter.onAny(({ event, payload }) => {
  console.log(\`Event fired: \${event}\`, payload);
});

// Common use case: logging all events
eventEmitter.onAny(({ event, payload }) => {
  logger.info(\`[\${event}]\`, payload);
}, { priority: 100 }); // High priority for logging`}</pre>

        <h3>emit(event, payload)</h3>
        <p>Emit an event synchronously. Wildcard listeners execute first, then specific listeners.</p>
        <pre className="docs-code">{`eventEmitter.emit("form:submit", {
  formId: "user-form",
  action: "create",
  values: { name: "John", email: "john@example.com" }
});

eventEmitter.emit("api:request:success", {
  apiId: "users",
  url: "/api/users",
  response: { id: 1, name: "John" },
  duration: 245
});`}</pre>

        <h3>emitAsync(event, payload)</h3>
        <p>Emit an event and wait for all async handlers to complete.</p>
        <pre className="docs-code">{`// Async handler
eventEmitter.on("user:created", async (payload) => {
  await sendWelcomeEmail(payload.userId);
  await createUserProfile(payload.userId);
});

// Emit and wait for all handlers
await eventEmitter.emitAsync("user:created", {
  userId: 123,
  email: "john@example.com"
});

console.log("All handlers completed");`}</pre>

        <h3>off(event, callback?)</h3>
        <p>Unsubscribe from an event. If no callback is provided, removes all listeners for that event.</p>
        <pre className="docs-code">{`const handler = (payload) => { ... };
eventEmitter.on("form:change", handler);

// Remove specific handler
eventEmitter.off("form:change", handler);

// Remove all handlers for this event
eventEmitter.off("form:change");`}</pre>
      </div>

      <div className="docs-section">
        <h2>Utility Methods</h2>

        <h3>hasListeners(event)</h3>
        <p>Check if there are any subscribers for an event.</p>
        <pre className="docs-code">{`if (eventEmitter.hasListeners("form:submit")) {
  console.log("Someone is listening to form:submit");
}`}</pre>

        <h3>listenerCount(event)</h3>
        <p>Get the number of listeners for an event.</p>
        <pre className="docs-code">{`const count = eventEmitter.listenerCount("form:submit");
console.log(\`\${count} listeners for form:submit\`);`}</pre>

        <h3>eventNames()</h3>
        <p>Get all registered event names.</p>
        <pre className="docs-code">{`const events = eventEmitter.eventNames();
console.log("Registered events:", events);
// ["form:submit", "form:change", "page:load", ...]`}</pre>

        <h3>clear()</h3>
        <p>Remove all subscriptions from all events.</p>
        <pre className="docs-code">{`// Nuclear option - use sparingly
eventEmitter.clear();`}</pre>

        <h3>clearEvent(event)</h3>
        <p>Remove all subscriptions for a specific event.</p>
        <pre className="docs-code">{`eventEmitter.clearEvent("form:submit");`}</pre>
      </div>

      <div className="docs-section">
        <h2>Priority-Based Execution</h2>
        <p>
          Event handlers execute in order of priority (highest first). This is useful when
          certain handlers must run before others.
        </p>
        <pre className="docs-code">{`// Logger runs first (priority 100)
eventEmitter.on("api:request:start", (payload) => {
  logger.info("API request:", payload.url);
}, { priority: 100 });

// Analytics runs second (priority 50)
eventEmitter.on("api:request:start", (payload) => {
  analytics.track("api_request", payload);
}, { priority: 50 });

// Business logic runs last (default priority 0)
eventEmitter.on("api:request:start", (payload) => {
  updateUIState(payload);
});

// Execution order: logger → analytics → business logic`}</pre>
      </div>

      <div className="docs-section">
        <h2>Error Handling</h2>
        <p>
          Errors in event handlers are caught and logged, preventing one handler from
          breaking others.
        </p>
        <pre className="docs-code">{`eventEmitter.on("form:submit", (payload) => {
  throw new Error("Handler 1 error");
});

eventEmitter.on("form:submit", (payload) => {
  console.log("Handler 2 still runs");
});

eventEmitter.emit("form:submit", { formId: "test", ... });

// Console output:
// Error in event handler for "form:submit": Handler 1 error
// Handler 2 still runs`}</pre>
      </div>

      <div className="docs-section">
        <h2>Global Singleton</h2>
        <p>
          Lumino provides a global <code>eventEmitter</code> instance for application-wide events.
        </p>
        <pre className="docs-code">{`import { eventEmitter } from "lumino/core";

// All built-in Lumino events use this instance
eventEmitter.on("form:submit", (payload) => { ... });
eventEmitter.on("page:load", (payload) => { ... });
eventEmitter.on("api:request:success", (payload) => { ... });

// You can also use it for custom events
eventEmitter.emit("myapp:custom:event", { data: "..." });`}</pre>
      </div>

      <div className="docs-section">
        <h2>React Integration</h2>
        <p>
          Use EventEmitter with React hooks for proper cleanup:
        </p>
        <pre className="docs-code">{`import { useEffect } from "react";
import { eventEmitter } from "lumino/core";

function MyComponent() {
  useEffect(() => {
    const unsubscribe = eventEmitter.on("form:submit", (payload) => {
      console.log("Form submitted:", payload);
    });

    // Cleanup on unmount
    return unsubscribe;
  }, []);

  return <div>My Component</div>;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>Event Namespacing</h3>
        <pre className="docs-code">{`// Use colons to namespace events
"module:action:result"

// Examples:
"user:login:success"
"user:login:failure"
"order:create:start"
"order:create:complete"

// This allows for pattern-based subscriptions (if implemented)
// and makes event organization clear`}</pre>

        <h3>Event Aggregation</h3>
        <pre className="docs-code">{`// Aggregate multiple events into one
const formEvents = ["form:submit", "form:validate", "form:reset"];
formEvents.forEach(event => {
  eventEmitter.on(event, (payload) => {
    console.log(\`Form event: \${event}\`, payload);
  });
});`}</pre>

        <h3>Conditional Subscriptions</h3>
        <pre className="docs-code">{`let unsubscribe: (() => void) | null = null;

function enableFeature() {
  unsubscribe = eventEmitter.on("feature:action", (payload) => {
    // Handle feature action
  });
}

function disableFeature() {
  unsubscribe?.();
  unsubscribe = null;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Performance Considerations</h2>
        <ul>
          <li><strong>Subscription overhead</strong> - Each subscription adds a small amount of memory</li>
          <li><strong>Priority sorting</strong> - Handlers are sorted by priority on subscription, not on emit</li>
          <li><strong>Async handlers</strong> - Use <code>emitAsync()</code> sparingly as it waits for all handlers</li>
          <li><strong>Wildcard listeners</strong> - Execute for every event, so keep them lightweight</li>
          <li><strong>Memory leaks</strong> - Always unsubscribe to prevent memory leaks</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Store unsubscribe functions</strong> - Always clean up subscriptions</li>
          <li><strong>Use descriptive event names</strong> - Follow the <code>category:action:result</code> pattern</li>
          <li><strong>Keep handlers lightweight</strong> - Avoid heavy computation in handlers</li>
          <li><strong>Use priorities wisely</strong> - Reserve high priorities for critical operations</li>
          <li><strong>Document event payloads</strong> - Use TypeScript interfaces for clarity</li>
          <li><strong>Avoid circular dependencies</strong> - Don't emit events that trigger themselves</li>
          <li><strong>Test event flows</strong> - Verify that handlers execute in the correct order</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>API Reference</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Parameters</th>
              <th>Returns</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>on</code></td>
              <td>event, callback, options?</td>
              <td>EventUnsubscribe</td>
              <td>Subscribe to an event</td>
            </tr>
            <tr>
              <td><code>once</code></td>
              <td>event, callback, options?</td>
              <td>EventUnsubscribe</td>
              <td>Subscribe once, then auto-unsubscribe</td>
            </tr>
            <tr>
              <td><code>onAny</code></td>
              <td>callback, options?</td>
              <td>EventUnsubscribe</td>
              <td>Subscribe to all events (wildcard)</td>
            </tr>
            <tr>
              <td><code>emit</code></td>
              <td>event, payload</td>
              <td>void</td>
              <td>Emit event synchronously</td>
            </tr>
            <tr>
              <td><code>emitAsync</code></td>
              <td>event, payload</td>
              <td>Promise&lt;void&gt;</td>
              <td>Emit event and wait for handlers</td>
            </tr>
            <tr>
              <td><code>off</code></td>
              <td>event, callback?</td>
              <td>void</td>
              <td>Unsubscribe from event</td>
            </tr>
            <tr>
              <td><code>hasListeners</code></td>
              <td>event</td>
              <td>boolean</td>
              <td>Check if event has listeners</td>
            </tr>
            <tr>
              <td><code>listenerCount</code></td>
              <td>event</td>
              <td>number</td>
              <td>Get number of listeners</td>
            </tr>
            <tr>
              <td><code>eventNames</code></td>
              <td>-</td>
              <td>string[]</td>
              <td>Get all registered events</td>
            </tr>
            <tr>
              <td><code>clear</code></td>
              <td>-</td>
              <td>void</td>
              <td>Remove all subscriptions</td>
            </tr>
            <tr>
              <td><code>clearEvent</code></td>
              <td>event</td>
              <td>void</td>
              <td>Remove all listeners for event</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li><strong>Form Events</strong> - Learn about form-related events</li>
          <li><strong>Page Events</strong> - Learn about page lifecycle events</li>
          <li><strong>API Events</strong> - Learn about API request events</li>
          <li><strong>Custom Events</strong> - Create your own type-safe events</li>
        </ul>
      </div>
    </div>
  );
}
