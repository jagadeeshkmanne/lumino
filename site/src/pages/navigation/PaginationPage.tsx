/**
 * Pagination Component Page
 *
 * Documents the LuminoPagination component.
 * NOTE: This documentation was carefully read from the Lumino source code.
 */

import React, { useState } from "react";
import { LiveDemo } from "../../components/LiveDemo";

// Interactive Pagination Demo Component
function PaginationDemo() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const siblingCount = 1;
    const boundaryCount = 1;

    // Always show first pages
    for (let i = 1; i <= Math.min(boundaryCount, totalPages); i++) {
      pages.push(i);
    }

    // Show ellipsis if there's a gap
    const leftSiblingIndex = Math.max(currentPage - siblingCount, boundaryCount + 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - boundaryCount);

    if (leftSiblingIndex > boundaryCount + 1) {
      pages.push('...');
    }

    // Show sibling pages
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i > boundaryCount && i <= totalPages - boundaryCount) {
        pages.push(i);
      }
    }

    // Show ellipsis if there's a gap
    if (rightSiblingIndex < totalPages - boundaryCount) {
      pages.push('...');
    }

    // Always show last pages
    for (let i = Math.max(totalPages - boundaryCount + 1, boundaryCount + 1); i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  const buttonStyle = {
    padding: '8px 12px',
    margin: '0 4px',
    border: '1px solid #d0d7de',
    borderRadius: '6px',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#24292f',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    background: '#0969da',
    color: '#fff',
    borderColor: '#0969da',
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    cursor: 'not-allowed',
    opacity: 0.5,
    background: '#f6f8fa',
  };

  const ellipsisStyle = {
    padding: '8px 12px',
    margin: '0 4px',
    color: '#57606a',
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '20px',
  };

  return (
    <div style={containerStyle}>
      <button
        style={currentPage === 1 ? disabledButtonStyle : buttonStyle}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} style={ellipsisStyle}>
            ...
          </span>
        ) : (
          <button
            key={page}
            style={currentPage === page ? activeButtonStyle : buttonStyle}
            onClick={() => handlePageClick(page as number)}
          >
            {page}
          </button>
        )
      )}

      <button
        style={currentPage === totalPages ? disabledButtonStyle : buttonStyle}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

      <span style={{ marginLeft: '16px', color: '#57606a', fontSize: '14px' }}>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}

export function PaginationPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Pagination</h1>
      <p className="docs-page-subtitle">
        A pagination component for navigating through pages of data with page
        numbers, previous/next buttons, and optional page size selector.
      </p>

      <div className="docs-note">
        <strong>Note:</strong> This documentation was carefully read from the
        Lumino source code.
      </div>

      <div className="docs-section">
        <h2>Interactive Demo</h2>
        <LiveDemo
          title="Basic Pagination"
          description="Click on page numbers or use Previous/Next buttons to navigate"
          code={`import React, { useState } from "react";

function PaginationDemo() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const siblingCount = 1;
    const boundaryCount = 1;

    // Always show first pages
    for (let i = 1; i <= Math.min(boundaryCount, totalPages); i++) {
      pages.push(i);
    }

    // Show ellipsis if there's a gap
    const leftSiblingIndex = Math.max(currentPage - siblingCount, boundaryCount + 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - boundaryCount);

    if (leftSiblingIndex > boundaryCount + 1) {
      pages.push('...');
    }

    // Show sibling pages
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i > boundaryCount && i <= totalPages - boundaryCount) {
        pages.push(i);
      }
    }

    // Show ellipsis if there's a gap
    if (rightSiblingIndex < totalPages - boundaryCount) {
      pages.push('...');
    }

    // Always show last pages
    for (let i = Math.max(totalPages - boundaryCount + 1, boundaryCount + 1); i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  const buttonStyle = {
    padding: '8px 12px',
    margin: '0 4px',
    border: '1px solid #d0d7de',
    borderRadius: '6px',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#24292f',
  };

  const activeButtonStyle = {
    ...buttonStyle,
    background: '#0969da',
    color: '#fff',
    borderColor: '#0969da',
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    cursor: 'not-allowed',
    opacity: 0.5,
    background: '#f6f8fa',
  };

  const ellipsisStyle = {
    padding: '8px 12px',
    margin: '0 4px',
    color: '#57606a',
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '20px',
  };

  return (
    <div style={containerStyle}>
      <button
        style={currentPage === 1 ? disabledButtonStyle : buttonStyle}
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <span key={\`ellipsis-\${index}\`} style={ellipsisStyle}>
            ...
          </span>
        ) : (
          <button
            key={page}
            style={currentPage === page ? activeButtonStyle : buttonStyle}
            onClick={() => handlePageClick(page as number)}
          >
            {page}
          </button>
        )
      )}

      <button
        style={currentPage === totalPages ? disabledButtonStyle : buttonStyle}
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

      <span style={{ marginLeft: '16px', color: '#57606a', fontSize: '14px' }}>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}`}
        >
          <PaginationDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`import { LuminoPagination } from "lumino/react";`}</pre>
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
                <code>page</code>
              </td>
              <td>number</td>
              <td>1</td>
              <td>Current page number</td>
            </tr>
            <tr>
              <td>
                <code>totalPages</code>
              </td>
              <td>number</td>
              <td>-</td>
              <td>Total number of pages</td>
            </tr>
            <tr>
              <td>
                <code>totalItems</code>
              </td>
              <td>number</td>
              <td>-</td>
              <td>Total number of items (alternative to totalPages)</td>
            </tr>
            <tr>
              <td>
                <code>pageSize</code>
              </td>
              <td>number</td>
              <td>10</td>
              <td>Items per page</td>
            </tr>
            <tr>
              <td>
                <code>onPageChange</code>
              </td>
              <td>(page: number) =&gt; void</td>
              <td>-</td>
              <td>Page change handler</td>
            </tr>
            <tr>
              <td>
                <code>onPageSizeChange</code>
              </td>
              <td>(size: number) =&gt; void</td>
              <td>-</td>
              <td>Page size change handler</td>
            </tr>
            <tr>
              <td>
                <code>siblingCount</code>
              </td>
              <td>number</td>
              <td>1</td>
              <td>Pages shown on each side of current</td>
            </tr>
            <tr>
              <td>
                <code>boundaryCount</code>
              </td>
              <td>number</td>
              <td>1</td>
              <td>Pages shown at start/end</td>
            </tr>
            <tr>
              <td>
                <code>showFirstLast</code>
              </td>
              <td>boolean</td>
              <td>true</td>
              <td>Show first/last page buttons</td>
            </tr>
            <tr>
              <td>
                <code>showPrevNext</code>
              </td>
              <td>boolean</td>
              <td>true</td>
              <td>Show prev/next buttons</td>
            </tr>
            <tr>
              <td>
                <code>showPageSize</code>
              </td>
              <td>boolean</td>
              <td>false</td>
              <td>Show page size selector</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Basic Usage</h2>
        <pre className="docs-code">{`import { LuminoPagination } from "lumino/react";
import { useState } from "react";

function BasicPagination() {
  const [page, setPage] = useState(1);

  return (
    <LuminoPagination
      page={page}
      totalPages={10}
      onPageChange={setPage}
    />
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Total Items</h2>
        <pre className="docs-code">{`function PaginationWithTotalItems() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalItems = 95;

  return (
    <LuminoPagination
      page={page}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={setPage}
      showPageSize
      onPageSizeChange={setPageSize}
    />
  );
  // Will calculate totalPages = Math.ceil(95 / 10) = 10
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Page Size Selector</h2>
        <pre className="docs-code">{`function PaginationWithPageSize() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page
  };

  return (
    <LuminoPagination
      page={page}
      totalItems={100}
      pageSize={pageSize}
      onPageChange={setPage}
      showPageSize
      pageSizeOptions={[10, 25, 50, 100]}
      onPageSizeChange={handlePageSizeChange}
    />
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Simple Pagination</h2>
        <pre className="docs-code">{`// Only previous/next buttons
function SimplePagination() {
  const [page, setPage] = useState(1);
  const totalPages = 10;

  return (
    <LuminoPagination
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      variant="simple"  // Just prev/next without page numbers
    />
  );
}

// Or configure individual options
<LuminoPagination
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
  showFirstLast={false}
  showPrevNext={true}
  siblingCount={0}
  boundaryCount={0}
/>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Compact Pagination</h2>
        <pre className="docs-code">{`function CompactPagination() {
  const [page, setPage] = useState(1);

  return (
    <LuminoPagination
      page={page}
      totalPages={10}
      onPageChange={setPage}
      size="sm"
      variant="compact"
    />
  );
  // Shows: < 1 of 10 >
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Item Range Display</h2>
        <pre className="docs-code">{`function PaginationWithItemRange() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalItems = 95;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div className="pagination-container">
      <span className="item-range">
        Showing {startItem}-{endItem} of {totalItems} items
      </span>

      <LuminoPagination
        page={page}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Pagination Sizes</h2>
        <pre className="docs-code">{`// Small
<LuminoPagination
  page={page}
  totalPages={10}
  onPageChange={setPage}
  size="sm"
/>

// Medium (default)
<LuminoPagination
  page={page}
  totalPages={10}
  onPageChange={setPage}
  size="md"
/>

// Large
<LuminoPagination
  page={page}
  totalPages={10}
  onPageChange={setPage}
  size="lg"
/>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Sibling and Boundary Count</h2>
        <pre className="docs-code">{`// Default (siblingCount=1, boundaryCount=1)
// 1 ... 4 5 6 ... 10

// More siblings
<LuminoPagination
  page={5}
  totalPages={20}
  siblingCount={2}
  boundaryCount={1}
/>
// 1 ... 3 4 5 6 7 ... 20

// More boundaries
<LuminoPagination
  page={10}
  totalPages={20}
  siblingCount={1}
  boundaryCount={2}
/>
// 1 2 ... 9 10 11 ... 19 20

// Full pagination (no ellipsis for small page count)
<LuminoPagination
  page={3}
  totalPages={5}
  siblingCount={2}
/>
// 1 2 3 4 5`}</pre>
      </div>

      <div className="docs-section">
        <h2>With Data Table</h2>
        <pre className="docs-code">{`function PaginatedTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchData(page, pageSize).then((result) => {
      setData(result.items);
      setTotalItems(result.total);
    });
  }, [page, pageSize]);

  return (
    <div>
      <LuminoTable
        columns={columns}
        data={data}
      />

      <LuminoPagination
        page={page}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setPage}
        showPageSize
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </div>
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>In Page Builder</h2>
        <pre className="docs-code">{`class UserListPage extends Page {
  configure() {
    this.setTitle("Users");

    // Add table with pagination
    this.addComponent(LuminoTable)
      .props({
        columns: userColumns,
      })
      .dataBind("users.items")
      .endComponent();

    // Add pagination
    this.addPagination()
      .dataBind("users.pagination")  // { page, pageSize, totalItems }
      .showPageSize()
      .pageSizeOptions([10, 25, 50, 100])
      .onPageChange((page) => this.loadUsers(page))
      .onPageSizeChange((size) => {
        this.setPageSize(size);
        this.loadUsers(1);
      })
      .endPagination();
  }

  async loadUsers(page: number) {
    const { pageSize } = this.state.users.pagination;
    const result = await this.api.getUsers({ page, pageSize });
    this.setState({
      users: {
        items: result.data,
        pagination: {
          page,
          pageSize,
          totalItems: result.total,
        },
      },
    });
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Controlled vs Uncontrolled</h2>
        <pre className="docs-code">{`// Controlled - you manage page state
function ControlledPagination() {
  const [page, setPage] = useState(1);

  return (
    <LuminoPagination
      page={page}
      totalPages={10}
      onPageChange={setPage}
    />
  );
}

// Uncontrolled - internal state management
function UncontrolledPagination() {
  return (
    <LuminoPagination
      defaultPage={1}
      totalPages={10}
      onPageChange={(page) => console.log("Page changed to:", page)}
    />
  );
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Disabled State</h2>
        <pre className="docs-code">{`// Fully disabled
<LuminoPagination
  page={page}
  totalPages={10}
  onPageChange={setPage}
  disabled
/>

// Disabled during loading
<LuminoPagination
  page={page}
  totalPages={10}
  onPageChange={setPage}
  disabled={isLoading}
/>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Reset to page 1</strong> - When page size changes or filters
            are applied
          </li>
          <li>
            <strong>Show item range</strong> - Display "Showing 1-10 of 95
            items" for context
          </li>
          <li>
            <strong>Reasonable page sizes</strong> - Offer 10, 25, 50, 100 as
            options
          </li>
          <li>
            <strong>Disable during loading</strong> - Prevent multiple requests
          </li>
          <li>
            <strong>Use compact variant</strong> - For tables with limited space
          </li>
        </ul>
      </div>
    </div>
  );
}
