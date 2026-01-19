"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteProductAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductRowActions({ productId }: { productId: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        setLoading(true);
        const res = await deleteProductAction(productId);
        setLoading(false);

        if (res?.success) {
            router.refresh();
        } else {
            alert("Failed to delete product");
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Link href={`/admin/products/${productId}`}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Pencil className="w-4 h-4 text-slate-500" />
                </Button>
            </Link>
            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:text-rose-600 hover:bg-rose-50"
                onClick={handleDelete}
                disabled={loading}
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    );
}
