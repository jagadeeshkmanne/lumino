/**
 * Lumino Framework - Salt Loading Adapter
 *
 * Maps Lumino loading interfaces to Salt DS components.
 */

import type { ILoadingAdapter } from "../../../core/types/ui";

// Import components
import { LuminoPageLoader } from "./PageLoader";
import { LuminoComponentLoader } from "./ComponentLoader";
import { LuminoInlineLoader } from "./InlineLoader";
import { LuminoGlobalLoadingOverlay } from "./GlobalLoadingOverlay";
import { LuminoSkeleton } from "./Skeleton";

/**
 * Salt Loading Adapter
 */
export const saltLoadingAdapter: ILoadingAdapter = {
  PageLoader: LuminoPageLoader as any,
  ComponentLoader: LuminoComponentLoader as any,
  InlineLoader: LuminoInlineLoader as any,
  GlobalLoadingOverlay: LuminoGlobalLoadingOverlay as any,
  Skeleton: LuminoSkeleton as any,
};

// Re-export components
export { LuminoPageLoader } from "./PageLoader";
export { LuminoComponentLoader } from "./ComponentLoader";
export { LuminoInlineLoader } from "./InlineLoader";
export { LuminoGlobalLoadingOverlay } from "./GlobalLoadingOverlay";
export { LuminoSkeleton } from "./Skeleton";

// Legacy aliases
export { LuminoPageLoader as SaltPageLoader } from "./PageLoader";
export { LuminoComponentLoader as SaltComponentLoader } from "./ComponentLoader";
export { LuminoInlineLoader as SaltInlineLoader } from "./InlineLoader";
export { LuminoGlobalLoadingOverlay as SaltGlobalLoadingOverlay } from "./GlobalLoadingOverlay";
export { LuminoSkeleton as SaltSkeleton } from "./Skeleton";
