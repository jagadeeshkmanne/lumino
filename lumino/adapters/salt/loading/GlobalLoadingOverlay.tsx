/**
 * Lumino Framework - Salt Global Loading Overlay Component
 *
 * Full-screen overlay for multiple concurrent API calls.
 */

import React from "react";
import { FlexLayout, StackLayout, Text, Spinner } from "@salt-ds/core";
import { luminoClass } from "../utils";
import type { GlobalLoadingOverlayProps } from "../../../core/types/ui";

/**
 * LuminoGlobalLoadingOverlay - Global loading overlay for API calls
 *
 * @example
 * ```tsx
 * <LuminoGlobalLoadingOverlay
 *   visible={apiLoadingState.isGlobalLoading}
 *   message="Loading data..."
 *   showProgress
 *   progress={50}
 * />
 * ```
 */
export const LuminoGlobalLoadingOverlay: React.FC<GlobalLoadingOverlayProps> = ({
  visible,
  message = "Loading...",
  showProgress = false,
  progress = 0,
  opacity = 0.85,
  zIndex = 9998,
  className,
  style,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <FlexLayout
      className={luminoClass("loading", "global-overlay", className)}
      style={{
        position: "fixed",
        inset: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: `rgba(var(--salt-color-white-rgb), ${opacity})`,
        zIndex,
        ...style,
      }}
    >
      <StackLayout
        gap={3}
        style={{
          textAlign: "center",
          padding: "var(--salt-spacing-400)",
          backgroundColor: "var(--salt-container-primary-background)",
          borderRadius: "var(--salt-palette-corner-default)",
          boxShadow: "var(--salt-overlayable-shadow)",
          minWidth: 200,
        }}
      >
        <Spinner size="large" />

        {message && (
          <Text>{message}</Text>
        )}

        {showProgress && (
          <StackLayout gap={1}>
            <div
              style={{
                width: "100%",
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
            <Text color="secondary" styleAs="notation">
              {Math.round(progress)}%
            </Text>
          </StackLayout>
        )}
      </StackLayout>
    </FlexLayout>
  );
};

// Legacy alias
export { LuminoGlobalLoadingOverlay as SaltGlobalLoadingOverlay };
