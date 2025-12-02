/**
 * Form Rows Page - Horizontal layouts and columns
 */

import { CodeBlock } from "../../components/CodeBlock";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import {
  LuminoTextInput,
  LuminoNumberInput,
  LuminoSelect,
  LuminoDatePicker,
} from "lumino/react";

// =============================================================================
// FORM WITH VARIOUS ROW LAYOUTS
// =============================================================================

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  quantity: number | null;
  unitPrice: number | null;
  discount: number | null;
  orderDate: string | null;
}

const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
];

const states = [
  { value: "ca", label: "California" },
  { value: "ny", label: "New York" },
  { value: "tx", label: "Texas" },
  { value: "fl", label: "Florida" },
];

class OrderForm extends Form<OrderData> {
  constructor() {
    super("order-form");
  }

  configure() {
    // Section 1: Order Info - single column
    this.addSection("Order Information")
      .addRow()
        .addField("orderNumber")
          .component(LuminoTextInput)
          .label("Order Number")
          .placeholder("ORD-XXXX")
          .rules(Validators.required({ message: "Order number is required" }))
        .endField()
        .addField("orderDate")
          .component(LuminoDatePicker)
          .label("Order Date")
          .rules(Validators.required({ message: "Order date is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    // Section 2: Customer Info - various layouts
    this.addSection("Customer Information")
      // Full width row
      .addRow()
        .addField("customerName")
          .component(LuminoTextInput)
          .label("Customer Name")
          .placeholder("Full name")
          .rules(Validators.required({ message: "Name is required" }))
        .endField()
      .endRow()
      // Two equal columns
      .addRow()
        .addField("customerEmail")
          .component(LuminoTextInput)
          .label("Email")
          .placeholder("customer@example.com")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Invalid email format")
          )
        .endField()
        .addField("customerPhone")
          .component(LuminoTextInput)
          .label("Phone")
          .placeholder("(123) 456-7890")
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    // Section 3: Address - demonstrates multiple column configurations
    this.addSection("Shipping Address")
      // Full width
      .addRow()
        .addField("shippingStreet")
          .component(LuminoTextInput)
          .label("Street Address")
          .placeholder("123 Main St")
          .rules(Validators.required({ message: "Street is required" }))
        .endField()
      .endRow()
      // 2:1 ratio (City wider than State)
      .addRow()
        .addField("shippingCity")
          .component(LuminoTextInput)
          .label("City")
          .placeholder("City name")
          .rules(Validators.required({ message: "City is required" }))
        .endField()
        .addField("shippingState")
          .component(LuminoSelect)
          .label("State")
          .placeholder("Select state")
          .props({ options: states })
          .rules(Validators.required({ message: "State is required" }))
        .endField()
        .layout([2, 1])
      .endRow()
      // Three columns: 1:2:1 ratio
      .addRow()
        .addField("shippingZip")
          .component(LuminoTextInput)
          .label("ZIP Code")
          .placeholder("12345")
          .rules(Validators.required({ message: "ZIP is required" }))
        .endField()
        .addField("shippingCountry")
          .component(LuminoSelect)
          .label("Country")
          .placeholder("Select country")
          .props({ options: countries })
          .rules(Validators.required({ message: "Country is required" }))
        .endField()
        .layout([1, 2])
      .endRow()
    .endSection();

    // Section 4: Pricing - three equal columns
    this.addSection("Pricing")
      .addRow()
        .addField("quantity")
          .component(LuminoNumberInput)
          .label("Quantity")
          .placeholder("1")
          .props({ min: 1 })
          .rules(Validators.required({ message: "Quantity is required" }))
        .endField()
        .addField("unitPrice")
          .component(LuminoNumberInput)
          .label("Unit Price ($)")
          .placeholder("0.00")
          .props({ min: 0, step: 0.01 })
          .rules(Validators.required({ message: "Price is required" }))
        .endField()
        .addField("discount")
          .component(LuminoNumberInput)
          .label("Discount (%)")
          .placeholder("0")
          .props({ min: 0, max: 100 })
        .endField()
        .layout([1, 1, 1])
      .endRow()
    .endSection();
  }
}

const rowsCode = `import { Form, Validators } from "lumino/core";
import {
  LuminoTextInput,
  LuminoNumberInput,
  LuminoSelect,
  LuminoDatePicker,
} from "lumino/react";

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  quantity: number | null;
  unitPrice: number | null;
  discount: number | null;
  orderDate: string | null;
}

class OrderForm extends Form<OrderData> {
  constructor() {
    super("order-form");
  }

  configure() {
    // Order Info - two equal columns
    this.addSection("Order Information")
      .addRow()
        .addField("orderNumber")
          .component(LuminoTextInput)
          .label("Order Number")
          .rules(Validators.required())
        .endField()
        .addField("orderDate")
          .component(LuminoDatePicker)
          .label("Order Date")
          .rules(Validators.required())
        .endField()
        .layout([1, 1])  // Equal width columns
      .endRow()
    .endSection();

    // Customer Info - full width + two columns
    this.addSection("Customer Information")
      .addRow()
        .addField("customerName")
          .component(LuminoTextInput)
          .label("Customer Name")
          .rules(Validators.required())
        .endField()
        // No layout = full width
      .endRow()
      .addRow()
        .addField("customerEmail")
          .component(LuminoTextInput)
          .label("Email")
          .rules(Validators.required(), Validators.email())
        .endField()
        .addField("customerPhone")
          .component(LuminoTextInput)
          .label("Phone")
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();

    // Shipping - demonstrates 2:1 ratio
    this.addSection("Shipping Address")
      .addRow()
        .addField("shippingCity")
          .component(LuminoTextInput)
          .label("City")
          .rules(Validators.required())
        .endField()
        .addField("shippingState")
          .component(LuminoSelect)
          .label("State")
          .props({ options: states })
        .endField()
        .layout([2, 1])  // City is 2x wider than State
      .endRow()
    .endSection();

    // Pricing - three equal columns
    this.addSection("Pricing")
      .addRow()
        .addField("quantity")
          .component(LuminoNumberInput)
          .label("Quantity")
          .props({ min: 1 })
        .endField()
        .addField("unitPrice")
          .component(LuminoNumberInput)
          .label("Unit Price")
          .props({ min: 0 })
        .endField()
        .addField("discount")
          .component(LuminoNumberInput)
          .label("Discount (%)")
          .props({ min: 0, max: 100 })
        .endField()
        .layout([1, 1, 1])  // Three equal columns
      .endRow()
    .endSection();
  }
}`;

const rowApiCode = `// RowBuilder API
addRow(): RowBuilder<T>

// RowBuilder methods
.addField(name: keyof T): FieldBuilder<T>
.addComponent(Component): ComponentBuilder
.layout(ratios: number[])          // Column width ratios
.hideByCondition(fn)               // Conditional visibility
.css(className: string)            // Custom CSS class
.style(styles: CSSProperties)      // Inline styles

// Return to parent
.endRow(): SectionBuilder<T> | FormBuilder<T>`;

const basicRowCode = `// Single field (full width)
this.addRow()
  .addField("email")
    .component(LuminoTextInput)
    .label("Email")
  .endField()
.endRow();

// Two fields (will stack without layout)
this.addRow()
  .addField("firstName")
    .component(LuminoTextInput)
    .label("First Name")
  .endField()
  .addField("lastName")
    .component(LuminoTextInput)
    .label("Last Name")
  .endField()
.endRow();`;

const layoutExamplesCode = `// Equal columns
.layout([1, 1])       // Two equal columns (50% / 50%)
.layout([1, 1, 1])    // Three equal columns (33% each)
.layout([1, 1, 1, 1]) // Four equal columns (25% each)

// Weighted columns
.layout([2, 1])       // First column 2x wider (66% / 33%)
.layout([1, 2, 1])    // Middle column 2x wider (25% / 50% / 25%)
.layout([3, 1])       // First column 3x wider (75% / 25%)

// Complex layouts
.layout([1, 2, 3])    // 16% / 33% / 50% approximately
.layout([8, 2, 2])    // 66% / 17% / 17% (12-column grid style)`;

const conditionalRowCode = `// Hide row based on form state
this.addRow()
  .addField("shippingAddress")
    .component(LuminoTextInput)
    .label("Shipping Address")
  .endField()
  .hideByCondition((ctx) => ctx.getValue("pickupInStore"))
.endRow();`;

const styledRowCode = `// Custom styling
this.addRow()
  .css("highlighted-row")
  .style({
    backgroundColor: "#f0f8ff",
    padding: "12px",
    borderRadius: "4px",
  })
  .addField("importantField")
    .component(LuminoTextInput)
    .label("Important Field")
  .endField()
.endRow();`;

const rowWithComponentsCode = `// Mix fields and components in a row
this.addRow()
  .addField("quantity")
    .component(LuminoNumberInput)
    .label("Quantity")
  .endField()
  .addComponent(LuminoButton)
    .children("Calculate Total")
    .props({ variant: "secondary" })
    .onClick((ctx) => {
      const qty = ctx.getValue("quantity");
      const price = ctx.getValue("unitPrice");
      ctx.setValue("total", qty * price);
    })
  .endComponent()
  .layout([2, 1])
.endRow();`;

export function FormRowsPage() {
  const form = new OrderForm();

  return (
    <>
      <h1 className="docs-page-title">Form Rows</h1>
      <p className="docs-page-subtitle">
        Rows provide horizontal layout with flexible column configuration.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Overview</h2>
        <p>
          Rows are the horizontal building blocks within sections. Each row can contain
          multiple fields that are laid out side by side. The <code>.layout()</code> method
          controls how columns are distributed.
        </p>
        <ul>
          <li>Group related fields horizontally (First Name + Last Name)</li>
          <li>Control column widths with ratio-based layouts</li>
          <li>Mix fields and action buttons in a single row</li>
          <li>Apply conditional visibility and custom styling</li>
        </ul>
      </div>

      {/* API Reference */}
      <div className="docs-section">
        <h2 className="docs-section-title">API Reference</h2>
        <CodeBlock code={rowApiCode} language="typescript" />
      </div>

      {/* Live Demo */}
      <div className="docs-section">
        <h2 className="docs-section-title">Live Example</h2>
        <p>
          This form demonstrates various row layouts - equal columns, weighted columns,
          and different column counts:
        </p>
        <LuminoLiveDemo
          title="Order Form"
          description="Various row layouts and column configurations"
          form={form}
          code={rowsCode}
          initialValues={{
            orderNumber: "",
            customerName: "",
            customerEmail: "",
            customerPhone: "",
            shippingStreet: "",
            shippingCity: "",
            shippingState: "",
            shippingZip: "",
            shippingCountry: "",
            quantity: null,
            unitPrice: null,
            discount: null,
            orderDate: null,
          }}
          defaultView="split"
        />
      </div>

      {/* Basic Rows */}
      <div className="docs-section">
        <h2 className="docs-section-title">Basic Rows</h2>
        <p>
          Without a <code>.layout()</code> call, fields will stack vertically.
          Add <code>.layout([1, 1])</code> for side-by-side display:
        </p>
        <CodeBlock code={basicRowCode} language="typescript" />
      </div>

      {/* Layout Examples */}
      <div className="docs-section">
        <h2 className="docs-section-title">Layout Configurations</h2>
        <p>
          The <code>.layout()</code> method takes an array of numbers representing
          relative column widths. The numbers are ratios, not percentages:
        </p>
        <CodeBlock code={layoutExamplesCode} language="typescript" />
        <p>
          <strong>How it works:</strong> The ratios are summed, and each column gets
          its proportion. For <code>[2, 1]</code>, the total is 3, so the first column
          gets 2/3 (66%) and the second gets 1/3 (33%).
        </p>
      </div>

      {/* Conditional Rows */}
      <div className="docs-section">
        <h2 className="docs-section-title">Conditional Visibility</h2>
        <p>
          Hide entire rows based on form state:
        </p>
        <CodeBlock code={conditionalRowCode} language="typescript" />
      </div>

      {/* Styled Rows */}
      <div className="docs-section">
        <h2 className="docs-section-title">Custom Styling</h2>
        <p>
          Apply CSS classes and inline styles to rows:
        </p>
        <CodeBlock code={styledRowCode} language="typescript" />
      </div>

      {/* Rows with Components */}
      <div className="docs-section">
        <h2 className="docs-section-title">Mixing Fields and Components</h2>
        <p>
          Rows can contain both fields and standalone components (like buttons):
        </p>
        <CodeBlock code={rowWithComponentsCode} language="typescript" />
      </div>

      {/* Best Practices */}
      <div className="docs-section">
        <h2 className="docs-section-title">Best Practices</h2>
        <ul>
          <li>
            <strong>2-3 fields per row</strong> - More than 3 fields can feel cramped,
            especially on smaller screens
          </li>
          <li>
            <strong>Related fields together</strong> - Place fields that are logically
            connected (City/State/ZIP) in the same row
          </li>
          <li>
            <strong>Use consistent layouts</strong> - Similar forms should use similar
            column structures for user familiarity
          </li>
          <li>
            <strong>Consider mobile</strong> - Multi-column layouts may stack on smaller
            screens; test responsive behavior
          </li>
        </ul>
      </div>

      {/* What's Next */}
      <div className="docs-section">
        <h2 className="docs-section-title">What's Next?</h2>
        <ul>
          <li><strong>Fields</strong> - Deep dive into field configuration</li>
          <li><strong>Validation</strong> - Adding validation rules to fields</li>
          <li><strong>FormContext</strong> - Accessing form state in callbacks</li>
        </ul>
      </div>
    </>
  );
}
