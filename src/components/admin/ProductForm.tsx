"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Define a type for the product prop
interface ProductData {
    id?: string;
    title: string;
    description: string;
    price: number;
    stockQuantity: number;
    category: string;
    images: string; // JSON string in DB, but we might handle as string or array here. Let's assume input text for URL for simplicity in V1
}

interface ProductFormProps {
    initialData?: ProductData | null;
    action: (formData: FormData) => Promise<any>;
}

export function ProductForm({ initialData, action }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");

        const res = await action(formData);

        if (res?.error) {
            setError(res.error);
            setLoading(false);
        } else {
            router.push("/admin/products");
            router.refresh();
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 max-w-2xl bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="space-y-2">
                <label className="text-sm font-medium">Product Title</label>
                <Input name="title" defaultValue={initialData?.title} required placeholder="e.g. Wireless Headphones" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    name="description"
                    defaultValue={initialData?.description}
                    required
                    className="w-full min-h-[100px] rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Product details..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Price ($)</label>
                    <Input name="price" type="number" step="0.01" defaultValue={initialData?.price} required placeholder="99.99" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Stock Quantity</label>
                    <Input name="stockQuantity" type="number" defaultValue={initialData?.stockQuantity} required placeholder="100" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input name="category" defaultValue={initialData?.category} required placeholder="Electronics" />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <Input name="image" defaultValue={initialData?.images ? JSON.parse(initialData.images)[0] : ""} required placeholder="https://example.com/image.jpg" />
                <p className="text-xs text-slate-500">Provide a direct link to an image.</p>
            </div>

            {/* Hidden ID for updates */}
            {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" isLoading={loading}>
                    {initialData ? "Update Product" : "Create Product"}
                </Button>
            </div>
        </form>
    );
}
