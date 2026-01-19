import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteProductAction } from "@/lib/actions"; // We'll need a client component for the delete button to use server action if we want to avoid full page refresh or use form
// To keep it simple, we can make this a server component and have a client component for the row actions

import { ProductRowActions } from "@/components/admin/ProductRowActions";

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Products</h1>
                <Link href="/admin/products/new">
                    <Button leftIcon={<Plus className="w-4 h-4" />}>Add Product</Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-medium border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {products.map((product) => {
                            let images: string[] = [];
                            try {
                                images = JSON.parse(product.images);
                            } catch (e) {
                                images = [product.images];
                            }
                            const mainImage = images[0] || "https://dummyjson.com/image/50";

                            return (
                                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden">
                                            <img src={mainImage} className="w-full h-full object-contain" alt="" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 line-clamp-2 max-w-[200px]">
                                        {product.title}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{product.category}</td>
                                    <td className="px-6 py-4">${Number(product.price).toFixed(2)}</td>
                                    <td className="px-6 py-4">{product.stockQuantity}</td>
                                    <td className="px-6 py-4 text-right">
                                        <ProductRowActions productId={product.id} />
                                    </td>
                                </tr>
                            );
                        })}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
