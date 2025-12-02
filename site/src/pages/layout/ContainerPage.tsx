/**
 * Container Component Page
 *
 * Documents the LuminoContainer component.
 */

import React from "react";

export function ContainerPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Container</h1>
      <p className="docs-page-subtitle">
        A responsive container component that centers content and constrains its
        maximum width based on breakpoints.
      </p>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoContainer } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoContainer } from "lumino/react";

function PageContent() {
  return (
    <LuminoContainer>
      <h1>Page Title</h1>
      <p>
        This content is centered and constrained to a maximum width
        of 1024px (lg size by default).
      </p>
    </LuminoContainer>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Container Sizes</h2>
        <pre className="docs-code">{`// Size values (max-width)
const sizes = {
  sm: "640px",   // Small screens
  md: "768px",   // Medium screens
  lg: "1024px",  // Large screens (default)
  xl: "1280px",  // Extra large
  "2xl": "1536px", // 2X large
  full: "100%",  // Full width
};

// Usage
<LuminoContainer size="sm">
  Narrow content (max 640px)
</LuminoContainer>

<LuminoContainer size="xl">
  Wide content (max 1280px)
</LuminoContainer>

<LuminoContainer size="full">
  Full width content
</LuminoContainer>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Responsive Sizes</h2>
        <pre className="docs-code">{`// Different sizes at different breakpoints
<LuminoContainer
  size={{
    base: "full",  // Full width on mobile
    md: "lg",      // 1024px on tablets
    xl: "xl",      // 1280px on desktop
  }}
>
  Responsive container
</LuminoContainer>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Fluid Container</h2>
        <pre className="docs-code">{`// Full width until breakpoint, then constrained
<LuminoContainer fluid size="lg">
  Full width on mobile, max 1024px on larger screens
</LuminoContainer>

// Breakpoint-based fluid behavior
<LuminoContainer
  fluid={{ base: true, lg: false }}
  size="xl"
>
  Fluid until large screens
</LuminoContainer>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Custom Padding</h2>
        <pre className="docs-code">{`// No padding
<LuminoContainer padding={false}>
  Content without horizontal padding
</LuminoContainer>

// Custom padding amount
<LuminoContainer padding={8}>  {/* 32px */}
  Content with larger padding
</LuminoContainer>

// Responsive padding
<LuminoContainer
  padding={{ base: 4, md: 6, lg: 8 }}
>
  Responsive padding
</LuminoContainer>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Page Layouts</h2>
        <pre className="docs-code">{`// Blog post layout
function BlogPost({ post }) {
  return (
    <article>
      {/* Full-width hero */}
      <LuminoContainer size="full" padding={false}>
        <img src={post.heroImage} alt="" className="hero-image" />
      </LuminoContainer>

      {/* Narrow content for readability */}
      <LuminoContainer size="sm">
        <h1>{post.title}</h1>
        <div className="post-content">{post.content}</div>
      </LuminoContainer>

      {/* Wider section for related posts */}
      <LuminoContainer size="lg">
        <h2>Related Posts</h2>
        <LuminoGrid columns={3}>
          {post.related.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </LuminoGrid>
      </LuminoContainer>
    </article>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Form Builder</h2>
        <pre className="docs-code">{`class SettingsPage extends Page {
  configure() {
    this.setTitle("Settings");

    // Wrap form in container for consistent width
    this.addContainer()
      .size("md")
      .children(
        this.addForm(SettingsForm)
          .dataBind("settings")
          .onSubmit((data) => this.saveSettings(data))
          .endForm()
      )
      .endContainer();
  }
}`}</pre>
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
              <td><code>size</code></td>
              <td>"sm" | "md" | "lg" | "xl" | "2xl" | "full"</td>
              <td>"lg"</td>
              <td>Maximum width of container</td>
            </tr>
            <tr>
              <td><code>centered</code></td>
              <td>boolean</td>
              <td>true</td>
              <td>Center container horizontally</td>
            </tr>
            <tr>
              <td><code>padding</code></td>
              <td>boolean | number</td>
              <td>true</td>
              <td>Add horizontal padding</td>
            </tr>
            <tr>
              <td><code>fluid</code></td>
              <td>boolean</td>
              <td>false</td>
              <td>Full width until breakpoint</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Choose size based on content</strong> - Use smaller sizes
            for text-heavy pages
          </li>
          <li>
            <strong>Use responsive sizes</strong> - Adapt container width to
            screen size
          </li>
          <li>
            <strong>Maintain consistent padding</strong> - Use default padding
            unless needed otherwise
          </li>
          <li>
            <strong>Nest thoughtfully</strong> - Use nested containers for
            different content sections
          </li>
          <li>
            <strong>Consider readability</strong> - Optimal line length is
            50-75 characters
          </li>
        </ul>
      </div>
    </div>
  );
}
