/**
 * Custom Events Documentation
 */

import React from "react";

export function CustomEventsPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Custom Events</h1>
      <p className="docs-page-subtitle">
        Create your own type-safe domain-specific events for your application.
      </p>

      <div className="docs-section">
        <h2>Overview</h2>
        <p>
          While Lumino provides many built-in events, you can also create custom events
          for your application's domain logic. Custom events maintain type safety and
          integrate seamlessly with the event system.
        </p>
        <pre className="docs-code">{`import { EventEmitter, eventEmitter } from "lumino/core";

// Define custom events
interface MyCustomEvents {
  "user:selected": { userId: number; name: string };
  "order:placed": { orderId: string; total: number };
  "cart:updated": { items: number; total: number };
}

// Create typed emitter
const customEmitter = new EventEmitter<MyCustomEvents>();

// Subscribe with full type safety
customEmitter.on("user:selected", (payload) => {
  // payload is typed as { userId: number; name: string }
  console.log(\`User \${payload.name} selected\`);
});

// Emit with type checking
customEmitter.emit("user:selected", {
  userId: 123,
  name: "John Doe"
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Defining Custom Events</h2>
        <p>
          Define your custom events using TypeScript interfaces:
        </p>
        <pre className="docs-code">{`// Define event payloads
interface MyEvents {
  // User events
  "user:created": {
    userId: number;
    email: string;
    name: string;
  };
  "user:updated": {
    userId: number;
    changes: Record<string, any>;
  };
  "user:deleted": {
    userId: number;
  };

  // Order events
  "order:created": {
    orderId: string;
    userId: number;
    items: Array<{ productId: string; quantity: number }>;
    total: number;
  };
  "order:shipped": {
    orderId: string;
    trackingNumber: string;
  };
  "order:delivered": {
    orderId: string;
    deliveredAt: Date;
  };

  // Notification events
  "notification:show": {
    message: string;
    type: "info" | "success" | "warning" | "error";
    duration?: number;
  };
  "notification:dismissed": {
    notificationId: string;
  };
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Using Custom Events</h2>

        <h3>Option 1: Separate EventEmitter Instance</h3>
        <p>Create a dedicated emitter for your custom events:</p>
        <pre className="docs-code">{`// events.ts
import { EventEmitter } from "lumino/core";

interface MyEvents {
  "user:selected": { userId: number };
  "order:placed": { orderId: string };
}

export const myEmitter = new EventEmitter<MyEvents>();

// usage.ts
import { myEmitter } from "./events";

myEmitter.on("user:selected", (payload) => {
  console.log("User selected:", payload.userId);
});

myEmitter.emit("user:selected", { userId: 123 });`}</pre>

        <h3>Option 2: Global EventEmitter with Custom Events</h3>
        <p>Use the global eventEmitter for custom events:</p>
        <pre className="docs-code">{`import { eventEmitter } from "lumino/core";

// No type safety for custom events on global emitter
eventEmitter.on("myapp:user:selected" as any, (payload: any) => {
  console.log("User selected:", payload.userId);
});

eventEmitter.emit("myapp:user:selected" as any, { userId: 123 });`}</pre>

        <h3>Option 3: Extend Built-in Events</h3>
        <p>Extend the built-in event types:</p>
        <pre className="docs-code">{`// types.ts
import { BuiltInEvents } from "lumino/core";

interface MyCustomEvents {
  "myapp:user:selected": { userId: number };
  "myapp:order:placed": { orderId: string };
}

// Combine with built-in events
export type AllMyEvents = BuiltInEvents & MyCustomEvents;

// Create typed emitter
import { EventEmitter } from "lumino/core";
export const appEmitter = new EventEmitter<AllMyEvents>();

// usage.ts
import { appEmitter } from "./types";

// Use both built-in and custom events
appEmitter.on("form:submit", (payload) => { ... });
appEmitter.on("myapp:user:selected", (payload) => { ... });`}</pre>
      </div>

      <div className="docs-section">
        <h2>Event Naming Conventions</h2>
        <p>
          Follow these conventions for consistent event naming:
        </p>
        <pre className="docs-code">{`// Pattern: "domain:action:result"

// Good examples:
"user:login:success"
"user:login:failure"
"order:create:start"
"order:create:complete"
"payment:process:pending"
"payment:process:approved"

// Namespace your custom events:
"myapp:feature:action"
"acme:customer:created"
"shop:cart:updated"

// Avoid:
"userLogin"           // Use colons
"login-success"       // Use colons, not dashes
"USER_CREATED"        // Use lowercase`}</pre>
      </div>

      <div className="docs-section">
        <h2>Real-World Examples</h2>

        <h3>1. E-commerce Events</h3>
        <pre className="docs-code">{`// Define e-commerce events
interface ShopEvents {
  "cart:item:added": {
    productId: string;
    quantity: number;
    price: number;
  };
  "cart:item:removed": {
    productId: string;
  };
  "cart:cleared": {};
  "checkout:started": {
    cartTotal: number;
    itemCount: number;
  };
  "checkout:completed": {
    orderId: string;
    total: number;
    paymentMethod: string;
  };
  "product:viewed": {
    productId: string;
    category: string;
  };
  "product:favorited": {
    productId: string;
    userId: number;
  };
}

const shopEmitter = new EventEmitter<ShopEvents>();

// Usage
shopEmitter.on("cart:item:added", (payload) => {
  // Update cart UI
  updateCartBadge();

  // Track analytics
  analytics.track("cart_item_added", {
    productId: payload.productId,
    quantity: payload.quantity
  });

  // Show notification
  showNotification(\`Added to cart: $\{payload.quantity}x\`);
});

shopEmitter.on("checkout:completed", (payload) => {
  // Clear cart
  clearCart();

  // Track conversion
  analytics.track("purchase", {
    orderId: payload.orderId,
    revenue: payload.total
  });

  // Redirect to confirmation page
  navigate(\`/orders/\${payload.orderId}\`);
});`}</pre>

        <h3>2. Chat Application Events</h3>
        <pre className="docs-code">{`interface ChatEvents {
  "message:received": {
    messageId: string;
    fromUserId: number;
    text: string;
    timestamp: Date;
  };
  "message:sent": {
    messageId: string;
    toUserId: number;
    text: string;
  };
  "message:typing": {
    userId: number;
    isTyping: boolean;
  };
  "conversation:opened": {
    conversationId: string;
    participants: number[];
  };
  "conversation:closed": {
    conversationId: string;
  };
  "user:online": {
    userId: number;
  };
  "user:offline": {
    userId: number;
  };
}

const chatEmitter = new EventEmitter<ChatEvents>();

// Usage
chatEmitter.on("message:received", (payload) => {
  // Add message to UI
  addMessageToConversation(payload);

  // Show notification if window is not focused
  if (!document.hasFocus()) {
    showDesktopNotification(\`New message from \${payload.fromUserId}\`);
  }

  // Play sound
  playMessageSound();
});

chatEmitter.on("message:typing", (payload) => {
  if (payload.isTyping) {
    showTypingIndicator(payload.userId);
  } else {
    hideTypingIndicator(payload.userId);
  }
});`}</pre>

        <h3>3. Game Events</h3>
        <pre className="docs-code">{`interface GameEvents {
  "game:started": {
    gameId: string;
    players: string[];
  };
  "game:ended": {
    gameId: string;
    winner: string;
    score: number;
  };
  "player:moved": {
    playerId: string;
    position: { x: number; y: number };
  };
  "player:scored": {
    playerId: string;
    points: number;
  };
  "powerup:collected": {
    playerId: string;
    powerupType: string;
  };
  "achievement:unlocked": {
    playerId: string;
    achievementId: string;
  };
}

const gameEmitter = new EventEmitter<GameEvents>();

// Usage
gameEmitter.on("player:scored", (payload) => {
  // Update score display
  updateScore(payload.playerId, payload.points);

  // Show animation
  showScoreAnimation(payload.points);

  // Play sound
  playScoreSound();
});

gameEmitter.on("achievement:unlocked", (payload) => {
  // Show achievement notification
  showAchievementToast(payload.achievementId);

  // Save to backend
  saveAchievement(payload.playerId, payload.achievementId);
});`}</pre>

        <h3>4. Document Editor Events</h3>
        <pre className="docs-code">{`interface EditorEvents {
  "document:opened": {
    documentId: string;
    title: string;
  };
  "document:saved": {
    documentId: string;
    version: number;
  };
  "document:shared": {
    documentId: string;
    sharedWith: string[];
  };
  "selection:changed": {
    documentId: string;
    selection: { start: number; end: number };
  };
  "comment:added": {
    documentId: string;
    commentId: string;
    text: string;
    position: number;
  };
  "collaboration:user:joined": {
    documentId: string;
    userId: string;
  };
}

const editorEmitter = new EventEmitter<EditorEvents>();

// Usage
editorEmitter.on("document:saved", (payload) => {
  // Update last saved timestamp
  updateLastSaved(new Date());

  // Clear dirty flag
  clearDirtyFlag();

  // Show saved indicator
  showSavedIndicator();
});

editorEmitter.on("collaboration:user:joined", (payload) => {
  // Show user avatar
  addCollaboratorAvatar(payload.userId);

  // Notify
  showToast(\`\${payload.userId} joined the document\`);
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>Advanced Patterns</h2>

        <h3>1. Event Aggregator</h3>
        <pre className="docs-code">{`// Aggregate multiple events into one
class EventAggregator<T extends Record<string, any>> {
  private emitter = new EventEmitter<T>();
  private buffer: Array<{ event: keyof T; payload: any }> = [];
  private timeout: NodeJS.Timeout | null = null;

  emit<K extends keyof T>(event: K, payload: T[K]) {
    this.buffer.push({ event, payload });

    if (this.timeout) clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.flush();
    }, 100); // 100ms debounce
  }

  private flush() {
    if (this.buffer.length === 0) return;

    // Emit aggregated event
    this.emitter.emit("batch:processed" as any, {
      events: [...this.buffer],
      count: this.buffer.length
    });

    this.buffer = [];
  }
}

// Usage
const aggregator = new EventAggregator<MyEvents>();
aggregator.emit("user:selected", { userId: 1 });
aggregator.emit("user:selected", { userId: 2 });
aggregator.emit("user:selected", { userId: 3 });
// After 100ms, emits one "batch:processed" event with all 3 events`}</pre>

        <h3>2. Event Middleware</h3>
        <pre className="docs-code">{`// Add middleware to process events
class EventMiddleware<T extends Record<string, any>> {
  private emitter = new EventEmitter<T>();
  private middlewares: Array<(event: string, payload: any) => boolean> = [];

  use(middleware: (event: string, payload: any) => boolean) {
    this.middlewares.push(middleware);
  }

  emit<K extends keyof T>(event: K, payload: T[K]) {
    // Run through middleware
    for (const middleware of this.middlewares) {
      if (!middleware(event as string, payload)) {
        return; // Middleware blocked the event
      }
    }

    // Emit if all middleware passed
    this.emitter.emit(event, payload);
  }
}

// Usage
const middlewareEmitter = new EventMiddleware<MyEvents>();

// Add logging middleware
middlewareEmitter.use((event, payload) => {
  console.log(\`Event: \${event}\`, payload);
  return true; // Continue
});

// Add validation middleware
middlewareEmitter.use((event, payload) => {
  if (event === "user:created" && !payload.email) {
    console.error("Email is required");
    return false; // Block event
  }
  return true;
});`}</pre>

        <h3>3. Event Replay</h3>
        <pre className="docs-code">{`// Record and replay events
class EventRecorder<T extends Record<string, any>> {
  private emitter = new EventEmitter<T>();
  private history: Array<{ event: keyof T; payload: any; timestamp: number }> = [];

  emit<K extends keyof T>(event: K, payload: T[K]) {
    // Record event
    this.history.push({
      event,
      payload,
      timestamp: Date.now()
    });

    // Emit normally
    this.emitter.emit(event, payload);
  }

  replay(fromTimestamp?: number) {
    const events = fromTimestamp
      ? this.history.filter(e => e.timestamp >= fromTimestamp)
      : this.history;

    events.forEach(({ event, payload }) => {
      this.emitter.emit(event, payload);
    });
  }

  getHistory() {
    return [...this.history];
  }

  clear() {
    this.history = [];
  }
}

// Usage
const recorder = new EventRecorder<MyEvents>();
recorder.emit("user:selected", { userId: 1 });
recorder.emit("user:selected", { userId: 2 });

// Later, replay all events
recorder.replay();`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li><strong>Define event interfaces</strong> - Always use TypeScript interfaces for type safety</li>
          <li><strong>Use namespaces</strong> - Prefix events with your app name to avoid conflicts</li>
          <li><strong>Follow naming conventions</strong> - Use <code>domain:action:result</code> pattern</li>
          <li><strong>Document events</strong> - Add JSDoc comments to event interfaces</li>
          <li><strong>Keep payloads simple</strong> - Use plain objects, avoid circular references</li>
          <li><strong>Version events</strong> - Consider versioning if events evolve over time</li>
          <li><strong>Test events</strong> - Write unit tests for event emission and handling</li>
          <li><strong>Avoid excessive events</strong> - Don't emit events for every small change</li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Testing Custom Events</h2>
        <pre className="docs-code">{`import { EventEmitter } from "lumino/core";

describe("Custom Events", () => {
  let emitter: EventEmitter<MyEvents>;

  beforeEach(() => {
    emitter = new EventEmitter<MyEvents>();
  });

  it("should emit and receive user:selected event", () => {
    const handler = jest.fn();
    emitter.on("user:selected", handler);

    emitter.emit("user:selected", { userId: 123 });

    expect(handler).toHaveBeenCalledWith({ userId: 123 });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should support multiple listeners", () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    emitter.on("user:selected", handler1);
    emitter.on("user:selected", handler2);

    emitter.emit("user:selected", { userId: 123 });

    expect(handler1).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });

  it("should unsubscribe correctly", () => {
    const handler = jest.fn();
    const unsubscribe = emitter.on("user:selected", handler);

    unsubscribe();
    emitter.emit("user:selected", { userId: 123 });

    expect(handler).not.toHaveBeenCalled();
  });
});`}</pre>
      </div>

      <div className="docs-section">
        <h2>React Integration</h2>
        <pre className="docs-code">{`import { useEffect } from "react";

// Custom hook for event subscription
function useEvent<T extends Record<string, any>, K extends keyof T>(
  emitter: EventEmitter<T>,
  event: K,
  handler: (payload: T[K]) => void
) {
  useEffect(() => {
    const unsubscribe = emitter.on(event, handler);
    return unsubscribe;
  }, [emitter, event, handler]);
}

// Usage in component
function UserSelector() {
  useEvent(myEmitter, "user:selected", (payload) => {
    console.log("User selected:", payload.userId);
  });

  return <div>User Selector</div>;
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li><strong>EventEmitter</strong> - Deep dive into the EventEmitter class</li>
          <li><strong>Form Events</strong> - Learn about built-in form events</li>
          <li><strong>API Events</strong> - Learn about built-in API events</li>
          <li><strong>Best Practices</strong> - Event system best practices and patterns</li>
        </ul>
      </div>
    </div>
  );
}
