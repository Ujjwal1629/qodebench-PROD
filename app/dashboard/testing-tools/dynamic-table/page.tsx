'use client';

import { useState, useMemo } from 'react';
import { ToolLayout } from '../tool-layout';
import { PlaywrightRunner } from '@/components/testing-tools/playwright-runner';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  joined: string;
}

const allUsers: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', joined: '2024-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active', joined: '2024-02-20' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'Inactive', joined: '2024-03-10' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'Admin', status: 'Active', joined: '2023-11-05' },
  { id: 5, name: 'Ethan Hunt', email: 'ethan@example.com', role: 'Editor', status: 'Active', joined: '2024-04-01' },
  { id: 6, name: 'Fiona Green', email: 'fiona@example.com', role: 'Viewer', status: 'Inactive', joined: '2024-01-28' },
  { id: 7, name: 'George Lucas', email: 'george@example.com', role: 'Editor', status: 'Active', joined: '2023-12-15' },
  { id: 8, name: 'Hannah Lee', email: 'hannah@example.com', role: 'Admin', status: 'Active', joined: '2024-05-12' },
  { id: 9, name: 'Ivan Petrov', email: 'ivan@example.com', role: 'Viewer', status: 'Inactive', joined: '2024-02-08' },
  { id: 10, name: 'Julia Roberts', email: 'julia@example.com', role: 'Editor', status: 'Active', joined: '2024-06-01' },
  { id: 11, name: 'Kevin Hart', email: 'kevin@example.com', role: 'Viewer', status: 'Active', joined: '2024-03-22' },
  { id: 12, name: 'Luna Park', email: 'luna@example.com', role: 'Admin', status: 'Inactive', joined: '2024-01-01' },
];

const PAGE_SIZE = 5;

const STARTER_CODE = `// Test: Search for a user and verify results
await page.getByTestId('search-input').fill('alice');

// Verify only Alice's row appears
await expect(page.getByTestId('row-1')).toBeVisible();
await expect(page.getByTestId('row-count')).toContainText('1 of 1');

// Clear search
await page.getByTestId('search-input').clear();

// Filter by Admin role
await page.getByTestId('role-filter').selectOption('Admin');
await expect(page.getByTestId('row-count')).toContainText('of 4');

// Edit a user's name
await page.getByTestId('edit-1').click();
await page.getByTestId('edit-input').clear();
await page.getByTestId('edit-input').fill('Alice Updated');
await page.getByTestId('save-button').click();
await expect(page.getByTestId('row-1')).toContainText('Alice Updated');`;

export default function DynamicTableTool() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof User>('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('All');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    let data = allUsers.filter((u) => !deletedIds.has(u.id));
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (roleFilter !== 'All') {
      data = data.filter((u) => u.role === roleFilter);
    }
    data.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
    return data;
  }, [search, sortKey, sortAsc, roleFilter, deletedIds]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: keyof User) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditName(user.name);
  };

  const handleSaveEdit = (id: number) => {
    const user = allUsers.find((u) => u.id === id);
    if (user) user.name = editName;
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setDeletedIds((prev) => new Set(prev).add(id));
  };

  const sortArrow = (key: keyof User) => {
    if (sortKey !== key) return '';
    return sortAsc ? ' \u2191' : ' \u2193';
  };

  return (
    <ToolLayout
      title="Dynamic Table"
      description="Sortable, filterable, paginated data table with edit and delete actions."
      difficulty="Intermediate"
      scenarios={[
        'Search for "alice" and verify only matching rows appear.',
        'Click column headers to sort ascending/descending.',
        'Filter by role "Admin" and verify only admins are shown.',
        'Navigate between pages and verify correct data on each page.',
        'Click "Edit" on a row, change the name, save, and verify it updates.',
        'Click "Delete" on a row and verify it disappears.',
        'Verify the row count text updates after filtering/deleting.',
        'Combine search + filter and verify results.',
      ]}
    >
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email..."
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          data-testid="search-input"
        />
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          data-testid="role-filter"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>
      </div>

      {/* Row count */}
      <p className="text-xs text-slate-500 mb-2" data-testid="row-count">
        Showing {paginated.length} of {filtered.length} users
      </p>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-sm" data-testid="data-table">
          <thead className="bg-slate-50">
            <tr>
              {(['id', 'name', 'email', 'role', 'status', 'joined'] as (keyof User)[]).map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-3 text-left font-medium text-slate-700 cursor-pointer hover:bg-slate-100 select-none whitespace-nowrap"
                  data-testid={`header-${key}`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}{sortArrow(key)}
                </th>
              ))}
              <th className="px-4 py-3 text-left font-medium text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500" data-testid="empty-state">
                  No users found.
                </td>
              </tr>
            ) : (
              paginated.map((user) => (
                <tr key={user.id} className="border-t border-slate-200 hover:bg-slate-50" data-testid={`row-${user.id}`}>
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3">
                    {editingId === user.id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 border border-sky-300 rounded text-sm w-full"
                        data-testid="edit-input"
                        autoFocus
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'Editor' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`} data-testid={`status-${user.id}`}>{user.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {editingId === user.id ? (
                        <button onClick={() => handleSaveEdit(user.id)} className="text-xs text-green-600 hover:underline" data-testid="save-button">Save</button>
                      ) : (
                        <button onClick={() => handleEdit(user)} className="text-xs text-sky-600 hover:underline" data-testid={`edit-${user.id}`}>Edit</button>
                      )}
                      <button onClick={() => handleDelete(user.id)} className="text-xs text-red-600 hover:underline" data-testid={`delete-${user.id}`}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-50"
          data-testid="prev-page"
        >
          Previous
        </button>
        <span className="text-sm text-slate-600" data-testid="page-info">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-50"
          data-testid="next-page"
        >
          Next
        </button>
      </div>

      {/* Playwright Code Editor */}
      <PlaywrightRunner starterCode={STARTER_CODE} />
    </ToolLayout>
  );
}
