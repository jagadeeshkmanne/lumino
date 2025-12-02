/**
 * PropsTable - Display component props/methods in a table format
 */

import React from "react";

interface PropItem {
  name: string;
  type: string;
  default?: string;
  description: string;
}

interface PropsTableProps {
  title?: string;
  items: PropItem[];
}

export function PropsTable({ title = "Properties", items }: PropsTableProps) {
  return (
    <div className="docs-section">
      {title && <h3 className="docs-section-title">{title}</h3>}
      <table className="props-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name}>
              <td><span className="props-name">{item.name}</span></td>
              <td><span className="props-type">{item.type}</span></td>
              <td><span className="props-default">{item.default || "-"}</span></td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
