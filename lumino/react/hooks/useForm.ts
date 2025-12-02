/**
 * Lumino Framework - useForm Hook
 *
 * React hook for binding Form class to React state.
 * Handles form state, validation, field changes, and actions.
 */

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import type { FormContext, AppContext, ListOperations, DialogOptions } from "../../core/types/context";
import type { ValidationErrors } from "../../core/types/validation";
import type { FormState, DependsOnConfig, FieldConfig, VisibilityConfig, BuiltListConfig, RowConfig } from "../../core/types/form";
import type { ValidationRule } from "../../core/types/validation";
import type { Form } from "../../core/form/Form";
import type { Dialog } from "../../core/containers/Dialog";
import { createFormState, isFormDirty } from "../../core/form/Form";
import { validationRunner } from "../../core/validation/ValidationRunner";
import { eventEmitter } from "../../core/events/EventEmitter";
import { useAppContext } from "../context/LuminoProvider";
import { evaluateVisibility, type VisibilityResult } from "../../core/utils/visibility";
import { useDialogContext } from "../providers/DialogProvider";

// =============================================================================
// PATH UTILITIES - Handle nested paths like "addresses[0].street"
// =============================================================================

/**
 * Parse a path string into segments
 * "addresses[0].street" -> ["addresses", 0, "street"]
 */
function parseFieldPath(path: string): (string | number)[] {
  const segments: (string | number)[] = [];
  const regex = /([^.\[\]]+)|\[(\d+)\]/g;
  let match;
  while ((match = regex.exec(path)) !== null) {
    if (match[1] !== undefined) {
      segments.push(match[1]);
    } else if (match[2] !== undefined) {
      segments.push(parseInt(match[2], 10));
    }
  }
  return segments;
}

/**
 * Get a nested value from an object using a path
 */
function getValueByPath(obj: any, path: string): any {
  const segments = parseFieldPath(path);
  let value = obj;
  for (const segment of segments) {
    if (value === null || value === undefined) {
      return undefined;
    }
    value = value[segment];
  }
  return value;
}

/**
 * Set a nested value in an object using a path (immutably)
 * Returns a new object with the value set
 */
function setValueByPath(obj: any, path: string, value: any): any {
  const segments = parseFieldPath(path);
  if (segments.length === 0) return obj;

  // Clone the root object
  const result = Array.isArray(obj) ? [...obj] : { ...obj };

  // Navigate to the parent and set the value
  let current: any = result;
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    const nextSegment = segments[i + 1];

    // Clone the next level
    if (current[segment] === null || current[segment] === undefined) {
      // Create new object or array based on next segment type
      current[segment] = typeof nextSegment === 'number' ? [] : {};
    } else if (Array.isArray(current[segment])) {
      // Clone array
      current[segment] = [...current[segment]];
      // Also need to clone the item at the next index if it's an object
      if (typeof nextSegment === 'number' && current[segment][nextSegment] != null) {
        current[segment][nextSegment] = { ...current[segment][nextSegment] };
      }
    } else {
      // Clone object
      current[segment] = { ...current[segment] };
    }
    current = current[segment];
  }

  // Set the final value
  const lastSegment = segments[segments.length - 1];
  current[lastSegment] = value;

  return result;
}

// =============================================================================
// LIST VALIDATION UTILITIES
// =============================================================================

/**
 * Extract field rules from list rows (used for list item validation)
 */
function extractFieldRulesFromRows(rows: RowConfig[]): Map<string, ValidationRule[]> {
  const rules = new Map<string, ValidationRule[]>();
  for (const row of rows) {
    for (const field of row.fields) {
      if (field.rules && field.rules.length > 0) {
        rules.set(field.name, field.rules);
      }
    }
  }
  return rules;
}

/**
 * Expand list field rules for each item in the list.
 * Takes rules defined for fields like "street" and creates rules for
 * "addresses[0].street", "addresses[1].street", etc.
 * Also adds list-level validation (min/max items).
 */
function expandListFieldRules(
  listName: string,
  listConfig: BuiltListConfig<any>,
  items: any[],
  baseRules: Map<string, ValidationRule[]>
): Map<string, ValidationRule[]> {
  const expandedRules = new Map<string, ValidationRule[]>();

  // Get field rules defined in the list's rows
  const listFieldRules = extractFieldRulesFromRows(listConfig.rows);

  // Expand rules for each item
  for (let i = 0; i < items.length; i++) {
    for (const [fieldName, rules] of listFieldRules) {
      const indexedPath = `${listName}[${i}].${fieldName}`;
      expandedRules.set(indexedPath, rules);
    }
  }

  // Add list-level validation (min/max items)
  const listLevelRules: ValidationRule[] = [];

  if (listConfig.min !== undefined && listConfig.min > 0) {
    listLevelRules.push({
      type: "min",
      message: `At least ${listConfig.min} item(s) required`,
      validate: () => items.length >= listConfig.min!,
    });
  }

  if (listConfig.max !== undefined) {
    listLevelRules.push({
      type: "max",
      message: `Maximum ${listConfig.max} item(s) allowed`,
      validate: () => items.length <= listConfig.max!,
    });
  }

  // Add any custom list-level rules
  if (listConfig.rules && listConfig.rules.length > 0) {
    listLevelRules.push(...listConfig.rules);
  }

  if (listLevelRules.length > 0) {
    expandedRules.set(listName, listLevelRules);
  }

  return expandedRules;
}

// =============================================================================
// DEPENDENCY TYPES
// =============================================================================

/**
 * Internal structure for tracking field dependencies
 */
interface DependencyEntry {
  /** The field that has dependencies */
  fieldName: string;
  /** Fields this field depends on */
  dependsOnFields: string[];
  /** Configuration for this dependency */
  config: DependsOnConfig;
}

/**
 * Map of dependency field -> fields that depend on it
 */
type DependencyMap = Map<string, DependencyEntry[]>;

// =============================================================================
// TYPES
// =============================================================================

export interface UseFormOptions<TEntity = any> {
  initialValues?: Partial<TEntity>;
  mode?: string;
  readOnly?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormReturn<TEntity = any> {
  // State
  values: Record<string, any>;
  errors: ValidationErrors;
  touched: Record<string, boolean>;
  dirty: boolean;
  submitting: boolean;
  readOnly: boolean;
  valid: boolean;

  // Field operations
  getValue: <T = any>(field: string) => T;
  setValue: (field: string, value: any) => void;
  setValues: (values: Partial<TEntity>) => void;
  getFieldError: (field: string) => string | null;
  getFieldErrors: (field: string) => string[];
  setFieldError: (field: string, error: string) => void;
  clearFieldError: (field: string) => void;
  isFieldDirty: (field: string) => boolean;
  isFieldTouched: (field: string) => boolean;
  touchField: (field: string) => void;

  // Field visibility/state
  isFieldDisabled: (field: string) => boolean;
  /** Check if field is hidden (any reason - conditional or access) */
  isFieldHidden: (field: string) => boolean;
  /** Check if field is hidden due to access/permission (data preserved, validation runs) */
  isFieldAccessHidden: (field: string) => boolean;
  showField: (field: string) => void;
  /** Conditional hide - hide field, CLEAR data, SKIP validation */
  hideFieldByCondition: (field: string) => void;
  /** Access-based hide - hide field, PRESERVE data, PERFORM validation */
  hideFieldByAccess: (field: string) => void;
  enableField: (field: string) => void;
  disableField: (field: string) => void;

  // Section visibility
  /** Check if section is hidden (any reason - conditional or access) */
  isSectionHidden: (sectionId: string) => boolean;
  /** Check if section is hidden due to access/permission (data preserved, validation runs) */
  isSectionAccessHidden: (sectionId: string) => boolean;
  showSection: (sectionId: string) => void;
  /** Conditional hide - hide section, CLEAR field data, SKIP validation */
  hideSectionByCondition: (sectionId: string) => void;
  /** Access-based hide - hide section, PRESERVE field data, PERFORM validation */
  hideSectionByAccess: (sectionId: string) => void;

  // Form operations
  validate: () => Promise<boolean>;
  validateField: (field: string) => Promise<boolean>;
  reset: () => void;
  resetField: (field: string) => void;
  setReadOnly: (readOnly: boolean) => void;

  // Actions
  executeAction: (actionName: string) => Promise<void>;
  hasAction: (actionName: string) => boolean;

  // Field options (from dependsOn reloadApi)
  getFieldOptions: <T = any>(field: string) => T[] | undefined;
  setFieldOptions: (field: string, options: any[]) => void;

  // Form context (for passing to components)
  formContext: FormContext;

  // Form config
  formConfig: ReturnType<Form<TEntity>["build"]>;
}

// =============================================================================
// HOOK
// =============================================================================

export function useForm<TEntity = any>(
  form: Form<TEntity>,
  options: UseFormOptions<TEntity> = {}
): UseFormReturn<TEntity> {
  const appContext = useAppContext();
  const dialogContext = useDialogContext();
  const formId = form.id;

  const {
    initialValues = form.getDefaultValues(),
    mode = "default",
    readOnly: initialReadOnly = false,
    validateOnChange = false,
    validateOnBlur = true,
  } = options;

  // State
  const [state, setState] = useState<FormState>(() =>
    createFormState(initialValues as Record<string, any>)
  );
  const [fieldVisibility, setFieldVisibility] = useState<Record<string, boolean>>({});
  /** Track which fields are hidden by access (imperative calls) */
  const [fieldAccessHidden, setFieldAccessHidden] = useState<Record<string, boolean>>({});
  const [fieldDisabled, setFieldDisabled] = useState<Record<string, boolean>>({});
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({});
  /** Track which sections are hidden by access (imperative calls) */
  const [sectionAccessHidden, setSectionAccessHidden] = useState<Record<string, boolean>>({});
  /** Track active tab index for lists displayed as tabs */
  const [listActiveIndices, setListActiveIndices] = useState<Record<string, number>>({});

  // Track previous initialValues to detect changes
  const prevInitialValuesRef = useRef(initialValues);

  // Update form values when initialValues changes (e.g., from page entity loading or mode switch)
  useEffect(() => {
    // Only update if initialValues actually changed (reference comparison)
    // This handles: initial load, mode changes, and entity updates
    if (initialValues !== prevInitialValuesRef.current && initialValues) {
      prevInitialValuesRef.current = initialValues;
      setState((prev) => ({
        ...prev,
        values: { ...initialValues } as Record<string, any>,
        initialValues: { ...initialValues } as Record<string, any>,
        dirty: false,
        errors: {}, // Clear errors when values reset (e.g., switching to new mode)
      }));
    }
  }, [initialValues]);

  // Sync readOnly state when prop changes (e.g., when mode changes)
  // Also clear errors when switching to read-only mode
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      readOnly: initialReadOnly,
      // Clear errors when form becomes read-only (e.g., view mode)
      errors: initialReadOnly ? {} : prev.errors,
    }));
  }, [initialReadOnly]);

  // Refs for callbacks
  const stateRef = useRef(state);
  stateRef.current = state;

  // Form config
  const formConfig = useMemo(() => form.build(), [form]);

  // =============================================================================
  // VISIBILITY MANAGEMENT
  // =============================================================================

  // Extract field visibility configs from form config
  const fieldVisibilityConfigs = useMemo<Map<string, VisibilityConfig>>(() => {
    const configMap = new Map<string, VisibilityConfig>();

    const extractFields = (config: ReturnType<Form<TEntity>["build"]>): FieldConfig[] => {
      const fields: FieldConfig[] = [];
      for (const section of config.sections) {
        for (const row of section.rows) {
          fields.push(...row.fields);
        }
      }
      return fields;
    };

    const fields = extractFields(formConfig);

    for (const field of fields) {
      if (field.visibility) {
        configMap.set(field.name, field.visibility);
      }
    }

    return configMap;
  }, [formConfig]);

  // Track previous visibility state to detect changes
  const prevVisibilityRef = useRef<Map<string, boolean>>(new Map());

  // Computed visibility results for all fields
  const computedVisibility = useMemo<Map<string, VisibilityResult>>(() => {
    const resultMap = new Map<string, VisibilityResult>();

    // We need formContext to evaluate conditions, but we're in the middle of creating it
    // So we create a minimal context for evaluation
    const evalContext: FormContext = {
      mode,
      formId,
      getValue: <T,>(field: string): T => stateRef.current.values[field] as T,
      getFormData: () => stateRef.current.values,
      getEntity: <T,>(): T => stateRef.current.values as T,
      // Provide minimal implementations for other required methods
      user: appContext.user,
      api: appContext.api,
      navigate: appContext.navigate,
      notify: appContext.notify,
      i18n: appContext.i18n,
      locale: appContext.locale,
      setLocale: appContext.setLocale,
      store: appContext.store,
      loading: appContext.loading,
      setLoading: appContext.setLoading,
      meta: appContext.meta,
      setMeta: appContext.setMeta,
      theme: appContext.theme,
      setTheme: appContext.setTheme,
    } as FormContext;

    for (const [fieldName, visConfig] of fieldVisibilityConfigs) {
      const result = evaluateVisibility(visConfig, evalContext);
      resultMap.set(fieldName, result);
    }

    return resultMap;
  }, [fieldVisibilityConfigs, state.values, mode, formId, appContext]);

  // Handle visibility changes - clear data for conditionally hidden fields
  useEffect(() => {
    const fieldsToClear: string[] = [];
    const fieldsToReset: string[] = [];

    for (const [fieldName, result] of computedVisibility) {
      const wasVisible = prevVisibilityRef.current.get(fieldName) ?? true;

      // Field just became hidden
      if (wasVisible && !result.isVisible) {
        // Only clear data for conditional hide (not access-based)
        if (result.shouldClearData) {
          fieldsToClear.push(fieldName);
        }
      }

      // Field just became visible - check if we need to reset
      if (!wasVisible && result.isVisible) {
        const visConfig = fieldVisibilityConfigs.get(fieldName);
        if (visConfig?.conditionalOptions?.resetOnShow) {
          fieldsToReset.push(fieldName);
        }
      }

      // Update tracking
      prevVisibilityRef.current.set(fieldName, result.isVisible);
    }

    // Clear data for conditionally hidden fields
    if (fieldsToClear.length > 0) {
      setState((prev) => {
        const newValues = { ...prev.values };
        for (const field of fieldsToClear) {
          newValues[field] = null;
        }
        return { ...prev, values: newValues };
      });

      // Emit event for cleared fields
      for (const field of fieldsToClear) {
        eventEmitter.emit("form:field:cleared", {
          formId,
          field,
          reason: "conditional_hide",
        });
      }
    }

    // Reset fields that need to be reset on show
    if (fieldsToReset.length > 0) {
      setState((prev) => {
        const newValues = { ...prev.values };
        for (const field of fieldsToReset) {
          newValues[field] = prev.initialValues[field];
        }
        return { ...prev, values: newValues };
      });

      // Emit event for reset fields
      for (const field of fieldsToReset) {
        eventEmitter.emit("form:field:reset", {
          formId,
          field,
          reason: "show_reset",
        });
      }
    }
  }, [computedVisibility, fieldVisibilityConfigs, formId]);

  // =============================================================================
  // FORM CONTEXT
  // =============================================================================

  const formContext = useMemo<FormContext>(() => {
    return {
      ...appContext,
      mode,
      formId,

      // Entity
      getEntity: <T,>(): T => stateRef.current.values as T,
      setEntity: (data: any) => {
        setState((prev) => ({
          ...prev,
          values: { ...data },
          initialValues: { ...data },
          dirty: false,
        }));
      },

      // Field access - supports nested paths like "addresses[0].street"
      getValue: <T,>(field: string): T => {
        // Check if it's a nested path (contains [ or .)
        if (field.includes('[') || field.includes('.')) {
          return getValueByPath(stateRef.current.values, field) as T;
        }
        return stateRef.current.values[field] as T;
      },
      setValue: (field: string, value: any) => {
        // Check if it's a nested path (contains [ or .)
        const isNestedPath = field.includes('[') || field.includes('.');
        const previousValue = isNestedPath
          ? getValueByPath(stateRef.current.values, field)
          : stateRef.current.values[field];

        setState((prev) => {
          const newValues = isNestedPath
            ? setValueByPath(prev.values, field, value)
            : { ...prev.values, [field]: value };
          return {
            ...prev,
            values: newValues,
            dirty: true,
          };
        });

        // Emit change event
        eventEmitter.emit("form:change", {
          formId,
          field,
          value,
          previousValue,
        });

        // Call lifecycle hook
        if (form.onFieldChange) {
          form.onFieldChange(field, value, formContext);
        }
      },
      getFormData: () => stateRef.current.values,

      // Field state
      getFieldError: (field: string): string | null => {
        const errors = stateRef.current.errors[field];
        return errors && errors.length > 0 ? errors[0] : null;
      },
      getFieldErrors: (field: string): string[] => {
        return stateRef.current.errors[field] || [];
      },
      setFieldError: (field: string, error: string) => {
        setState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [field]: [error],
          },
        }));
      },
      clearFieldError: (field: string) => {
        setState((prev) => {
          const newErrors = { ...prev.errors };
          delete newErrors[field];
          return { ...prev, errors: newErrors };
        });
      },
      isFieldDirty: (field: string): boolean => {
        return stateRef.current.values[field] !== stateRef.current.initialValues[field];
      },
      isFieldTouched: (field: string): boolean => {
        return stateRef.current.touched[field] || false;
      },

      // Form state
      isDirty: (): boolean => stateRef.current.dirty,
      isTouched: (): boolean => Object.keys(stateRef.current.touched).length > 0,
      isValid: (): boolean => Object.keys(stateRef.current.errors).length === 0,
      isSubmitting: (): boolean => stateRef.current.submitting,
      getErrors: (): ValidationErrors => stateRef.current.errors,

      // Form actions
      validate: async (): Promise<boolean> => {
        // Get base field rules from sections
        const baseRules = form.getAllFieldRules();

        // Expand list field rules for each list in the form
        const listNames = form.getListNames();
        for (const listName of listNames) {
          const listConfig = form.getListConfig(listName);
          if (listConfig) {
            // Get the current items for this list
            const items = (stateRef.current.values[listName] as any[]) || [];

            // Expand rules for each item in the list
            const expandedRules = expandListFieldRules(
              listName,
              listConfig,
              items,
              baseRules
            );

            // Merge expanded rules into base rules
            for (const [path, rules] of expandedRules) {
              baseRules.set(path, rules);
            }
          }
        }

        // Pass visibility configs to validation runner
        // This allows proper skip logic based on visibility type
        const result = await validationRunner.validateForm(
          baseRules,
          stateRef.current.values,
          formContext,
          mode,
          fieldVisibilityConfigs // Pass visibility configs for proper validation skip
        );

        setState((prev) => ({
          ...prev,
          errors: result.errors,
        }));

        eventEmitter.emit("form:validate", {
          formId,
          valid: result.valid,
          errors: result.errors,
        });

        if (!result.valid && form.onValidationError) {
          form.onValidationError(result.errors, formContext);
        }

        return result.valid;
      },
      validateField: async (field: string): Promise<boolean> => {
        const rules = form.getFieldRules(field);
        const value = stateRef.current.values[field];
        const errors = await validationRunner.validateField(field, value, rules, formContext, mode);

        setState((prev) => ({
          ...prev,
          errors: {
            ...prev.errors,
            [field]: errors,
          },
        }));

        return errors.length === 0;
      },
      reset: () => {
        if (form.onBeforeReset && !form.onBeforeReset(formContext)) {
          return;
        }

        setState((prev) => ({
          ...prev,
          values: { ...prev.initialValues },
          errors: {},
          touched: {},
          dirty: false,
        }));

        eventEmitter.emit("form:reset", { formId });

        if (form.onAfterReset) {
          form.onAfterReset(formContext);
        }
      },
      resetField: (field: string) => {
        setState((prev) => ({
          ...prev,
          values: {
            ...prev.values,
            [field]: prev.initialValues[field],
          },
          touched: {
            ...prev.touched,
            [field]: false,
          },
        }));
      },
      setReadOnly: (ro: boolean) => {
        setState((prev) => ({ ...prev, readOnly: ro }));
      },
      isReadOnly: (): boolean => stateRef.current.readOnly,

      // Field visibility
      showField: (field: string) => {
        setFieldVisibility((prev) => ({ ...prev, [field]: true }));
        setFieldAccessHidden((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      },
      /**
       * Conditional hide - hide field, CLEAR data, SKIP validation.
       */
      hideFieldByCondition: (field: string) => {
        setFieldVisibility((prev) => ({ ...prev, [field]: false }));
        // Ensure NOT marked as access-hidden
        setFieldAccessHidden((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
        // Clear field data for conditional hide
        setState((prev) => ({
          ...prev,
          values: { ...prev.values, [field]: null },
          errors: (() => { const e = { ...prev.errors }; delete e[field]; return e; })(),
        }));
      },
      /**
       * Access-based hide - hide field, PRESERVE data, PERFORM validation.
       */
      hideFieldByAccess: (field: string) => {
        setFieldVisibility((prev) => ({ ...prev, [field]: false }));
        setFieldAccessHidden((prev) => ({ ...prev, [field]: true }));
        // Data is preserved - don't clear anything
      },
      /**
       * Check if field is hidden (either conditional or access-based).
       */
      isFieldHidden: (field: string): boolean => {
        // Check manual override first
        if (fieldVisibility[field] === false) {
          return true;
        }
        // Then check computed visibility
        const computed = computedVisibility.get(field);
        return computed ? !computed.isVisible : false;
      },
      /**
       * Check if field is hidden due to access/permissions.
       * Returns true if hidden AND hidden by access (data preserved, validation runs).
       */
      isFieldHiddenByAccess: (field: string): boolean => {
        // Check imperative access-hidden first
        if (fieldAccessHidden[field]) {
          return true;
        }
        // Then check computed visibility
        const computed = computedVisibility.get(field);
        return computed ? !computed.isVisible && computed.hiddenBy === "access" : false;
      },
      enableField: (field: string) => {
        setFieldDisabled((prev) => ({ ...prev, [field]: false }));
      },
      disableField: (field: string) => {
        setFieldDisabled((prev) => ({ ...prev, [field]: true }));
      },
      isFieldDisabled: (field: string): boolean => {
        return fieldDisabled[field] || false;
      },

      // Section visibility
      showSection: (sectionId: string) => {
        setSectionVisibility((prev) => ({ ...prev, [sectionId]: true }));
        setSectionAccessHidden((prev) => {
          const next = { ...prev };
          delete next[sectionId];
          return next;
        });
      },
      /**
       * Conditional hide - hide section, CLEAR field data, SKIP validation.
       */
      hideSectionByCondition: (sectionId: string) => {
        setSectionVisibility((prev) => ({ ...prev, [sectionId]: false }));
        // Ensure NOT marked as access-hidden
        setSectionAccessHidden((prev) => {
          const next = { ...prev };
          delete next[sectionId];
          return next;
        });
        // Note: Field data clearing for sections should be handled by the UI
        // which knows which fields belong to which section
      },
      /**
       * Access-based hide - hide section, PRESERVE field data, PERFORM validation.
       */
      hideSectionByAccess: (sectionId: string) => {
        setSectionVisibility((prev) => ({ ...prev, [sectionId]: false }));
        setSectionAccessHidden((prev) => ({ ...prev, [sectionId]: true }));
      },
      /**
       * Check if section is hidden (either conditional or access-based).
       */
      isSectionHidden: (sectionId: string): boolean => {
        return sectionVisibility[sectionId] === false;
      },
      /**
       * Check if section is hidden due to access/permissions.
       */
      isSectionHiddenByAccess: (sectionId: string): boolean => {
        return sectionVisibility[sectionId] === false && sectionAccessHidden[sectionId] === true;
      },

      // =========================================================================
      // LIST OPERATIONS
      // =========================================================================

      /**
       * Get list operations for a list field.
       * Provides add/remove/reorder operations for dynamic arrays.
       */
      list: <T = Record<string, any>>(fieldName: string): ListOperations<T> => {
        // Helper to get nested value from state
        const getNestedValue = (path: string): any[] => {
          const parts = path.split(".");
          let value: any = stateRef.current.values;
          for (const part of parts) {
            if (value === undefined || value === null) return [];
            value = value[part];
          }
          return Array.isArray(value) ? value : [];
        };

        // Helper to set nested value in state
        const setNestedValue = (path: string, newArray: any[]) => {
          const parts = path.split(".");
          setState((prev) => {
            const newValues = { ...prev.values };
            if (parts.length === 1) {
              newValues[path] = newArray;
            } else {
              // Handle nested paths like "person.addresses"
              let obj = newValues;
              for (let i = 0; i < parts.length - 1; i++) {
                obj[parts[i]] = { ...obj[parts[i]] };
                obj = obj[parts[i]];
              }
              obj[parts[parts.length - 1]] = newArray;
            }
            return { ...prev, values: newValues, dirty: true };
          });
        };

        return {
          // ADD OPERATIONS
          add: (values?: Partial<T>): number => {
            const items = getNestedValue(fieldName);
            const newItem = values || ({} as T);
            const newItems = [...items, newItem];
            setNestedValue(fieldName, newItems);
            return newItems.length - 1;
          },

          addAt: (index: number, values?: Partial<T>): void => {
            const items = getNestedValue(fieldName);
            const newItem = values || ({} as T);
            const newItems = [...items.slice(0, index), newItem, ...items.slice(index)];
            setNestedValue(fieldName, newItems);
          },

          addFirst: (values?: Partial<T>): void => {
            const items = getNestedValue(fieldName);
            const newItem = values || ({} as T);
            setNestedValue(fieldName, [newItem, ...items]);
          },

          addLast: (values?: Partial<T>): number => {
            const items = getNestedValue(fieldName);
            const newItem = values || ({} as T);
            const newItems = [...items, newItem];
            setNestedValue(fieldName, newItems);
            return newItems.length - 1;
          },

          // REMOVE OPERATIONS
          remove: (index: number): void => {
            const items = getNestedValue(fieldName);
            const newItems = items.filter((_: any, i: number) => i !== index);
            setNestedValue(fieldName, newItems);
            // Adjust active tab index if needed
            const activeIndex = listActiveIndices[fieldName] || 0;
            if (activeIndex >= newItems.length && newItems.length > 0) {
              setListActiveIndices((prev) => ({ ...prev, [fieldName]: newItems.length - 1 }));
            }
          },

          removeByItem: (item: T): boolean => {
            const items = getNestedValue(fieldName);
            const index = items.indexOf(item as any);
            if (index >= 0) {
              const newItems = items.filter((_, i) => i !== index);
              setNestedValue(fieldName, newItems);
              return true;
            }
            return false;
          },

          removeFirst: (): void => {
            const items = getNestedValue(fieldName);
            if (items.length > 0) {
              setNestedValue(fieldName, items.slice(1));
            }
          },

          removeLast: (): void => {
            const items = getNestedValue(fieldName);
            if (items.length > 0) {
              setNestedValue(fieldName, items.slice(0, -1));
            }
          },

          clear: (): void => {
            setNestedValue(fieldName, []);
            setListActiveIndices((prev) => ({ ...prev, [fieldName]: 0 }));
          },

          // REORDER OPERATIONS
          move: (fromIndex: number, toIndex: number): void => {
            const items = getNestedValue(fieldName);
            if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) {
              return;
            }
            const newItems = [...items];
            const [item] = newItems.splice(fromIndex, 1);
            newItems.splice(toIndex, 0, item);
            setNestedValue(fieldName, newItems);
          },

          swap: (indexA: number, indexB: number): void => {
            const items = getNestedValue(fieldName);
            if (indexA < 0 || indexA >= items.length || indexB < 0 || indexB >= items.length) {
              return;
            }
            const newItems = [...items];
            [newItems[indexA], newItems[indexB]] = [newItems[indexB], newItems[indexA]];
            setNestedValue(fieldName, newItems);
          },

          // ACCESS OPERATIONS
          get: (index: number): T | undefined => {
            const items = getNestedValue(fieldName);
            return items[index] as T | undefined;
          },

          set: (index: number, values: T): void => {
            const items = getNestedValue(fieldName);
            if (index >= 0 && index < items.length) {
              const newItems = [...items];
              newItems[index] = values;
              setNestedValue(fieldName, newItems);
            }
          },

          update: (index: number, values: Partial<T>): void => {
            const items = getNestedValue(fieldName);
            if (index >= 0 && index < items.length) {
              const newItems = [...items];
              newItems[index] = { ...newItems[index], ...values };
              setNestedValue(fieldName, newItems);
            }
          },

          getAll: (): T[] => {
            return getNestedValue(fieldName) as T[];
          },

          count: (): number => {
            return getNestedValue(fieldName).length;
          },

          isEmpty: (): boolean => {
            return getNestedValue(fieldName).length === 0;
          },

          findIndex: (predicate: (item: T, index: number) => boolean): number => {
            const items = getNestedValue(fieldName);
            return items.findIndex((item, index) => predicate(item as T, index));
          },

          find: (predicate: (item: T, index: number) => boolean): T | undefined => {
            const items = getNestedValue(fieldName);
            return items.find((item, index) => predicate(item as T, index)) as T | undefined;
          },

          // TAB-SPECIFIC OPERATIONS
          getActiveIndex: (): number => {
            return listActiveIndices[fieldName] || 0;
          },

          setActiveIndex: (index: number): void => {
            const items = getNestedValue(fieldName);
            if (index >= 0 && index < items.length) {
              setListActiveIndices((prev) => ({ ...prev, [fieldName]: index }));
            }
          },

          // VALIDATION
          getErrors: (): string[] => {
            const errors = stateRef.current.errors[fieldName];
            return errors || [];
          },

          getItemErrors: (index: number): Record<string, string[]> => {
            const prefix = `${fieldName}[${index}]`;
            const itemErrors: Record<string, string[]> = {};
            for (const [key, errors] of Object.entries(stateRef.current.errors)) {
              if (key.startsWith(prefix)) {
                const fieldKey = key.replace(`${prefix}.`, "");
                itemErrors[fieldKey] = errors as string[];
              }
            }
            return itemErrors;
          },

          isValid: (): boolean => {
            const errors = stateRef.current.errors[fieldName];
            return !errors || errors.length === 0;
          },

          isItemValid: (index: number): boolean => {
            const prefix = `${fieldName}[${index}]`;
            for (const key of Object.keys(stateRef.current.errors)) {
              if (key.startsWith(prefix)) {
                return false;
              }
            }
            return true;
          },
        };
      },

      // =========================================================================
      // DIALOG OPERATIONS
      // =========================================================================

      /**
       * Open a dialog with callback-based result handling.
       * Requires DialogProvider to be present in the component tree.
       */
      open: <TData = any, TResult = any>(
        dialog: Dialog | (new (...args: any[]) => Dialog),
        options?: DialogOptions<TData, TResult>
      ): void => {
        if (dialogContext) {
          // We need to pass formContext, but it's being created here
          // Use a lazy reference that will be resolved when the dialog opens
          dialogContext.open(dialog, options || {}, formContext);
        } else {
          console.warn(
            "DialogProvider not found. Wrap your app with <DialogProvider> to use open()."
          );
        }
      },
    };
  }, [appContext, mode, formId, form, fieldVisibility, fieldAccessHidden, fieldDisabled, sectionVisibility, sectionAccessHidden, computedVisibility, fieldVisibilityConfigs, listActiveIndices, dialogContext]);

  // =============================================================================
  // OPERATIONS
  // =============================================================================

  const getValue = useCallback(<T = any,>(field: string): T => {
    // Check if it's a nested path (contains [ or .)
    if (field.includes('[') || field.includes('.')) {
      return getValueByPath(state.values, field) as T;
    }
    return state.values[field] as T;
  }, [state.values]);

  const setValue = useCallback((field: string, value: any) => {
    formContext.setValue(field, value);

    // Validate on change if enabled
    if (validateOnChange) {
      formContext.validateField(field);
    }
  }, [formContext, validateOnChange]);

  const setValues = useCallback((values: Partial<TEntity>) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, ...values },
      dirty: true,
    }));
  }, []);

  const touchField = useCallback((field: string) => {
    setState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [field]: true },
    }));

    // Validate on blur if enabled
    if (validateOnBlur) {
      formContext.validateField(field);
    }
  }, [formContext, validateOnBlur]);

  const executeAction = useCallback(async (actionName: string) => {
    const action = form.getAction(actionName);
    if (!action) {
      console.error(`Action "${actionName}" not found in form "${formId}"`);
      return;
    }

    // Before submit hook
    if (form.onBeforeSubmit) {
      const shouldContinue = await form.onBeforeSubmit(actionName, formContext);
      if (!shouldContinue) return;
    }

    setState((prev) => ({ ...prev, submitting: true }));

    eventEmitter.emit("form:submit", {
      formId,
      action: actionName,
      values: state.values,
    });

    try {
      // Create action context
      const actionContext = {
        ...formContext,
        action: actionName,
        preventDefault: () => {},
      };

      await action.execute(actionContext);

      eventEmitter.emit("form:submit:success", {
        formId,
        action: actionName,
        response: null,
      });

      if (form.onAfterSubmit) {
        form.onAfterSubmit(actionName, null, formContext);
      }
    } catch (error) {
      eventEmitter.emit("form:submit:error", {
        formId,
        action: actionName,
        error,
      });
    } finally {
      setState((prev) => ({ ...prev, submitting: false }));
    }
  }, [form, formId, formContext, state.values]);

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  // Init
  useEffect(() => {
    eventEmitter.emit("form:init", { formId });

    if (form.onInit) {
      form.onInit(formContext);
    }

    if (form.onLoad) {
      form.onLoad(formContext);
    }

    eventEmitter.emit("form:load", {
      formId,
      values: state.values,
    });

    // Emit form:ready after a microtask to ensure all subscribers are ready
    // This gives React time to mount all components before the event fires
    queueMicrotask(() => {
      eventEmitter.emit("form:ready", {
        formId,
        values: stateRef.current.values,
      });
    });
  }, []);

  // Track dirty state
  useEffect(() => {
    const isDirty = isFormDirty(state.values, state.initialValues);
    if (isDirty !== state.dirty) {
      setState((prev) => ({ ...prev, dirty: isDirty }));
      eventEmitter.emit("form:dirty", { formId, dirty: isDirty });
    }
  }, [state.values, state.initialValues, state.dirty, formId]);

  // =============================================================================
  // FIELD DEPENDENCIES (dependsOn)
  // =============================================================================

  // Extract dependency map from form config
  const dependencyMap = useMemo<DependencyMap>(() => {
    const map: DependencyMap = new Map();

    // Helper to extract all fields from form config
    const extractFields = (config: ReturnType<Form<TEntity>["build"]>): FieldConfig[] => {
      const fields: FieldConfig[] = [];
      for (const section of config.sections) {
        for (const row of section.rows) {
          fields.push(...row.fields);
        }
      }
      return fields;
    };

    const fields = extractFields(formConfig);

    for (const field of fields) {
      if (field.dependsOn && field.dependsOn.size > 0) {
        // Iterate over each dependency configuration
        field.dependsOn.forEach((config, keyStr) => {
          // keyStr is comma-separated field names (from FieldBuilderImpl.dependsOn)
          const dependsOnFields = keyStr.split(",").map((s) => s.trim());

          // For each dependency field, add this field to the map
          for (const depField of dependsOnFields) {
            if (!map.has(depField)) {
              map.set(depField, []);
            }
            map.get(depField)!.push({
              fieldName: field.name,
              dependsOnFields,
              config,
            });
          }
        });
      }
    }

    return map;
  }, [formConfig]);

  // Track previous values for dependency detection
  const prevValuesRef = useRef<Record<string, any>>({});

  // Field options state (for reloadApi results)
  const [fieldOptionsState, setFieldOptionsState] = useState<Record<string, any[]>>({});

  // Debounce timers
  const debounceTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Handle dependency changes
  useEffect(() => {
    const prevValues = prevValuesRef.current;
    const currentValues = state.values;

    // Find which dependency fields have changed
    const changedFields: string[] = [];
    for (const depField of dependencyMap.keys()) {
      if (prevValues[depField] !== currentValues[depField]) {
        changedFields.push(depField);
      }
    }

    // Process each changed dependency field
    for (const changedField of changedFields) {
      const entries = dependencyMap.get(changedField) || [];
      const newValue = currentValues[changedField];

      for (const entry of entries) {
        const { fieldName, dependsOnFields, config } = entry;

        // Check if all dependency fields match (for multi-field dependencies)
        // Only trigger if all fields in the dependency array have changed or have values
        const allDependenciesChanged = dependsOnFields.every(
          (f) => prevValues[f] !== currentValues[f] || changedFields.includes(f)
        );

        if (!allDependenciesChanged && dependsOnFields.length > 1) {
          continue;
        }

        // Check onlyIfTruthy condition
        if (config.onlyIfTruthy && !newValue) {
          continue;
        }

        // Create handler for this dependency
        const handleDependency = async () => {
          // 1. Clear field value
          if (config.clear) {
            formContext.setValue(fieldName, null);
          }

          // 2. Reset to initial value
          if (config.reset) {
            formContext.resetField(fieldName);
          }

          // 3. Reload API for options
          if (config.reloadApi) {
            try {
              // Get params - pass context for dynamic params
              const params = typeof config.reloadParams === "function"
                ? config.reloadParams(formContext)
                : config.reloadParams || {};

              // Parse API reference (e.g., "StatesApi.getByCountry")
              const [apiName, methodName] = config.reloadApi.split(".");

              // Execute API call through app context
              const app = (formContext as any).app;
              if (app && app.api) {
                const api = app.api[apiName];
                if (api && api[methodName]) {
                  const result = await api[methodName](params);
                  // Store options for this field
                  setFieldOptionsState((prev) => ({
                    ...prev,
                    [fieldName]: result,
                  }));

                  eventEmitter.emit("form:field:optionsLoaded", {
                    formId,
                    field: fieldName,
                    options: result,
                  });
                }
              }
            } catch (error) {
              console.error(`Failed to reload options for ${fieldName}:`, error);
              eventEmitter.emit("form:field:optionsError", {
                formId,
                field: fieldName,
                error,
              });
            }
          }

          // 4. Custom handler - receives value AND full context
          if (config.handler) {
            await config.handler(newValue, formContext);
          }

          // Emit dependency triggered event
          eventEmitter.emit("form:dependency", {
            formId,
            field: fieldName,
            dependsOn: changedField,
            value: newValue,
          });
        };

        // Apply debounce if configured
        if (config.debounceMs && config.debounceMs > 0) {
          const timerKey = `${changedField}->${fieldName}`;

          // Clear existing timer
          if (debounceTimersRef.current.has(timerKey)) {
            clearTimeout(debounceTimersRef.current.get(timerKey)!);
          }

          // Set new timer
          const timer = setTimeout(handleDependency, config.debounceMs);
          debounceTimersRef.current.set(timerKey, timer);
        } else {
          // Execute immediately
          handleDependency();
        }
      }
    }

    // Update previous values
    prevValuesRef.current = { ...currentValues };
  }, [state.values, dependencyMap, formContext, formId]);

  // Cleanup debounce timers on unmount
  useEffect(() => {
    return () => {
      debounceTimersRef.current.forEach((timer) => clearTimeout(timer));
      debounceTimersRef.current.clear();
    };
  }, []);

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    // State
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    dirty: state.dirty,
    submitting: state.submitting,
    readOnly: state.readOnly || initialReadOnly,
    valid: Object.keys(state.errors).length === 0,

    // Field operations
    getValue,
    setValue,
    setValues,
    getFieldError: formContext.getFieldError,
    getFieldErrors: formContext.getFieldErrors,
    setFieldError: formContext.setFieldError,
    clearFieldError: formContext.clearFieldError,
    isFieldDirty: formContext.isFieldDirty,
    isFieldTouched: formContext.isFieldTouched,
    touchField,

    // Field visibility/state
    isFieldDisabled: formContext.isFieldDisabled,
    isFieldHidden: formContext.isFieldHidden,
    isFieldAccessHidden: formContext.isFieldHiddenByAccess,
    showField: formContext.showField,
    hideFieldByCondition: formContext.hideFieldByCondition,
    hideFieldByAccess: formContext.hideFieldByAccess,
    enableField: formContext.enableField,
    disableField: formContext.disableField,

    // Section visibility
    isSectionHidden: formContext.isSectionHidden,
    isSectionAccessHidden: formContext.isSectionHiddenByAccess,
    showSection: formContext.showSection,
    hideSectionByCondition: formContext.hideSectionByCondition,
    hideSectionByAccess: formContext.hideSectionByAccess,

    // Form operations
    validate: formContext.validate,
    validateField: formContext.validateField,
    reset: formContext.reset,
    resetField: formContext.resetField,
    setReadOnly: formContext.setReadOnly,

    // Actions
    executeAction,
    hasAction: form.hasAction.bind(form),

    // Field options (from dependsOn reloadApi)
    getFieldOptions: <T = any>(field: string): T[] | undefined => fieldOptionsState[field],
    setFieldOptions: (field: string, options: any[]) => {
      setFieldOptionsState((prev) => ({ ...prev, [field]: options }));
    },

    // Form context
    formContext,

    // Form config
    formConfig,
  };
}
