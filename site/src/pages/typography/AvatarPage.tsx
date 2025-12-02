/**
 * Avatar Component Page
 *
 * Documents the LuminoAvatar component.
 * NOTE: This documentation uses direct component demos.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import { LuminoAvatar, LuminoStackLayout, LuminoFlowLayout, LuminoText, LuminoCard, LuminoCardContent } from "lumino/react";

// =============================================================================
// DEMO COMPONENTS
// =============================================================================

function BasicAvatarDemo() {
  return (
    <LuminoFlowLayout gap={3}>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="John Doe" />
        <LuminoText variant="secondary">With name</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="Jane Smith" src="https://i.pravatar.cc/150?u=jane" />
        <LuminoText variant="secondary">With image</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar />
        <LuminoText variant="secondary">Default</LuminoText>
      </LuminoStackLayout>
    </LuminoFlowLayout>
  );
}

function AvatarSizesDemo() {
  return (
    <LuminoFlowLayout gap={3} align="center">
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="Small" size="small" />
        <LuminoText variant="secondary">Small</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="Medium" size="medium" />
        <LuminoText variant="secondary">Medium</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="Large" size="large" />
        <LuminoText variant="secondary">Large</LuminoText>
      </LuminoStackLayout>
    </LuminoFlowLayout>
  );
}

function AvatarInitialsDemo() {
  return (
    <LuminoFlowLayout gap={3}>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="John" />
        <LuminoText variant="secondary">John</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="John Doe" />
        <LuminoText variant="secondary">John Doe</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="John Michael Doe" />
        <LuminoText variant="secondary">John Michael Doe</LuminoText>
      </LuminoStackLayout>
    </LuminoFlowLayout>
  );
}

function AvatarWithImagesDemo() {
  const users = [
    { name: "Alice Brown", src: "https://i.pravatar.cc/150?u=alice" },
    { name: "Bob Wilson", src: "https://i.pravatar.cc/150?u=bob" },
    { name: "Carol Davis", src: "https://i.pravatar.cc/150?u=carol" },
    { name: "David Lee" },
  ];

  return (
    <LuminoFlowLayout gap={2}>
      {users.map((user) => (
        <LuminoStackLayout key={user.name} gap={1} align="center">
          <LuminoAvatar name={user.name} src={user.src} size="medium" />
          <LuminoText variant="secondary">{user.name.split(" ")[0]}</LuminoText>
        </LuminoStackLayout>
      ))}
    </LuminoFlowLayout>
  );
}

function UserProfileDemo() {
  return (
    <LuminoCard>
      <LuminoCardContent>
        <LuminoFlowLayout gap={3} align="center">
          <LuminoAvatar
            name="John Doe"
            src="https://i.pravatar.cc/150?u=john"
            size="large"
          />
          <LuminoStackLayout gap={0}>
            <LuminoText styleAs="label">John Doe</LuminoText>
            <LuminoText variant="secondary">john.doe@example.com</LuminoText>
            <LuminoText variant="secondary">Software Engineer</LuminoText>
          </LuminoStackLayout>
        </LuminoFlowLayout>
      </LuminoCardContent>
    </LuminoCard>
  );
}

function TeamMembersDemo() {
  const team = [
    { name: "Alice", src: "https://i.pravatar.cc/150?u=alice1" },
    { name: "Bob", src: "https://i.pravatar.cc/150?u=bob1" },
    { name: "Carol", src: "https://i.pravatar.cc/150?u=carol1" },
    { name: "David", src: "https://i.pravatar.cc/150?u=david1" },
    { name: "Eve" },
  ];

  return (
    <LuminoStackLayout gap={2}>
      <LuminoText styleAs="label">Team Members ({team.length})</LuminoText>
      <LuminoFlowLayout gap={-1}>
        {team.map((member, index) => (
          <div
            key={member.name}
            style={{
              marginLeft: index > 0 ? "-8px" : 0,
              border: "2px solid white",
              borderRadius: "50%",
            }}
          >
            <LuminoAvatar name={member.name} src={member.src} size="medium" />
          </div>
        ))}
      </LuminoFlowLayout>
    </LuminoStackLayout>
  );
}

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicAvatarCode = `import { LuminoAvatar, LuminoStackLayout, LuminoFlowLayout, LuminoText } from "lumino/react";

function BasicAvatarDemo() {
  return (
    <LuminoFlowLayout gap={3}>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="John Doe" />
        <LuminoText variant="secondary">With name</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="Jane Smith" src="https://i.pravatar.cc/150?u=jane" />
        <LuminoText variant="secondary">With image</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar />
        <LuminoText variant="secondary">Default</LuminoText>
      </LuminoStackLayout>
    </LuminoFlowLayout>
  );
}`;

const avatarSizesCode = `import { LuminoAvatar, LuminoStackLayout, LuminoFlowLayout, LuminoText } from "lumino/react";

function AvatarSizesDemo() {
  return (
    <LuminoFlowLayout gap={3} align="center">
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="Small" size="small" />
        <LuminoText variant="secondary">Small</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="Medium" size="medium" />
        <LuminoText variant="secondary">Medium</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="Large" size="large" />
        <LuminoText variant="secondary">Large</LuminoText>
      </LuminoStackLayout>
    </LuminoFlowLayout>
  );
}`;

const avatarInitialsCode = `import { LuminoAvatar, LuminoStackLayout, LuminoFlowLayout, LuminoText } from "lumino/react";

function AvatarInitialsDemo() {
  return (
    <LuminoFlowLayout gap={3}>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="John" />
        <LuminoText variant="secondary">John</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="John Doe" />
        <LuminoText variant="secondary">John Doe</LuminoText>
      </LuminoStackLayout>
      <LuminoStackLayout gap={1} align="center">
        <LuminoAvatar name="John Michael Doe" />
        <LuminoText variant="secondary">John Michael Doe</LuminoText>
      </LuminoStackLayout>
    </LuminoFlowLayout>
  );
}`;

const avatarWithImagesCode = `import { LuminoAvatar, LuminoStackLayout, LuminoFlowLayout, LuminoText } from "lumino/react";

function AvatarWithImagesDemo() {
  const users = [
    { name: "Alice Brown", src: "https://i.pravatar.cc/150?u=alice" },
    { name: "Bob Wilson", src: "https://i.pravatar.cc/150?u=bob" },
    { name: "Carol Davis", src: "https://i.pravatar.cc/150?u=carol" },
    { name: "David Lee" },  // Will show initials
  ];

  return (
    <LuminoFlowLayout gap={2}>
      {users.map((user) => (
        <LuminoStackLayout key={user.name} gap={1} align="center">
          <LuminoAvatar name={user.name} src={user.src} size="medium" />
          <LuminoText variant="secondary">{user.name.split(" ")[0]}</LuminoText>
        </LuminoStackLayout>
      ))}
    </LuminoFlowLayout>
  );
}`;

const userProfileCode = `import { LuminoAvatar, LuminoStackLayout, LuminoFlowLayout, LuminoText, LuminoCard, LuminoCardContent } from "lumino/react";

function UserProfileDemo() {
  return (
    <LuminoCard>
      <LuminoCardContent>
        <LuminoFlowLayout gap={3} align="center">
          <LuminoAvatar
            name="John Doe"
            src="https://i.pravatar.cc/150?u=john"
            size="large"
          />
          <LuminoStackLayout gap={0}>
            <LuminoText styleAs="label">John Doe</LuminoText>
            <LuminoText variant="secondary">john.doe@example.com</LuminoText>
            <LuminoText variant="secondary">Software Engineer</LuminoText>
          </LuminoStackLayout>
        </LuminoFlowLayout>
      </LuminoCardContent>
    </LuminoCard>
  );
}`;

const teamMembersCode = `import { LuminoAvatar, LuminoStackLayout, LuminoFlowLayout, LuminoText } from "lumino/react";

function TeamMembersDemo() {
  const team = [
    { name: "Alice", src: "https://i.pravatar.cc/150?u=alice1" },
    { name: "Bob", src: "https://i.pravatar.cc/150?u=bob1" },
    { name: "Carol", src: "https://i.pravatar.cc/150?u=carol1" },
    { name: "David", src: "https://i.pravatar.cc/150?u=david1" },
    { name: "Eve" },
  ];

  return (
    <LuminoStackLayout gap={2}>
      <LuminoText styleAs="label">Team Members ({team.length})</LuminoText>
      <LuminoFlowLayout gap={-1}>
        {team.map((member, index) => (
          <div
            key={member.name}
            style={{
              marginLeft: index > 0 ? "-8px" : 0,
              border: "2px solid white",
              borderRadius: "50%",
            }}
          >
            <LuminoAvatar name={member.name} src={member.src} size="medium" />
          </div>
        ))}
      </LuminoFlowLayout>
    </LuminoStackLayout>
  );
}`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function AvatarPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Avatar</h1>
      <p className="docs-page-subtitle">
        A user avatar component displaying profile images, initials, or
        fallback icons.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoAvatar } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Avatar</h2>
        <p>Avatars display user images or initials:</p>
        <LiveDemo
          title="Basic Avatar"
          description="With name, image, or default"
          code={basicAvatarCode}
        >
          <BasicAvatarDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Avatar Sizes</h2>
        <p>Use the <code>size</code> prop to control avatar size:</p>
        <LiveDemo
          title="Avatar Sizes"
          description="Small, medium, and large sizes"
          code={avatarSizesCode}
        >
          <AvatarSizesDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Initials Generation</h2>
        <p>Initials are automatically generated from the name:</p>
        <LiveDemo
          title="Initials"
          description="Auto-generated initials from name"
          code={avatarInitialsCode}
        >
          <AvatarInitialsDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>With Images</h2>
        <p>Mix of avatars with images and initials fallback:</p>
        <LiveDemo
          title="Avatar Images"
          description="Avatars with images and fallback initials"
          code={avatarWithImagesCode}
        >
          <AvatarWithImagesDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>User Profile</h2>
        <p>Avatar in a user profile card:</p>
        <LiveDemo
          title="User Profile"
          description="Avatar with user information"
          code={userProfileCode}
        >
          <UserProfileDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Team Members</h2>
        <p>Stacked avatars for team display:</p>
        <LiveDemo
          title="Team Members"
          description="Overlapping avatar group"
          code={teamMembersCode}
        >
          <TeamMembersDemo />
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
              <td><code>src</code></td>
              <td>string</td>
              <td>-</td>
              <td>Image URL</td>
            </tr>
            <tr>
              <td><code>name</code></td>
              <td>string</td>
              <td>-</td>
              <td>User name for initials fallback</td>
            </tr>
            <tr>
              <td><code>size</code></td>
              <td>"small" | "medium" | "large" | number</td>
              <td>"medium"</td>
              <td>Avatar size</td>
            </tr>
            <tr>
              <td><code>className</code></td>
              <td>string</td>
              <td>-</td>
              <td>Additional CSS class</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoAvatar } from "lumino/react";

// With image
<LuminoAvatar
  src="/path/to/avatar.jpg"
  name="John Doe"
/>

// With initials fallback
<LuminoAvatar name="John Doe" />

// With custom size
<LuminoAvatar name="John Doe" size="large" />`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Always provide name</strong> - Used for initials fallback
            and accessibility
          </li>
          <li>
            <strong>Handle loading errors</strong> - Provide fallback for failed
            images
          </li>
          <li>
            <strong>Consistent sizing</strong> - Use preset sizes for uniformity
          </li>
          <li>
            <strong>Use appropriate size</strong> - Small for lists, large for
            profiles
          </li>
        </ul>
      </div>
    </div>
  );
}
