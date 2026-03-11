'use client'

import {useMemo, useState} from "react";
import { useRouter } from "next/navigation";
import CustomerCard from "@/app/customer/component/CustomerCard";
import {
    actionCreateCustomer,
    actionDeleteCustomer,
    actionGetAllCustomers, actionPatchCustomer,
    actionUpdateCustomer
} from "@/app/actions/customerAction";
import { CreateModal, EditModal, DeleteModal } from "@/app/customer/component/ModalComponent";
import {useDebounce} from "@/hooks/useDebounce";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {flexRender, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";

export default function CustomerClient() {
    const router = useRouter();
    const queryClient = useQueryClient();

    // query state
    const [search, setSearch] = useState("");
    const [types, setTypes] = useState("");
    const [status, setStatus] = useState("");

    // debounce search
    const debounceSearch = useDebounce(search, 500);

    // modal state
    const [showCreate, setShowCreate]     = useState(false);
    const [editTarget, setEditTarget]     = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const {
        data: customerData= [],
    } = useQuery({
        queryKey: ["customers", debounceSearch, types, status],
        queryFn: async () => {
            const res = await actionGetAllCustomers({search: debounceSearch, types, status});
            return res?.data?.data?.items ?? [];
        },
        staleTime: 30_000,
    })

    const invalidate = () =>
        queryClient.invalidateQueries({queryKey: ["customers"]});

    const createMutation = useMutation({
        mutationFn: (form) => actionCreateCustomer(form),
        onSuccess: (res) => {
            if(res?.status === 201) invalidate();
            else console.error("Created failed: ", res?.status)
        }
    })

    const deleteMutation = useMutation({
        mutationFn: (id) => actionDeleteCustomer(id),
        onSuccess: (res) => {
            if (res?.status === 200) invalidate();
            else console.error("Delete failed:", res?.status);
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, form }) => actionUpdateCustomer(id, form),
        onSuccess: (res) => {
            if (res?.status === 200) invalidate();
            else console.error("Update failed:", res?.status);
        },
    });

    const patchMutation = useMutation({
        mutationFn: ({ id, patchData }) => actionPatchCustomer(id, patchData),
        onSuccess: (res) => {
            if (res?.status === 200) invalidate();
            else console.error("Patch failed:", res?.status);
        },
    });

    const handleCreate = (form) => createMutation.mutate(form);
    const handleDelete = (id)   => deleteMutation.mutate(id);
    const handleUpdate = (id, form)         => updateMutation.mutate({ id, form });
    const handlePatch  = (id, patchData)    => patchMutation.mutate({ id, patchData });

    // TanStack Table columns
    const columns = useMemo(() => [
        {
            accessorKey: "customerId",
            header: "ID",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "types",
            header: "Type",
            cell: ({ getValue }) => (
                <span className="capitalize text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded-full">
                    {getValue()}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }) => {
                const val = getValue();
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${val === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                        {val}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push(`/customer/${row.original.customerId}`)}
                        className="text-violet-600 text-xs font-medium hover:underline"
                    >
                        View
                    </button>
                    <button
                        onClick={() => setEditTarget(row.original)}
                        className="text-blue-600 text-xs font-medium hover:underline"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setDeleteTarget(row.original)}
                        className="text-red-500 text-xs font-medium hover:underline"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ], [router]);

    // TanStack Table instance
    const table = useReactTable({
        data: customerData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 3,
            }
        }
    });

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Top Bar */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    <div className="mr-auto">
                        <h1 className="text-xl font-bold text-gray-900">Customers</h1>
                        <p className="text-xs text-gray-400">{customerData.length} total</p>
                    </div>
                    {/* search section */}
                    <div className="relative w-48">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                        />
                    </div>
                    {/*  Types filter */}
                    <select
                        value={types}
                        onChange={e => setTypes(e.target.value)}
                        className="py-2 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-400 transition"
                    >
                        <option value="">All Types</option>
                        <option value="INDIVIDUAL">Individual</option>
                        <option value="CORPORATE">Corporate</option>
                    </select>

                    {/*  Status filter */}
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="py-2 px-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-violet-400 transition"
                    >
                        <option value="">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                    <button onClick={() => setShowCreate(true)}
                            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                {customerData.length === 0 ? (
                    <div className="text-center py-24 text-gray-400">
                        <p className="text-5xl mb-4">👤</p>
                        <p className="font-semibold text-gray-500">No customers found</p>
                        <p className="text-sm mt-1">
                            {search ? "Try a different search term" : `Click "New" to add your first customer`}
                        </p>
                    </div>
                ) : (
                    <div className="hidden sm:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody>
                            {table.getRowModel().rows.map((row, i) => (
                                <tr key={row.id}
                                    className={`border-t border-gray-100 hover:bg-violet-50 transition-colors
                                                ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-5 py-4 text-gray-700">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {/* Pagination */}
                        <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">

                            {/* Info */}
                            <p className="text-xs text-gray-500">
                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </p>

                            {/* Buttons */}
                            <div className="flex items-center gap-2">
                                {/* First */}
                                <button
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                    className="px-2 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                                >
                                    «
                                </button>

                                {/* Prev */}
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="px-3 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                                >
                                    Prev
                                </button>

                                {/* Page numbers */}
                                {Array.from({ length: table.getPageCount() }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => table.setPageIndex(i)}
                                        className={`px-3 py-1 text-xs rounded-lg border transition-colors
                    ${table.getState().pagination.pageIndex === i
                                            ? "bg-violet-600 text-white border-violet-600"
                                            : "border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                {/* Next */}
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="px-3 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                                >
                                    Next
                                </button>

                                {/* Last */}
                                <button
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                    className="px-2 py-1 text-xs rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                                >
                                    »
                                </button>
                            </div>

                            {/* Page size */}
                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={e => table.setPageSize(Number(e.target.value))}
                                className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-violet-400"
                            >
                                {[5, 10, 20, 50].map(size => (
                                    <option key={size} value={size}>Show {size}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {showCreate   && <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
            {editTarget   && <EditModal customer={editTarget} onClose={() => setEditTarget(null)} onUpdate={handleUpdate} onPatch={handlePatch} />}
            {deleteTarget && <DeleteModal customer={deleteTarget} onClose={() => setDeleteTarget(null)} onDelete={handleDelete} />}
        </div>
    );
}