/**
 * Skeleton Component Page
 *
 * Documents the LuminoSkeleton component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import { LuminoSkeleton, LuminoStackLayout, LuminoFlowLayout, LuminoCard, LuminoCardContent } from "lumino/react";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function SkeletonVariantsDemo() {
  return (
    <LuminoFlowLayout gap={3}>
      <LuminoStackLayout gap={1} align="center">
        <LuminoSkeleton variant="text" width={100} height={16} />
        <span style={{ fontSize: "12px", color: "var(--salt-color-gray-600)" }}>Text</span>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoSkeleton variant="circular" width={48} height={48} />
        <span style={{ fontSize: "12px", color: "var(--salt-color-gray-600)" }}>Circular</span>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoSkeleton variant="rectangular" width={80} height={60} />
        <span style={{ fontSize: "12px", color: "var(--salt-color-gray-600)" }}>Rectangular</span>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoSkeleton variant="rounded" width={80} height={40} />
        <span style={{ fontSize: "12px", color: "var(--salt-color-gray-600)" }}>Rounded</span>
      </LuminoStackLayout>
    </LuminoFlowLayout>
  );
}

function SkeletonTextLinesDemo() {
  return (
    <LuminoStackLayout gap={2} style={{ maxWidth: "300px" }}>
      <LuminoSkeleton variant="text" lines={3} />
    </LuminoStackLayout>
  );
}

function SkeletonCardDemo() {
  return (
    <LuminoCard style={{ maxWidth: "300px" }}>
      <LuminoSkeleton variant="rectangular" width="100%" height={150} />
      <LuminoCardContent>
        <LuminoStackLayout gap={1}>
          <LuminoSkeleton variant="text" width="80%" height={24} />
          <LuminoSkeleton variant="text" lines={2} />
          <LuminoFlowLayout gap={1}>
            <LuminoSkeleton variant="rounded" width={80} height={32} />
            <LuminoSkeleton variant="rounded" width={80} height={32} />
          </LuminoFlowLayout>
        </LuminoStackLayout>
      </LuminoCardContent>
    </LuminoCard>
  );
}

function SkeletonListItemDemo() {
  return (
    <LuminoStackLayout gap={2}>
      {[1, 2, 3].map((i) => (
        <LuminoFlowLayout key={i} gap={2} align="center">
          <LuminoSkeleton variant="circular" width={40} height={40} />
          <LuminoStackLayout gap={1} style={{ flex: 1 }}>
            <LuminoSkeleton variant="text" width="40%" height={16} />
            <LuminoSkeleton variant="text" width="70%" height={14} />
          </LuminoStackLayout>
          <LuminoSkeleton variant="rounded" width={60} height={28} />
        </LuminoFlowLayout>
      ))}
    </LuminoStackLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const variantsCode = `import { LuminoSkeleton, LuminoStackLayout, LuminoFlowLayout } from "lumino/react";

function SkeletonVariantsDemo() {
  return (
    <LuminoFlowLayout gap={3}>
      <LuminoStackLayout gap={1} align="center">
        <LuminoSkeleton variant="text" width={100} height={16} />
        <span>Text</span>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoSkeleton variant="circular" width={48} height={48} />
        <span>Circular</span>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoSkeleton variant="rectangular" width={80} height={60} />
        <span>Rectangular</span>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoSkeleton variant="rounded" width={80} height={40} />
        <span>Rounded</span>
      </LuminoStackLayout>
    </LuminoFlowLayout>
  );
}`;

const textLinesCode = `import { LuminoSkeleton, LuminoStackLayout } from "lumino/react";

function SkeletonTextLinesDemo() {
  return (
    <LuminoStackLayout gap={2} style={{ maxWidth: "300px" }}>
      <LuminoSkeleton variant="text" lines={3} />
    </LuminoStackLayout>
  );
}`;

const cardCode = `import { LuminoSkeleton, LuminoStackLayout, LuminoFlowLayout, LuminoCard, LuminoCardContent } from "lumino/react";

function SkeletonCardDemo() {
  return (
    <LuminoCard style={{ maxWidth: "300px" }}>
      <LuminoSkeleton variant="rectangular" width="100%" height={150} />
      <LuminoCardContent>
        <LuminoStackLayout gap={1}>
          <LuminoSkeleton variant="text" width="80%" height={24} />
          <LuminoSkeleton variant="text" lines={2} />
          <LuminoFlowLayout gap={1}>
            <LuminoSkeleton variant="rounded" width={80} height={32} />
            <LuminoSkeleton variant="rounded" width={80} height={32} />
          </LuminoFlowLayout>
        </LuminoStackLayout>
      </LuminoCardContent>
    </LuminoCard>
  );
}`;

const listItemCode = `import { LuminoSkeleton, LuminoStackLayout, LuminoFlowLayout } from "lumino/react";

function SkeletonListItemDemo() {
  return (
    <LuminoStackLayout gap={2}>
      {[1, 2, 3].map((i) => (
        <LuminoFlowLayout key={i} gap={2} align="center">
          <LuminoSkeleton variant="circular" width={40} height={40} />
          <LuminoStackLayout gap={1} style={{ flex: 1 }}>
            <LuminoSkeleton variant="text" width="40%" height={16} />
            <LuminoSkeleton variant="text" width="70%" height={14} />
          </LuminoStackLayout>
          <LuminoSkeleton variant="rounded" width={60} height={28} />
        </LuminoFlowLayout>
      ))}
    </LuminoStackLayout>
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function SkeletonPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Skeleton</h1>
      <p className="docs-page-subtitle">
        Placeholder loading components that mimic content layout while data is
        being fetched.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoSkeleton } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Skeleton Variants</h2>
        <p>Use <code>variant</code> to control skeleton shape:</p>
        <LiveDemo
          title="Skeleton Variants"
          description="Different skeleton shape options"
          code={variantsCode}
        >
          <SkeletonVariantsDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Multiple Lines</h2>
        <p>Use <code>lines</code> prop to render multiple text lines:</p>
        <LiveDemo
          title="Text Lines"
          description="Multiple skeleton lines for paragraph placeholders"
          code={textLinesCode}
        >
          <SkeletonTextLinesDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Card Skeleton</h2>
        <p>Compose skeletons to create card loading states:</p>
        <LiveDemo
          title="Card Skeleton"
          description="Complete card placeholder with image and content"
          code={cardCode}
        >
          <SkeletonCardDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>List Item Skeleton</h2>
        <p>Create list loading placeholders:</p>
        <LiveDemo
          title="List Items"
          description="Skeleton for list items with avatar and text"
          code={listItemCode}
        >
          <SkeletonListItemDemo />
        </LiveDemo>
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
              <td><code>variant</code></td>
              <td>"text" | "circular" | "rectangular" | "rounded"</td>
              <td>"text"</td>
              <td>Shape variant</td>
            </tr>
            <tr>
              <td><code>width</code></td>
              <td>string | number</td>
              <td>"100%"</td>
              <td>Skeleton width</td>
            </tr>
            <tr>
              <td><code>height</code></td>
              <td>string | number</td>
              <td>20</td>
              <td>Skeleton height</td>
            </tr>
            <tr>
              <td><code>animation</code></td>
              <td>"pulse" | "wave" | false</td>
              <td>"pulse"</td>
              <td>Animation style</td>
            </tr>
            <tr>
              <td><code>lines</code></td>
              <td>number</td>
              <td>1</td>
              <td>Number of skeleton lines (text variant)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoSkeleton } from "lumino/react";

// Text skeleton (default)
<LuminoSkeleton />

// Avatar skeleton
<LuminoSkeleton variant="circular" width={48} height={48} />

// Image skeleton
<LuminoSkeleton variant="rectangular" width="100%" height={200} />

// Button skeleton
<LuminoSkeleton variant="rounded" width={120} height={40} />`}</pre>
      </div>

      <div className="docs-section">
        <h2>Animation Types</h2>
        <pre className="docs-code">{`// Pulse animation (default)
<LuminoSkeleton animation="pulse" />

// Wave animation
<LuminoSkeleton animation="wave" />

// No animation
<LuminoSkeleton animation={false} />`}</pre>
      </div>

      <div className="docs-section">
        <h2>Conditional Loading</h2>
        <pre className="docs-code">{`import { LuminoSkeleton, LuminoStackLayout, LuminoText } from "lumino/react";

function UserProfile({ loading, user }) {
  if (loading) {
    return (
      <LuminoStackLayout gap={2}>
        <LuminoSkeleton variant="circular" width={80} height={80} />
        <LuminoSkeleton variant="text" width={150} height={24} />
        <LuminoSkeleton variant="text" lines={2} />
      </LuminoStackLayout>
    );
  }

  return (
    <LuminoStackLayout gap={2}>
      <LuminoAvatar src={user.avatar} size="large" />
      <LuminoH3>{user.name}</LuminoH3>
      <LuminoText>{user.bio}</LuminoText>
    </LuminoStackLayout>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Match content layout</strong> - Skeletons should closely
            match the final content structure
          </li>
          <li>
            <strong>Use appropriate variants</strong> - Circular for avatars,
            rectangular for images
          </li>
          <li>
            <strong>Vary line widths</strong> - Makes text skeletons look more
            natural
          </li>
          <li>
            <strong>Don't overuse animation</strong> - Subtle pulse is usually
            sufficient
          </li>
          <li>
            <strong>Consider reduced motion</strong> - Respect user preferences
            for animations
          </li>
          <li>
            <strong>Create reusable skeletons</strong> - Build skeleton
            components for common patterns
          </li>
        </ul>
      </div>
    </div>
  );
}
