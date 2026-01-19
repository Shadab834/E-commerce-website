"use client";

import { useState } from "react";
import { updateOrderStatusAction } from "@/lib/actions";
import { useRouter } from "next/navigation";

// Define strict types corresponding to Prisma return
interface OrderRowProps {
    order: {
        id: string;
        user: { fullName: string; email: string };
        createdAt: Date;
        totalAmount: any; // Decimal in Prisma is tricky on client, usually string or number
        status: string;
    };
}

export function OrderRow({ order }: OrderRowProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(order.status);

    const handleStatusChange = async (newStatus: string) => {
        setLoading(true);
        const res = await updateOrderStatusAction(order.id, newStatus);
        setLoading(false);

        if (res?.success) {
            setStatus(newStatus);
            router.refresh();
        } else {
            alert("Failed to update status");
        }
    };

    const statusColors: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800",
        PROCESSING: "bg-blue-100 text-blue-800",
        SHIPPED: "bg-purple-100 text-purple-800",
        DELIVERED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
    };

    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
            <td className="px-6 py-4">
                <div className="font-medium text-slate-900 dark:text-slate-100">{order.user.fullName}</div>
                <div className="text-xs text-slate-500">{order.user.email}</div>
            </td>
            <td className="px-6 py-4 text-slate-500">
                {new Date(order.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 font-medium">${Number(order.totalAmount).toFixed(2)}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <select
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="text-sm border border-slate-300 rounded p-1 dark:bg-slate-800 dark:border-slate-600"
                    disabled={loading}
                >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </td>
        </tr>
    );
}
