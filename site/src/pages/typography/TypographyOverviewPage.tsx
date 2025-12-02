/**
 * Typography Components Overview Page
 *
 * Documents typography components in Lumino.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";

export function TypographyOverviewPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Typography Components</h1>
      <p className="docs-page-subtitle">
        Components for rendering text content with consistent styling, including
        headings, paragraphs, labels, and code blocks.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Available Components</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Description</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>LuminoHeading</code>
              </td>
              <td>Heading elements (h1-h6)</td>
              <td>Page titles and section headers</td>
            </tr>
            <tr>
              <td>
                <code>LuminoText</code>
              </td>
              <td>General text content</td>
              <td>Paragraphs, descriptions, captions</td>
            </tr>
            <tr>
              <td>
                <code>LuminoLabel</code>
              </td>
              <td>Form labels and captions</td>
              <td>Field labels, small text</td>
            </tr>
            <tr>
              <td>
                <code>LuminoCode</code>
              </td>
              <td>Inline and block code</td>
              <td>Code snippets, API references</td>
            </tr>
            <tr>
              <td>
                <code>LuminoIcon</code>
              </td>
              <td>Icon component</td>
              <td>Visual indicators, button icons</td>
            </tr>
            <tr>
              <td>
                <code>LuminoAvatar</code>
              </td>
              <td>User avatars</td>
              <td>Profile pictures, user indicators</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import {
  LuminoHeading,
  LuminoText,
  LuminoLabel,
  LuminoCode,
  LuminoIcon,
  LuminoAvatar,
} from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Typography Scale</h2>
        <pre className="docs-code">{`// Heading sizes
<LuminoHeading level={1}>H1 - Page Title (2.5rem)</LuminoHeading>
<LuminoHeading level={2}>H2 - Section Title (2rem)</LuminoHeading>
<LuminoHeading level={3}>H3 - Subsection (1.5rem)</LuminoHeading>
<LuminoHeading level={4}>H4 - Content Header (1.25rem)</LuminoHeading>
<LuminoHeading level={5}>H5 - Small Header (1rem)</LuminoHeading>
<LuminoHeading level={6}>H6 - Tiny Header (0.875rem)</LuminoHeading>

// Text sizes
<LuminoText size="xs">Extra small text (0.75rem)</LuminoText>
<LuminoText size="sm">Small text (0.875rem)</LuminoText>
<LuminoText size="md">Medium text (1rem)</LuminoText>
<LuminoText size="lg">Large text (1.125rem)</LuminoText>
<LuminoText size="xl">Extra large text (1.25rem)</LuminoText>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Text Variants</h2>
        <pre className="docs-code">{`// Colors
<LuminoText color="default">Default text</LuminoText>
<LuminoText color="muted">Muted/secondary text</LuminoText>
<LuminoText color="primary">Primary brand color</LuminoText>
<LuminoText color="success">Success message</LuminoText>
<LuminoText color="warning">Warning message</LuminoText>
<LuminoText color="error">Error message</LuminoText>

// Weight
<LuminoText weight="normal">Normal weight</LuminoText>
<LuminoText weight="medium">Medium weight</LuminoText>
<LuminoText weight="semibold">Semibold weight</LuminoText>
<LuminoText weight="bold">Bold weight</LuminoText>

// Styles
<LuminoText italic>Italic text</LuminoText>
<LuminoText underline>Underlined text</LuminoText>
<LuminoText strikethrough>Strikethrough text</LuminoText>
<LuminoText uppercase>Uppercase text</LuminoText>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Common Patterns</h2>

        <h3>Page Header</h3>
        <pre className="docs-code">{`function PageHeader({ title, description }) {
  return (
    <div className="page-header">
      <LuminoHeading level={1}>{title}</LuminoHeading>
      <LuminoText color="muted" size="lg">
        {description}
      </LuminoText>
    </div>
  );
}`}</pre>

        <h3>Card Content</h3>
        <pre className="docs-code">{`function CardContent() {
  return (
    <LuminoCard>
      <LuminoHeading level={3}>Card Title</LuminoHeading>
      <LuminoText>
        This is the card description with regular text content.
      </LuminoText>
      <LuminoText size="sm" color="muted">
        Last updated: 2 hours ago
      </LuminoText>
    </LuminoCard>
  );
}`}</pre>

        <h3>User Profile</h3>
        <pre className="docs-code">{`function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <LuminoAvatar name={user.name} src={user.avatar} size="lg" />
      <div>
        <LuminoText weight="semibold">{user.name}</LuminoText>
        <LuminoText size="sm" color="muted">{user.email}</LuminoText>
      </div>
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Truncation & Overflow</h2>
        <pre className="docs-code">{`// Single line truncation
<LuminoText truncate>
  This is a very long text that will be truncated with ellipsis...
</LuminoText>

// Multi-line truncation
<LuminoText lines={2}>
  This text will show at most 2 lines and then truncate with
  ellipsis if it exceeds that limit. Useful for card previews.
</LuminoText>

// Line clamping
<LuminoText clamp={3}>
  Clamps to 3 lines maximum with ellipsis at the end.
</LuminoText>`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Form Builder</h2>
        <pre className="docs-code">{`class ProfilePage extends Page {
  configure() {
    // Page header
    this.addHeading(1)
      .text(() => \`Welcome, \${this.user.name}\`)
      .endHeading();

    this.addText()
      .content("Manage your profile settings and preferences.")
      .color("muted")
      .size("lg")
      .endText();

    // User info section
    this.addSection("profile")
      .addHeading(2)
        .text("Profile Information")
        .endHeading()
      .addAvatar()
        .dataBind("user.avatar")
        .size("xl")
        .editable(true)
        .endAvatar()
      .addText()
        .dataBind("user.bio")
        .color("muted")
        .endText()
    .endSection();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Accessibility</h2>
        <pre className="docs-code">{`// Semantic heading structure
<LuminoHeading level={1}>Main Page Title</LuminoHeading>
<section>
  <LuminoHeading level={2}>Section Title</LuminoHeading>
  <LuminoText>Content...</LuminoText>
</section>

// Screen reader only text
<LuminoText srOnly>
  This text is only visible to screen readers
</LuminoText>

// Alternative text for icons
<LuminoIcon name="warning" aria-label="Warning" />

// Labeled avatars
<LuminoAvatar name="John Doe" aria-label="John Doe's profile picture" />`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Maintain hierarchy</strong> - Use heading levels
            sequentially (h1 → h2 → h3)
          </li>
          <li>
            <strong>Consistent sizing</strong> - Use the predefined size scale
          </li>
          <li>
            <strong>Color semantics</strong> - Use colors meaningfully (error
            for errors, muted for secondary)
          </li>
          <li>
            <strong>Readable line length</strong> - Keep lines under 70-80
            characters
          </li>
          <li>
            <strong>Proper contrast</strong> - Ensure text is readable against
            backgrounds
          </li>
        </ul>
      </div>
    </div>
  );
}
