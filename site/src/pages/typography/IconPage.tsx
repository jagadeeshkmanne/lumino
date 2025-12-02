/**
 * Icon Component Page
 *
 * Documents the LuminoIcon component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";

// Demo component showing different icon sizes and colors
function IconDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "20px" }}>
      {/* Icon Sizes */}
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Icon Sizes</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
          12px • 16px • 20px • 24px • 32px
        </div>
      </div>

      {/* Icon Colors */}
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Icon Colors</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
          current • primary • success • warning • error • muted
        </div>
      </div>

      {/* Different Icon Types */}
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Common Icons</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
          home • search • settings • user • bell • star • heart • plus
        </div>
      </div>
    </div>
  );
}

export function IconPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Icon</h1>
      <p className="docs-page-subtitle">
        A flexible icon component that supports multiple icon libraries and
        custom SVG icons.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoIcon } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Props</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>name</code>
              </td>
              <td>string</td>
              <td>-</td>
              <td>Icon name from the icon set</td>
            </tr>
            <tr>
              <td>
                <code>size</code>
              </td>
              <td>"xs" | "sm" | "md" | "lg" | "xl" | number</td>
              <td>"md"</td>
              <td>Icon size</td>
            </tr>
            <tr>
              <td>
                <code>color</code>
              </td>
              <td>"current" | "primary" | "muted" | etc.</td>
              <td>"current"</td>
              <td>Icon color</td>
            </tr>
            <tr>
              <td>
                <code>spin</code>
              </td>
              <td>boolean</td>
              <td>false</td>
              <td>Animate spinning</td>
            </tr>
            <tr>
              <td>
                <code>strokeWidth</code>
              </td>
              <td>number</td>
              <td>2</td>
              <td>SVG stroke width</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Live Demo</h2>
        <LiveDemo
          code={`function IconDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "20px" }}>
      {/* Icon Sizes */}
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Icon Sizes</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
          12px • 16px • 20px • 24px • 32px
        </div>
      </div>

      {/* Icon Colors */}
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Icon Colors</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
          current • primary • success • warning • error • muted
        </div>
      </div>

      {/* Different Icon Types */}
      <div>
        <h4 style={{ marginBottom: "12px", fontSize: "14px", fontWeight: 600 }}>Common Icons</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
          home • search • settings • user • bell • star • heart • plus
        </div>
      </div>
    </div>
  );
}`}
        >
          <IconDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoIcon } from "lumino/react";

function BasicIcons() {
  return (
    <div>
      <LuminoIcon name="home" />
      <LuminoIcon name="settings" />
      <LuminoIcon name="user" />
      <LuminoIcon name="search" />
      <LuminoIcon name="bell" />
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Icon Sizes</h2>
        <pre className="docs-code">{`// Preset sizes
<LuminoIcon name="star" size="xs" />  {/* 12px */}
<LuminoIcon name="star" size="sm" />  {/* 16px */}
<LuminoIcon name="star" size="md" />  {/* 20px */}
<LuminoIcon name="star" size="lg" />  {/* 24px */}
<LuminoIcon name="star" size="xl" />  {/* 32px */}

// Custom size in pixels
<LuminoIcon name="star" size={48} />
<LuminoIcon name="star" size={64} />`}</pre>
      </div>

      <div className="docs-section">
        <h2>Icon Colors</h2>
        <pre className="docs-code">{`// Inherits current text color (default)
<LuminoIcon name="check" color="current" />

// Semantic colors
<LuminoIcon name="check-circle" color="success" />
<LuminoIcon name="alert-triangle" color="warning" />
<LuminoIcon name="x-circle" color="error" />
<LuminoIcon name="info" color="info" />

// Brand colors
<LuminoIcon name="heart" color="primary" />
<LuminoIcon name="star" color="secondary" />

// Muted
<LuminoIcon name="clock" color="muted" />

// Custom color
<LuminoIcon name="star" style={{ color: "#FFD700" }} />`}</pre>
      </div>

      <div className="docs-section">
        <h2>Spinning Animation</h2>
        <pre className="docs-code">{`// Loading spinner
<LuminoIcon name="loader" spin />

// Refresh indicator
<LuminoIcon name="refresh-cw" spin />

// Custom with color
<LuminoIcon name="loader" spin color="primary" size="lg" />`}</pre>
      </div>

      <div className="docs-section">
        <h2>Common Icon Names</h2>
        <pre className="docs-code">{`// Navigation
home, menu, arrow-left, arrow-right, chevron-down, chevron-up
external-link, link, corner-up-left, corner-up-right

// Actions
plus, minus, x, check, edit, trash, copy, save
download, upload, share, send, refresh-cw, rotate-cw

// UI Elements
search, filter, settings, sliders, more-vertical, more-horizontal
maximize, minimize, expand, collapse, eye, eye-off

// User & Account
user, users, user-plus, user-minus, log-in, log-out
lock, unlock, key, shield

// Communication
mail, inbox, message-circle, message-square, phone, bell
at-sign, hash, paperclip

// Media
image, camera, video, music, play, pause, volume-2
mic, headphones, film

// Files & Data
file, folder, file-text, clipboard, database, archive
cloud, cloud-upload, cloud-download

// Status
check-circle, x-circle, alert-circle, alert-triangle, info, help-circle
thumbs-up, thumbs-down, star, heart, flag

// Misc
calendar, clock, map-pin, globe, sun, moon
gift, shopping-cart, credit-card, dollar-sign`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Buttons</h2>
        <pre className="docs-code">{`// Icon only button
<LuminoIconButton icon="settings" />

// Button with icon
<LuminoButton leftIcon={<LuminoIcon name="plus" />}>
  Add Item
</LuminoButton>

<LuminoButton rightIcon={<LuminoIcon name="arrow-right" />}>
  Continue
</LuminoButton>

// Icon button with badge
<LuminoIconButton icon="bell">
  <LuminoBadge color="error" dot />
</LuminoIconButton>`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Text</h2>
        <pre className="docs-code">{`<LuminoText>
  <LuminoIcon name="info" size="sm" /> This is an informational message.
</LuminoText>

<LuminoText>
  Click the <LuminoIcon name="settings" size="sm" /> icon to open settings.
</LuminoText>

// Status indicator
<LuminoText color="success">
  <LuminoIcon name="check-circle" /> Verified
</LuminoText>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Custom SVG Icons</h2>
        <pre className="docs-code">{`// Register custom icon
import { registerIcon } from "lumino/react";

registerIcon("custom-logo", () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
));

// Use custom icon
<LuminoIcon name="custom-logo" size="lg" color="primary" />

// Or inline SVG
<LuminoIcon>
  <svg viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" />
  </svg>
</LuminoIcon>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Icon Libraries</h2>
        <pre className="docs-code">{`// Configure icon library in LuminoProvider
import { LuminoProvider } from "lumino/react";
import { FeatherIcons } from "lumino/icons/feather";
import { LucideIcons } from "lumino/icons/lucide";
import { HeroIcons } from "lumino/icons/heroicons";

function App() {
  return (
    <LuminoProvider
      icons={FeatherIcons}  // Use Feather icons (default)
      // icons={LucideIcons}  // Or Lucide
      // icons={HeroIcons}    // Or Heroicons
    >
      <MyApp />
    </LuminoProvider>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Stroke Width</h2>
        <pre className="docs-code">{`// Thin stroke
<LuminoIcon name="star" strokeWidth={1} />

// Default stroke
<LuminoIcon name="star" strokeWidth={2} />

// Bold stroke
<LuminoIcon name="star" strokeWidth={3} />`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Form Builder</h2>
        <pre className="docs-code">{`class UserListPage extends Page {
  configure() {
    this.setTitle("Users");

    // Header with icon
    this.addHeading(1)
      .icon("users")  // Add icon to heading
      .text("User Management")
      .endHeading();

    // Button with icon
    this.addToolbar()
      .addButton("Add User")
        .icon("user-plus")
        .variant("primary")
        .onClick(() => this.openDialog("addUser"))
      .endButton()
      .addButton("Export")
        .icon("download")
        .variant("secondary")
      .endButton()
    .endToolbar();

    // Table with icon column
    this.addComponent(LuminoTable)
      .props({
        columns: [
          {
            key: "status",
            label: "Status",
            render: (row) => (
              <LuminoIcon
                name={row.active ? "check-circle" : "x-circle"}
                color={row.active ? "success" : "error"}
              />
            ),
          },
          // ... other columns
        ],
      })
      .endComponent();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Accessibility</h2>
        <pre className="docs-code">{`// Decorative icon (hidden from screen readers)
<LuminoIcon name="star" aria-hidden="true" />

// Icon with meaning - provide label
<LuminoIcon name="warning" aria-label="Warning" />

// Icon button should have accessible name
<LuminoIconButton
  icon="settings"
  aria-label="Open settings"
/>

// Or use title for tooltip + accessibility
<LuminoIcon name="info" title="More information" />`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Consistent sizing</strong> - Use the preset sizes for
            consistency
          </li>
          <li>
            <strong>Meaningful icons</strong> - Choose icons that clearly
            represent their action
          </li>
          <li>
            <strong>Add labels</strong> - Pair icons with text for clarity when
            needed
          </li>
          <li>
            <strong>Accessibility</strong> - Provide aria-label for interactive
            icons
          </li>
          <li>
            <strong>Color with purpose</strong> - Use semantic colors (success,
            error) meaningfully
          </li>
        </ul>
      </div>
    </div>
  );
}
