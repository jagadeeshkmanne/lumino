/**
 * Form Computed Values Documentation
 *
 * Documents how to create computed/derived field values with mini demos.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React from "react";
import { Form, Validators } from "lumino/core";
import {
  LuminoTextInput,
  LuminoNumberInput,
  LuminoSelect,
  FormRenderer,
} from "lumino/react";
import { LiveDemo } from "../../components/LiveDemo";

// =============================================================================
// DEMO ENTITIES
// =============================================================================

class InvoiceLineEntity {
  quantity: number = 1;
  unitPrice: number = 0;
  subtotal: number = 0;
}

class DiscountEntity {
  subtotal: number = 100;
  discountType: string = "percent";
  discountValue: number = 10;
  discountAmount: number = 10;
  total: number = 90;
}

class FullNameEntity {
  firstName: string = "";
  lastName: string = "";
  fullName: string = "";
  email: string = "";
  username: string = "";
}

class TaxEntity {
  baseAmount: number = 100;
  taxRate: number = 8.5;
  taxAmount: number = 8.5;
  totalWithTax: number = 108.5;
}

// =============================================================================
// DEMO 1: Simple Computed Value
// =============================================================================

class SimpleComputedForm extends Form<InvoiceLineEntity> {
  constructor() {
    super("simple-computed");
  }

  configure() {
    this.addSection("Line Item Subtotal")
      .addRow()
        .addField("quantity")
          .component(LuminoNumberInput)
          .label("Quantity")
          .props({ min: 1, max: 999 })
          .rules(Validators.required({ message: "Quantity is required" }))
          .endField()
        .addField("unitPrice")
          .component(LuminoNumberInput)
          .label("Unit Price")
          .props({ min: 0, prefix: "$", step: 0.01 })
          .rules(Validators.required({ message: "Price is required" }))
          .endField()
        .addField("subtotal")
          .component(LuminoNumberInput)
          .label("Subtotal")
          .props({ prefix: "$", readOnly: true })
          .readOnly(() => true)
          .dependsOn(["quantity", "unitPrice"], {
            handler: (_, ctx) => {
              const qty = ctx.getValue("quantity") || 0;
              const price = ctx.getValue("unitPrice") || 0;
              ctx.setValue("subtotal", qty * price);
            }
          })
          .endField()
        .layout([1, 1, 1])
      .endRow()
    .endSection();
  }
}

const simpleComputedCode = `class SimpleComputedForm extends Form<InvoiceLineEntity> {
  configure() {
    this.addSection("Line Item Subtotal")
      .addRow()
        .addField("quantity")
          .component(LuminoNumberInput)
          .label("Quantity")
          .props({ min: 1 })
          .endField()
        .addField("unitPrice")
          .component(LuminoNumberInput)
          .label("Unit Price")
          .props({ prefix: "$" })
          .endField()
        .addField("subtotal")
          .component(LuminoNumberInput)
          .label("Subtotal")
          .props({ prefix: "$", readOnly: true })
          .readOnly(() => true)
          // Computed from quantity and unitPrice
          .dependsOn(["quantity", "unitPrice"], {
            handler: (_, ctx) => {
              const qty = ctx.getValue("quantity") || 0;
              const price = ctx.getValue("unitPrice") || 0;
              ctx.setValue("subtotal", qty * price);
            }
          })
          .endField()
        .layout([1, 1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 2: Conditional Computation
// =============================================================================

const discountTypes = [
  { value: "percent", label: "Percentage (%)" },
  { value: "fixed", label: "Fixed Amount ($)" },
];

class ConditionalComputedForm extends Form<DiscountEntity> {
  constructor() {
    super("conditional-computed");
  }

  configure() {
    this.addSection("Discount Calculation")
      .addRow()
        .addField("subtotal")
          .component(LuminoNumberInput)
          .label("Subtotal")
          .props({ min: 0, prefix: "$" })
          .endField()
        .addField("discountType")
          .component(LuminoSelect)
          .label("Discount Type")
          .props({ options: discountTypes })
          .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("discountValue")
          .component(LuminoNumberInput)
          .label((ctx) =>
            ctx.getValue("discountType") === "percent"
              ? "Discount (%)"
              : "Discount ($)"
          )
          .props((ctx) => ({
            min: 0,
            max: ctx.getValue("discountType") === "percent" ? 100 : undefined,
            suffix: ctx.getValue("discountType") === "percent" ? "%" : undefined,
            prefix: ctx.getValue("discountType") === "fixed" ? "$" : undefined,
          }))
          .endField()
        .addField("discountAmount")
          .component(LuminoNumberInput)
          .label("Discount Amount")
          .props({ prefix: "$", readOnly: true })
          .readOnly(() => true)
          .dependsOn(["subtotal", "discountType", "discountValue"], {
            handler: (_, ctx) => {
              const subtotal = ctx.getValue("subtotal") || 0;
              const type = ctx.getValue("discountType");
              const value = ctx.getValue("discountValue") || 0;

              let discountAmount = 0;
              if (type === "percent") {
                discountAmount = subtotal * (value / 100);
              } else {
                discountAmount = Math.min(value, subtotal);
              }
              ctx.setValue("discountAmount", Math.round(discountAmount * 100) / 100);
            }
          })
          .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("total")
          .component(LuminoNumberInput)
          .label("Total After Discount")
          .props({ prefix: "$", readOnly: true })
          .readOnly(() => true)
          .dependsOn(["subtotal", "discountAmount"], {
            handler: (_, ctx) => {
              const subtotal = ctx.getValue("subtotal") || 0;
              const discount = ctx.getValue("discountAmount") || 0;
              ctx.setValue("total", Math.round((subtotal - discount) * 100) / 100);
            }
          })
          .endField()
      .endRow()
    .endSection();
  }
}

const conditionalComputedCode = `class ConditionalComputedForm extends Form<DiscountEntity> {
  configure() {
    this.addSection("Discount Calculation")
      .addRow()
        .addField("subtotal")
          .component(LuminoNumberInput)
          .label("Subtotal")
          .props({ prefix: "$" })
          .endField()
        .addField("discountType")
          .component(LuminoSelect)
          .label("Discount Type")
          .props({ options: discountTypes })
          .endField()
      .endRow()
      .addRow()
        .addField("discountValue")
          .component(LuminoNumberInput)
          // Dynamic label based on discount type
          .label((ctx) =>
            ctx.getValue("discountType") === "percent"
              ? "Discount (%)"
              : "Discount ($)"
          )
          .endField()
        .addField("discountAmount")
          .component(LuminoNumberInput)
          .label("Discount Amount")
          .readOnly(() => true)
          // Conditional calculation based on type
          .dependsOn(["subtotal", "discountType", "discountValue"], {
            handler: (_, ctx) => {
              const subtotal = ctx.getValue("subtotal") || 0;
              const type = ctx.getValue("discountType");
              const value = ctx.getValue("discountValue") || 0;

              let discountAmount = 0;
              if (type === "percent") {
                discountAmount = subtotal * (value / 100);
              } else {
                discountAmount = Math.min(value, subtotal);
              }
              ctx.setValue("discountAmount", discountAmount);
            }
          })
          .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 3: String Computed Values
// =============================================================================

class StringComputedForm extends Form<FullNameEntity> {
  constructor() {
    super("string-computed");
  }

  configure() {
    this.addSection("Name and Username Generation")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .placeholder("Enter first name")
          .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .placeholder("Enter last name")
          .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("fullName")
          .component(LuminoTextInput)
          .label("Full Name (computed)")
          .readOnly(() => true)
          .dependsOn(["firstName", "lastName"], {
            handler: (_, ctx) => {
              const first = ctx.getValue("firstName") || "";
              const last = ctx.getValue("lastName") || "";
              const full = [first, last].filter(Boolean).join(" ");
              ctx.setValue("fullName", full);
            }
          })
          .endField()
        .addField("username")
          .component(LuminoTextInput)
          .label("Suggested Username")
          .readOnly(() => true)
          .dependsOn(["firstName", "lastName"], {
            handler: (_, ctx) => {
              const first = (ctx.getValue("firstName") || "").toLowerCase();
              const last = (ctx.getValue("lastName") || "").toLowerCase();
              if (first && last) {
                ctx.setValue("username", `${first}.${last}`);
              } else if (first || last) {
                ctx.setValue("username", first || last);
              } else {
                ctx.setValue("username", "");
              }
            }
          })
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const stringComputedCode = `class StringComputedForm extends Form<FullNameEntity> {
  configure() {
    this.addSection("Name and Username Generation")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("fullName")
          .component(LuminoTextInput)
          .label("Full Name (computed)")
          .readOnly(() => true)
          // Combine first and last name
          .dependsOn(["firstName", "lastName"], {
            handler: (_, ctx) => {
              const first = ctx.getValue("firstName") || "";
              const last = ctx.getValue("lastName") || "";
              ctx.setValue("fullName", [first, last].filter(Boolean).join(" "));
            }
          })
          .endField()
        .addField("username")
          .component(LuminoTextInput)
          .label("Suggested Username")
          .readOnly(() => true)
          // Generate username from names
          .dependsOn(["firstName", "lastName"], {
            handler: (_, ctx) => {
              const first = (ctx.getValue("firstName") || "").toLowerCase();
              const last = (ctx.getValue("lastName") || "").toLowerCase();
              ctx.setValue("username", first && last ? \`\${first}.\${last}\` : "");
            }
          })
          .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DEMO 4: Chained Computations
// =============================================================================

class ChainedComputedForm extends Form<TaxEntity> {
  constructor() {
    super("chained-computed");
  }

  configure() {
    this.addSection("Tax Calculation Chain")
      .addRow()
        .addField("baseAmount")
          .component(LuminoNumberInput)
          .label("Base Amount")
          .props({ min: 0, prefix: "$" })
          .endField()
        .addField("taxRate")
          .component(LuminoNumberInput)
          .label("Tax Rate")
          .props({ min: 0, max: 100, suffix: "%", step: 0.5 })
          .endField()
        .layout([1, 1])
      .endRow()
      .addRow()
        .addField("taxAmount")
          .component(LuminoNumberInput)
          .label("Tax Amount")
          .props({ prefix: "$", readOnly: true })
          .readOnly(() => true)
          .dependsOn(["baseAmount", "taxRate"], {
            handler: (_, ctx) => {
              const base = ctx.getValue("baseAmount") || 0;
              const rate = ctx.getValue("taxRate") || 0;
              const tax = base * (rate / 100);
              ctx.setValue("taxAmount", Math.round(tax * 100) / 100);
            }
          })
          .endField()
        .addField("totalWithTax")
          .component(LuminoNumberInput)
          .label("Total with Tax")
          .props({ prefix: "$", readOnly: true })
          .readOnly(() => true)
          .dependsOn(["baseAmount", "taxAmount"], {
            handler: (_, ctx) => {
              const base = ctx.getValue("baseAmount") || 0;
              const tax = ctx.getValue("taxAmount") || 0;
              ctx.setValue("totalWithTax", Math.round((base + tax) * 100) / 100);
            }
          })
          .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const chainedComputedCode = `class ChainedComputedForm extends Form<TaxEntity> {
  configure() {
    this.addSection("Tax Calculation Chain")
      .addRow()
        .addField("baseAmount")
          .component(LuminoNumberInput)
          .label("Base Amount")
          .props({ prefix: "$" })
          .endField()
        .addField("taxRate")
          .component(LuminoNumberInput)
          .label("Tax Rate")
          .props({ suffix: "%" })
          .endField()
      .endRow()
      .addRow()
        .addField("taxAmount")
          .component(LuminoNumberInput)
          .label("Tax Amount")
          .readOnly(() => true)
          // First computation: taxAmount = baseAmount * taxRate
          .dependsOn(["baseAmount", "taxRate"], {
            handler: (_, ctx) => {
              const base = ctx.getValue("baseAmount") || 0;
              const rate = ctx.getValue("taxRate") || 0;
              ctx.setValue("taxAmount", base * (rate / 100));
            }
          })
          .endField()
        .addField("totalWithTax")
          .component(LuminoNumberInput)
          .label("Total with Tax")
          .readOnly(() => true)
          // Chained: depends on computed taxAmount
          .dependsOn(["baseAmount", "taxAmount"], {
            handler: (_, ctx) => {
              const base = ctx.getValue("baseAmount") || 0;
              const tax = ctx.getValue("taxAmount") || 0;
              ctx.setValue("totalWithTax", base + tax);
            }
          })
          .endField()
      .endRow()
    .endSection();
  }
}

// Computation chain:
// baseAmount/taxRate change -> taxAmount computed
// taxAmount change -> totalWithTax computed`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function FormComputedPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Computed Values</h1>
      <p className="docs-page-subtitle">
        Learn how to create fields whose values are automatically computed
        from other fields. Computed values update in real-time as dependencies change.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the Lumino source code.
        Computed values are implemented using the <code>.dependsOn()</code> method with a handler.
      </div>

      <div className="docs-section">
        <h2>How Computed Values Work</h2>
        <p>
          In Lumino, computed values are created by:
        </p>
        <ol className="docs-list">
          <li>Making the field <code>.readOnly(() =&gt; true)</code> to prevent user edits</li>
          <li>Using <code>.dependsOn()</code> to watch source fields</li>
          <li>Providing a <code>handler</code> that computes and sets the value</li>
        </ol>
        <pre className="docs-code">{`.addField("computed")
  .component(LuminoNumberInput)
  .label("Computed Value")
  .readOnly(() => true)  // User can't edit
  .dependsOn(["field1", "field2"], {
    handler: (_, ctx) => {
      const val1 = ctx.getValue("field1") || 0;
      const val2 = ctx.getValue("field2") || 0;
      ctx.setValue("computed", val1 + val2);
    }
  })
  .endField()`}</pre>
      </div>

      <div className="docs-section">
        <h2>1. Simple Computation</h2>
        <p>
          Basic example: subtotal = quantity × unit price.
          Change quantity or price to see the subtotal update.
        </p>
        <LiveDemo
          title="Simple Computed Value"
          description="Subtotal computed from quantity and price"
          code={simpleComputedCode}
          FormClass={SimpleComputedForm}
          EntityClass={InvoiceLineEntity}
        />
      </div>

      <div className="docs-section">
        <h2>2. Conditional Computation</h2>
        <p>
          The computation logic can vary based on other field values.
          Here, the discount calculation depends on whether it's a percentage or fixed amount.
        </p>
        <LiveDemo
          title="Conditional Computation"
          description="Discount calculation varies by type"
          code={conditionalComputedCode}
          FormClass={ConditionalComputedForm}
          EntityClass={DiscountEntity}
        />
      </div>

      <div className="docs-section">
        <h2>3. String Computed Values</h2>
        <p>
          Computed values aren't just for numbers. You can compute strings too,
          like generating a full name or suggested username from name fields.
        </p>
        <LiveDemo
          title="String Computations"
          description="Full name and username generated from first/last name"
          code={stringComputedCode}
          FormClass={StringComputedForm}
          EntityClass={FullNameEntity}
        />
      </div>

      <div className="docs-section">
        <h2>4. Chained Computations</h2>
        <p>
          Computed values can depend on other computed values, creating a chain.
          Here, totalWithTax depends on taxAmount, which depends on baseAmount and taxRate.
        </p>
        <LiveDemo
          title="Chained Computations"
          description="Total depends on computed tax amount"
          code={chainedComputedCode}
          FormClass={ChainedComputedForm}
          EntityClass={TaxEntity}
        />
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Always use <code>readOnly(() =&gt; true)</code></strong> for computed
            fields to prevent user edits that would be overwritten
          </li>
          <li>
            <strong>Handle null/undefined values</strong> with defaults (e.g., <code>|| 0</code>)
            to avoid NaN results
          </li>
          <li>
            <strong>Round currency values</strong> to avoid floating-point precision issues:
            <code>Math.round(value * 100) / 100</code>
          </li>
          <li>
            <strong>Keep computations simple</strong> - complex business logic should be
            in lifecycle hooks or service functions
          </li>
          <li>
            <strong>Consider validation</strong> - computed fields usually don't need
            validation since they're derived from validated inputs
          </li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Alternative: Lifecycle Hooks</h2>
        <p>
          For complex computations, you can use the <code>onFieldChange</code> lifecycle hook:
        </p>
        <pre className="docs-code">{`class OrderForm extends Form<Order> {
  configure() {
    // ... field definitions
  }

  // Called whenever any field changes
  onFieldChange(field: string, value: any, ctx: FormContext) {
    // Recalculate totals when relevant fields change
    if (["quantity", "unitPrice", "discount", "taxRate"].includes(field)) {
      this.recalculateTotals(ctx);
    }
  }

  private recalculateTotals(ctx: FormContext) {
    const qty = ctx.getValue("quantity") || 0;
    const price = ctx.getValue("unitPrice") || 0;
    const discount = ctx.getValue("discount") || 0;
    const taxRate = ctx.getValue("taxRate") || 0;

    const subtotal = qty * price;
    const discountAmount = subtotal * (discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const tax = afterDiscount * (taxRate / 100);
    const total = afterDiscount + tax;

    ctx.setValue("subtotal", subtotal);
    ctx.setValue("discountAmount", discountAmount);
    ctx.setValue("taxAmount", tax);
    ctx.setValue("total", total);
  }
}`}</pre>
      </div>
    </div>
  );
}
