'use client'
import { useState } from "react";

// ── Shared internals ───────────────────────────────────────────────────────────
function Modal({ children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                 onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
            {children}
        </div>
    );
}

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition bg-gray-50 focus:bg-white";

// ── Create Modal ───────────────────────────────────────────────────────────────
export function CreateModal({ onClose, onCreate }) {
    const [form, setForm] = useState({ username: "", type: "INDIVIDUAL", email: "", phone: "" });
    const [loading, setLoading] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async () => {
        if (!form.username || !form.email || !form.phone) return;
        setLoading(true);
        await onCreate(form);
        setLoading(false);
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">New Customer</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Fill in the details below</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    <Field label="Username">
                        <input className={inputCls} type="text" placeholder="e.g. sochetra" value={form.username} onChange={e => set("username", e.target.value)} />
                    </Field>
                    <Field label="Email">
                        <input className={inputCls} type="email" placeholder="e.g. user@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
                    </Field>
                    <Field label="Phone">
                        <input className={inputCls} type="text" placeholder="e.g. 012345678" value={form.phone} onChange={e => set("phone", e.target.value)} />
                    </Field>
                    <Field label="Type">
                        <select className={inputCls} value={form.type} onChange={e => set("type", e.target.value)}>
                            <option value="INDIVIDUAL">INDIVIDUAL</option>
                            <option value="CORPORATE">CORPORATE</option>
                        </select>
                    </Field>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-semibold text-sm transition-colors">
                        {loading ? "Creating..." : "Create Customer"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// ── Edit Modal (PUT) ───────────────────────────────────────────────────────────
export function EditModal({ customer, onClose, onUpdate }) {
    const [form, setForm] = useState({
        username: customer.username ?? "",
        type: customer.types ?? "INDIVIDUAL",
        email: customer.email ?? "",
        phone: customer.phone ?? "",
        status: customer.status ?? "ACTIVE",
    });
    const [loading, setLoading] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async () => {
        setLoading(true);
        await onUpdate(customer.customerId, form);
        setLoading(false);
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Edit Customer</h2>
                        <p className="text-sm text-gray-400 mt-0.5">@{customer.username}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    <Field label="Username">
                        <input className={inputCls} type="text" value={form.username} onChange={e => set("username", e.target.value)} />
                    </Field>
                    <Field label="Email">
                        <input className={inputCls} type="email" value={form.email} onChange={e => set("email", e.target.value)} />
                    </Field>
                    <Field label="Phone">
                        <input className={inputCls} type="text" value={form.phone} onChange={e => set("phone", e.target.value)} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Type">
                            <select className={inputCls} value={form.type} onChange={e => set("type", e.target.value)}>
                                <option value="INDIVIDUAL">INDIVIDUAL</option>
                                <option value="CORPORATE">CORPORATE</option>
                            </select>
                        </Field>
                        <Field label="Status">
                            <select className={inputCls} value={form.status} onChange={e => set("status", e.target.value)}>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </Field>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-semibold text-sm transition-colors">
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// ── Patch Modal (PATCH) ────────────────────────────────────────────────────────
export function PatchModal({ customer, onClose, onPatch }) {
    const [form, setForm] = useState({
        phone: customer.phone ?? "",
        status: customer.status ?? "ACTIVE",
    });
    const [loading, setLoading] = useState(false);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async () => {
        setLoading(true);
        await onPatch(customer.customerId, form);
        setLoading(false);
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Quick Update</h2>
                        <p className="text-sm text-gray-400 mt-0.5">@{customer.username}</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    <Field label="Phone">
                        <input className={inputCls} type="text" value={form.phone} onChange={e => set("phone", e.target.value)} />
                    </Field>
                    <Field label="Status">
                        <select className={inputCls} value={form.status} onChange={e => set("status", e.target.value)}>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                    </Field>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors">Cancel</button>
                    <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold text-sm transition-colors">
                        {loading ? "Updating..." : "Quick Update"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// ── Delete Modal ───────────────────────────────────────────────────────────────
export function DeleteModal({ customer, onClose, onDelete }) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        await onDelete(customer.customerId);
        setLoading(false);
        onClose();
    };

    return (
        <Modal onClose={onClose}>
            <div className="p-8 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Customer</h3>
                <p className="text-sm text-gray-500 mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-800">@{customer.username}</span>?
                    <br />This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm transition-colors">Cancel</button>
                    <button onClick={handleConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold text-sm transition-colors">
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}