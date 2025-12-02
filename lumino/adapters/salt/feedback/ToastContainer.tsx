/**
 * Lumino Framework - Salt Toast Container
 *
 * Renders notifications from the NotificationContext using Salt ToastGroup.
 * Place this component at the root of your app to display notifications.
 *
 * @example
 * ```tsx
 * <NotificationProvider>
 *   <App />
 *   <LuminoToastContainer />
 * </NotificationProvider>
 * ```
 */

import React from "react";
import { Toast, ToastContent, Button, StackLayout } from "@salt-ds/core";
import { ToastGroup } from "@salt-ds/lab";
import {
  useNotificationContext,
  NotificationManagerSync,
  type Notification,
  type NotificationPosition,
} from "../../../core/context/NotificationContext";
import { luminoClass } from "../utils";

// =============================================================================
// POSITION MAPPING
// =============================================================================

// Salt ToastGroup only supports "top-right" | "bottom-right"
type SaltPlacement = "top-right" | "bottom-right";

const POSITION_MAP: Record<NotificationPosition, SaltPlacement> = {
  "top-left": "top-right",
  "top-center": "top-right",
  "top-right": "top-right",
  "bottom-left": "bottom-right",
  "bottom-center": "bottom-right",
  "bottom-right": "bottom-right",
};

// =============================================================================
// STATUS MAPPING
// =============================================================================

type SaltStatus = "info" | "success" | "warning" | "error";

const STATUS_MAP: Record<string, SaltStatus> = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
};

// =============================================================================
// TOAST ITEM
// =============================================================================

interface ToastItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ notification, onDismiss }) => {
  const { id, type, title, message, action, dismissible } = notification;

  return (
    <Toast
      status={STATUS_MAP[type] || "info"}
      className={luminoClass("feedback", "toast-notification")}
    >
      <ToastContent>
        <StackLayout gap={1}>
          {title && <strong>{title}</strong>}
          <span>{message}</span>
          <StackLayout direction="row" gap={1}>
            {action && (
              <Button
                variant="secondary"
                onClick={() => {
                  action.onClick();
                  onDismiss(id);
                }}
              >
                {action.label}
              </Button>
            )}
            {dismissible && (
              <Button
                variant="secondary"
                onClick={() => onDismiss(id)}
              >
                Dismiss
              </Button>
            )}
          </StackLayout>
        </StackLayout>
      </ToastContent>
    </Toast>
  );
};

// =============================================================================
// TOAST CONTAINER
// =============================================================================

interface ToastContainerProps {
  /** Override position from context config */
  position?: NotificationPosition;
  /** Custom className */
  className?: string;
}

/**
 * LuminoToastContainer - Renders all notifications as Salt Toasts
 *
 * @example
 * ```tsx
 * // At app root
 * <NotificationProvider>
 *   <App />
 *   <LuminoToastContainer position="top-right" />
 * </NotificationProvider>
 * ```
 */
export const LuminoToastContainer: React.FC<ToastContainerProps> = ({
  position: positionOverride,
  className,
}) => {
  const { notifications, config, dismiss } = useNotificationContext();

  const position = positionOverride || config.position || "bottom-right";
  const saltPlacement = POSITION_MAP[position];

  if (notifications.length === 0) {
    return <NotificationManagerSync />;
  }

  return (
    <>
      <NotificationManagerSync />
      <ToastGroup
        placement={saltPlacement}
        className={luminoClass("feedback", `toast-container ${className || ""}`.trim())}
      >
        {notifications.map((notification) => (
          <ToastItem
            key={notification.id}
            notification={notification}
            onDismiss={dismiss}
          />
        ))}
      </ToastGroup>
    </>
  );
};

// Legacy alias
export { LuminoToastContainer as SaltToastContainer };
