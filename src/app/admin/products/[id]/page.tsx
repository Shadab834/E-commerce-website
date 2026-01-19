import { ProductForm } from "@/components/admin/ProductForm";
import { updateProductAction } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product) notFound();

    // Transform product data to match ProductData interface if necessary
    // Prisma returns Decimal for price, we need number for the form helper
    const productData = {
        ...product,
        price: Number(product.price),
        // images might need handling if it's not a string in Prisma type but it is in our schema
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Edit Product</h1>
            <ProductForm initialData={productData} action={updateProductAction} />
        </div>
    );
}
