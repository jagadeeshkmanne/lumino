/**
 * Lumino Framework - Event Emitter
 *
 * Type-safe event emitter for custom events, form events, page events,
 * and application-level events.
 */

// =============================================================================
// EVENT TYPES
// =============================================================================

export type EventCallback<T = any> = (payload: T) => void | Promise<void>;
export type EventUnsubscribe = () => void;

export interface EventSubscription {
  event: string;
  callback: EventCallback;
  once: boolean;
  priority: number;
}

// =============================================================================
// BUILT-IN EVENT DEFINITIONS
// =============================================================================

/**
 * Form Events
 */
export interface FormEvents {
  "form:init": { formId: string };
  "form:load": { formId: string; values: Record<string, any> };
  "form:ready": { formId: string; values: Record<string, any> };
  "form:change": { formId: string; field: string; value: any; previousValue: any };
  "form:submit": { formId: string; action: string; values: Record<string, any> };
  "form:submit:success": { formId: string; action: string; response: any };
  "form:submit:error": { formId: string; action: string; error: any };
  "form:validate": { formId: string; valid: boolean; errors: Record<string, string[]> };
  "form:reset": { formId: string };
  "form:dirty": { formId: string; dirty: boolean };
  "form:field:focus": { formId: string; field: string };
  "form:field:blur": { formId: string; field: string };
  "form:field:error": { formId: string; field: string; errors: string[] };
}

/**
 * Page Events
 */
export interface PageEvents {
  "page:init": { pageId: string; mode: string };
  "page:load": { pageId: string; mode: string };
  "page:ready": { pageId: string; mode: string };
  "page:modeChange": { pageId: string; previousMode: string; mode: string };
  "page:beforeLeave": { pageId: string; targetPath: string };
  "page:leave": { pageId: string };
  "page:destroy": { pageId: string };
  "page:error": { pageId: string; error: any };
}

/**
 * Navigation Events
 */
export interface NavigationEvents {
  "navigation:start": { from: string; to: string };
  "navigation:end": { from: string; to: string };
  "navigation:error": { path: string; error: any };
  "navigation:blocked": { from: string; to: string; reason: string };
}

/**
 * API Events
 */
export interface ApiEvents {
  "api:request:start": { apiId: string; url: string; method: string };
  "api:request:success": { apiId: string; url: string; response: any; duration: number };
  "api:request:error": { apiId: string; url: string; error: any; duration: number };
  "api:cache:hit": { apiId: string; key: string };
  "api:cache:miss": { apiId: string; key: string };
  "api:cache:clear": { apiId?: string; key?: string };
}

/**
 * Auth Events
 */
export interface AuthEvents {
  "auth:login": { userId: string | number };
  "auth:logout": {};
  "auth:token:refresh": {};
  "auth:token:expired": {};
  "auth:unauthorized": { path: string };
}

/**
 * App Events
 */
export interface AppEvents {
  "app:init": {};
  "app:ready": {};
  "app:error": { error: any };
  "app:config:change": { key: string; value: any };
  "app:locale:change": { locale: string; previousLocale: string };
}

/**
 * UI Events
 */
export interface UIEvents {
  "ui:modal:open": { modalId: string };
  "ui:modal:close": { modalId: string; result?: any };
  "ui:loader:show": {};
  "ui:loader:hide": {};
  "ui:notify": { message: string; type: string };
  "ui:confirm:open": { message: string };
  "ui:confirm:result": { confirmed: boolean };
}

/**
 * Lookup Events - for search dialog fields
 */
export interface LookupEvents {
  /** Lookup dialog opened */
  "lookup:open": { formId: string; field: string; config: any };
  /** Lookup search performed */
  "lookup:search": { formId: string; field: string; query: string };
  /** Lookup results received */
  "lookup:results": { formId: string; field: string; results: any[]; count: number };
  /** Item selected from lookup */
  "lookup:select": { formId: string; field: string; selected: any; displayValue: string };
  /** Multiple items selected */
  "lookup:selectMultiple": { formId: string; field: string; selected: any[]; displayValues: string[] };
  /** Lookup cleared */
  "lookup:clear": { formId: string; field: string };
  /** Lookup dialog closed */
  "lookup:close": { formId: string; field: string };
  /** Lookup error */
  "lookup:error": { formId: string; field: string; error: any };
}

/**
 * All built-in events combined
 */
export interface BuiltInEvents
  extends FormEvents,
    PageEvents,
    NavigationEvents,
    ApiEvents,
    AuthEvents,
    AppEvents,
    UIEvents,
    LookupEvents {}

/**
 * Custom event interface - extend this for type-safe custom events
 */
export interface CustomEvents {
  [key: string]: any;
}

/**
 * All events (built-in + custom)
 */
export type AllEvents = BuiltInEvents & CustomEvents;

// =============================================================================
// EVENT EMITTER CLASS
// =============================================================================

/**
 * Type-safe Event Emitter
 *
 * @example
 * ```typescript
 * // Using built-in events
 * eventEmitter.on("form:change", ({ formId, field, value }) => {
 *   console.log(`Field ${field} changed to ${value}`);
 * });
 *
 * // Using custom events with type safety
 * interface MyEvents {
 *   "user:selected": { userId: number };
 *   "order:placed": { orderId: string; total: number };
 * }
 *
 * const emitter = new EventEmitter<MyEvents>();
 * emitter.on("user:selected", ({ userId }) => {});
 * emitter.emit("order:placed", { orderId: "123", total: 99.99 });
 * ```
 */
export class EventEmitter<TEvents extends Record<string, any> = AllEvents> {
  private _subscriptions: Map<keyof TEvents, EventSubscription[]> = new Map();
  private _wildcardSubscriptions: EventSubscription[] = [];

  /**
   * Subscribe to an event
   */
  on<K extends keyof TEvents>(
    event: K,
    callback: EventCallback<TEvents[K]>,
    options?: { priority?: number }
  ): EventUnsubscribe {
    return this._subscribe(event, callback, false, options?.priority ?? 0);
  }

  /**
   * Subscribe to an event (fires once then unsubscribes)
   */
  once<K extends keyof TEvents>(
    event: K,
    callback: EventCallback<TEvents[K]>,
    options?: { priority?: number }
  ): EventUnsubscribe {
    return this._subscribe(event, callback, true, options?.priority ?? 0);
  }

  /**
   * Subscribe to all events (wildcard)
   */
  onAny(
    callback: EventCallback<{ event: string; payload: any }>,
    options?: { priority?: number }
  ): EventUnsubscribe {
    const subscription: EventSubscription = {
      event: "*",
      callback: callback as EventCallback,
      once: false,
      priority: options?.priority ?? 0,
    };

    this._wildcardSubscriptions.push(subscription);
    this._sortByPriority(this._wildcardSubscriptions);

    return () => {
      const index = this._wildcardSubscriptions.indexOf(subscription);
      if (index > -1) {
        this._wildcardSubscriptions.splice(index, 1);
      }
    };
  }

  /**
   * Unsubscribe from an event
   */
  off<K extends keyof TEvents>(event: K, callback?: EventCallback<TEvents[K]>): void {
    const subscriptions = this._subscriptions.get(event);
    if (!subscriptions) return;

    if (callback) {
      const index = subscriptions.findIndex((s) => s.callback === callback);
      if (index > -1) {
        subscriptions.splice(index, 1);
      }
    } else {
      // Remove all subscriptions for this event
      this._subscriptions.delete(event);
    }
  }

  /**
   * Emit an event
   */
  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    // Execute wildcard subscriptions first
    this._executeWildcardSubscriptions(event as string, payload);

    // Execute event-specific subscriptions
    const subscriptions = this._subscriptions.get(event);
    if (!subscriptions || subscriptions.length === 0) return;

    const toRemove: EventSubscription[] = [];

    for (const subscription of subscriptions) {
      try {
        subscription.callback(payload);
        if (subscription.once) {
          toRemove.push(subscription);
        }
      } catch (error) {
        console.error(`Error in event handler for "${String(event)}":`, error);
      }
    }

    // Remove one-time subscriptions
    for (const sub of toRemove) {
      const index = subscriptions.indexOf(sub);
      if (index > -1) {
        subscriptions.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event and wait for all async handlers
   */
  async emitAsync<K extends keyof TEvents>(event: K, payload: TEvents[K]): Promise<void> {
    // Execute wildcard subscriptions first
    await this._executeWildcardSubscriptionsAsync(event as string, payload);

    // Execute event-specific subscriptions
    const subscriptions = this._subscriptions.get(event);
    if (!subscriptions || subscriptions.length === 0) return;

    const toRemove: EventSubscription[] = [];

    for (const subscription of subscriptions) {
      try {
        await subscription.callback(payload);
        if (subscription.once) {
          toRemove.push(subscription);
        }
      } catch (error) {
        console.error(`Error in async event handler for "${String(event)}":`, error);
      }
    }

    // Remove one-time subscriptions
    for (const sub of toRemove) {
      const index = subscriptions.indexOf(sub);
      if (index > -1) {
        subscriptions.splice(index, 1);
      }
    }
  }

  /**
   * Check if there are any subscribers for an event
   */
  hasListeners<K extends keyof TEvents>(event: K): boolean {
    const subscriptions = this._subscriptions.get(event);
    return (subscriptions?.length ?? 0) > 0 || this._wildcardSubscriptions.length > 0;
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount<K extends keyof TEvents>(event: K): number {
    const subscriptions = this._subscriptions.get(event);
    return (subscriptions?.length ?? 0) + this._wildcardSubscriptions.length;
  }

  /**
   * Get all registered event names
   */
  eventNames(): Array<keyof TEvents> {
    return Array.from(this._subscriptions.keys());
  }

  /**
   * Remove all subscriptions
   */
  clear(): void {
    this._subscriptions.clear();
    this._wildcardSubscriptions = [];
  }

  /**
   * Remove all subscriptions for a specific event
   */
  clearEvent<K extends keyof TEvents>(event: K): void {
    this._subscriptions.delete(event);
  }

  // Private methods

  private _subscribe<K extends keyof TEvents>(
    event: K,
    callback: EventCallback<TEvents[K]>,
    once: boolean,
    priority: number
  ): EventUnsubscribe {
    const subscription: EventSubscription = {
      event: event as string,
      callback: callback as EventCallback,
      once,
      priority,
    };

    let subscriptions = this._subscriptions.get(event);
    if (!subscriptions) {
      subscriptions = [];
      this._subscriptions.set(event, subscriptions);
    }

    subscriptions.push(subscription);
    this._sortByPriority(subscriptions);

    return () => {
      const index = subscriptions!.indexOf(subscription);
      if (index > -1) {
        subscriptions!.splice(index, 1);
      }
    };
  }

  private _sortByPriority(subscriptions: EventSubscription[]): void {
    subscriptions.sort((a, b) => b.priority - a.priority);
  }

  private _executeWildcardSubscriptions(event: string, payload: any): void {
    for (const subscription of this._wildcardSubscriptions) {
      try {
        subscription.callback({ event, payload });
      } catch (error) {
        console.error(`Error in wildcard event handler:`, error);
      }
    }
  }

  private async _executeWildcardSubscriptionsAsync(event: string, payload: any): Promise<void> {
    for (const subscription of this._wildcardSubscriptions) {
      try {
        await subscription.callback({ event, payload });
      } catch (error) {
        console.error(`Error in async wildcard event handler:`, error);
      }
    }
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

/**
 * Global event emitter instance for application-wide events
 */
export const eventEmitter = new EventEmitter<AllEvents>();

// =============================================================================
// EVENT BUS (TYPED WRAPPER)
// =============================================================================

/**
 * EventBus provides a cleaner API for working with events
 * by grouping event operations by category.
 */
export class EventBus {
  private _emitter: EventEmitter<AllEvents>;

  constructor(emitter: EventEmitter<AllEvents> = eventEmitter) {
    this._emitter = emitter;
  }

  // Form Events
  get form() {
    return {
      onInit: (cb: EventCallback<FormEvents["form:init"]>) =>
        this._emitter.on("form:init", cb),
      onLoad: (cb: EventCallback<FormEvents["form:load"]>) =>
        this._emitter.on("form:load", cb),
      onReady: (cb: EventCallback<FormEvents["form:ready"]>) =>
        this._emitter.on("form:ready", cb),
      onChange: (cb: EventCallback<FormEvents["form:change"]>) =>
        this._emitter.on("form:change", cb),
      onSubmit: (cb: EventCallback<FormEvents["form:submit"]>) =>
        this._emitter.on("form:submit", cb),
      onSubmitSuccess: (cb: EventCallback<FormEvents["form:submit:success"]>) =>
        this._emitter.on("form:submit:success", cb),
      onSubmitError: (cb: EventCallback<FormEvents["form:submit:error"]>) =>
        this._emitter.on("form:submit:error", cb),
      onValidate: (cb: EventCallback<FormEvents["form:validate"]>) =>
        this._emitter.on("form:validate", cb),
      onReset: (cb: EventCallback<FormEvents["form:reset"]>) =>
        this._emitter.on("form:reset", cb),
      onDirty: (cb: EventCallback<FormEvents["form:dirty"]>) =>
        this._emitter.on("form:dirty", cb),

      emitInit: (payload: FormEvents["form:init"]) =>
        this._emitter.emit("form:init", payload),
      emitLoad: (payload: FormEvents["form:load"]) =>
        this._emitter.emit("form:load", payload),
      emitReady: (payload: FormEvents["form:ready"]) =>
        this._emitter.emit("form:ready", payload),
      emitChange: (payload: FormEvents["form:change"]) =>
        this._emitter.emit("form:change", payload),
      emitSubmit: (payload: FormEvents["form:submit"]) =>
        this._emitter.emit("form:submit", payload),
      emitSubmitSuccess: (payload: FormEvents["form:submit:success"]) =>
        this._emitter.emit("form:submit:success", payload),
      emitSubmitError: (payload: FormEvents["form:submit:error"]) =>
        this._emitter.emit("form:submit:error", payload),
      emitValidate: (payload: FormEvents["form:validate"]) =>
        this._emitter.emit("form:validate", payload),
      emitReset: (payload: FormEvents["form:reset"]) =>
        this._emitter.emit("form:reset", payload),
      emitDirty: (payload: FormEvents["form:dirty"]) =>
        this._emitter.emit("form:dirty", payload),
    };
  }

  // Page Events
  get page() {
    return {
      onInit: (cb: EventCallback<PageEvents["page:init"]>) =>
        this._emitter.on("page:init", cb),
      onLoad: (cb: EventCallback<PageEvents["page:load"]>) =>
        this._emitter.on("page:load", cb),
      onReady: (cb: EventCallback<PageEvents["page:ready"]>) =>
        this._emitter.on("page:ready", cb),
      onModeChange: (cb: EventCallback<PageEvents["page:modeChange"]>) =>
        this._emitter.on("page:modeChange", cb),
      onBeforeLeave: (cb: EventCallback<PageEvents["page:beforeLeave"]>) =>
        this._emitter.on("page:beforeLeave", cb),
      onLeave: (cb: EventCallback<PageEvents["page:leave"]>) =>
        this._emitter.on("page:leave", cb),
      onDestroy: (cb: EventCallback<PageEvents["page:destroy"]>) =>
        this._emitter.on("page:destroy", cb),
      onError: (cb: EventCallback<PageEvents["page:error"]>) =>
        this._emitter.on("page:error", cb),

      emitInit: (payload: PageEvents["page:init"]) =>
        this._emitter.emit("page:init", payload),
      emitLoad: (payload: PageEvents["page:load"]) =>
        this._emitter.emit("page:load", payload),
      emitReady: (payload: PageEvents["page:ready"]) =>
        this._emitter.emit("page:ready", payload),
      emitModeChange: (payload: PageEvents["page:modeChange"]) =>
        this._emitter.emit("page:modeChange", payload),
      emitBeforeLeave: (payload: PageEvents["page:beforeLeave"]) =>
        this._emitter.emit("page:beforeLeave", payload),
      emitLeave: (payload: PageEvents["page:leave"]) =>
        this._emitter.emit("page:leave", payload),
      emitDestroy: (payload: PageEvents["page:destroy"]) =>
        this._emitter.emit("page:destroy", payload),
      emitError: (payload: PageEvents["page:error"]) =>
        this._emitter.emit("page:error", payload),
    };
  }

  // Navigation Events
  get navigation() {
    return {
      onStart: (cb: EventCallback<NavigationEvents["navigation:start"]>) =>
        this._emitter.on("navigation:start", cb),
      onEnd: (cb: EventCallback<NavigationEvents["navigation:end"]>) =>
        this._emitter.on("navigation:end", cb),
      onError: (cb: EventCallback<NavigationEvents["navigation:error"]>) =>
        this._emitter.on("navigation:error", cb),
      onBlocked: (cb: EventCallback<NavigationEvents["navigation:blocked"]>) =>
        this._emitter.on("navigation:blocked", cb),

      emitStart: (payload: NavigationEvents["navigation:start"]) =>
        this._emitter.emit("navigation:start", payload),
      emitEnd: (payload: NavigationEvents["navigation:end"]) =>
        this._emitter.emit("navigation:end", payload),
      emitError: (payload: NavigationEvents["navigation:error"]) =>
        this._emitter.emit("navigation:error", payload),
      emitBlocked: (payload: NavigationEvents["navigation:blocked"]) =>
        this._emitter.emit("navigation:blocked", payload),
    };
  }

  // API Events
  get api() {
    return {
      onRequestStart: (cb: EventCallback<ApiEvents["api:request:start"]>) =>
        this._emitter.on("api:request:start", cb),
      onRequestSuccess: (cb: EventCallback<ApiEvents["api:request:success"]>) =>
        this._emitter.on("api:request:success", cb),
      onRequestError: (cb: EventCallback<ApiEvents["api:request:error"]>) =>
        this._emitter.on("api:request:error", cb),
      onCacheHit: (cb: EventCallback<ApiEvents["api:cache:hit"]>) =>
        this._emitter.on("api:cache:hit", cb),
      onCacheMiss: (cb: EventCallback<ApiEvents["api:cache:miss"]>) =>
        this._emitter.on("api:cache:miss", cb),
      onCacheClear: (cb: EventCallback<ApiEvents["api:cache:clear"]>) =>
        this._emitter.on("api:cache:clear", cb),

      emitRequestStart: (payload: ApiEvents["api:request:start"]) =>
        this._emitter.emit("api:request:start", payload),
      emitRequestSuccess: (payload: ApiEvents["api:request:success"]) =>
        this._emitter.emit("api:request:success", payload),
      emitRequestError: (payload: ApiEvents["api:request:error"]) =>
        this._emitter.emit("api:request:error", payload),
      emitCacheHit: (payload: ApiEvents["api:cache:hit"]) =>
        this._emitter.emit("api:cache:hit", payload),
      emitCacheMiss: (payload: ApiEvents["api:cache:miss"]) =>
        this._emitter.emit("api:cache:miss", payload),
      emitCacheClear: (payload: ApiEvents["api:cache:clear"]) =>
        this._emitter.emit("api:cache:clear", payload),
    };
  }

  // Auth Events
  get auth() {
    return {
      onLogin: (cb: EventCallback<AuthEvents["auth:login"]>) =>
        this._emitter.on("auth:login", cb),
      onLogout: (cb: EventCallback<AuthEvents["auth:logout"]>) =>
        this._emitter.on("auth:logout", cb),
      onTokenRefresh: (cb: EventCallback<AuthEvents["auth:token:refresh"]>) =>
        this._emitter.on("auth:token:refresh", cb),
      onTokenExpired: (cb: EventCallback<AuthEvents["auth:token:expired"]>) =>
        this._emitter.on("auth:token:expired", cb),
      onUnauthorized: (cb: EventCallback<AuthEvents["auth:unauthorized"]>) =>
        this._emitter.on("auth:unauthorized", cb),

      emitLogin: (payload: AuthEvents["auth:login"]) =>
        this._emitter.emit("auth:login", payload),
      emitLogout: () =>
        this._emitter.emit("auth:logout", {}),
      emitTokenRefresh: () =>
        this._emitter.emit("auth:token:refresh", {}),
      emitTokenExpired: () =>
        this._emitter.emit("auth:token:expired", {}),
      emitUnauthorized: (payload: AuthEvents["auth:unauthorized"]) =>
        this._emitter.emit("auth:unauthorized", payload),
    };
  }

  // App Events
  get app() {
    return {
      onInit: (cb: EventCallback<AppEvents["app:init"]>) =>
        this._emitter.on("app:init", cb),
      onReady: (cb: EventCallback<AppEvents["app:ready"]>) =>
        this._emitter.on("app:ready", cb),
      onError: (cb: EventCallback<AppEvents["app:error"]>) =>
        this._emitter.on("app:error", cb),
      onConfigChange: (cb: EventCallback<AppEvents["app:config:change"]>) =>
        this._emitter.on("app:config:change", cb),
      onLocaleChange: (cb: EventCallback<AppEvents["app:locale:change"]>) =>
        this._emitter.on("app:locale:change", cb),

      emitInit: () =>
        this._emitter.emit("app:init", {}),
      emitReady: () =>
        this._emitter.emit("app:ready", {}),
      emitError: (payload: AppEvents["app:error"]) =>
        this._emitter.emit("app:error", payload),
      emitConfigChange: (payload: AppEvents["app:config:change"]) =>
        this._emitter.emit("app:config:change", payload),
      emitLocaleChange: (payload: AppEvents["app:locale:change"]) =>
        this._emitter.emit("app:locale:change", payload),
    };
  }

  // UI Events
  get ui() {
    return {
      onModalOpen: (cb: EventCallback<UIEvents["ui:modal:open"]>) =>
        this._emitter.on("ui:modal:open", cb),
      onModalClose: (cb: EventCallback<UIEvents["ui:modal:close"]>) =>
        this._emitter.on("ui:modal:close", cb),
      onLoaderShow: (cb: EventCallback<UIEvents["ui:loader:show"]>) =>
        this._emitter.on("ui:loader:show", cb),
      onLoaderHide: (cb: EventCallback<UIEvents["ui:loader:hide"]>) =>
        this._emitter.on("ui:loader:hide", cb),
      onNotify: (cb: EventCallback<UIEvents["ui:notify"]>) =>
        this._emitter.on("ui:notify", cb),

      emitModalOpen: (payload: UIEvents["ui:modal:open"]) =>
        this._emitter.emit("ui:modal:open", payload),
      emitModalClose: (payload: UIEvents["ui:modal:close"]) =>
        this._emitter.emit("ui:modal:close", payload),
      emitLoaderShow: () =>
        this._emitter.emit("ui:loader:show", {}),
      emitLoaderHide: () =>
        this._emitter.emit("ui:loader:hide", {}),
      emitNotify: (payload: UIEvents["ui:notify"]) =>
        this._emitter.emit("ui:notify", payload),
    };
  }

  // Lookup Events
  get lookup() {
    return {
      onOpen: (cb: EventCallback<LookupEvents["lookup:open"]>) =>
        this._emitter.on("lookup:open", cb),
      onSearch: (cb: EventCallback<LookupEvents["lookup:search"]>) =>
        this._emitter.on("lookup:search", cb),
      onResults: (cb: EventCallback<LookupEvents["lookup:results"]>) =>
        this._emitter.on("lookup:results", cb),
      onSelect: (cb: EventCallback<LookupEvents["lookup:select"]>) =>
        this._emitter.on("lookup:select", cb),
      onSelectMultiple: (cb: EventCallback<LookupEvents["lookup:selectMultiple"]>) =>
        this._emitter.on("lookup:selectMultiple", cb),
      onClear: (cb: EventCallback<LookupEvents["lookup:clear"]>) =>
        this._emitter.on("lookup:clear", cb),
      onClose: (cb: EventCallback<LookupEvents["lookup:close"]>) =>
        this._emitter.on("lookup:close", cb),
      onError: (cb: EventCallback<LookupEvents["lookup:error"]>) =>
        this._emitter.on("lookup:error", cb),

      emitOpen: (payload: LookupEvents["lookup:open"]) =>
        this._emitter.emit("lookup:open", payload),
      emitSearch: (payload: LookupEvents["lookup:search"]) =>
        this._emitter.emit("lookup:search", payload),
      emitResults: (payload: LookupEvents["lookup:results"]) =>
        this._emitter.emit("lookup:results", payload),
      emitSelect: (payload: LookupEvents["lookup:select"]) =>
        this._emitter.emit("lookup:select", payload),
      emitSelectMultiple: (payload: LookupEvents["lookup:selectMultiple"]) =>
        this._emitter.emit("lookup:selectMultiple", payload),
      emitClear: (payload: LookupEvents["lookup:clear"]) =>
        this._emitter.emit("lookup:clear", payload),
      emitClose: (payload: LookupEvents["lookup:close"]) =>
        this._emitter.emit("lookup:close", payload),
      emitError: (payload: LookupEvents["lookup:error"]) =>
        this._emitter.emit("lookup:error", payload),
    };
  }

  // Custom event access
  custom<T = any>(event: string) {
    return {
      on: (cb: EventCallback<T>) => this._emitter.on(event as any, cb),
      once: (cb: EventCallback<T>) => this._emitter.once(event as any, cb),
      emit: (payload: T) => this._emitter.emit(event as any, payload),
      off: (cb?: EventCallback<T>) => this._emitter.off(event as any, cb),
    };
  }
}

/**
 * Global event bus instance
 */
export const eventBus = new EventBus();
