
function Avatar({ name }) {
    const initials = (name ?? "??").slice(0, 2).toUpperCase();
    const palette = ["bg-violet-500","bg-emerald-500","bg-amber-500","bg-sky-500","bg-rose-500","bg-indigo-500"];
    const color = palette[(name?.charCodeAt(0) ?? 0) % palette.length];
    return (
        <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center text-white font-bold text-base flex-shrink-0 select-none`}>
            {initials}
        </div>
    );
}
function StatusBadge({ status }) {
    const on = status === "ACTIVE";
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${on ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${on ? "bg-emerald-500" : "bg-gray-400"}`} />
            {status ?? "—"}
        </span>
    );
}
function TypeBadge({ type }) {
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${type === "BUSINESS" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
            {type ?? "—"}
        </span>
    );
}
function formatDate(iso) {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
export default function CustomerCard({ customer, onView, onEdit, onDelete, onPatch }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4">
            <div className="flex items-start gap-3">
                <Avatar name={customer?.username} />
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">@{customer.username}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{customer.email}</p>
                </div>
                <StatusBadge status={customer.status} />
            </div>

            <div className="flex items-center justify-between">
                <TypeBadge type={customer.types} />
                <span className="text-xs text-gray-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {customer.phone}
                </span>
            </div>

            <div className="pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
                <span className="text-xs text-gray-400">{formatDate(customer.createdAt)}</span>
                <div className="flex items-center gap-1">
                    <button onClick={() => onView(customer.customerId)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-violet-600 hover:bg-violet-50 transition-colors">
                        View
                    </button>
                    <button onClick={() => onEdit(customer)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                        Edit
                    </button>
                    <button onClick={() => onDelete(customer)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
                        Delete
                    </button>
                    <button onClick={() => onPatch(customer)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-500 hover:bg-red-50 transition-colors">
                        Patch
                    </button>
                </div>
            </div>
        </div>
    );
}