/**
 * Lumino Framework - Salt Stepper Adapter
 *
 * Uses createLuminoComponent to map Lumino StepperProps to Salt Stepper.
 */

import React from "react";
import { Stepper, Step } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";
import type { StepperProps, StepItem } from "../../../core/types/ui";

/**
 * LuminoStepper - Salt Stepper with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - steps → Step components with label/description props
 * - activeStep → activeStep
 * - orientation → orientation
 *
 * @example
 * ```tsx
 * <LuminoStepper
 *   activeStep={1}
 *   steps={[
 *     { label: "Step 1", description: "First step" },
 *     { label: "Step 2", description: "Second step" },
 *     { label: "Step 3", description: "Final step" },
 *   ]}
 * />
 * ```
 */
export const LuminoStepper = createLuminoComponent(Stepper, {
  props: {
    activeStep: { to: "activeStep" },
    orientation: { to: "orientation" },
    className: {
      to: "className",
      transform: (className) => luminoClass("navigation", "stepper", className),
    },
  },
  exclude: ["steps", "onStepChange"],
  render: (transformedProps, _Stepper, originalProps) => {
    const { steps } = originalProps as StepperProps;

    // Map Lumino status to Salt stage
    const mapStage = (status?: StepItem["status"], index?: number, activeStep?: number) => {
      switch (status) {
        case "completed": return "completed";
        case "current": return "active";
        case "error": return "active"; // Salt uses status for error, not stage
        case "waiting":
        default:
          // If no explicit status, determine by position
          if (activeStep !== undefined && index !== undefined) {
            if (index < activeStep) return "completed";
            if (index === activeStep) return "active";
          }
          return "pending";
      }
    };

    // Map Lumino status to Salt status (error/warning)
    const mapStatus = (status?: StepItem["status"]) => {
      if (status === "error") return "error";
      return undefined;
    };

    return (
      <Stepper {...transformedProps}>
        {steps.map((step, index) => (
          <Step
            key={index}
            label={step.label}
            description={step.description}
            stage={mapStage(step.status, index, (originalProps as any).activeStep)}
            status={mapStatus(step.status)}
          />
        ))}
      </Stepper>
    );
  },
});

// Legacy alias for backward compatibility
export { LuminoStepper as SaltStepper };
