/**
 * Lumino Framework - Notification System
 *
 * Provides a unified way to show success/error/warning/info messages.
 * Works with any UI adapter (Salt, MUI, etc.).
 *
 * @example
 * ```tsx
 * // In your component
 * const { notify } = useNotification();
 *
 * // Show success message
 * notify.success("Data saved successfully!");
 *
 * // Show error message
 * notify.error("Failed to save data");
 *
 * // Show with options
 * notify.success({
 *   title: "Saved",
 *   message: "Your changes have been saved.",
 *   duration: 3000,
 * });
 * ```
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";

// =============================================================================
// TYPES
// =============================================================================

export type NotificationType = "success" | "error" | "warning" | "info";

export type NotificationPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface NotificationOptions {
  /** Notification title */
  title?: string;
  /** Notification message */
  message: string;
  /** Notification type */
  type?: NotificationType;
  /** Duration in ms (0 = no auto-dismiss) */
  duration?: number;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Custom icon */
  icon?: ReactNode;
  /** Whether notification can be dismissed */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Unique ID (auto-generated if not provided) */
  id?: string;
}

export interface Notification extends Required<Omit<NotificationOptions, "action" | "icon" | "onDismiss">> {
  id: string;
  action?: NotificationOptions["action"];
  icon?: NotificationOptions["icon"];
  onDismiss?: NotificationOptions["onDismiss"];
  createdAt: Date;
}

export interface NotificationConfig {
  /** Default duration in ms */
  duration?: number;
  /** Maximum notifications shown at once */
  maxNotifications?: number;
  /** Position on screen */
  position?: NotificationPosition;
  /** Whether to stack notifications */
  stacked?: boolean;
}

export interface NotificationContextValue {
  /** Current notifications */
  notifications: Notification[];
  /** Configuration */
  config: NotificationConfig;

  /** Show a notification */
  show: (options: NotificationOptions | string, type?: NotificationType) => string;
  /** Show success notification */
  success: (options: NotificationOptions | string) => string;
  /** Show error notification */
  error: (options: NotificationOptions | string) => string;
  /** Show warning notification */
  warning: (options: NotificationOptions | string) => string;
  /** Show info notification */
  info: (options: NotificationOptions | string) => string;

  /** Dismiss a notification */
  dismiss: (id: string) => void;
  /** Dismiss all notifications */
  dismissAll: () => void;
  /** Update a notification */
  update: (id: string, options: Partial<NotificationOptions>) => void;
}

// =============================================================================
// DEFAULTS
// =============================================================================

const DEFAULT_CONFIG: NotificationConfig = {
  duration: 5000,
  maxNotifications: 5,
  position: "bottom-right",
  stacked: true,
};

const DEFAULT_DURATIONS: Record<NotificationType, number> = {
  success: 3000,
  error: 6000,
  warning: 5000,
  info: 4000,
};

// =============================================================================
// CONTEXT
// =============================================================================

const NotificationContext = createContext<NotificationContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

interface NotificationProviderProps {
  children: ReactNode;
  config?: NotificationConfig;
}

let notificationCounter = 0;

function generateId(): string {
  notificationCounter++;
  return `notification-${Date.now()}-${notificationCounter}`;
}

/**
 * NotificationProvider - Provides notification system to the app
 *
 * @example
 * ```tsx
 * <NotificationProvider config={{ position: "top-right", duration: 4000 }}>
 *   <App />
 * </NotificationProvider>
 * ```
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  config: userConfig,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const config = { ...DEFAULT_CONFIG, ...userConfig };

  // Clear timer for a notification
  const clearTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  // Dismiss a notification
  const dismiss = useCallback((id: string) => {
    clearTimer(id);
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === id);
      if (notification?.onDismiss) {
        notification.onDismiss();
      }
      return prev.filter((n) => n.id !== id);
    });
  }, [clearTimer]);

  // Dismiss all notifications
  const dismissAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setNotifications([]);
  }, []);

  // Show a notification
  const show = useCallback(
    (options: NotificationOptions | string, type: NotificationType = "info"): string => {
      const opts: NotificationOptions =
        typeof options === "string" ? { message: options, type } : { type, ...options };

      const id = opts.id || generateId();
      const notificationType = opts.type || type;
      const duration = opts.duration ?? DEFAULT_DURATIONS[notificationType] ?? config.duration!;

      const notification: Notification = {
        id,
        title: opts.title || "",
        message: opts.message,
        type: notificationType,
        duration,
        dismissible: opts.dismissible ?? true,
        action: opts.action,
        icon: opts.icon,
        onDismiss: opts.onDismiss,
        createdAt: new Date(),
      };

      setNotifications((prev) => {
        // Remove oldest if exceeds max
        let updated = [...prev, notification];
        if (config.maxNotifications && updated.length > config.maxNotifications) {
          const removed = updated.shift();
          if (removed) clearTimer(removed.id);
        }
        return updated;
      });

      // Set auto-dismiss timer
      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [config.duration, config.maxNotifications, dismiss, clearTimer]
  );

  // Shorthand methods
  const success = useCallback(
    (options: NotificationOptions | string) => show(options, "success"),
    [show]
  );

  const error = useCallback(
    (options: NotificationOptions | string) => show(options, "error"),
    [show]
  );

  const warning = useCallback(
    (options: NotificationOptions | string) => show(options, "warning"),
    [show]
  );

  const info = useCallback(
    (options: NotificationOptions | string) => show(options, "info"),
    [show]
  );

  // Update a notification
  const update = useCallback(
    (id: string, options: Partial<NotificationOptions>) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                ...options,
                type: options.type || n.type,
                message: options.message || n.message,
              }
            : n
        )
      );
    },
    []
  );

  const value: NotificationContextValue = {
    notifications,
    config,
    show,
    success,
    error,
    warning,
    info,
    dismiss,
    dismissAll,
    update,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook to access notification system
 *
 * @example
 * ```tsx
 * const { notify } = useNotification();
 *
 * const handleSave = async () => {
 *   try {
 *     await saveData();
 *     notify.success("Saved successfully!");
 *   } catch (error) {
 *     notify.error("Failed to save");
 *   }
 * };
 * ```
 */
export function useNotification(): { notify: NotificationContextValue } {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return { notify: context };
}

/**
 * Hook to access raw notification context
 */
export function useNotificationContext(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationContext must be used within a NotificationProvider");
  }
  return context;
}

/**
 * Hook for notifications with automatic error handling
 *
 * @example
 * ```tsx
 * const { withNotification } = useNotificationAsync();
 *
 * const handleSave = () => withNotification(
 *   async () => {
 *     await saveData();
 *   },
 *   {
 *     success: "Data saved successfully!",
 *     error: "Failed to save data",
 *     loading: "Saving...",
 *   }
 * );
 * ```
 */
export function useNotificationAsync() {
  const { notify } = useNotification();

  const withNotification = useCallback(
    async <T,>(
      asyncFn: () => Promise<T>,
      messages: {
        success?: string | NotificationOptions;
        error?: string | NotificationOptions;
        loading?: string | NotificationOptions;
      }
    ): Promise<T | null> => {
      let loadingId: string | undefined;

      try {
        // Show loading notification
        if (messages.loading) {
          loadingId = notify.info(
            typeof messages.loading === "string"
              ? { message: messages.loading, duration: 0 }
              : { ...messages.loading, duration: 0 }
          );
        }

        const result = await asyncFn();

        // Dismiss loading, show success
        if (loadingId) notify.dismiss(loadingId);
        if (messages.success) {
          notify.success(messages.success);
        }

        return result;
      } catch (error) {
        // Dismiss loading, show error
        if (loadingId) notify.dismiss(loadingId);
        if (messages.error) {
          const errorMessage =
            typeof messages.error === "string"
              ? messages.error
              : messages.error.message;
          const errorDetails =
            error instanceof Error ? error.message : String(error);

          notify.error(
            typeof messages.error === "string"
              ? { message: errorMessage, title: errorDetails }
              : { ...messages.error, title: errorDetails }
          );
        }
        return null;
      }
    },
    [notify]
  );

  return { withNotification, notify };
}

// =============================================================================
// STANDALONE NOTIFICATION MANAGER
// =============================================================================

/**
 * Standalone notification manager for use outside React components
 * Requires NotificationProvider to be mounted
 */
class NotificationManagerClass {
  private _context: NotificationContextValue | null = null;

  setContext(context: NotificationContextValue) {
    this._context = context;
  }

  private get context() {
    if (!this._context) {
      console.warn("NotificationManager: No context set. Make sure NotificationProvider is mounted.");
      return null;
    }
    return this._context;
  }

  success(options: NotificationOptions | string) {
    return this.context?.success(options);
  }

  error(options: NotificationOptions | string) {
    return this.context?.error(options);
  }

  warning(options: NotificationOptions | string) {
    return this.context?.warning(options);
  }

  info(options: NotificationOptions | string) {
    return this.context?.info(options);
  }

  show(options: NotificationOptions | string, type?: NotificationType) {
    return this.context?.show(options, type);
  }

  dismiss(id: string) {
    this.context?.dismiss(id);
  }

  dismissAll() {
    this.context?.dismissAll();
  }
}

export const NotificationManager = new NotificationManagerClass();

/**
 * Component to sync NotificationManager with context
 * Include this inside NotificationProvider
 */
export const NotificationManagerSync: React.FC = () => {
  const context = useNotificationContext();
  React.useEffect(() => {
    NotificationManager.setContext(context);
  }, [context]);
  return null;
};
