/**
 * Page Events Documentation
 */

import React from "react";

export function PageEventsPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Page Events</h1>
      <p className="docs-page-subtitle">
        Events emitted during page lifecycle, mode changes, and navigation.
      </p>

      <div className="docs-section">
        <h2>Overview</h2>
        <p>
          Page events are emitted automatically by Lumino during page lifecycle operations.
          These events help you track when pages are initialized, loaded, navigated to/from,
          and when their mode changes (e.g., from "view" to "edit").
        </p>
        <pre className="docs-code">{`import { eventEmitter, eventBus } from "lumino/core";

// Method 1: Direct event subscription
eventEmitter.on("page:ready", (payload) => {
  console.log("Page ready:", payload.pageId);
});

// Method 2: Using EventBus (recommended)
eventBus.page.onReady((payload) => {
  console.log("Page ready:", payload.pageId);
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Page Lifecycle Events</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>When Fired</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>page:init</code></td>
              <td><code>{"{ pageId: string; mode: string }"}</code></td>
              <td>Page instance is created</td>
            </tr>
            <tr>
              <td><code>page:load</code></td>
              <td><code>{"{ pageId: string; mode: string }"}</code></td>
              <td>Page data is being loaded</td>
            </tr>
            <tr>
              <td><code>page:ready</code></td>
              <td><code>{"{ pageId: string; mode: string }"}</code></td>
              <td>Page is fully loaded and ready for interaction</td>
            </tr>
            <tr>
              <td><code>page:destroy</code></td>
              <td><code>{"{ pageId: string }"}</code></td>
              <td>Page is being destroyed/unmounted</td>
            </tr>
            <tr>
              <td><code>page:error</code></td>
              <td><code>{"{ pageId: string; error: any }"}</code></td>
              <td>Page encounters an error during lifecycle</td>
            </tr>
          </tbody>
        </table>

        <h3>Example: Page Lifecycle Tracking</h3>
        <pre className="docs-code">{`// Track page initialization
eventBus.page.onInit((payload) => {
  console.log(\`Page initializing: \${payload.pageId}\`);
  console.log(\`Mode: \${payload.mode}\`);
});

// Track page load
eventBus.page.onLoad((payload) => {
  console.log(\`Page loading: \${payload.pageId}\`);
  // Show loading indicator
  eventBus.ui.emitLoaderShow();
});

// Track page ready
eventBus.page.onReady((payload) => {
  console.log(\`Page ready: \${payload.pageId}\`);
  // Hide loading indicator
  eventBus.ui.emitLoaderHide();

  // Track analytics
  analytics.page(payload.pageId, {
    mode: payload.mode
  });
});

// Track page destruction
eventBus.page.onDestroy((payload) => {
  console.log(\`Page destroyed: \${payload.pageId}\`);
  // Cleanup resources
  cleanup(payload.pageId);
});

// Handle page errors
eventBus.page.onError((payload) => {
  console.error(\`Page error: \${payload.pageId}\`, payload.error);
  // Show error notification
  eventBus.ui.emitNotify({
    message: "Failed to load page. Please refresh.",
    type: "error"
  });
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Page Mode Events</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>When Fired</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>page:modeChange</code></td>
              <td><code>{"{ pageId: string; previousMode: string; mode: string }"}</code></td>
              <td>Page mode changes (e.g., "view" → "edit")</td>
            </tr>
          </tbody>
        </table>

        <h3>Example: Mode Change Handling</h3>
        <pre className="docs-code">{`// Track mode changes
eventBus.page.onModeChange((payload) => {
  console.log(\`Mode changed from \${payload.previousMode} to \${payload.mode}\`);

  // Show different UI based on mode
  if (payload.mode === "edit") {
    showEditToolbar();
  } else if (payload.mode === "view") {
    hideEditToolbar();
  }

  // Track analytics
  analytics.track("page_mode_changed", {
    pageId: payload.pageId,
    from: payload.previousMode,
    to: payload.mode
  });
});

// Warn about unsaved changes when switching to view mode
eventBus.page.onModeChange((payload) => {
  if (payload.previousMode === "edit" && payload.mode === "view") {
    if (hasUnsavedChanges()) {
      eventBus.ui.emitNotify({
        message: "Exiting edit mode. Changes may be lost.",
        type: "warning"
      });
    }
  }
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Page Navigation Events</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Payload</th>
              <th>When Fired</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>page:beforeLeave</code></td>
              <td><code>{"{ pageId: string; targetPath: string }"}</code></td>
              <td>User is about to leave the page</td>
            </tr>
            <tr>
              <td><code>page:leave</code></td>
              <td><code>{"{ pageId: string }"}</code></td>
              <td>User has left the page</td>
            </tr>
          </tbody>
        </table>

        <h3>Example: Navigation Handling</h3>
        <pre className="docs-code">{`// Warn before leaving page
eventBus.page.onBeforeLeave((payload) => {
  console.log(\`Leaving \${payload.pageId} for \${payload.targetPath}\`);

  // Check for unsaved changes
  if (hasUnsavedChanges(payload.pageId)) {
    const confirmed = confirm(
      "You have unsaved changes. Do you want to leave?"
    );

    if (!confirmed) {
      // Block navigation
      eventBus.navigation.emitBlocked({
        from: payload.pageId,
        to: payload.targetPath,
        reason: "unsaved_changes"
      });
    }
  }
});

// Cleanup when page is left
eventBus.page.onLeave((payload) => {
  console.log(\`Left page: \${payload.pageId}\`);

  // Stop any running timers
  clearPageTimers(payload.pageId);

  // Save scroll position
  saveScrollPosition(payload.pageId);
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Common Patterns</h2>

        <h3>1. Page View Analytics</h3>
        <pre className="docs-code">{`// Track page views
eventBus.page.onReady((payload) => {
  analytics.page(payload.pageId, {
    mode: payload.mode,
    timestamp: new Date().toISOString()
  });
});

// Track time spent on page
const pageStartTimes = new Map<string, number>();

eventBus.page.onReady((payload) => {
  pageStartTimes.set(payload.pageId, Date.now());
});

eventBus.page.onLeave((payload) => {
  const startTime = pageStartTimes.get(payload.pageId);
  if (startTime) {
    const duration = Date.now() - startTime;
    analytics.track("page_time", {
      pageId: payload.pageId,
      duration: duration
    });
    pageStartTimes.delete(payload.pageId);
  }
});`}</pre>

        <h3>2. Loading State Management</h3>
        <pre className="docs-code">{`// Show/hide global loader
eventBus.page.onLoad((payload) => {
  eventBus.ui.emitLoaderShow();
});

eventBus.page.onReady((payload) => {
  eventBus.ui.emitLoaderHide();
});

eventBus.page.onError((payload) => {
  eventBus.ui.emitLoaderHide();
});`}</pre>

        <h3>3. Error Recovery</h3>
        <pre className="docs-code">{`// Handle page errors with retry
const retryCount = new Map<string, number>();

eventBus.page.onError((payload) => {
  const count = (retryCount.get(payload.pageId) || 0) + 1;
  retryCount.set(payload.pageId, count);

  if (count < 3) {
    // Retry loading page
    console.log(\`Retrying page load (\${count}/3)...\`);
    reloadPage(payload.pageId);
  } else {
    // Show error after 3 retries
    eventBus.ui.emitNotify({
      message: "Failed to load page after multiple attempts.",
      type: "error"
    });
    retryCount.delete(payload.pageId);
  }
});`}</pre>

        <h3>4. Breadcrumb Navigation</h3>
        <pre className="docs-code">{`const navigationHistory: string[] = [];

eventBus.page.onReady((payload) => {
  // Add to history
  navigationHistory.push(payload.pageId);

  // Update breadcrumbs UI
  updateBreadcrumbs(navigationHistory);
});

eventBus.page.onLeave((payload) => {
  // Remove from history when going back
  const index = navigationHistory.indexOf(payload.pageId);
  if (index > -1) {
    navigationHistory.splice(index, 1);
  }
});`}</pre>

        <h3>5. Conditional Page Initialization</h3>
        <pre className="docs-code">{`// Initialize features based on page
eventBus.page.onInit((payload) => {
  if (payload.pageId === "dashboard") {
    // Initialize real-time updates
    initRealtimeUpdates();
  } else if (payload.pageId === "reports") {
    // Preload chart library
    loadChartLibrary();
  }
});`}</pre>

        <h3>6. Mode-Specific Validations</h3>
        <pre className="docs-code">{`eventBus.page.onModeChange((payload) => {
  if (payload.mode === "edit") {
    // Enable field validations
    enableValidations(payload.pageId);
  } else if (payload.mode === "view") {
    // Disable validations to improve performance
    disableValidations(payload.pageId);
  }
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Page Modes</h2>
        <p>
          Lumino pages support different modes that affect their behavior:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Mode</th>
              <th>Description</th>
              <th>Common Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>view</code></td>
              <td>Read-only mode</td>
              <td>Displaying data, reports</td>
            </tr>
            <tr>
              <td><code>edit</code></td>
              <td>Edit mode with form fields</td>
              <td>Editing existing records</td>
            </tr>
            <tr>
              <td><code>create</code></td>
              <td>Create mode for new records</td>
              <td>Creating new records</td>
            </tr>
            <tr>
              <td><code>delete</code></td>
              <td>Delete confirmation mode</td>
              <td>Confirming deletion</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Use EventBus for cleaner code</strong> - <code>eventBus.page.onReady()</code> is more readable</li>
          <li><strong>Track analytics</strong> - Use page events for comprehensive analytics</li>
          <li><strong>Handle errors gracefully</strong> - Subscribe to <code>page:error</code> for recovery</li>
          <li><strong>Cleanup on leave</strong> - Stop timers, clear intervals, unsubscribe from external events</li>
          <li><strong>Check pageId</strong> - Filter events to only handle specific pages</li>
          <li><strong>Use beforeLeave for warnings</strong> - Warn users about unsaved changes</li>
          <li><strong>Avoid memory leaks</strong> - Always unsubscribe in React cleanup</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>React Hook Integration</h2>
        <pre className="docs-code">{`import { useEffect } from "react";
import { eventBus } from "lumino/core";

function MyPageComponent() {
  useEffect(() => {
    // Subscribe to page events
    const unsubscribe1 = eventBus.page.onReady((payload) => {
      console.log("Page ready:", payload);
    });

    const unsubscribe2 = eventBus.page.onModeChange((payload) => {
      console.log("Mode changed:", payload);
    });

    const unsubscribe3 = eventBus.page.onError((payload) => {
      console.error("Page error:", payload);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
    };
  }, []);

  return <div>My Page</div>;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>TypeScript Type Definitions</h2>
        <pre className="docs-code">{`export interface PageEvents {
  "page:init": {
    pageId: string;
    mode: string;
  };
  "page:load": {
    pageId: string;
    mode: string;
  };
  "page:ready": {
    pageId: string;
    mode: string;
  };
  "page:modeChange": {
    pageId: string;
    previousMode: string;
    mode: string;
  };
  "page:beforeLeave": {
    pageId: string;
    targetPath: string;
  };
  "page:leave": {
    pageId: string;
  };
  "page:destroy": {
    pageId: string;
  };
  "page:error": {
    pageId: string;
    error: any;
  };
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li><strong>Navigation Events</strong> - Learn about route navigation events</li>
          <li><strong>Form Events</strong> - Learn about form lifecycle events</li>
          <li><strong>API Events</strong> - Learn about API request events</li>
          <li><strong>Custom Events</strong> - Create your own domain-specific events</li>
        </ul>
      </div>
    </div>
  );
}
