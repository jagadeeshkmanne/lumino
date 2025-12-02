/**
 * Lumino Framework - Salt Feedback Adapter
 *
 * Maps Lumino feedback interfaces to Salt DS components.
 * Includes data display (Badge, Avatar), loading (Spinner, Progress),
 * and notification (Banner, Toast, Tooltip) components.
 */

import type { ComponentType } from "react";
import type { FeedbackAdapter } from "../../../core/types/ui";

// Import individual components
import { LuminoBadge } from "./Badge";
import { LuminoAvatar } from "./Avatar";
import { LuminoSpinner } from "./Spinner";
import { LuminoProgress, LuminoLinearProgress, LuminoCircularProgress } from "./Progress";
import { LuminoBanner, LuminoAlert } from "./Banner";
import { LuminoToast } from "./Toast";
import { LuminoToastContainer } from "./ToastContainer";
import { LuminoTooltip } from "./Tooltip";

/**
 * Salt Feedback Adapter
 */
export const saltFeedbackAdapter: FeedbackAdapter = {
  Alert: LuminoBanner as any,
  Badge: LuminoBadge as any,
  Spinner: LuminoSpinner as any,
  Progress: LuminoProgress as any,
  Toast: LuminoToast as any,
};

/**
 * All feedback components for direct use
 */
export const saltFeedbackComponents: Record<string, ComponentType<any>> = {
  Badge: LuminoBadge,
  Avatar: LuminoAvatar,
  Spinner: LuminoSpinner,
  Progress: LuminoProgress,
  LinearProgress: LuminoLinearProgress,
  CircularProgress: LuminoCircularProgress,
  Banner: LuminoBanner,
  Alert: LuminoAlert,
  Toast: LuminoToast,
  ToastContainer: LuminoToastContainer,
  Tooltip: LuminoTooltip,
};

// Re-export individual components
export { LuminoBadge } from "./Badge";
export { LuminoAvatar } from "./Avatar";
export { LuminoSpinner } from "./Spinner";
export { LuminoProgress, LuminoLinearProgress, LuminoCircularProgress } from "./Progress";
export { LuminoBanner, LuminoAlert } from "./Banner";
export { LuminoToast } from "./Toast";
export { LuminoToastContainer } from "./ToastContainer";
export { LuminoTooltip } from "./Tooltip";

// Legacy aliases for backward compatibility
export { LuminoBadge as SaltBadge } from "./Badge";
export { LuminoAvatar as SaltAvatar } from "./Avatar";
export { LuminoSpinner as SaltSpinner } from "./Spinner";
export { LuminoProgress as SaltProgress, LuminoLinearProgress as SaltLinearProgress, LuminoCircularProgress as SaltCircularProgress } from "./Progress";
export { LuminoBanner as SaltBanner, LuminoAlert as SaltAlert } from "./Banner";
export { LuminoToast as SaltToast } from "./Toast";
export { LuminoToastContainer as SaltToastContainer } from "./ToastContainer";
export { LuminoTooltip as SaltTooltip } from "./Tooltip";
