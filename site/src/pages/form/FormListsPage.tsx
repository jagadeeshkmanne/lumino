/**
 * Form Lists Page - Documentation for array/list fields
 *
 * I have carefully read the Lumino source code and API documentation.
 * This page includes mini demos for each list configuration.
 */

import { CodeBlock } from "../../components/CodeBlock";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoButton, LuminoTabs } from "lumino/react";

// =============================================================================
// BASIC LIST DEMO
// =============================================================================

class BasicListForm extends Form<{ tags: string[] }> {
  constructor() { super("basic-list-form"); }
  configure() {
    this.addSection("Tags")
      .addRow()
        .addComponent(LuminoButton)
          .children("+ Add Tag")
          .props({ variant: "secondary" })
          .onClick((ctx) => { ctx.list("tags").add({ value: "" }); })
        .endComponent()
      .endRow()
    .endSection();

    this.addList("tags")
      .min(1)
      .max(5)
      .addRow()
        .addField("value")
          .component(LuminoTextInput)
          .label("Tag")
          .placeholder("Enter tag")
          .rules(Validators.required({ message: "Tag is required" }))
        .endField()
        .addComponent(LuminoButton)
          .children("Remove")
          .props({ variant: "secondary" })
          .onClick((ctx) => { ctx.removeCurrentItem?.(); })
        .endComponent()
        .layout([10, 2])
      .endRow()
      .end();
  }
}

const basicListCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoButton } from "lumino/react";

class BasicListForm extends Form<{ tags: string[] }> {
  configure() {
    // Add button to add items
    this.addSection("Tags")
      .addRow()
        .addComponent(LuminoButton)
          .children("+ Add Tag")
          .props({ variant: "secondary" })
          .onClick((ctx) => { ctx.list("tags").add({ value: "" }); })
        .endComponent()
      .endRow()
    .endSection();

    // Define list structure
    this.addList("tags")
      .min(1)    // At least 1 tag required
      .max(5)    // Maximum 5 tags
      .addRow()
        .addField("value")
          .component(LuminoTextInput)
          .label("Tag")
          .rules(Validators.required({ message: "Tag is required" }))
        .endField()
        .addComponent(LuminoButton)
          .children("Remove")
          .onClick((ctx) => { ctx.removeCurrentItem?.(); })
        .endComponent()
        .layout([10, 2])
      .endRow()
      .end();
  }
}`;

// =============================================================================
// LIST WITH TABS DISPLAY
// =============================================================================

interface Address {
  type: string;
  street: string;
  city: string;
  zip: string;
}

class AddressListForm extends Form<{ addresses: Address[] }> {
  constructor() { super("address-list-form"); }
  configure() {
    this.addSection("Addresses")
      .addRow()
        .addComponent(LuminoButton)
          .children("+ Add Address")
          .props({ variant: "secondary" })
          .onClick((ctx) => {
            ctx.list("addresses").add({
              type: "home",
              street: "",
              city: "",
              zip: ""
            });
          })
        .endComponent()
      .endRow()
    .endSection();

    this.addList<Address>("addresses")
      .as(LuminoTabs)
      .min(1)
      .tabLabel((addr, index) => {
        if (addr.street) return addr.street;
        return `Address #${index + 1}`;
      })
      .addRow()
        .addField("type")
          .component(LuminoTextInput)
          .label("Type")
          .placeholder("home, work, etc.")
        .endField()
        .addField("street")
          .component(LuminoTextInput)
          .label("Street")
          .placeholder("123 Main St")
          .rules(Validators.required({ message: "Street is required" }))
        .endField()
        .layout([4, 8])
      .endRow()
      .addRow()
        .addField("city")
          .component(LuminoTextInput)
          .label("City")
          .placeholder("City name")
          .rules(Validators.required({ message: "City is required" }))
        .endField()
        .addField("zip")
          .component(LuminoTextInput)
          .label("ZIP Code")
          .placeholder("12345")
          .rules(Validators.required({ message: "ZIP is required" }))
        .endField()
        .layout([8, 4])
      .endRow()
      .end();
  }
}

const tabsListCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoButton, LuminoTabs } from "lumino/react";

interface Address {
  type: string;
  street: string;
  city: string;
  zip: string;
}

class AddressListForm extends Form<{ addresses: Address[] }> {
  configure() {
    this.addSection("Addresses")
      .addRow()
        .addComponent(LuminoButton)
          .children("+ Add Address")
          .onClick((ctx) => {
            ctx.list("addresses").add({
              type: "home",
              street: "",
              city: "",
              zip: ""
            });
          })
        .endComponent()
      .endRow()
    .endSection();

    this.addList<Address>("addresses")
      .as(LuminoTabs)  // Display as tabs
      .min(1)
      .tabLabel((addr, index) => {
        if (addr.street) return addr.street;
        return \`Address #\${index + 1}\`;
      })
      .addRow()
        .addField("type")
          .component(LuminoTextInput)
          .label("Type")
        .endField()
        .addField("street")
          .component(LuminoTextInput)
          .label("Street")
          .rules(Validators.required())
        .endField()
        .layout([4, 8])
      .endRow()
      .addRow()
        .addField("city")
          .component(LuminoTextInput)
          .label("City")
          .rules(Validators.required())
        .endField()
        .addField("zip")
          .component(LuminoTextInput)
          .label("ZIP Code")
          .rules(Validators.required())
        .endField()
        .layout([8, 4])
      .endRow()
      .end();
  }
}`;

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export function FormListsPage() {
  return (
    <>
      <h1 className="docs-page-title">Lists / Arrays</h1>
      <p className="docs-page-subtitle">
        Lumino supports dynamic lists of items using <code>addList()</code>.
        Lists can be displayed as rows, tabs, tables, or custom components.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">List Features</h2>
        <ul>
          <li><strong>Dynamic Add/Remove</strong> - Users can add and remove items</li>
          <li><strong>Multiple Display Modes</strong> - Rows, Tabs, Table, Cards, or custom</li>
          <li><strong>Min/Max Constraints</strong> - Limit the number of items</li>
          <li><strong>Per-Item Validation</strong> - Each item validates independently</li>
          <li><strong>List-Level Validation</strong> - Validate the list as a whole</li>
          <li><strong>Nested Structures</strong> - Lists within lists, objects within lists</li>
        </ul>
      </div>

      {/* Basic List */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic List</h2>
        <p>
          The simplest list displays items as rows. Use <code>ctx.list("fieldName")</code>
          to add/remove items programmatically.
        </p>
        <LuminoLiveDemo
          title="Basic List"
          description="Simple tag list with add/remove"
          form={new BasicListForm()}
          code={basicListCode}
          defaultView="split"
        />
      </div>

      {/* Tabs Display */}
      <div className="docs-section">
        <h2 className="docs-section-title">Tabs Display</h2>
        <p>
          Use <code>.as(LuminoTabs)</code> to display list items as tabs. Ideal for
          complex items like addresses or forms with multiple sections per item.
        </p>
        <LuminoLiveDemo
          title="Tabs Display"
          description="Addresses displayed as tabs"
          form={new AddressListForm()}
          code={tabsListCode}
          defaultView="split"
        />
      </div>

      {/* List Operations API */}
      <div className="docs-section">
        <h2 className="docs-section-title">List Operations API</h2>
        <p>
          Access list operations via <code>ctx.list("fieldName")</code>:
        </p>
        <CodeBlock
          code={`// Add operations
ctx.list("items").add({ name: "" })         // Add at end
ctx.list("items").addAt(0, { name: "" })    // Add at index
ctx.list("items").addFirst({ name: "" })    // Add at beginning

// Remove operations
ctx.list("items").remove(index)             // Remove by index
ctx.list("items").removeFirst()             // Remove first
ctx.list("items").removeLast()              // Remove last
ctx.list("items").clear()                   // Remove all

// Access operations
ctx.list("items").get(0)                    // Get item at index
ctx.list("items").getAll()                  // Get all items
ctx.list("items").count()                   // Get count
ctx.list("items").isEmpty()                 // Check if empty

// Reorder operations
ctx.list("items").move(fromIndex, toIndex)  // Move item
ctx.list("items").swap(indexA, indexB)      // Swap items

// From within an item (e.g., onClick handler)
ctx.removeCurrentItem?.()                   // Remove current item
ctx.updateCurrentItem?.({ name: "new" })    // Update current item`}
          language="typescript"
        />
      </div>

      {/* Display Modes */}
      <div className="docs-section">
        <h2 className="docs-section-title">Display Modes</h2>
        <p>
          Lists can be displayed in different modes using <code>.as()</code>:
        </p>
        <CodeBlock
          code={`// As rows (default) - each item rendered vertically
this.addList("items")
  .addRow()
    .addField("name").component(LuminoTextInput).endField()
  .endRow()
  .end();

// As tabs - each item in a tab
this.addList("addresses")
  .as(LuminoTabs)
  .tabLabel((item, index) => item.city || \`Address \${index + 1}\`)
  .addRow()
    // fields...
  .endRow()
  .end();

// As table - items in a table with columns
this.addList("experiences")
  .as(LuminoTable)
  .tableColumns([
    { field: "company", header: "Company", width: "40%" },
    { field: "title", header: "Title", width: "30%" },
    { field: "years", header: "Years", width: "30%" },
  ])
  .end();

// With dialog for add/edit
this.addList("contacts")
  .editForm(ContactDialogForm)  // Form class for edit dialog
  .end();`}
          language="typescript"
        />
      </div>

      {/* Min/Max Constraints */}
      <div className="docs-section">
        <h2 className="docs-section-title">Min/Max Constraints</h2>
        <p>
          Use <code>.min()</code> and <code>.max()</code> to limit the number of items:
        </p>
        <CodeBlock
          code={`this.addList("tags")
  .min(1)  // At least 1 item required
  .max(10) // Maximum 10 items allowed
  .addRow()
    .addField("value")
      .component(LuminoTextInput)
      .label("Tag")
    .endField()
  .endRow()
  .end();

// List validation errors appear at the list level
// "At least 1 item is required"
// "Maximum 10 items allowed"`}
          language="typescript"
        />
      </div>

      {/* Default Values */}
      <div className="docs-section">
        <h2 className="docs-section-title">Default Values</h2>
        <p>
          Use <code>.defaults()</code> to set initial values for new items:
        </p>
        <CodeBlock
          code={`// Static defaults
this.addList("addresses")
  .defaults({ type: "home", country: "US" })
  .end();

// Dynamic defaults based on context
this.addList("addresses")
  .defaults((ctx, index) => ({
    type: index === 0 ? "primary" : "secondary",
    country: ctx.getValue("defaultCountry") || "US"
  }))
  .end();`}
          language="typescript"
        />
      </div>

      {/* Nested Lists */}
      <div className="docs-section">
        <h2 className="docs-section-title">Nested Structures</h2>
        <p>
          Lists can contain nested objects and even other lists:
        </p>
        <CodeBlock
          code={`// List with nested object
this.addList("employees")
  .addRow()
    .addField("name").component(LuminoTextInput).endField()
  .endRow()
  .addObject("address")  // Nested object within each item
    .addRow()
      .addField("street").component(LuminoTextInput).endField()
      .addField("city").component(LuminoTextInput).endField()
    .endRow()
  .end()
  .end();

// Nested list (list within list)
this.addList("departments")
  .addRow()
    .addField("name").component(LuminoTextInput).endField()
  .endRow()
  .addList("employees")  // Nested list within each department
    .addRow()
      .addField("name").component(LuminoTextInput).endField()
    .endRow()
  .end()
  .end();`}
          language="typescript"
        />
      </div>

      {/* List Visibility */}
      <div className="docs-section">
        <h2 className="docs-section-title">List Visibility</h2>
        <p>
          Lists support the same visibility controls as fields:
        </p>
        <CodeBlock
          code={`this.addList("addresses")
  // Conditional visibility
  .visibleByCondition((ctx) => ctx.getValue("hasAddresses"))

  // Access-based visibility
  .visibleByAccess((ctx) => ctx.user?.hasAnyRole?.("admin", "hr"))
  .end();`}
          language="typescript"
        />
      </div>
    </>
  );
}
