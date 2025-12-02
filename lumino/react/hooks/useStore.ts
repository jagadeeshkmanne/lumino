/**
 * Lumino Framework - Store Hooks
 *
 * React hooks for subscribing to state stores.
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  stateManager,
  EntityStore,
  CollectionStore,
  StateSelector,
} from "../../core/state/StateManager";
import type { EntityState, AppState } from "../../core/state/StateManager";
import { eventEmitter } from "../../core/events/EventEmitter";

// =============================================================================
// USE ENTITY
// =============================================================================

export interface UseEntityOptions<T> {
  /** Store name */
  name: string;
  /** Initial data */
  initialData?: T;
}

export interface UseEntityReturn<T> {
  /** Entity data */
  data: T | null;
  /** Loading state */
  loading: boolean;
  /** Error */
  error: any | null;
  /** Set entity data */
  setData: (data: T) => void;
  /** Set loading */
  setLoading: (loading: boolean) => void;
  /** Set error */
  setError: (error: any) => void;
  /** Clear entity */
  clear: () => void;
  /** Full state */
  state: EntityState<T>;
}

/**
 * Hook for managing single entity state
 *
 * @example
 * ```typescript
 * const { data: user, loading, setData } = useEntity<User>({ name: "currentUser" });
 *
 * // Load user
 * const response = await api.get();
 * setData(response);
 * ```
 */
export function useEntity<T = any>(options: UseEntityOptions<T>): UseEntityReturn<T> {
  const { name, initialData } = options;

  // Get or create store
  const store = useMemo(() => {
    const existingStore = stateManager.getEntityStore<T>(name);
    if (existingStore) return existingStore;
    const newStore = stateManager.createEntityStore<T>(name);
    if (initialData) {
      newStore.setData(initialData);
    }
    return newStore;
  }, [name]);

  // State
  const [state, setState] = useState<EntityState<T>>(store.getState());

  // Subscribe to changes
  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setState(newState);
    });

    return unsubscribe;
  }, [store]);

  // Operations
  const setData = useCallback(
    (data: T) => {
      store.setData(data);
    },
    [store]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      store.setLoading(loading);
    },
    [store]
  );

  const setError = useCallback(
    (error: any) => {
      store.setError(error);
    },
    [store]
  );

  const clear = useCallback(() => {
    store.clear();
  }, [store]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    setData,
    setLoading,
    setError,
    clear,
    state,
  };
}

// =============================================================================
// USE COLLECTION
// =============================================================================

export interface UseCollectionOptions<T, TId extends string | number = string> {
  /** Store name */
  name: string;
  /** ID field */
  idField?: keyof T;
  /** Initial items */
  initialItems?: T[];
}

export interface UseCollectionReturn<T, TId extends string | number = string> {
  /** All items */
  items: T[];
  /** Loading state */
  loading: boolean;
  /** Error */
  error: any | null;
  /** Item count */
  count: number;
  /** Get item by ID */
  getById: (id: TId) => T | undefined;
  /** Set all items */
  setAll: (items: T[]) => void;
  /** Add or update item */
  upsert: (item: T) => void;
  /** Add or update multiple items */
  upsertMany: (items: T[]) => void;
  /** Remove item by ID */
  remove: (id: TId) => void;
  /** Remove multiple items */
  removeMany: (ids: TId[]) => void;
  /** Set loading */
  setLoading: (loading: boolean) => void;
  /** Set error */
  setError: (error: any) => void;
  /** Clear all items */
  clear: () => void;
}

/**
 * Hook for managing collection state
 *
 * @example
 * ```typescript
 * const { items: users, loading, setAll, upsert, remove } = useCollection<User, number>({
 *   name: "users",
 *   idField: "id",
 * });
 *
 * // Load users
 * const response = await api.list();
 * setAll(response.content);
 *
 * // Update user
 * upsert(updatedUser);
 *
 * // Remove user
 * remove(userId);
 * ```
 */
export function useCollection<T = any, TId extends string | number = string>(
  options: UseCollectionOptions<T, TId>
): UseCollectionReturn<T, TId> {
  const { name, idField = "id" as keyof T, initialItems } = options;

  // Get or create store
  const store = useMemo(() => {
    const existingStore = stateManager.getCollectionStore<T, TId>(name);
    if (existingStore) return existingStore;
    const newStore = stateManager.createCollectionStore<T, TId>(name, idField);
    if (initialItems) {
      newStore.setAll(initialItems);
    }
    return newStore;
  }, [name, idField]);

  // State
  const [items, setItems] = useState<T[]>(store.getAll());
  const [loading, setLoadingState] = useState(store.loading);
  const [error, setErrorState] = useState(store.error);

  // Subscribe to changes
  useEffect(() => {
    const unsubscribe = store.subscribe((newItems) => {
      setItems(newItems);
      setLoadingState(store.loading);
      setErrorState(store.error);
    });

    return unsubscribe;
  }, [store]);

  // Operations
  const getById = useCallback(
    (id: TId): T | undefined => {
      return store.getById(id);
    },
    [store]
  );

  const setAll = useCallback(
    (newItems: T[]) => {
      store.setAll(newItems);
    },
    [store]
  );

  const upsert = useCallback(
    (item: T) => {
      store.upsert(item);
    },
    [store]
  );

  const upsertMany = useCallback(
    (newItems: T[]) => {
      store.upsertMany(newItems);
    },
    [store]
  );

  const remove = useCallback(
    (id: TId) => {
      store.remove(id);
    },
    [store]
  );

  const removeMany = useCallback(
    (ids: TId[]) => {
      store.removeMany(ids);
    },
    [store]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      store.setLoading(loading);
    },
    [store]
  );

  const setError = useCallback(
    (err: any) => {
      store.setError(err);
    },
    [store]
  );

  const clear = useCallback(() => {
    store.clear();
  }, [store]);

  return {
    items,
    loading,
    error,
    count: items.length,
    getById,
    setAll,
    upsert,
    upsertMany,
    remove,
    removeMany,
    setLoading,
    setError,
    clear,
  };
}

// =============================================================================
// USE STATE SELECTOR
// =============================================================================

/**
 * Hook for selecting a slice of app state
 *
 * @example
 * ```typescript
 * const loading = useStateSelector((state) => state.loading.global);
 * const locale = useStateSelector((state) => state.locale);
 * ```
 */
export function useStateSelector<R>(selector: StateSelector<AppState, R>): R {
  const [value, setValue] = useState<R>(() => selector(stateManager.getState()));

  useEffect(() => {
    const unsubscribe = stateManager.subscribe((state) => {
      const newValue = selector(state);
      setValue(newValue);
    });

    return unsubscribe;
  }, [selector]);

  return value;
}

// =============================================================================
// USE LOADING
// =============================================================================

/**
 * Hook for global loading state
 */
export function useLoading(): boolean {
  return useStateSelector((state) => state.loading.global);
}

/**
 * Hook for API loading state
 */
export function useApiLoading(apiId: string): boolean {
  return useStateSelector((state) => state.loading.apis[apiId] || false);
}

/**
 * Hook for form loading state
 */
export function useFormLoading(formId: string): boolean {
  return useStateSelector((state) => state.loading.forms[formId] || false);
}

/**
 * Hook for subscribing to form data changes.
 * Provides real-time form data that updates as fields change.
 * Uses framework events (form:load, form:change, form:reset) for updates.
 *
 * @param formId - Optional form ID to filter events. If not provided, listens to all forms.
 * @returns Current form data as a Record
 *
 * @example
 * ```tsx
 * function FormDataDisplay() {
 *   const formData = useFormData("employee-form");
 *   return <pre>{JSON.stringify(formData, null, 2)}</pre>;
 * }
 * ```
 */
export function useFormData<T = Record<string, unknown>>(formId?: string): T {
  const [formData, setFormData] = useState<T>({} as T);

  useEffect(() => {
    // Subscribe to form:ready to get initial data
    // form:ready fires after a microtask, ensuring all components are mounted
    const unsubscribeReady = eventEmitter.on("form:ready", (payload) => {
      if (!formId || payload.formId === formId) {
        setFormData(payload.values as T);
      }
    });

    // Subscribe to form:change for incremental updates
    const unsubscribeChange = eventEmitter.on("form:change", (payload) => {
      if (!formId || payload.formId === formId) {
        setFormData((prev) => ({
          ...prev,
          [payload.field]: payload.value,
        }));
      }
    });

    // Subscribe to form:reset to clear data
    const unsubscribeReset = eventEmitter.on("form:reset", (payload) => {
      if (!formId || payload.formId === formId) {
        setFormData({} as T);
      }
    });

    return () => {
      unsubscribeReady();
      unsubscribeChange();
      unsubscribeReset();
    };
  }, [formId]);

  return formData;
}

/**
 * Hook for page loading state
 */
export function usePageLoading(pageId: string): boolean {
  return useStateSelector((state) => state.loading.pages[pageId] || false);
}

// =============================================================================
// USE LOCALE
// =============================================================================

/**
 * Hook for locale state
 */
export function useLocale(): [string, (locale: string) => void] {
  const locale = useStateSelector((state) => state.locale);

  const setLocale = useCallback((newLocale: string) => {
    stateManager.setLocale(newLocale);
  }, []);

  return [locale, setLocale];
}

// =============================================================================
// USE THEME
// =============================================================================

/**
 * Hook for theme state
 */
export function useTheme(): [string, (theme: string) => void] {
  const theme = useStateSelector((state) => state.theme);

  const setTheme = useCallback((newTheme: string) => {
    stateManager.setTheme(newTheme);
  }, []);

  return [theme, setTheme];
}

// =============================================================================
// USE USER
// =============================================================================

/**
 * Hook for user state
 */
export function useUser<T = any>(): [T | null, (user: T | null) => void] {
  const user = useStateSelector((state) => state.user as T | null);

  const setUser = useCallback((newUser: T | null) => {
    if (newUser) {
      stateManager.setUser(newUser);
    } else {
      stateManager.clearUser();
    }
  }, []);

  return [user, setUser];
}

// =============================================================================
// USE META
// =============================================================================

/**
 * Hook for meta state
 */
export function useMeta<T = any>(key: string): [T | undefined, (value: T) => void] {
  const value = useStateSelector((state) => state.meta[key] as T | undefined);

  const setValue = useCallback(
    (newValue: T) => {
      stateManager.setMeta(key, newValue);
    },
    [key]
  );

  return [value, setValue];
}
