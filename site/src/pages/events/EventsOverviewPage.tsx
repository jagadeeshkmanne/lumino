/**
 * Events Overview Page - Introduction to Lumino Event System
 */

import React from "react";

export function EventsOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Event System Overview</h1>
      <p className="docs-page-subtitle">
        Understand Lumino's type-safe event system for building reactive applications
        with built-in events and custom event support.
      </p>

      <div className="docs-section">
        <h2>What is the Event System?</h2>
        <p>
          Lumino provides a powerful, type-safe event system that allows different parts
          of your application to communicate without tight coupling. The event system
          includes built-in events for forms, pages, API calls, and app lifecycle, as well
          as support for custom events.
        </p>
        <p>
          The event system is built around the <code>EventEmitter</code> class, which provides
          a familiar publish-subscribe pattern with TypeScript type safety and additional
          features like priority-based execution and wildcard subscriptions.
        </p>
      </div>

      <div className="docs-section">
        <h2>Key Features</h2>
        <ul>
          <li><strong>Type-safe</strong> - Full TypeScript support with typed event payloads</li>
          <li><strong>Built-in events</strong> - Pre-defined events for forms, pages, API, and app lifecycle</li>
          <li><strong>Custom events</strong> - Easy to add your own domain-specific events</li>
          <li><strong>Priority-based</strong> - Control the execution order of event handlers</li>
          <li><strong>Wildcard subscriptions</strong> - Listen to all events with <code>onAny()</code></li>
          <li><strong>Async support</strong> - Handle async operations with <code>emitAsync()</code></li>
          <li><strong>One-time listeners</strong> - Subscribe to events that fire only once with <code>once()</code></li>
          <li><strong>EventBus wrapper</strong> - Cleaner API with category-based event grouping</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Quick Start</h2>
        <pre className="docs-code">{`import { eventEmitter, eventBus } from "lumino/core";

// Method 1: Using eventEmitter directly
const unsubscribe = eventEmitter.on("form:submit", (payload) => {
  console.log("Form submitted:", payload.formId);
  console.log("Values:", payload.values);
});

// Method 2: Using eventBus for cleaner API
eventBus.form.onSubmit((payload) => {
  console.log("Form submitted:", payload.formId);
});

// Emit an event
eventEmitter.emit("form:submit", {
  formId: "user-form",
  action: "create",
  values: { name: "John", email: "john@example.com" }
});

// Cleanup
unsubscribe();`}</pre>
      </div>

      <div className="docs-section">
        <h2>Built-in Event Categories</h2>
        <p>
          Lumino provides several categories of built-in events:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Example Events</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Form Events</strong></td>
              <td>Form lifecycle, field changes, validation, submission</td>
              <td><code>form:submit</code>, <code>form:change</code>, <code>form:validate</code></td>
            </tr>
            <tr>
              <td><strong>Page Events</strong></td>
              <td>Page lifecycle, mode changes, navigation</td>
              <td><code>page:init</code>, <code>page:ready</code>, <code>page:modeChange</code></td>
            </tr>
            <tr>
              <td><strong>API Events</strong></td>
              <td>API requests, responses, caching</td>
              <td><code>api:request:start</code>, <code>api:request:success</code>, <code>api:cache:hit</code></td>
            </tr>
            <tr>
              <td><strong>App Events</strong></td>
              <td>Application initialization, configuration, errors</td>
              <td><code>app:init</code>, <code>app:ready</code>, <code>app:error</code></td>
            </tr>
            <tr>
              <td><strong>Auth Events</strong></td>
              <td>Authentication and authorization</td>
              <td><code>auth:login</code>, <code>auth:logout</code>, <code>auth:unauthorized</code></td>
            </tr>
            <tr>
              <td><strong>UI Events</strong></td>
              <td>UI feedback, modals, notifications</td>
              <td><code>ui:modal:open</code>, <code>ui:notify</code>, <code>ui:loader:show</code></td>
            </tr>
            <tr>
              <td><strong>Navigation Events</strong></td>
              <td>Route changes, navigation blocking</td>
              <td><code>navigation:start</code>, <code>navigation:end</code></td>
            </tr>
            <tr>
              <td><strong>Lookup Events</strong></td>
              <td>Search dialog field interactions</td>
              <td><code>lookup:select</code>, <code>lookup:search</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Event Flow</h2>
        <pre className="docs-code">{`┌─────────────────┐
│  Event Source   │  (Component, API, Form, etc.)
│  emit("event")  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  EventEmitter   │
│  ├─ Wildcard    │  Execute wildcard listeners first
│  └─ Specific    │  Then execute specific event listeners
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Subscribers   │  (Priority-sorted)
│   callback(data)│  Execute in order of priority
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Side Effects  │  (Update UI, log, analytics, etc.)
└─────────────────┘`}</pre>
      </div>

      <div className="docs-section">
        <h2>EventEmitter vs EventBus</h2>
        <p>
          Lumino provides two ways to work with events:
        </p>
        <pre className="docs-code">{`// EventEmitter - Lower level, more explicit
eventEmitter.on("form:submit", (payload) => { ... });
eventEmitter.emit("form:submit", { formId: "...", ... });

// EventBus - Higher level, category-based
eventBus.form.onSubmit((payload) => { ... });
eventBus.form.emitSubmit({ formId: "...", ... });

// Both are valid - choose based on preference:
// - EventEmitter: More explicit, good for wildcard usage
// - EventBus: Cleaner API, better autocomplete`}</pre>
      </div>

      <div className="docs-section">
        <h2>Common Patterns</h2>

        <h3>1. Global Application Logging</h3>
        <pre className="docs-code">{`// Log all API requests
eventBus.api.onRequestStart((payload) => {
  console.log(\`API Request: \${payload.method} \${payload.url}\`);
});

eventBus.api.onRequestError((payload) => {
  console.error(\`API Error: \${payload.url}\`, payload.error);
});`}</pre>

        <h3>2. Analytics Tracking</h3>
        <pre className="docs-code">{`// Track form submissions
eventBus.form.onSubmitSuccess((payload) => {
  analytics.track("form_submitted", {
    formId: payload.formId,
    action: payload.action
  });
});

// Track page views
eventBus.page.onReady((payload) => {
  analytics.page(payload.pageId);
});`}</pre>

        <h3>3. Error Handling</h3>
        <pre className="docs-code">{`// Centralized error handling
eventBus.app.onError((payload) => {
  // Log to error tracking service
  errorService.log(payload.error);

  // Show user notification
  eventBus.ui.emitNotify({
    message: "An error occurred. Please try again.",
    type: "error"
  });
});`}</pre>

        <h3>4. Cross-Form Communication</h3>
        <pre className="docs-code">{`// When a customer is created in one form
eventBus.form.onSubmitSuccess((payload) => {
  if (payload.formId === "customer-form") {
    // Refresh customer list in another form
    eventBus.form.emitLoad({
      formId: "order-form",
      values: {}
    });
  }
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Always unsubscribe</strong> - Store the unsubscribe function and call it in cleanup (useEffect return)</li>
          <li><strong>Use EventBus for clarity</strong> - Category-based API is more readable</li>
          <li><strong>Set priorities wisely</strong> - Higher priority for critical handlers (logging, validation)</li>
          <li><strong>Avoid side effects in handlers</strong> - Keep handlers pure when possible</li>
          <li><strong>Use custom events for domain logic</strong> - Don't overload built-in events</li>
          <li><strong>Document custom events</strong> - Define interfaces for type safety</li>
          <li><strong>Use async handlers carefully</strong> - They can slow down the application</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li><strong>EventEmitter</strong> - Deep dive into the EventEmitter class</li>
          <li><strong>Form Events</strong> - All form-related events and their payloads</li>
          <li><strong>Page Events</strong> - Page lifecycle events</li>
          <li><strong>API Events</strong> - API request and cache events</li>
          <li><strong>App Events</strong> - Application-level events</li>
          <li><strong>Custom Events</strong> - Creating your own type-safe events</li>
        </ul>
      </div>
    </div>
  );
}
