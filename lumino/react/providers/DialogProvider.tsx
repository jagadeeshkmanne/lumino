/**
 * Lumino Framework - Dialog Provider
 *
 * Provides dialog management at the app level.
 * Allows any component to open dialogs via context.
 *
 * Uses the adapter's Dialog component for rendering.
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { DialogOptions } from "../../core/types/context";
import type { Dialog, DialogConfig } from "../../core/containers/Dialog";
import type { FormContext } from "../../core/types/context";
import { DialogRenderer } from "../renderer/DialogRenderer";

// =============================================================================
// DIALOG STATE
// =============================================================================

interface DialogState {
  /** The dialog config to render */
  config: DialogConfig;
  /** Options passed when opening (data, mode, callbacks) */
  options: DialogOptions;
  /** Form context to pass to dialog */
  context: FormContext;
}

// =============================================================================
// DIALOG CONTEXT
// =============================================================================

interface DialogContextValue {
  /** Open a dialog */
  open: (
    dialog: Dialog | (new (...args: any[]) => Dialog),
    options: DialogOptions,
    context: FormContext
  ) => void;
  /** Close the current dialog */
  close: () => void;
  /** Current dialog state */
  currentDialog: DialogState | null;
}

const DialogContext = createContext<DialogContextValue | null>(null);

// =============================================================================
// DIALOG PROVIDER
// =============================================================================

interface DialogProviderProps {
  children: ReactNode;
}

/**
 * DialogProvider - Manages dialog state at app level.
 *
 * Wrap your app with this provider to enable ctx.open().
 *
 * @example
 * ```tsx
 * <DialogProvider>
 *   <App />
 * </DialogProvider>
 * ```
 */
export function DialogProvider({ children }: DialogProviderProps) {
  const [dialogState, setDialogState] = useState<DialogState | null>(null);

  // Call onOpen lifecycle event when dialog opens
  useEffect(() => {
    if (dialogState) {
      dialogState.options.onOpen?.();
    }
  }, [dialogState]);

  const open = useCallback(
    (
      dialog: Dialog | (new (...args: any[]) => Dialog),
      options: DialogOptions,
      context: FormContext
    ) => {
      // Get dialog config - either from instance or by instantiating class
      let config: DialogConfig;
      if (typeof dialog === "function") {
        // It's a class constructor
        const instance = new dialog(dialog.name || "dialog");
        config = instance.build();
      } else {
        // It's already an instance
        config = dialog.build();
      }

      setDialogState({
        config,
        options,
        context,
      });
    },
    []
  );

  const close = useCallback(() => {
    if (dialogState) {
      // Check onBeforeClose - if it returns false, prevent closing
      const shouldClose = dialogState.options.onBeforeClose?.();
      if (shouldClose === false) {
        return; // Prevent closing
      }

      // Call onClose callback
      dialogState.options.onClose?.();
    }
    setDialogState(null);
  }, [dialogState]);

  // Create enhanced context for dialog with close and options
  const getDialogContext = useCallback((): FormContext | null => {
    if (!dialogState) return null;

    return {
      ...dialogState.context,
      dialogData: dialogState.options.data,
      dialogOptions: dialogState.options,
      close,
    };
  }, [dialogState, close]);

  return (
    <DialogContext.Provider value={{ open, close, currentDialog: dialogState }}>
      {children}
      {dialogState && (
        <DialogRenderer
          config={dialogState.config}
          context={getDialogContext()!}
          open={true}
          onClose={close}
        />
      )}
    </DialogContext.Provider>
  );
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook to access dialog functions.
 * Used internally by FormContext implementation.
 */
export function useDialogContext(): DialogContextValue | null {
  return useContext(DialogContext);
}

/**
 * Hook to get open function for use in FormContext.
 * Returns a function that opens dialog with proper context binding.
 */
export function useOpenDialog(context: FormContext): (
  dialog: Dialog | (new (...args: any[]) => Dialog),
  options?: DialogOptions
) => void {
  const dialogContext = useDialogContext();

  return useCallback(
    (dialog: Dialog | (new (...args: any[]) => Dialog), options: DialogOptions = {}) => {
      if (dialogContext) {
        dialogContext.open(dialog, options, context);
      } else {
        console.warn(
          "DialogProvider not found. Wrap your app with <DialogProvider> to use open()."
        );
      }
    },
    [dialogContext, context]
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export { DialogContext };
export type { DialogState, DialogContextValue };
