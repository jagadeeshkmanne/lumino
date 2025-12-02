/**
 * Stepper Component Page
 *
 * Documents the LuminoStepper component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React, { useState } from "react";
import { LiveDemo } from "../../components/LiveDemo";

// Interactive Stepper Demo Component
function StepperDemo() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "Account Info", description: "Enter your account details" },
    { label: "Personal Details", description: "Tell us about yourself" },
    { label: "Payment", description: "Set up payment method" },
    { label: "Confirmation", description: "Review and confirm" },
  ];

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Stepper */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                {/* Step Circle */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: index <= activeStep ? "#007bff" : "#e0e0e0",
                    color: index <= activeStep ? "white" : "#666",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {index < activeStep ? "✓" : index + 1}
                </div>
                {/* Step Label */}
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: index === activeStep ? "600" : "normal",
                    color: index <= activeStep ? "#333" : "#999",
                    textAlign: "center",
                  }}
                >
                  {step.label}
                </div>
                {/* Step Description */}
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    textAlign: "center",
                    marginTop: "4px",
                  }}
                >
                  {step.description}
                </div>
              </div>
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: "2px",
                    backgroundColor: index < activeStep ? "#007bff" : "#e0e0e0",
                    marginBottom: "60px",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div
        style={{
          padding: "30px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          marginBottom: "20px",
          minHeight: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{steps[activeStep].label}</h3>
          <p style={{ margin: 0, color: "#666" }}>
            Step {activeStep + 1} of {steps.length}: {steps[activeStep].description}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
        <button
          onClick={handleBack}
          disabled={activeStep === 0}
          style={{
            padding: "10px 20px",
            backgroundColor: activeStep === 0 ? "#e0e0e0" : "#6c757d",
            color: activeStep === 0 ? "#999" : "white",
            border: "none",
            borderRadius: "4px",
            cursor: activeStep === 0 ? "not-allowed" : "pointer",
            fontWeight: "500",
          }}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
          style={{
            padding: "10px 20px",
            backgroundColor: activeStep === steps.length - 1 ? "#e0e0e0" : "#007bff",
            color: activeStep === steps.length - 1 ? "#999" : "white",
            border: "none",
            borderRadius: "4px",
            cursor: activeStep === steps.length - 1 ? "not-allowed" : "pointer",
            fontWeight: "500",
          }}
        >
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}

export function StepperPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Stepper</h1>
      <p className="docs-page-subtitle">
        A step indicator component for multi-step processes, wizards, and
        sequential workflows.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Interactive Demo</h2>
        <LiveDemo
          title="Interactive Stepper Example"
          description="Try navigating through the steps using the Previous and Next buttons"
          code={`function StepperDemo() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "Account Info", description: "Enter your account details" },
    { label: "Personal Details", description: "Tell us about yourself" },
    { label: "Payment", description: "Set up payment method" },
    { label: "Confirmation", description: "Review and confirm" },
  ];

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Stepper */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                {/* Step Circle */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: index <= activeStep ? "#007bff" : "#e0e0e0",
                    color: index <= activeStep ? "white" : "#666",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {index < activeStep ? "✓" : index + 1}
                </div>
                {/* Step Label */}
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: index === activeStep ? "600" : "normal",
                    color: index <= activeStep ? "#333" : "#999",
                    textAlign: "center",
                  }}
                >
                  {step.label}
                </div>
                {/* Step Description */}
                <div
                  style={{
                    fontSize: "12px",
                    color: "#666",
                    textAlign: "center",
                    marginTop: "4px",
                  }}
                >
                  {step.description}
                </div>
              </div>
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: "2px",
                    backgroundColor: index < activeStep ? "#007bff" : "#e0e0e0",
                    marginBottom: "60px",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div
        style={{
          padding: "30px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          marginBottom: "20px",
          minHeight: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{steps[activeStep].label}</h3>
          <p style={{ margin: 0, color: "#666" }}>
            Step {activeStep + 1} of {steps.length}: {steps[activeStep].description}
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
        <button
          onClick={handleBack}
          disabled={activeStep === 0}
          style={{
            padding: "10px 20px",
            backgroundColor: activeStep === 0 ? "#e0e0e0" : "#6c757d",
            color: activeStep === 0 ? "#999" : "white",
            border: "none",
            borderRadius: "4px",
            cursor: activeStep === 0 ? "not-allowed" : "pointer",
            fontWeight: "500",
          }}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
          style={{
            padding: "10px 20px",
            backgroundColor: activeStep === steps.length - 1 ? "#e0e0e0" : "#007bff",
            color: activeStep === steps.length - 1 ? "#999" : "white",
            border: "none",
            borderRadius: "4px",
            cursor: activeStep === steps.length - 1 ? "not-allowed" : "pointer",
            fontWeight: "500",
          }}
        >
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}`}
        >
          <StepperDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoStepper } from "lumino/react";`}</pre>
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
                <code>activeStep</code>
              </td>
              <td>number</td>
              <td>0</td>
              <td>Current active step index</td>
            </tr>
            <tr>
              <td>
                <code>orientation</code>
              </td>
              <td>"horizontal" | "vertical"</td>
              <td>"horizontal"</td>
              <td>Stepper layout direction</td>
            </tr>
            <tr>
              <td>
                <code>variant</code>
              </td>
              <td>"default" | "numbered" | "dots"</td>
              <td>"default"</td>
              <td>Visual variant</td>
            </tr>
            <tr>
              <td>
                <code>size</code>
              </td>
              <td>"sm" | "md" | "lg"</td>
              <td>"md"</td>
              <td>Stepper size</td>
            </tr>
            <tr>
              <td>
                <code>alternativeLabel</code>
              </td>
              <td>boolean</td>
              <td>false</td>
              <td>Place label below step icon</td>
            </tr>
            <tr>
              <td>
                <code>nonLinear</code>
              </td>
              <td>boolean</td>
              <td>false</td>
              <td>Allow clicking any step</td>
            </tr>
            <tr>
              <td>
                <code>onStepClick</code>
              </td>
              <td>(step: number) =&gt; void</td>
              <td>-</td>
              <td>Step click handler</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Step Props</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>label</code>
              </td>
              <td>string | ReactNode</td>
              <td>Step label text</td>
            </tr>
            <tr>
              <td>
                <code>description</code>
              </td>
              <td>string</td>
              <td>Optional step description</td>
            </tr>
            <tr>
              <td>
                <code>icon</code>
              </td>
              <td>ReactNode</td>
              <td>Custom step icon</td>
            </tr>
            <tr>
              <td>
                <code>optional</code>
              </td>
              <td>boolean</td>
              <td>Mark step as optional</td>
            </tr>
            <tr>
              <td>
                <code>completed</code>
              </td>
              <td>boolean</td>
              <td>Mark step as completed</td>
            </tr>
            <tr>
              <td>
                <code>error</code>
              </td>
              <td>boolean</td>
              <td>Mark step as having error</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoStepper, LuminoStep } from "lumino/react";

function BasicStepper() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <LuminoStepper activeStep={activeStep}>
      <LuminoStep label="Account Info" />
      <LuminoStep label="Personal Details" />
      <LuminoStep label="Payment" />
      <LuminoStep label="Confirmation" />
    </LuminoStepper>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Step Content</h2>
        <pre className="docs-code">{`function StepperWithContent() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const steps = [
    { label: "Account Info", content: <AccountForm /> },
    { label: "Personal Details", content: <PersonalForm /> },
    { label: "Payment", content: <PaymentForm /> },
    { label: "Confirmation", content: <ConfirmationView /> },
  ];

  return (
    <div>
      <LuminoStepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <LuminoStep key={index} label={step.label} />
        ))}
      </LuminoStepper>

      <div className="step-content">
        {steps[activeStep].content}
      </div>

      <div className="step-actions">
        <LuminoButton
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </LuminoButton>

        <LuminoButton
          variant="primary"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
        >
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </LuminoButton>
      </div>
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Descriptions</h2>
        <pre className="docs-code">{`function StepperWithDescriptions() {
  return (
    <LuminoStepper activeStep={1}>
      <LuminoStep
        label="Create Account"
        description="Set up your username and password"
      />
      <LuminoStep
        label="Verify Email"
        description="Confirm your email address"
      />
      <LuminoStep
        label="Complete Profile"
        description="Add your personal information"
      />
    </LuminoStepper>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Vertical Stepper</h2>
        <pre className="docs-code">{`function VerticalStepper() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <LuminoStepper
      activeStep={activeStep}
      orientation="vertical"
    >
      <LuminoStep label="Select Campaign Settings">
        <LuminoStep.Content>
          <p>Configure your campaign settings and target audience.</p>
          <LuminoButton onClick={() => setActiveStep(1)}>
            Continue
          </LuminoButton>
        </LuminoStep.Content>
      </LuminoStep>

      <LuminoStep label="Create Ad Group">
        <LuminoStep.Content>
          <p>Set up your ad groups and keywords.</p>
          <LuminoButton onClick={() => setActiveStep(0)}>Back</LuminoButton>
          <LuminoButton onClick={() => setActiveStep(2)}>Continue</LuminoButton>
        </LuminoStep.Content>
      </LuminoStep>

      <LuminoStep label="Create Ad">
        <LuminoStep.Content>
          <p>Design your ad creative and copy.</p>
          <LuminoButton onClick={() => setActiveStep(1)}>Back</LuminoButton>
          <LuminoButton variant="primary">Finish</LuminoButton>
        </LuminoStep.Content>
      </LuminoStep>
    </LuminoStepper>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Non-Linear Stepper</h2>
        <pre className="docs-code">{`function NonLinearStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const handleStep = (step: number) => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    setCompleted((prev) => new Set(prev).add(activeStep));
    handleStep(activeStep + 1);
  };

  return (
    <LuminoStepper
      activeStep={activeStep}
      nonLinear
      onStepClick={handleStep}
    >
      <LuminoStep
        label="Step 1"
        completed={completed.has(0)}
      />
      <LuminoStep
        label="Step 2"
        completed={completed.has(1)}
      />
      <LuminoStep
        label="Step 3"
        completed={completed.has(2)}
      />
    </LuminoStepper>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Icons</h2>
        <pre className="docs-code">{`function StepperWithIcons() {
  return (
    <LuminoStepper activeStep={1}>
      <LuminoStep
        label="Cart"
        icon={<LuminoIcon name="shopping-cart" />}
      />
      <LuminoStep
        label="Shipping"
        icon={<LuminoIcon name="truck" />}
      />
      <LuminoStep
        label="Payment"
        icon={<LuminoIcon name="credit-card" />}
      />
      <LuminoStep
        label="Confirm"
        icon={<LuminoIcon name="check-circle" />}
      />
    </LuminoStepper>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Optional Steps</h2>
        <pre className="docs-code">{`function StepperWithOptional() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState<Set<number>>(new Set());

  const isStepOptional = (step: number) => step === 1;
  const isStepSkipped = (step: number) => skipped.has(step);

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("Can't skip non-optional step");
    }
    setSkipped((prev) => new Set(prev).add(activeStep));
    setActiveStep((prev) => prev + 1);
  };

  return (
    <div>
      <LuminoStepper activeStep={activeStep}>
        <LuminoStep label="Required Step" />
        <LuminoStep
          label="Optional Step"
          optional
          completed={isStepSkipped(1) ? false : undefined}
        />
        <LuminoStep label="Final Step" />
      </LuminoStepper>

      <div className="actions">
        {isStepOptional(activeStep) && (
          <LuminoButton variant="secondary" onClick={handleSkip}>
            Skip
          </LuminoButton>
        )}
        <LuminoButton onClick={() => setActiveStep((p) => p + 1)}>
          Next
        </LuminoButton>
      </div>
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Error State</h2>
        <pre className="docs-code">{`function StepperWithError() {
  const [activeStep, setActiveStep] = useState(1);
  const [hasError, setHasError] = useState(true);

  return (
    <LuminoStepper activeStep={activeStep}>
      <LuminoStep label="Enter Details" completed />
      <LuminoStep
        label="Verify Information"
        error={hasError}
        description={hasError ? "Please fix the errors" : undefined}
      />
      <LuminoStep label="Submit" />
    </LuminoStepper>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Stepper Variants</h2>
        <pre className="docs-code">{`// Default - icons with check marks
<LuminoStepper variant="default" activeStep={1}>
  <LuminoStep label="Step 1" />
  <LuminoStep label="Step 2" />
  <LuminoStep label="Step 3" />
</LuminoStepper>

// Numbered - shows step numbers
<LuminoStepper variant="numbered" activeStep={1}>
  <LuminoStep label="Step 1" />
  <LuminoStep label="Step 2" />
  <LuminoStep label="Step 3" />
</LuminoStepper>

// Dots - minimal progress indicator
<LuminoStepper variant="dots" activeStep={1}>
  <LuminoStep />
  <LuminoStep />
  <LuminoStep />
</LuminoStepper>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Alternative Label Placement</h2>
        <pre className="docs-code">{`// Labels below step icons (centered)
<LuminoStepper activeStep={1} alternativeLabel>
  <LuminoStep label="Step 1" description="First step details" />
  <LuminoStep label="Step 2" description="Second step details" />
  <LuminoStep label="Step 3" description="Third step details" />
</LuminoStepper>`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Form Builder</h2>
        <pre className="docs-code">{`class MultiStepForm extends Form<FormData> {
  configure() {
    this.addStepper()
      .addStep("account", "Account")
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .validators(["required", "email"])
          .endField()
        .addField("password")
          .component(LuminoTextInput)
          .type("password")
          .label("Password")
          .endField()
        .endStep()

      .addStep("personal", "Personal Info")
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .endField()
        .endStep()

      .addStep("confirm", "Confirmation")
        .addComponent(FormSummary)
          .props({ fields: ["email", "firstName", "lastName"] })
        .endComponent()
        .endStep()

      .onStepChange((from, to) => {
        console.log(\`Moving from step \${from} to \${to}\`);
      })
      .validateOnStepChange(true)
    .endStepper();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Keep steps minimal</strong> - Aim for 3-5 steps maximum
          </li>
          <li>
            <strong>Clear labels</strong> - Use descriptive, action-oriented
            step names
          </li>
          <li>
            <strong>Show progress</strong> - Indicate completed vs remaining
            steps
          </li>
          <li>
            <strong>Allow navigation</strong> - Let users go back to previous
            steps
          </li>
          <li>
            <strong>Validate per step</strong> - Don't let users proceed with
            invalid data
          </li>
          <li>
            <strong>Save progress</strong> - Persist data between steps to
            prevent loss
          </li>
        </ul>
      </div>
    </div>
  );
}
