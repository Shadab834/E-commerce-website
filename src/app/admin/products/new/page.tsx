"use client";

import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "@/lib/actions";

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Add New Product</h1>
            <ProductForm action={createProductAction} />
        </div>
    );
}
