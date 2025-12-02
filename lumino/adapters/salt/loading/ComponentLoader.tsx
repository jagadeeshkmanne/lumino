/**
 * Lumino Framework - Salt Component Loader
 *
 * Component-level loading indicator with overlay/skeleton options.
 */

import React from "react";
import { FlexLayout, StackLayout, Text, Spinner } from "@salt-ds/core";
import { luminoClass } from "../utils";
import type { ComponentLoaderProps, LoadingSize } from "../../../core/types/ui";

/**
 * Map Lumino size to Salt spinner size
 */
const getSaltSize = (size: LoadingSize = "medium"): "small" | "medium" | "large" => {
  return size;
};

/**
 * Skeleton placeholder component
 */
const Skeleton: React.FC<{
  height?: number | string;
  lines?: number;
}> = ({ height = 20, lines = 3 }) => {
  return (
    <StackLayout gap={1}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="lumino-skeleton-line"
          style={{
            height: typeof height === "number" ? height : height,
            backgroundColor: "var(--salt-palette-neutral-secondary-background)",
            borderRadius: "var(--salt-palette-corner-default)",
            animation: "lumino-skeleton-pulse 1.5s ease-in-out infinite",
            width: i === lines - 1 ? "60%" : "100%",
          }}
        />
      ))}
      <style>{`
        @keyframes lumino-skeleton-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </StackLayout>
  );
};

/**
 * LuminoComponentLoader - Component-level loading wrapper
 *
 * @example
 * ```tsx
 * <LuminoComponentLoader loading={isLoading} overlay blur>
 *   <DataTable data={data} />
 * </LuminoComponentLoader>
 * ```
 */
export const LuminoComponentLoader: React.FC<ComponentLoaderProps> = ({
  loading,
  message,
  size = "medium",
  overlay = false,
  blur = false,
  skeleton = false,
  skeletonHeight,
  skeletonLines = 3,
  children,
  className,
  style,
}) => {
  if (!loading) {
    return <>{children}</>;
  }

  // Skeleton mode
  if (skeleton) {
    return (
      <div
        className={luminoClass("loading", `component-loader-skeleton ${className || ""}`.trim())}
        style={{
          position: "relative",
          ...style,
        }}
      >
        <Skeleton height={skeletonHeight} lines={skeletonLines} />
      </div>
    );
  }

  // Overlay mode
  if (overlay) {
    return (
      <div
        className={luminoClass("loading", `component-loader-overlay ${className || ""}`.trim())}
        style={{
          position: "relative",
          ...style,
        }}
      >
        {/* Content with optional blur */}
        <div
          style={{
            filter: blur ? "blur(2px)" : undefined,
            opacity: blur ? 0.6 : 1,
            pointerEvents: "none",
          }}
        >
          {children}
        </div>

        {/* Loading overlay */}
        <FlexLayout
          style={{
            position: "absolute",
            inset: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: blur ? "transparent" : "rgba(var(--salt-color-white-rgb), 0.7)",
            zIndex: 10,
          }}
        >
          <StackLayout gap={2} style={{ textAlign: "center" }}>
            <Spinner size={getSaltSize(size)} />
            {message && <Text color="secondary">{message}</Text>}
          </StackLayout>
        </FlexLayout>
      </div>
    );
  }

  // Replace content mode (default)
  return (
    <FlexLayout
      className={luminoClass("loading", "component-loader", className)}
      style={{
        minHeight: 100,
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <StackLayout gap={2} style={{ textAlign: "center" }}>
        <Spinner size={getSaltSize(size)} />
        {message && <Text color="secondary">{message}</Text>}
      </StackLayout>
    </FlexLayout>
  );
};

// Legacy alias
export { LuminoComponentLoader as SaltComponentLoader };
