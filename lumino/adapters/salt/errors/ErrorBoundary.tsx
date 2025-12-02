/**
 * Lumino Framework - Salt Error Boundary Component
 *
 * React error boundary that catches errors and displays a fallback UI.
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button, FlexLayout, StackLayout, Text, H1 } from "@salt-ds/core";
import { luminoClass } from "../utils";
import type { ErrorBoundaryProps } from "../../../core/types/ui";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * LuminoErrorBoundary - Error boundary with Salt DS styling
 *
 * @example
 * ```tsx
 * <LuminoErrorBoundary
 *   fallback={<div>Something went wrong</div>}
 *   onError={(error) => logError(error)}
 * >
 *   <App />
 * </LuminoErrorBoundary>
 * ```
 */
export class LuminoErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error state if resetKeys change
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      !this.areKeysEqual(prevProps.resetKeys, this.props.resetKeys)
    ) {
      this.reset();
    }
  }

  private areKeysEqual(prevKeys: any[], nextKeys: any[]): boolean {
    if (prevKeys.length !== nextKeys.length) return false;
    return prevKeys.every((key, index) => key === nextKeys[index]);
  }

  reset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback, className, style } = this.props;

    if (hasError && error) {
      // Custom fallback
      if (typeof fallback === "function") {
        return fallback(error, this.reset);
      }

      if (fallback) {
        return fallback;
      }

      // Default fallback UI
      const isDevMode = process.env.NODE_ENV === "development";

      return (
        <FlexLayout
          className={luminoClass("error", "boundary", className)}
          style={{
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--salt-spacing-400)",
            ...style,
          }}
        >
          <StackLayout
            gap={3}
            style={{
              textAlign: "center",
              maxWidth: 600,
            }}
          >
            <div style={{ fontSize: "4rem" }}>💥</div>

            <H1 styleAs="h2">Something went wrong</H1>

            <Text color="secondary">
              An unexpected error occurred. Please try refreshing the page.
            </Text>

            {isDevMode && (
              <StackLayout gap={2}>
                <Text
                  as="pre"
                  style={{
                    textAlign: "left",
                    padding: "var(--salt-spacing-200)",
                    backgroundColor: "var(--salt-container-secondary-background)",
                    borderRadius: "var(--salt-palette-corner-default)",
                    overflow: "auto",
                    maxHeight: 200,
                    fontSize: "var(--salt-text-fontSize-small)",
                    color: "var(--salt-status-error-foreground)",
                  }}
                >
                  {error.message}
                </Text>

                {error.stack && (
                  <Text
                    as="pre"
                    style={{
                      textAlign: "left",
                      padding: "var(--salt-spacing-200)",
                      backgroundColor: "var(--salt-container-secondary-background)",
                      borderRadius: "var(--salt-palette-corner-default)",
                      overflow: "auto",
                      maxHeight: 300,
                      fontSize: "var(--salt-text-fontSize-small)",
                    }}
                  >
                    {error.stack}
                  </Text>
                )}
              </StackLayout>
            )}

            <FlexLayout gap={2} style={{ justifyContent: "center" }}>
              <Button onClick={this.reset} appearance="bordered">
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                sentiment="accented"
              >
                Reload Page
              </Button>
            </FlexLayout>
          </StackLayout>
        </FlexLayout>
      );
    }

    return children;
  }
}

// Legacy alias
export { LuminoErrorBoundary as SaltErrorBoundary };
