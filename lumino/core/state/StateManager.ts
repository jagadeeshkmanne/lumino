/**
 * Lumino Framework - State Manager
 *
 * Central state management for entities, loading states, and application state.
 * UI-independent - can be used with any UI library.
 */

import { eventEmitter } from "../events/EventEmitter";

// =============================================================================
// STATE TYPES
// =============================================================================

export type StateSubscriber<T> = (state: T, prevState: T) => void;
export type StateSelector<T, R> = (state: T) => R;
export type StateUnsubscribe = () => void;

export interface EntityState<T = any> {
  data: T | null;
  loading: boolean;
  error: any | null;
  lastUpdated: number | null;
}

export interface LoadingState {
  global: boolean;
  apis: Record<string, boolean>;
  forms: Record<string, boolean>;
  pages: Record<string, boolean>;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
}

// =============================================================================
// STORE CLASS
// =============================================================================

/**
 * Simple reactive store
 */
export class Store<T extends Record<string, any>> {
  private _state: T;
  private _subscribers: Set<StateSubscriber<T>> = new Set();
  private _selectorSubscribers: Map<
    StateSelector<T, any>,
    Set<StateSubscriber<any>>
  > = new Map();

  constructor(initialState: T) {
    this._state = initialState;
  }

  /**
   * Get current state
   */
  getState(): T {
    return this._state;
  }

  /**
   * Get a slice of state using a selector
   */
  select<R>(selector: StateSelector<T, R>): R {
    return selector(this._state);
  }

  /**
   * Update state
   */
  setState(partial: Partial<T> | ((state: T) => Partial<T>)): void {
    const prevState = this._state;
    const updates = typeof partial === "function" ? partial(prevState) : partial;

    this._state = { ...prevState, ...updates };

    // Notify all subscribers
    this._notifySubscribers(prevState);
  }

  /**
   * Subscribe to all state changes
   */
  subscribe(subscriber: StateSubscriber<T>): StateUnsubscribe {
    this._subscribers.add(subscriber);
    return () => {
      this._subscribers.delete(subscriber);
    };
  }

  /**
   * Subscribe to a specific slice of state
   */
  subscribeToSelector<R>(
    selector: StateSelector<T, R>,
    subscriber: StateSubscriber<R>
  ): StateUnsubscribe {
    let subscribers = this._selectorSubscribers.get(selector);
    if (!subscribers) {
      subscribers = new Set();
      this._selectorSubscribers.set(selector, subscribers);
    }
    subscribers.add(subscriber);

    return () => {
      subscribers!.delete(subscriber);
      if (subscribers!.size === 0) {
        this._selectorSubscribers.delete(selector);
      }
    };
  }

  /**
   * Reset to initial state
   */
  reset(initialState: T): void {
    const prevState = this._state;
    this._state = initialState;
    this._notifySubscribers(prevState);
  }

  private _notifySubscribers(prevState: T): void {
    // Notify general subscribers
    for (const subscriber of this._subscribers) {
      try {
        subscriber(this._state, prevState);
      } catch (error) {
        console.error("Error in state subscriber:", error);
      }
    }

    // Notify selector subscribers
    for (const [selector, subscribers] of this._selectorSubscribers) {
      const prevValue = selector(prevState);
      const newValue = selector(this._state);

      // Only notify if value changed (shallow comparison)
      if (prevValue !== newValue) {
        for (const subscriber of subscribers) {
          try {
            subscriber(newValue, prevValue);
          } catch (error) {
            console.error("Error in selector subscriber:", error);
          }
        }
      }
    }
  }
}

// =============================================================================
// ENTITY STORE
// =============================================================================

/**
 * Store for managing entity state (single entity)
 */
export class EntityStore<T = any> {
  private _store: Store<EntityState<T>>;

  constructor() {
    this._store = new Store<EntityState<T>>({
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    });
  }

  /**
   * Get current entity data
   */
  get data(): T | null {
    return this._store.getState().data;
  }

  /**
   * Get loading state
   */
  get loading(): boolean {
    return this._store.getState().loading;
  }

  /**
   * Get error
   */
  get error(): any | null {
    return this._store.getState().error;
  }

  /**
   * Get full state
   */
  getState(): EntityState<T> {
    return this._store.getState();
  }

  /**
   * Set entity data
   */
  setData(data: T): void {
    this._store.setState({
      data,
      loading: false,
      error: null,
      lastUpdated: Date.now(),
    });
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this._store.setState({ loading });
  }

  /**
   * Set error
   */
  setError(error: any): void {
    this._store.setState({
      loading: false,
      error,
    });
  }

  /**
   * Clear entity
   */
  clear(): void {
    this._store.setState({
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    });
  }

  /**
   * Subscribe to changes
   */
  subscribe(subscriber: StateSubscriber<EntityState<T>>): StateUnsubscribe {
    return this._store.subscribe(subscriber);
  }

  /**
   * Subscribe to data changes only
   */
  subscribeToData(subscriber: StateSubscriber<T | null>): StateUnsubscribe {
    return this._store.subscribeToSelector(
      (state) => state.data,
      subscriber
    );
  }
}

// =============================================================================
// COLLECTION STORE
// =============================================================================

/**
 * Store for managing a collection of entities
 */
export class CollectionStore<T = any, TId extends string | number = string> {
  private _store: Store<{
    items: Record<TId, T>;
    ids: TId[];
    loading: boolean;
    error: any | null;
    lastUpdated: number | null;
  }>;
  private _idField: keyof T;

  constructor(idField: keyof T = "id" as keyof T) {
    this._idField = idField;
    this._store = new Store({
      items: {} as Record<TId, T>,
      ids: [] as TId[],
      loading: false,
      error: null,
      lastUpdated: null,
    });
  }

  /**
   * Get all items as array
   */
  getAll(): T[] {
    const state = this._store.getState();
    return state.ids.map((id) => state.items[id]);
  }

  /**
   * Get item by ID
   */
  getById(id: TId): T | undefined {
    return this._store.getState().items[id];
  }

  /**
   * Get all IDs
   */
  getIds(): TId[] {
    return this._store.getState().ids;
  }

  /**
   * Get count
   */
  get count(): number {
    return this._store.getState().ids.length;
  }

  /**
   * Get loading state
   */
  get loading(): boolean {
    return this._store.getState().loading;
  }

  /**
   * Get error
   */
  get error(): any | null {
    return this._store.getState().error;
  }

  /**
   * Set all items
   */
  setAll(items: T[]): void {
    const itemsRecord = {} as Record<TId, T>;
    const ids: TId[] = [];

    for (const item of items) {
      const id = item[this._idField] as unknown as TId;
      itemsRecord[id] = item;
      ids.push(id);
    }

    this._store.setState({
      items: itemsRecord,
      ids,
      loading: false,
      error: null,
      lastUpdated: Date.now(),
    });
  }

  /**
   * Add or update an item
   */
  upsert(item: T): void {
    const id = item[this._idField] as unknown as TId;
    const state = this._store.getState();
    const isNew = !state.items[id];

    this._store.setState({
      items: { ...state.items, [id]: item },
      ids: isNew ? [...state.ids, id] : state.ids,
      lastUpdated: Date.now(),
    });
  }

  /**
   * Add or update multiple items
   */
  upsertMany(items: T[]): void {
    const state = this._store.getState();
    const newItems = { ...state.items };
    const newIds = [...state.ids];

    for (const item of items) {
      const id = item[this._idField] as unknown as TId;
      if (!newItems[id]) {
        newIds.push(id);
      }
      newItems[id] = item;
    }

    this._store.setState({
      items: newItems,
      ids: newIds,
      lastUpdated: Date.now(),
    });
  }

  /**
   * Remove an item by ID
   */
  remove(id: TId): void {
    const state = this._store.getState();
    const newItems = { ...state.items };
    delete newItems[id];

    this._store.setState({
      items: newItems,
      ids: state.ids.filter((i) => i !== id),
      lastUpdated: Date.now(),
    });
  }

  /**
   * Remove multiple items
   */
  removeMany(ids: TId[]): void {
    const state = this._store.getState();
    const newItems = { ...state.items };
    const idsToRemove = new Set(ids);

    for (const id of ids) {
      delete newItems[id];
    }

    this._store.setState({
      items: newItems,
      ids: state.ids.filter((id) => !idsToRemove.has(id)),
      lastUpdated: Date.now(),
    });
  }

  /**
   * Set loading state
   */
  setLoading(loading: boolean): void {
    this._store.setState({ loading });
  }

  /**
   * Set error
   */
  setError(error: any): void {
    this._store.setState({ loading: false, error });
  }

  /**
   * Clear all items
   */
  clear(): void {
    this._store.setState({
      items: {} as Record<TId, T>,
      ids: [],
      loading: false,
      error: null,
      lastUpdated: null,
    });
  }

  /**
   * Subscribe to changes
   */
  subscribe(subscriber: StateSubscriber<T[]>): StateUnsubscribe {
    return this._store.subscribe((state, prevState) => {
      subscriber(
        state.ids.map((id) => state.items[id]),
        prevState.ids.map((id) => prevState.items[id])
      );
    });
  }
}

// =============================================================================
// STATE MANAGER
// =============================================================================

export interface AppState {
  loading: LoadingState;
  locale: string;
  theme: string;
  user: any | null;
  meta: Record<string, any>;
}

/**
 * Central State Manager
 *
 * @example
 * ```typescript
 * // Subscribe to loading state
 * stateManager.onLoadingChange((loading) => {
 *   console.log("Global loading:", loading.global);
 * });
 *
 * // Set global loading
 * stateManager.setGlobalLoading(true);
 *
 * // Create entity store
 * const userStore = stateManager.createEntityStore<User>("currentUser");
 * userStore.setData(user);
 *
 * // Create collection store
 * const usersStore = stateManager.createCollectionStore<User, number>("users", "id");
 * usersStore.setAll(users);
 * ```
 */
export class StateManager {
  private _store: Store<AppState>;
  private _entityStores: Map<string, EntityStore<any>> = new Map();
  private _collectionStores: Map<string, CollectionStore<any, any>> = new Map();
  private _cache: Map<string, CacheEntry> = new Map();

  constructor(initialState?: Partial<AppState>) {
    this._store = new Store<AppState>({
      loading: {
        global: false,
        apis: {},
        forms: {},
        pages: {},
      },
      locale: "en",
      theme: "light",
      user: null,
      meta: {},
      ...initialState,
    });
  }

  // =============================================================================
  // LOADING STATE
  // =============================================================================

  /**
   * Get global loading state
   */
  isLoading(): boolean {
    return this._store.getState().loading.global;
  }

  /**
   * Set global loading state
   */
  setGlobalLoading(loading: boolean): void {
    this._store.setState((state) => ({
      loading: { ...state.loading, global: loading },
    }));

    if (loading) {
      eventEmitter.emit("ui:loader:show", {});
    } else {
      eventEmitter.emit("ui:loader:hide", {});
    }
  }

  /**
   * Set API loading state
   */
  setApiLoading(apiId: string, loading: boolean): void {
    this._store.setState((state) => ({
      loading: {
        ...state.loading,
        apis: { ...state.loading.apis, [apiId]: loading },
      },
    }));
  }

  /**
   * Check if API is loading
   */
  isApiLoading(apiId: string): boolean {
    return this._store.getState().loading.apis[apiId] || false;
  }

  /**
   * Set form loading state
   */
  setFormLoading(formId: string, loading: boolean): void {
    this._store.setState((state) => ({
      loading: {
        ...state.loading,
        forms: { ...state.loading.forms, [formId]: loading },
      },
    }));
  }

  /**
   * Check if form is loading
   */
  isFormLoading(formId: string): boolean {
    return this._store.getState().loading.forms[formId] || false;
  }

  /**
   * Set page loading state
   */
  setPageLoading(pageId: string, loading: boolean): void {
    this._store.setState((state) => ({
      loading: {
        ...state.loading,
        pages: { ...state.loading.pages, [pageId]: loading },
      },
    }));
  }

  /**
   * Check if page is loading
   */
  isPageLoading(pageId: string): boolean {
    return this._store.getState().loading.pages[pageId] || false;
  }

  /**
   * Subscribe to loading changes
   */
  onLoadingChange(subscriber: StateSubscriber<LoadingState>): StateUnsubscribe {
    return this._store.subscribeToSelector(
      (state) => state.loading,
      subscriber
    );
  }

  // =============================================================================
  // LOCALE & THEME
  // =============================================================================

  /**
   * Get current locale
   */
  getLocale(): string {
    return this._store.getState().locale;
  }

  /**
   * Set locale
   */
  setLocale(locale: string): void {
    const prevLocale = this._store.getState().locale;
    this._store.setState({ locale });
    eventEmitter.emit("app:locale:change", {
      locale,
      previousLocale: prevLocale,
    });
  }

  /**
   * Get current theme
   */
  getTheme(): string {
    return this._store.getState().theme;
  }

  /**
   * Set theme
   */
  setTheme(theme: string): void {
    this._store.setState({ theme });
  }

  // =============================================================================
  // USER STATE
  // =============================================================================

  /**
   * Get current user
   */
  getUser<T = any>(): T | null {
    return this._store.getState().user;
  }

  /**
   * Set current user
   */
  setUser(user: any): void {
    this._store.setState({ user });
  }

  /**
   * Clear user
   */
  clearUser(): void {
    this._store.setState({ user: null });
  }

  // =============================================================================
  // META STATE
  // =============================================================================

  /**
   * Get meta value
   */
  getMeta<T>(key: string): T | undefined {
    return this._store.getState().meta[key];
  }

  /**
   * Set meta value
   */
  setMeta(key: string, value: any): void {
    this._store.setState((state) => ({
      meta: { ...state.meta, [key]: value },
    }));
  }

  /**
   * Clear meta
   */
  clearMeta(): void {
    this._store.setState({ meta: {} });
  }

  // =============================================================================
  // ENTITY STORES
  // =============================================================================

  /**
   * Create or get an entity store
   */
  createEntityStore<T>(name: string): EntityStore<T> {
    let store = this._entityStores.get(name) as EntityStore<T>;
    if (!store) {
      store = new EntityStore<T>();
      this._entityStores.set(name, store);
    }
    return store;
  }

  /**
   * Get an entity store
   */
  getEntityStore<T>(name: string): EntityStore<T> | undefined {
    return this._entityStores.get(name) as EntityStore<T>;
  }

  /**
   * Remove an entity store
   */
  removeEntityStore(name: string): void {
    this._entityStores.delete(name);
  }

  // =============================================================================
  // COLLECTION STORES
  // =============================================================================

  /**
   * Create or get a collection store
   */
  createCollectionStore<T, TId extends string | number = string>(
    name: string,
    idField: keyof T = "id" as keyof T
  ): CollectionStore<T, TId> {
    let store = this._collectionStores.get(name) as CollectionStore<T, TId>;
    if (!store) {
      store = new CollectionStore<T, TId>(idField);
      this._collectionStores.set(name, store);
    }
    return store;
  }

  /**
   * Get a collection store
   */
  getCollectionStore<T, TId extends string | number = string>(
    name: string
  ): CollectionStore<T, TId> | undefined {
    return this._collectionStores.get(name) as CollectionStore<T, TId>;
  }

  /**
   * Remove a collection store
   */
  removeCollectionStore(name: string): void {
    this._collectionStores.delete(name);
  }

  // =============================================================================
  // CACHE
  // =============================================================================

  /**
   * Get cached value
   */
  getCached<T>(key: string): T | null {
    const entry = this._cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this._cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cached value
   */
  setCached<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this._cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear cache entry
   */
  clearCached(key: string): void {
    this._cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this._cache.clear();
  }

  // =============================================================================
  // SUBSCRIPTIONS
  // =============================================================================

  /**
   * Subscribe to all state changes
   */
  subscribe(subscriber: StateSubscriber<AppState>): StateUnsubscribe {
    return this._store.subscribe(subscriber);
  }

  /**
   * Get full state
   */
  getState(): AppState {
    return this._store.getState();
  }

  // =============================================================================
  // RESET
  // =============================================================================

  /**
   * Reset all state
   */
  reset(): void {
    this._store.reset({
      loading: {
        global: false,
        apis: {},
        forms: {},
        pages: {},
      },
      locale: "en",
      theme: "light",
      user: null,
      meta: {},
    });
    this._entityStores.clear();
    this._collectionStores.clear();
    this._cache.clear();
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

/**
 * Global state manager instance
 */
export const stateManager = new StateManager();
