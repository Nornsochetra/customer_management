'use client'

import {useState} from "react";
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {
                            customerData.map((customer) => (
                                <CustomerCard
                                    key={customer?.customerId}
                                    customer={customer}
                                    onView={(id) => router.push(`/customer/${id}`)}
                                    onEdit={setEditTarget}
                                    onDelete={setDeleteTarget}
                                />
                            ))
                        }
                    </div>
                )}
            </div>

            {showCreate   && <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
            {editTarget   && <EditModal customer={editTarget} onClose={() => setEditTarget(null)} onUpdate={handleUpdate} onPatch={handlePatch} />}
            {deleteTarget && <DeleteModal customer={deleteTarget} onClose={() => setDeleteTarget(null)} onDelete={handleDelete} />}
        </div>
    );
}