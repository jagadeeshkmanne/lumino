/**
 * Lumino Framework - Salt Page Loader Component
 *
 * Full page loading indicator with Salt DS styling.
 */

import React, { useEffect, useState } from "react";
import { FlexLayout, StackLayout, Text, Spinner } from "@salt-ds/core";
import { luminoClass } from "../utils";
import type { PageLoaderProps, LoadingSize } from "../../../core/types/ui";

/**
 * Map Lumino size to Salt spinner size
 */
const getSaltSize = (size: LoadingSize = "medium"): "small" | "medium" | "large" => {
  return size;
};

/**
 * LuminoPageLoader - Full page loading indicator
 *
 * @example
 * ```tsx
 * <LuminoPageLoader
 *   message="Loading your data..."
 *   showProgress
 *   progress={50}
 * />
 * ```
 */
export const LuminoPageLoader: React.FC<PageLoaderProps> = ({
  message = "Loading...",
  showProgress = false,
  progress = 0,
  size = "large",
  delay = 0,
  minDisplayTime = 0,
  className,
  style,
}) => {
  const [visible, setVisible] = useState(delay === 0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!visible) {
    return null;
  }

  return (
    <FlexLayout
      className={luminoClass("loading", "page-loader", className)}
      style={{
        position: "fixed",
        inset: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--salt-container-primary-background)",
        zIndex: 9999,
        ...style,
      }}
    >
      <StackLayout gap={3} style={{ textAlign: "center" }}>
        <Spinner size={getSaltSize(size)} />

        {message && (
          <Text color="secondary">{message}</Text>
        )}

        {showProgress && (
          <div
            style={{
              width: 200,
              height: 4,
              backgroundColor: "var(--salt-palette-neutral-secondary-background)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(100, Math.max(0, progress))}%`,
                height: "100%",
                backgroundColor: "var(--salt-palette-accent-background)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        )}
      </StackLayout>
    </FlexLayout>
  );
};

// Legacy alias
export { LuminoPageLoader as SaltPageLoader };
