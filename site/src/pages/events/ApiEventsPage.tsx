/**
 * API Events Documentation
 */

import React from "react";

export function ApiEventsPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">API Events</h1>
      <p className="docs-page-subtitle">
        Events emitted during API requests, responses, and caching operations.
      </p>

      <div className="docs-section">
        <h2>Overview</h2>
        <p>
          API events are emitted automatically by Lumino during API operations.
          These events allow you to track API requests, monitor performance,
          implement logging, handle errors globally, and manage caching behavior.
        </p>
        <pre className="docs-code">{`import { eventEmitter, eventBus } from "lumino/core";

// Method 1: Direct event subscription
eventEmitter.on("api:request:success", (payload) => {
  console.log("API request successful:", payload);
});

// Method 2: Using EventBus (recommended)
eventBus.api.onRequestSuccess((payload) => {
  console.log("API request successful:", payload);
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Request Events</h2>
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
              <td><code>api:request:start</code></td>
              <td><code>{"{ apiId: string; url: string; method: string }"}</code></td>
              <td>API request starts</td>
            </tr>
            <tr>
              <td><code>api:request:success</code></td>
              <td><code>{"{ apiId: string; url: string; response: any; duration: number }"}</code></td>
              <td>API request succeeds</td>
            </tr>
            <tr>
              <td><code>api:request:error</code></td>
              <td><code>{"{ apiId: string; url: string; error: any; duration: number }"}</code></td>
              <td>API request fails</td>
            </tr>
          </tbody>
        </table>

        <h3>Example: Request Tracking</h3>
        <pre className="docs-code">{`// Track all API requests
eventBus.api.onRequestStart((payload) => {
  console.log(\`API Request: \${payload.method} \${payload.url}\`);
  console.log(\`API ID: \${payload.apiId}\`);
});

// Track successful requests
eventBus.api.onRequestSuccess((payload) => {
  console.log(\`API Success: \${payload.url}\`);
  console.log(\`Duration: \${payload.duration}ms\`);
  console.log("Response:", payload.response);

  // Track performance
  if (payload.duration > 1000) {
    console.warn(\`Slow API request: \${payload.url} (\${payload.duration}ms)\`);
  }
});

// Handle API errors
eventBus.api.onRequestError((payload) => {
  console.error(\`API Error: \${payload.url}\`, payload.error);
  console.log(\`Duration: \${payload.duration}ms\`);

  // Show error notification
  eventBus.ui.emitNotify({
    message: "Failed to load data. Please try again.",
    type: "error"
  });
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Cache Events</h2>
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
              <td><code>api:cache:hit</code></td>
              <td><code>{"{ apiId: string; key: string }"}</code></td>
              <td>Cached response is returned (no network request)</td>
            </tr>
            <tr>
              <td><code>api:cache:miss</code></td>
              <td><code>{"{ apiId: string; key: string }"}</code></td>
              <td>No cached response available (network request made)</td>
            </tr>
            <tr>
              <td><code>api:cache:clear</code></td>
              <td><code>{"{ apiId?: string; key?: string }"}</code></td>
              <td>Cache is cleared (all or specific)</td>
            </tr>
          </tbody>
        </table>

        <h3>Example: Cache Tracking</h3>
        <pre className="docs-code">{`// Track cache hits
eventBus.api.onCacheHit((payload) => {
  console.log(\`Cache hit for \${payload.apiId}: \${payload.key}\`);

  // Track cache performance
  analytics.track("api_cache_hit", {
    apiId: payload.apiId,
    key: payload.key
  });
});

// Track cache misses
eventBus.api.onCacheMiss((payload) => {
  console.log(\`Cache miss for \${payload.apiId}: \${payload.key}\`);

  analytics.track("api_cache_miss", {
    apiId: payload.apiId,
    key: payload.key
  });
});

// Track cache clearing
eventBus.api.onCacheClear((payload) => {
  if (payload.apiId && payload.key) {
    console.log(\`Cache cleared: \${payload.apiId} - \${payload.key}\`);
  } else if (payload.apiId) {
    console.log(\`All cache cleared for: \${payload.apiId}\`);
  } else {
    console.log("All API cache cleared");
  }
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Common Patterns</h2>

        <h3>1. Global API Logging</h3>
        <pre className="docs-code">{`// Log all API activity
eventBus.api.onRequestStart((payload) => {
  logger.info(\`[\${payload.method}] \${payload.url}\`, {
    apiId: payload.apiId
  });
});

eventBus.api.onRequestSuccess((payload) => {
  logger.info(\`[SUCCESS] \${payload.url}\`, {
    duration: payload.duration,
    status: payload.response?.status
  });
});

eventBus.api.onRequestError((payload) => {
  logger.error(\`[ERROR] \${payload.url}\`, {
    duration: payload.duration,
    error: payload.error
  });
});`}</pre>

        <h3>2. Performance Monitoring</h3>
        <pre className="docs-code">{`// Track API performance metrics
const performanceMetrics = new Map<string, number[]>();

eventBus.api.onRequestSuccess((payload) => {
  const key = \`\${payload.method} \${payload.url}\`;
  const durations = performanceMetrics.get(key) || [];
  durations.push(payload.duration);
  performanceMetrics.set(key, durations);

  // Calculate average
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;

  // Alert on slow requests
  if (payload.duration > avg * 2) {
    console.warn(\`Slow API request detected: \${key}\`, {
      current: payload.duration,
      average: avg
    });
  }
});

// Generate performance report
function getPerformanceReport() {
  const report: any[] = [];

  performanceMetrics.forEach((durations, key) => {
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const max = Math.max(...durations);
    const min = Math.min(...durations);

    report.push({ key, avg, max, min, count: durations.length });
  });

  return report.sort((a, b) => b.avg - a.avg);
}`}</pre>

        <h3>3. Error Rate Tracking</h3>
        <pre className="docs-code">{`// Track error rates per API
const apiStats = new Map<string, { success: number; error: number }>();

eventBus.api.onRequestSuccess((payload) => {
  const stats = apiStats.get(payload.apiId) || { success: 0, error: 0 };
  stats.success++;
  apiStats.set(payload.apiId, stats);
});

eventBus.api.onRequestError((payload) => {
  const stats = apiStats.get(payload.apiId) || { success: 0, error: 0 };
  stats.error++;
  apiStats.set(payload.apiId, stats);

  // Alert if error rate exceeds threshold
  const total = stats.success + stats.error;
  const errorRate = stats.error / total;

  if (errorRate > 0.1) { // 10% error rate
    console.error(\`High error rate for \${payload.apiId}: \${(errorRate * 100).toFixed(1)}%\`);

    // Send alert to monitoring service
    monitoringService.alert({
      type: "high_error_rate",
      apiId: payload.apiId,
      errorRate: errorRate
    });
  }
});`}</pre>

        <h3>4. Request Queue Visualization</h3>
        <pre className="docs-code">{`// Track active requests
const activeRequests = new Set<string>();

eventBus.api.onRequestStart((payload) => {
  const key = \`\${payload.apiId}:\${payload.url}\`;
  activeRequests.add(key);

  // Update UI
  updateLoadingIndicator(activeRequests.size);
});

eventBus.api.onRequestSuccess((payload) => {
  const key = \`\${payload.apiId}:\${payload.url}\`;
  activeRequests.delete(key);
  updateLoadingIndicator(activeRequests.size);
});

eventBus.api.onRequestError((payload) => {
  const key = \`\${payload.apiId}:\${payload.url}\`;
  activeRequests.delete(key);
  updateLoadingIndicator(activeRequests.size);
});`}</pre>

        <h3>5. Retry Logic with Exponential Backoff</h3>
        <pre className="docs-code">{`const retryAttempts = new Map<string, number>();

eventBus.api.onRequestError((payload) => {
  // Only retry on network errors
  if (payload.error.message.includes("Network")) {
    const key = \`\${payload.apiId}:\${payload.url}\`;
    const attempts = (retryAttempts.get(key) || 0) + 1;

    if (attempts <= 3) {
      retryAttempts.set(key, attempts);

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempts - 1) * 1000;

      console.log(\`Retrying \${key} in \${delay}ms (attempt \${attempts}/3)\`);

      setTimeout(() => {
        // Retry the request
        retryRequest(payload.apiId, payload.url);
      }, delay);
    } else {
      retryAttempts.delete(key);
      console.error(\`Max retries exceeded for \${key}\`);
    }
  }
});

// Clear retry count on success
eventBus.api.onRequestSuccess((payload) => {
  const key = \`\${payload.apiId}:\${payload.url}\`;
  retryAttempts.delete(key);
});`}</pre>

        <h3>6. Cache Statistics</h3>
        <pre className="docs-code">{`// Track cache performance
const cacheStats = {
  hits: 0,
  misses: 0,
  hitRate: 0
};

eventBus.api.onCacheHit(() => {
  cacheStats.hits++;
  updateHitRate();
});

eventBus.api.onCacheMiss(() => {
  cacheStats.misses++;
  updateHitRate();
});

function updateHitRate() {
  const total = cacheStats.hits + cacheStats.misses;
  cacheStats.hitRate = total > 0 ? cacheStats.hits / total : 0;

  console.log(\`Cache hit rate: \${(cacheStats.hitRate * 100).toFixed(1)}%\`);
}

// Display cache stats
function getCacheStats() {
  return {
    ...cacheStats,
    hitRatePercentage: \`\${(cacheStats.hitRate * 100).toFixed(1)}%\`
  };
}`}</pre>

        <h3>7. Request Deduplication</h3>
        <pre className="docs-code">{`// Prevent duplicate simultaneous requests
const pendingRequests = new Map<string, Promise<any>>();

eventBus.api.onRequestStart((payload) => {
  const key = \`\${payload.method}:\${payload.url}\`;

  if (pendingRequests.has(key)) {
    console.log(\`Duplicate request detected: \${key}\`);
    // You could cancel or deduplicate here
  } else {
    // Track as pending
    const promise = new Promise((resolve, reject) => {
      // Store resolve/reject for later
    });
    pendingRequests.set(key, promise);
  }
});

eventBus.api.onRequestSuccess((payload) => {
  const key = \`\${payload.method}:\${payload.url}\`;
  pendingRequests.delete(key);
});

eventBus.api.onRequestError((payload) => {
  const key = \`\${payload.method}:\${payload.url}\`;
  pendingRequests.delete(key);
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Use EventBus for cleaner code</strong> - <code>eventBus.api.onRequestSuccess()</code> is more readable</li>
          <li><strong>Monitor performance</strong> - Track request durations and alert on slow requests</li>
          <li><strong>Track cache effectiveness</strong> - Use cache events to optimize caching strategy</li>
          <li><strong>Implement retry logic</strong> - Use exponential backoff for transient errors</li>
          <li><strong>Log for debugging</strong> - High-priority logging helps debug issues in production</li>
          <li><strong>Deduplicate requests</strong> - Prevent multiple identical simultaneous requests</li>
          <li><strong>Handle errors globally</strong> - Use <code>api:request:error</code> for centralized error handling</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>React Hook Integration</h2>
        <pre className="docs-code">{`import { useEffect, useState } from "react";
import { eventBus } from "lumino/core";

function ApiMonitor() {
  const [activeRequests, setActiveRequests] = useState(0);

  useEffect(() => {
    let count = 0;

    const unsubscribe1 = eventBus.api.onRequestStart(() => {
      count++;
      setActiveRequests(count);
    });

    const unsubscribe2 = eventBus.api.onRequestSuccess(() => {
      count--;
      setActiveRequests(count);
    });

    const unsubscribe3 = eventBus.api.onRequestError(() => {
      count--;
      setActiveRequests(count);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
      unsubscribe3();
    };
  }, []);

  return (
    <div>
      Active API Requests: {activeRequests}
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>TypeScript Type Definitions</h2>
        <pre className="docs-code">{`export interface ApiEvents {
  "api:request:start": {
    apiId: string;
    url: string;
    method: string;
  };
  "api:request:success": {
    apiId: string;
    url: string;
    response: any;
    duration: number;
  };
  "api:request:error": {
    apiId: string;
    url: string;
    error: any;
    duration: number;
  };
  "api:cache:hit": {
    apiId: string;
    key: string;
  };
  "api:cache:miss": {
    apiId: string;
    key: string;
  };
  "api:cache:clear": {
    apiId?: string;
    key?: string;
  };
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li><strong>App Events</strong> - Learn about application-level events</li>
          <li><strong>Form Events</strong> - Learn about form lifecycle events</li>
          <li><strong>Custom Events</strong> - Create your own domain-specific events</li>
          <li><strong>EventEmitter</strong> - Deep dive into the EventEmitter class</li>
        </ul>
      </div>
    </div>
  );
}
