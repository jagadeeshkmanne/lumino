/**
 * Lumino Framework - usePage Hook
 *
 * React hook for binding Page class to React state.
 * Handles page mode, entity loading, and lifecycle.
 */

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import type { PageContext } from "../../core/types/context";
import type { PageState } from "../../core/types/page";
import type { Page } from "../../core/page/Page";
import type { Form } from "../../core/form/Form";
import { createPageState } from "../../core/page/Page";
import { eventEmitter } from "../../core/events/EventEmitter";
import { useAppContext } from "../context/LuminoProvider";
import { useForm, UseFormReturn } from "./useForm";

// =============================================================================
// TYPES
// =============================================================================

export interface UsePageOptions {
  routeParams?: Record<string, string>;
  queryParams?: Record<string, string>;
}

export interface UsePageReturn<TEntity = any> {
  // State
  mode: string;
  entity: TEntity | null;
  loading: boolean;
  error: any | null;
  meta: Record<string, any>;

  // Operations
  setMode: (mode: string) => void;
  setEntity: (entity: TEntity) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: any) => void;
  setMeta: (key: string, value: any) => void;
  getMeta: <T>(key: string) => T | undefined;

  // Form access
  getForm: <T = any>(formId: string) => UseFormReturn<T> | undefined;
  forms: Map<string, UseFormReturn<any>>;

  // Dirty check
  isDirty: () => boolean;

  // Page context
  pageContext: PageContext;

  // Page config
  pageConfig: ReturnType<Page<TEntity>["build"]>;

  // Lifecycle
  refresh: () => Promise<void>;
}

// =============================================================================
// HOOK
// =============================================================================

export function usePage<TEntity = any>(
  page: Page<TEntity>,
  options: UsePageOptions = {}
): UsePageReturn<TEntity> {
  const appContext = useAppContext();
  const pageId = page.id;

  const { routeParams = {}, queryParams = {} } = options;

  // State
  const [state, setState] = useState<PageState>(() => createPageState());
  const [initialized, setInitialized] = useState(false);

  // Refs
  const stateRef = useRef(state);
  stateRef.current = state;

  // Page config
  const pageConfig = useMemo(() => page.build(), [page]);

  // =============================================================================
  // PAGE CONTEXT
  // =============================================================================

  const pageContext = useMemo<PageContext>(() => {
    return {
      ...appContext,
      mode: state.mode, // Use state.mode directly so it updates when mode changes
      routeParams,
      queryParams,

      // Entity
      getEntity: <T,>(): T => stateRef.current.entity as T,
      setEntity: (data: any) => {
        setState((prev) => ({ ...prev, entity: data }));
      },

      // Mode - allow components to change mode programmatically
      setMode: (newMode: string) => {
        const previousMode = stateRef.current.mode;
        setState((prev) => ({ ...prev, mode: newMode }));

        eventEmitter.emit("page:modeChange", {
          pageId,
          previousMode,
          mode: newMode,
        });

        // Execute mode handler for the new mode
        const modeHandler = page.getModeHandler(newMode);
        if (modeHandler) {
          // Create a context with the new mode for the handler
          const handlerContext = {
            ...appContext,
            mode: newMode,
            routeParams,
            queryParams,
            getEntity: <T,>(): T => stateRef.current.entity as T,
            setEntity: (data: any) => {
              setState((prev) => ({ ...prev, entity: data }));
            },
          } as PageContext;
          Promise.resolve(modeHandler(handlerContext)).catch((error) => {
            console.error("Mode handler error:", error);
          });
        }
      },

      // Dirty check
      isDirty: (): boolean => {
        // Check all forms for dirty state
        for (const form of page.getForms().values()) {
          // This would need to be connected to form state
          // For now, return false
        }
        return false;
      },

      // Form access
      getForm: (_formId: string) => {
        // This will be populated by the forms Map
        return null as any;
      },
    };
  }, [appContext, routeParams, queryParams, page, pageId, state.mode]); // Added state.mode to dependencies

  // =============================================================================
  // FORMS
  // =============================================================================

  // Initialize forms from page
  const forms = useMemo(() => {
    const formsMap = new Map<string, UseFormReturn<any>>();
    // Note: Forms will be initialized by FormRenderer components
    // This Map is for programmatic access
    return formsMap;
  }, [page]);

  // =============================================================================
  // OPERATIONS
  // =============================================================================

  const setMode = useCallback((mode: string) => {
    const previousMode = stateRef.current.mode;
    setState((prev) => ({ ...prev, mode }));

    eventEmitter.emit("page:modeChange", {
      pageId,
      previousMode,
      mode,
    });
  }, [pageId]);

  const setEntity = useCallback((entity: TEntity) => {
    setState((prev) => ({ ...prev, entity }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: any) => {
    setState((prev) => ({ ...prev, error, loading: false }));
    if (error) {
      eventEmitter.emit("page:error", { pageId, error });
    }
  }, [pageId]);

  const setMeta = useCallback((key: string, value: any) => {
    setState((prev) => ({
      ...prev,
      meta: { ...prev.meta, [key]: value },
    }));
  }, []);

  const getMeta = useCallback(<T,>(key: string): T | undefined => {
    return stateRef.current.meta[key] as T;
  }, []);

  const getForm = useCallback(<T = any,>(formId: string): UseFormReturn<T> | undefined => {
    return forms.get(formId) as UseFormReturn<T> | undefined;
  }, [forms]);

  const isDirty = useCallback((): boolean => {
    for (const form of forms.values()) {
      if (form.dirty) {
        return true;
      }
    }
    return false;
  }, [forms]);

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  const initializePage = useCallback(async () => {
    setLoading(true);

    try {
      // Determine mode
      const mode = page.determineMode(pageContext);
      setMode(mode);

      eventEmitter.emit("page:init", { pageId, mode });

      // Call page onInit
      if (page.onInit) {
        await page.onInit(pageContext);
      }

      // Execute mode handler
      const modeHandler = page.getModeHandler(mode);
      if (modeHandler) {
        await modeHandler(pageContext);
      }

      // Call page onLoad
      if (page.onLoad) {
        page.onLoad(pageContext);
      }

      eventEmitter.emit("page:load", { pageId, mode });

      setInitialized(true);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [page, pageId, pageContext, setLoading, setMode, setError]);

  const refresh = useCallback(async () => {
    await initializePage();
  }, [initializePage]);

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  // Initialize on mount
  useEffect(() => {
    initializePage();

    // Cleanup
    return () => {
      eventEmitter.emit("page:destroy", { pageId });

      if (page.onDestroy) {
        page.onDestroy(pageContext);
      }
    };
  }, []);

  // Handle route param changes
  useEffect(() => {
    if (initialized) {
      // Re-determine mode on route param change
      const newMode = page.determineMode(pageContext);
      if (newMode !== state.mode) {
        setMode(newMode);

        // Execute new mode handler
        const modeHandler = page.getModeHandler(newMode);
        if (modeHandler) {
          setLoading(true);
          // Wrap in Promise.resolve to handle both void and Promise returns
          Promise.resolve(modeHandler(pageContext))
            .then(() => setLoading(false))
            .catch((error) => setError(error));
        }
      }
    }
  }, [routeParams, queryParams]);

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    // State
    mode: state.mode,
    entity: state.entity,
    loading: state.loading,
    error: state.error,
    meta: state.meta,

    // Operations
    setMode,
    setEntity,
    setLoading,
    setError,
    setMeta,
    getMeta,

    // Form access
    getForm,
    forms,

    // Dirty check
    isDirty,

    // Page context
    pageContext,

    // Page config
    pageConfig,

    // Lifecycle
    refresh,
  };
}

// =============================================================================
// NAVIGATION GUARD HOOK
// =============================================================================

export interface UseNavigationGuardOptions {
  isDirty: () => boolean;
  message?: string;
  onBeforeLeave?: () => boolean | Promise<boolean>;
}

/**
 * Hook for preventing navigation when form is dirty
 */
export function useNavigationGuard(options: UseNavigationGuardOptions) {
  const { isDirty, message = "You have unsaved changes. Leave anyway?", onBeforeLeave } = options;
  const appContext = useAppContext();

  useEffect(() => {
    // Browser beforeunload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty()) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Custom navigation guard (for SPA routing)
    const handleNavigation = async (e: PopStateEvent) => {
      if (isDirty()) {
        const shouldLeave = onBeforeLeave
          ? await onBeforeLeave()
          : await appContext.confirm(message);

        if (!shouldLeave) {
          // Prevent navigation by going forward
          window.history.pushState(null, "", window.location.href);
        }
      }
    };

    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [isDirty, message, onBeforeLeave, appContext]);
}
