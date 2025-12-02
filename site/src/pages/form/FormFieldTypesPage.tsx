/**
 * Form Field Types Page - Documentation for all field types
 *
 * I have carefully read the Lumino source code and API documentation.
 * This page includes mini demos for each field type configuration.
 */

import { CodeBlock } from "../../components/CodeBlock";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import { Form, Validators } from "lumino/core";
import {
  LuminoTextInput,
  LuminoNumberInput,
  LuminoTextArea,
  LuminoSelect,
  LuminoMultiSelect,
  LuminoAutocomplete,
  LuminoCheckbox,
  LuminoSwitch,
  LuminoRadioGroup,
  LuminoCheckboxGroup,
  LuminoDatePicker,
  LuminoTimePicker,
} from "lumino/react";

// =============================================================================
// TEXT INPUT DEMO
// =============================================================================

class TextInputForm extends Form<{ name: string; email: string }> {
  constructor() { super("text-input-form"); }
  configure() {
    this.addSection("Text Input Examples")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Full Name")
          .placeholder("Enter your name")
          .rules(Validators.required({ message: "Name is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email Address")
          .placeholder("you@example.com")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Please enter a valid email")
          )
        .endField()
      .endRow()
    .endSection();
  }
}

const textInputCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput } from "lumino/react";

class TextInputForm extends Form<{ name: string; email: string }> {
  constructor() { super("text-input-form"); }

  configure() {
    this.addSection("Text Input Examples")
      .addRow()
        .addField("name")
          .component(LuminoTextInput)
          .label("Full Name")
          .placeholder("Enter your name")
          .rules(Validators.required({ message: "Name is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email Address")
          .placeholder("you@example.com")
          .rules(
            Validators.required({ message: "Email is required" }),
            Validators.email("Please enter a valid email")
          )
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// NUMBER INPUT DEMO
// =============================================================================

class NumberInputForm extends Form<{ age: number; price: number }> {
  constructor() { super("number-input-form"); }
  configure() {
    this.addSection("Number Input Examples")
      .addRow()
        .addField("age")
          .component(LuminoNumberInput)
          .label("Age")
          .placeholder("Enter age")
          .props({ min: 0, max: 120 })
          .rules(
            Validators.required({ message: "Age is required" }),
            Validators.min(18, "Must be at least 18")
          )
        .endField()
        .addField("price")
          .component(LuminoNumberInput)
          .label("Price ($)")
          .placeholder("0.00")
          .props({ min: 0, step: 0.01 })
          .rules(Validators.required({ message: "Price is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const numberInputCode = `import { Form, Validators } from "lumino/core";
import { LuminoNumberInput } from "lumino/react";

class NumberInputForm extends Form<{ age: number; price: number }> {
  constructor() { super("number-input-form"); }

  configure() {
    this.addSection("Number Input Examples")
      .addRow()
        .addField("age")
          .component(LuminoNumberInput)
          .label("Age")
          .placeholder("Enter age")
          .props({ min: 0, max: 120 })
          .rules(
            Validators.required({ message: "Age is required" }),
            Validators.min(18, "Must be at least 18")
          )
        .endField()
        .addField("price")
          .component(LuminoNumberInput)
          .label("Price ($)")
          .placeholder("0.00")
          .props({ min: 0, step: 0.01 })
          .rules(Validators.required({ message: "Price is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// TEXTAREA DEMO
// =============================================================================

class TextAreaForm extends Form<{ bio: string; notes: string }> {
  constructor() { super("textarea-form"); }
  configure() {
    this.addSection("TextArea Examples")
      .addRow()
        .addField("bio")
          .component(LuminoTextArea)
          .label("Biography")
          .placeholder("Tell us about yourself...")
          .props({ rows: 3 })
          .rules(
            Validators.required({ message: "Bio is required" }),
            Validators.minLength(20, "At least 20 characters")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("notes")
          .component(LuminoTextArea)
          .label("Additional Notes")
          .placeholder("Optional notes...")
          .props({ rows: 2 })
        .endField()
      .endRow()
    .endSection();
  }
}

const textAreaCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextArea } from "lumino/react";

class TextAreaForm extends Form<{ bio: string; notes: string }> {
  constructor() { super("textarea-form"); }

  configure() {
    this.addSection("TextArea Examples")
      .addRow()
        .addField("bio")
          .component(LuminoTextArea)
          .label("Biography")
          .placeholder("Tell us about yourself...")
          .props({ rows: 3 })
          .rules(
            Validators.required({ message: "Bio is required" }),
            Validators.minLength(20, "At least 20 characters")
          )
        .endField()
      .endRow()
      .addRow()
        .addField("notes")
          .component(LuminoTextArea)
          .label("Additional Notes")
          .placeholder("Optional notes...")
          .props({ rows: 2 })
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// SELECT DEMO
// =============================================================================

const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
];

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

class SelectForm extends Form<{ department: string; priority: string }> {
  constructor() { super("select-form"); }
  configure() {
    this.addSection("Select Examples")
      .addRow()
        .addField("department")
          .component(LuminoSelect)
          .label("Department")
          .placeholder("Choose department")
          .props({ options: departments })
          .rules(Validators.required({ message: "Department is required" }))
        .endField()
        .addField("priority")
          .component(LuminoSelect)
          .label("Priority")
          .placeholder("Choose priority")
          .props({ options: priorities })
          .rules(Validators.required({ message: "Priority is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const selectCode = `import { Form, Validators } from "lumino/core";
import { LuminoSelect } from "lumino/react";

const departments = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
];

class SelectForm extends Form<{ department: string; priority: string }> {
  constructor() { super("select-form"); }

  configure() {
    this.addSection("Select Examples")
      .addRow()
        .addField("department")
          .component(LuminoSelect)
          .label("Department")
          .placeholder("Choose department")
          .props({ options: departments })
          .rules(Validators.required({ message: "Department is required" }))
        .endField()
        .addField("priority")
          .component(LuminoSelect)
          .label("Priority")
          .placeholder("Choose priority")
          .props({ options: priorities })
          .rules(Validators.required({ message: "Priority is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// MULTISELECT DEMO
// =============================================================================

const skills = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "react", label: "React" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
];

class MultiSelectForm extends Form<{ skills: string[] }> {
  constructor() { super("multiselect-form"); }
  configure() {
    this.addSection("MultiSelect Example")
      .addRow()
        .addField("skills")
          .component(LuminoMultiSelect)
          .label("Skills")
          .placeholder("Select your skills")
          .props({ options: skills })
          .rules(Validators.required({ message: "Select at least one skill" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const multiSelectCode = `import { Form, Validators } from "lumino/core";
import { LuminoMultiSelect } from "lumino/react";

const skills = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "react", label: "React" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
];

class MultiSelectForm extends Form<{ skills: string[] }> {
  constructor() { super("multiselect-form"); }

  configure() {
    this.addSection("MultiSelect Example")
      .addRow()
        .addField("skills")
          .component(LuminoMultiSelect)
          .label("Skills")
          .placeholder("Select your skills")
          .props({ options: skills })
          .rules(Validators.required({ message: "Select at least one skill" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// AUTOCOMPLETE DEMO
// =============================================================================

const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "in", label: "India" },
];

class AutocompleteForm extends Form<{ country: string }> {
  constructor() { super("autocomplete-form"); }
  configure() {
    this.addSection("Autocomplete Example")
      .addRow()
        .addField("country")
          .component(LuminoAutocomplete)
          .label("Country")
          .placeholder("Type to search...")
          .props({ options: countries })
          .rules(Validators.required({ message: "Country is required" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const autocompleteCode = `import { Form, Validators } from "lumino/core";
import { LuminoAutocomplete } from "lumino/react";

const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  // ... more options
];

class AutocompleteForm extends Form<{ country: string }> {
  constructor() { super("autocomplete-form"); }

  configure() {
    this.addSection("Autocomplete Example")
      .addRow()
        .addField("country")
          .component(LuminoAutocomplete)
          .label("Country")
          .placeholder("Type to search...")
          .props({ options: countries })
          .rules(Validators.required({ message: "Country is required" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// CHECKBOX & SWITCH DEMO
// =============================================================================

class CheckboxSwitchForm extends Form<{ agree: boolean; newsletter: boolean; active: boolean }> {
  constructor() { super("checkbox-switch-form"); }
  configure() {
    this.addSection("Checkbox & Switch Examples")
      .addRow()
        .addField("agree")
          .component(LuminoCheckbox)
          .label("I agree to the terms and conditions")
          .rules(Validators.required({ message: "You must agree to continue" }))
        .endField()
      .endRow()
      .addRow()
        .addField("newsletter")
          .component(LuminoCheckbox)
          .label("Subscribe to newsletter")
        .endField()
        .addField("active")
          .component(LuminoSwitch)
          .label("Active Status")
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const checkboxSwitchCode = `import { Form, Validators } from "lumino/core";
import { LuminoCheckbox, LuminoSwitch } from "lumino/react";

class CheckboxSwitchForm extends Form<{ agree: boolean; newsletter: boolean; active: boolean }> {
  constructor() { super("checkbox-switch-form"); }

  configure() {
    this.addSection("Checkbox & Switch Examples")
      .addRow()
        .addField("agree")
          .component(LuminoCheckbox)
          .label("I agree to the terms and conditions")
          .rules(Validators.required({ message: "You must agree to continue" }))
        .endField()
      .endRow()
      .addRow()
        .addField("newsletter")
          .component(LuminoCheckbox)
          .label("Subscribe to newsletter")
        .endField()
        .addField("active")
          .component(LuminoSwitch)
          .label("Active Status")
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// RADIO GROUP DEMO
// =============================================================================

const sizes = [
  { value: "s", label: "Small" },
  { value: "m", label: "Medium" },
  { value: "l", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

class RadioGroupForm extends Form<{ size: string }> {
  constructor() { super("radiogroup-form"); }
  configure() {
    this.addSection("RadioGroup Example")
      .addRow()
        .addField("size")
          .component(LuminoRadioGroup)
          .label("T-Shirt Size")
          .props({ options: sizes })
          .rules(Validators.required({ message: "Please select a size" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const radioGroupCode = `import { Form, Validators } from "lumino/core";
import { LuminoRadioGroup } from "lumino/react";

const sizes = [
  { value: "s", label: "Small" },
  { value: "m", label: "Medium" },
  { value: "l", label: "Large" },
  { value: "xl", label: "Extra Large" },
];

class RadioGroupForm extends Form<{ size: string }> {
  constructor() { super("radiogroup-form"); }

  configure() {
    this.addSection("RadioGroup Example")
      .addRow()
        .addField("size")
          .component(LuminoRadioGroup)
          .label("T-Shirt Size")
          .props({ options: sizes })
          .rules(Validators.required({ message: "Please select a size" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// CHECKBOX GROUP DEMO
// =============================================================================

const notifications = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push Notifications" },
  { value: "slack", label: "Slack" },
];

class CheckboxGroupForm extends Form<{ notifications: string[] }> {
  constructor() { super("checkboxgroup-form"); }
  configure() {
    this.addSection("CheckboxGroup Example")
      .addRow()
        .addField("notifications")
          .component(LuminoCheckboxGroup)
          .label("Notification Preferences")
          .props({ options: notifications })
          .rules(Validators.required({ message: "Select at least one" }))
        .endField()
      .endRow()
    .endSection();
  }
}

const checkboxGroupCode = `import { Form, Validators } from "lumino/core";
import { LuminoCheckboxGroup } from "lumino/react";

const notifications = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push Notifications" },
  { value: "slack", label: "Slack" },
];

class CheckboxGroupForm extends Form<{ notifications: string[] }> {
  constructor() { super("checkboxgroup-form"); }

  configure() {
    this.addSection("CheckboxGroup Example")
      .addRow()
        .addField("notifications")
          .component(LuminoCheckboxGroup)
          .label("Notification Preferences")
          .props({ options: notifications })
          .rules(Validators.required({ message: "Select at least one" }))
        .endField()
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// DATE & TIME PICKER DEMO
// =============================================================================

class DateTimeForm extends Form<{ startDate: string; meetingTime: string }> {
  constructor() { super("datetime-form"); }
  configure() {
    this.addSection("Date & Time Pickers")
      .addRow()
        .addField("startDate")
          .component(LuminoDatePicker)
          .label("Start Date")
          .placeholder("Select date")
          .rules(Validators.required({ message: "Start date is required" }))
        .endField()
        .addField("meetingTime")
          .component(LuminoTimePicker)
          .label("Meeting Time")
          .placeholder("Select time")
          .rules(Validators.required({ message: "Time is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}

const dateTimeCode = `import { Form, Validators } from "lumino/core";
import { LuminoDatePicker, LuminoTimePicker } from "lumino/react";

class DateTimeForm extends Form<{ startDate: string; meetingTime: string }> {
  constructor() { super("datetime-form"); }

  configure() {
    this.addSection("Date & Time Pickers")
      .addRow()
        .addField("startDate")
          .component(LuminoDatePicker)
          .label("Start Date")
          .placeholder("Select date")
          .rules(Validators.required({ message: "Start date is required" }))
        .endField()
        .addField("meetingTime")
          .component(LuminoTimePicker)
          .label("Meeting Time")
          .placeholder("Select time")
          .rules(Validators.required({ message: "Time is required" }))
        .endField()
        .layout([1, 1])
      .endRow()
    .endSection();
  }
}`;

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export function FormFieldTypesPage() {
  return (
    <>
      <h1 className="docs-page-title">Field Types</h1>
      <p className="docs-page-subtitle">
        Lumino provides a comprehensive set of field components for building forms.
        Each field type can be configured with labels, placeholders, validation rules, and custom props.
      </p>

      {/* Overview */}
      <div className="docs-section">
        <h2 className="docs-section-title">Available Field Types</h2>
        <p>
          Lumino includes the following built-in field components. Each component
          can be used with the <code>.component()</code> method in the field builder:
        </p>
        <ul>
          <li><strong>LuminoTextInput</strong> - Single-line text input</li>
          <li><strong>LuminoNumberInput</strong> - Numeric input with min/max/step</li>
          <li><strong>LuminoTextArea</strong> - Multi-line text input</li>
          <li><strong>LuminoSelect</strong> - Dropdown selection</li>
          <li><strong>LuminoMultiSelect</strong> - Multiple selection dropdown</li>
          <li><strong>LuminoAutocomplete</strong> - Searchable dropdown</li>
          <li><strong>LuminoCheckbox</strong> - Single checkbox</li>
          <li><strong>LuminoSwitch</strong> - Toggle switch</li>
          <li><strong>LuminoRadioGroup</strong> - Radio button group</li>
          <li><strong>LuminoCheckboxGroup</strong> - Multiple checkboxes</li>
          <li><strong>LuminoDatePicker</strong> - Date selection</li>
          <li><strong>LuminoTimePicker</strong> - Time selection</li>
        </ul>
      </div>

      {/* Text Input */}
      <div className="docs-section">
        <h2 className="docs-section-title">TextInput</h2>
        <p>
          The most common field type for single-line text entry. Supports standard
          HTML input attributes via <code>.props()</code>.
        </p>
        <LuminoLiveDemo
          title="TextInput Demo"
          description="Basic text inputs with validation"
          form={new TextInputForm()}
          code={textInputCode}
          defaultView="split"
        />
      </div>

      {/* Number Input */}
      <div className="docs-section">
        <h2 className="docs-section-title">NumberInput</h2>
        <p>
          For numeric values. Supports <code>min</code>, <code>max</code>, and
          <code>step</code> props for constraining input.
        </p>
        <LuminoLiveDemo
          title="NumberInput Demo"
          description="Numeric inputs with constraints"
          form={new NumberInputForm()}
          code={numberInputCode}
          defaultView="split"
        />
      </div>

      {/* TextArea */}
      <div className="docs-section">
        <h2 className="docs-section-title">TextArea</h2>
        <p>
          Multi-line text input. Use <code>rows</code> prop to set the initial height.
        </p>
        <LuminoLiveDemo
          title="TextArea Demo"
          description="Multi-line text with rows config"
          form={new TextAreaForm()}
          code={textAreaCode}
          defaultView="split"
        />
      </div>

      {/* Select */}
      <div className="docs-section">
        <h2 className="docs-section-title">Select</h2>
        <p>
          Single-selection dropdown. Pass <code>options</code> array with
          <code>{`{ value, label }`}</code> objects via props.
        </p>
        <LuminoLiveDemo
          title="Select Demo"
          description="Dropdown selection fields"
          form={new SelectForm()}
          code={selectCode}
          defaultView="split"
        />
      </div>

      {/* MultiSelect */}
      <div className="docs-section">
        <h2 className="docs-section-title">MultiSelect</h2>
        <p>
          Multiple-selection dropdown. Returns an array of selected values.
        </p>
        <LuminoLiveDemo
          title="MultiSelect Demo"
          description="Multi-selection dropdown"
          form={new MultiSelectForm()}
          code={multiSelectCode}
          defaultView="split"
        />
      </div>

      {/* Autocomplete */}
      <div className="docs-section">
        <h2 className="docs-section-title">Autocomplete</h2>
        <p>
          Searchable dropdown that filters options as you type. Great for large option sets.
        </p>
        <LuminoLiveDemo
          title="Autocomplete Demo"
          description="Searchable dropdown"
          form={new AutocompleteForm()}
          code={autocompleteCode}
          defaultView="split"
        />
      </div>

      {/* Checkbox & Switch */}
      <div className="docs-section">
        <h2 className="docs-section-title">Checkbox & Switch</h2>
        <p>
          <strong>Checkbox</strong> is a standard checkbox for boolean values.
          <strong>Switch</strong> is a toggle-style alternative with the same functionality.
        </p>
        <LuminoLiveDemo
          title="Checkbox & Switch Demo"
          description="Boolean toggle fields"
          form={new CheckboxSwitchForm()}
          code={checkboxSwitchCode}
          defaultView="split"
        />
      </div>

      {/* RadioGroup */}
      <div className="docs-section">
        <h2 className="docs-section-title">RadioGroup</h2>
        <p>
          Radio buttons for single selection from a small set of options.
          Better UX than Select when there are 2-5 options.
        </p>
        <LuminoLiveDemo
          title="RadioGroup Demo"
          description="Radio button group"
          form={new RadioGroupForm()}
          code={radioGroupCode}
          defaultView="split"
        />
      </div>

      {/* CheckboxGroup */}
      <div className="docs-section">
        <h2 className="docs-section-title">CheckboxGroup</h2>
        <p>
          Multiple checkboxes for selecting multiple values. Returns an array.
        </p>
        <LuminoLiveDemo
          title="CheckboxGroup Demo"
          description="Multiple checkbox selection"
          form={new CheckboxGroupForm()}
          code={checkboxGroupCode}
          defaultView="split"
        />
      </div>

      {/* Date & Time Pickers */}
      <div className="docs-section">
        <h2 className="docs-section-title">DatePicker & TimePicker</h2>
        <p>
          Date and time selection components. Returns ISO-formatted strings.
        </p>
        <LuminoLiveDemo
          title="Date & Time Demo"
          description="Date and time selection"
          form={new DateTimeForm()}
          code={dateTimeCode}
          defaultView="split"
        />
      </div>

      {/* Field Configuration Reference */}
      <div className="docs-section">
        <h2 className="docs-section-title">Field Configuration Reference</h2>
        <p>
          All field types support these common configuration methods:
        </p>
        <CodeBlock
          code={`// Common field configuration methods
.addField("fieldName")
  .component(LuminoTextInput)  // Set the component
  .label("Label Text")          // Display label
  .placeholder("Placeholder")   // Placeholder text
  .rules(                       // Validation rules
    Validators.required({ message: "Required" }),
    Validators.email("Invalid email")
  )
  .props({ maxLength: 100 })    // Component-specific props
  .colSpan(6)                   // Column width (1-12)
  .disable((ctx) => ctx.mode === "view")  // Conditional disable
  .readOnly((ctx) => !ctx.user?.isAdmin)  // Conditional read-only
  .hideByCondition((ctx) => ctx.getValue("type") !== "other")
  .visibleByAccess((ctx) => ctx.user?.hasRole("admin"))
.endField()`}
          language="typescript"
        />
      </div>
    </>
  );
}
