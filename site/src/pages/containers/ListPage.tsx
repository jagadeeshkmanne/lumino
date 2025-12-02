/**
 * List Container Page
 *
 * Documents the List container components (LumList, LumListItem)
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicListCode = `// Basic list structure
<LumList>
  <LumListItem>First item</LumListItem>
  <LumListItem>Second item</LumListItem>
  <LumListItem>Third item</LumListItem>
</LumList>`;

const interactiveListCode = `// Interactive list with callbacks
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Buy groceries", done: false },
    { id: 2, text: "Walk the dog", done: false },
    { id: 3, text: "Finish report", done: true },
  ]);

  const handleToggle = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  return (
    <LumList>
      {todos.map(todo => (
        <LumListItem
          key={todo.id}
          onClick={() => handleToggle(todo.id)}
          style={{
            textDecoration: todo.done ? 'line-through' : 'none',
            cursor: 'pointer'
          }}
        >
          {todo.text}
        </LumListItem>
      ))}
    </LumList>
  );
}`;

const nestedListCode = `// Nested list structure
<LumList>
  <LumListItem>
    Parent Item 1
    <LumList>
      <LumListItem>Child Item 1.1</LumListItem>
      <LumListItem>Child Item 1.2</LumListItem>
    </LumList>
  </LumListItem>
  <LumListItem>
    Parent Item 2
    <LumList>
      <LumListItem>Child Item 2.1</LumListItem>
      <LumListItem>Child Item 2.2</LumListItem>
    </LumList>
  </LumListItem>
</LumList>`;

const formBuilderCode = `class NavigationForm extends Form<Navigation> {
  configure() {
    this.addSection("Menu Items")
      .container(LumList)
        .each()
          .add(LumListItem)
            .field("title").display()
          .end()
        .endEach()
      .end()
    .endSection();
  }
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function ListPage() {
  const sampleItems = ["First item", "Second item", "Third item", "Fourth item"];

  const sampleMenuItems = [
    { id: 1, title: "Dashboard", icon: "dashboard" },
    { id: 2, title: "Reports", icon: "chart" },
    { id: 3, title: "Settings", icon: "settings" },
  ];

  return (
    <div className="docs-page">
      <h1 className="docs-page-title">List</h1>
      <p className="docs-page-subtitle">
        Simple list container components for displaying vertical lists of items.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        The List container components (LumList, LumListItem) are abstract markers that get
        resolved to the UI adapter's list implementation at runtime.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LumList, LumListItem } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Props</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Prop</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>LumList</code></td>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>List items (LumListItem elements)</td>
            </tr>
            <tr>
              <td><code>LumListItem</code></td>
              <td><code>children</code></td>
              <td>ReactNode</td>
              <td>List item content</td>
            </tr>
            <tr>
              <td><code>LumListItem</code></td>
              <td><code>onClick</code></td>
              <td>() =&gt; void</td>
              <td>Click handler for interactive items</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>1. Basic List</h2>
        <p>
          A simple list with static items:
        </p>
        <LiveDemo
          title="Basic List"
          description="Simple vertical list of items"
          code={basicListCode}
        >
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            border: "1px solid #ddd",
            borderRadius: 4,
          }}>
            {sampleItems.map((item, index) => (
              <li
                key={index}
                style={{
                  padding: "12px 16px",
                  borderBottom: index < sampleItems.length - 1 ? "1px solid #eee" : "none",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>2. Interactive List</h2>
        <p>
          List items with hover and click interactions:
        </p>
        <LiveDemo
          title="Interactive List"
          description="Clickable list items with hover effects"
          code={interactiveListCode}
        >
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            border: "1px solid #ddd",
            borderRadius: 4,
          }}>
            {sampleMenuItems.map((item, index) => (
              <li
                key={item.id}
                style={{
                  padding: "12px 16px",
                  borderBottom: index < sampleMenuItems.length - 1 ? "1px solid #eee" : "none",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>3. List with Custom Content</h2>
        <p>
          List items can contain any React content:
        </p>
        <LiveDemo
          title="Rich List Items"
          description="List items with icons and descriptions"
          code={`<LumList>
  <LumListItem>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Icon name="dashboard" />
      <div>
        <div style={{ fontWeight: 500 }}>Dashboard</div>
        <div style={{ fontSize: 12, color: "#666" }}>View your overview</div>
      </div>
    </div>
  </LumListItem>
  <LumListItem>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Icon name="chart" />
      <div>
        <div style={{ fontWeight: 500 }}>Reports</div>
        <div style={{ fontSize: 12, color: "#666" }}>Generate reports</div>
      </div>
    </div>
  </LumListItem>
</LumList>`}
        >
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            border: "1px solid #ddd",
            borderRadius: 4,
          }}>
            {sampleMenuItems.map((item, index) => (
              <li
                key={item.id}
                style={{
                  padding: "12px 16px",
                  borderBottom: index < sampleMenuItems.length - 1 ? "1px solid #eee" : "none",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#1976d2",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}>
                    {item.icon.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>Access {item.title.toLowerCase()}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Nested Lists</h2>
        <pre className="docs-code">{nestedListCode}</pre>
      </div>

      <div className="docs-section">
        <h2>Dynamic Lists</h2>
        <pre className="docs-code">{`function DynamicList({ items }) {
  return (
    <LumList>
      {items.map((item, index) => (
        <LumListItem key={index}>
          {item.content}
        </LumListItem>
      ))}
    </LumList>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Form Builder</h2>
        <p>
          Build lists declaratively in forms:
        </p>
        <pre className="docs-code">{formBuilderCode}</pre>
      </div>

      <div className="docs-section">
        <h2>Configuration Methods</h2>
        <p>
          When using lists in Lumino's form builder:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.container(LumList)</code></td>
              <td>Start list container</td>
              <td><code>this.container(LumList)</code></td>
            </tr>
            <tr>
              <td><code>.add(LumListItem)</code></td>
              <td>Add list item</td>
              <td><code>.add(LumListItem)</code></td>
            </tr>
            <tr>
              <td><code>.each()</code></td>
              <td>Iterate over array data</td>
              <td><code>.each().add(LumListItem)...</code></td>
            </tr>
            <tr>
              <td><code>.text(value)</code></td>
              <td>Set static text content</td>
              <td><code>.add(LumListItem).text("Item")</code></td>
            </tr>
            <tr>
              <td><code>.field(name)</code></td>
              <td>Bind to entity field</td>
              <td><code>.add(LumListItem).field("title")</code></td>
            </tr>
            <tr>
              <td><code>.children(fn)</code></td>
              <td>Custom content renderer</td>
              <td><code>.children(() =&gt; &lt;Custom /&gt;)</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use semantic HTML</strong> - Lists render as ul/ol elements for
            proper accessibility
          </li>
          <li>
            <strong>Provide unique keys</strong> - When rendering dynamic lists, always
            provide unique keys for React
          </li>
          <li>
            <strong>Consider interaction states</strong> - Add hover, focus, and active
            states for clickable items
          </li>
          <li>
            <strong>Keep items consistent</strong> - Maintain similar height and structure
            for better UX
          </li>
          <li>
            <strong>Use dividers sparingly</strong> - Too many visual separators can
            create clutter
          </li>
          <li>
            <strong>Limit nesting depth</strong> - Deep nesting can be hard to navigate;
            consider alternative layouts
          </li>
        </ul>
      </div>
    </div>
  );
}
