/**
 * Lumino Framework - Salt FileDropZone Adapter
 *
 * Uses createLuminoComponent to map Lumino FileDropZoneProps to Salt FileDropZone.
 * The adapter pattern ensures we can swap to MUI/Ant/other frameworks.
 */

import React, { type DragEvent } from "react";
import { FileDropZone } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";
import type { FileDropZoneProps } from "../../../core/types/ui";

/**
 * LuminoFileDropZone - Salt FileDropZone with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - disabled → disabled
 * - error → status ("error" if true)
 * - children → children
 *
 * Lumino Events → Salt Events:
 * - onDrop(files[]) ← onDrop(event, files)
 *
 * Note: Salt's FileDropZone is simpler than some alternatives.
 * File validation (accept, maxSize, maxFiles) must be done in the onDrop handler.
 *
 * @example
 * ```tsx
 * <LuminoFileDropZone
 *   name="documents"
 *   onDrop={(files) => handleFiles(files)}
 *   accept="image/*,.pdf"
 *   maxSize={5 * 1024 * 1024} // 5MB
 * >
 *   Drop files here
 * </LuminoFileDropZone>
 * ```
 */
export const LuminoFileDropZone = createLuminoComponent(FileDropZone, {
  props: {
    disabled: { to: "disabled" },
    error: {
      to: "status",
      transform: (error) => (error ? "error" : undefined),
    },
    className: {
      to: "className",
      transform: (className) => luminoClass("field", "file-drop-zone", className),
    },
  },
  // Exclude Lumino-specific props that need custom handling
  exclude: ["name", "accept", "maxSize", "maxFiles", "multiple", "onDropRejected"],
  // Custom render to handle file validation
  render: (transformedProps, _FileDropZone, originalProps) => {
    const {
      accept,
      maxSize,
      maxFiles,
      multiple = true,
      onDrop,
      onDropRejected,
      children,
    } = originalProps as FileDropZoneProps;

    // Validate files and split into accepted/rejected
    const handleDrop = (event: DragEvent<HTMLDivElement>, files: File[]) => {
      const acceptedFiles: File[] = [];
      const rejectedFiles: File[] = [];
      let rejectionReason = "";

      for (const file of files) {
        let isValid = true;
        let reason = "";

        // Check file type
        if (accept && !matchesAccept(file, accept)) {
          isValid = false;
          reason = `Invalid file type: ${file.type || file.name}`;
        }

        // Check file size
        if (isValid && maxSize && file.size > maxSize) {
          isValid = false;
          reason = `File too large: ${formatBytes(file.size)} > ${formatBytes(maxSize)}`;
        }

        if (isValid) {
          acceptedFiles.push(file);
        } else {
          rejectedFiles.push(file);
          if (!rejectionReason) rejectionReason = reason;
        }
      }

      // Check max files
      if (maxFiles && acceptedFiles.length > maxFiles) {
        const excess = acceptedFiles.splice(maxFiles);
        rejectedFiles.push(...excess);
        rejectionReason = `Too many files: max ${maxFiles} allowed`;
      }

      // If not multiple, only take first file
      if (!multiple && acceptedFiles.length > 1) {
        rejectedFiles.push(...acceptedFiles.slice(1));
        acceptedFiles.length = 1;
        rejectionReason = "Only single file allowed";
      }

      // Call handlers
      if (acceptedFiles.length > 0 && onDrop) {
        onDrop(acceptedFiles);
      }

      if (rejectedFiles.length > 0 && onDropRejected) {
        onDropRejected(rejectedFiles, rejectionReason);
      }
    };

    return (
      <FileDropZone {...transformedProps} onDrop={handleDrop}>
        {children}
      </FileDropZone>
    );
  },
});

/**
 * Check if file matches accept pattern.
 * Supports: "image/*", ".pdf", "application/pdf", etc.
 */
function matchesAccept(file: File, accept: string): boolean {
  const acceptPatterns = accept.split(",").map((p) => p.trim().toLowerCase());

  for (const pattern of acceptPatterns) {
    // Extension pattern: .pdf, .docx
    if (pattern.startsWith(".")) {
      const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
      if (ext === pattern) return true;
    }
    // MIME type wildcard: image/*, application/*
    else if (pattern.endsWith("/*")) {
      const type = pattern.slice(0, -2);
      if (file.type.toLowerCase().startsWith(type + "/")) return true;
    }
    // Exact MIME type: application/pdf
    else {
      if (file.type.toLowerCase() === pattern) return true;
    }
  }

  return false;
}

/**
 * Format bytes to human-readable string.
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Legacy alias for backward compatibility
export { LuminoFileDropZone as SaltFileDropZone };
