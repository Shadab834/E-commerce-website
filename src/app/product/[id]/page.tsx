import { AddToCartButton } from "@/components/product/AddToCartButton";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        notFound();
    }

    let images: string[] = [];
    try {
        images = JSON.parse(product.images);
    } catch (e) {
        images = [product.images];
    }

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 p-8 flex items-center justify-center">
                            <img
                                src={images[0] || "https://dummyjson.com/image/400"}
                                alt={product.title}
                                className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {images.slice(0, 4).map((img, i) => (
                                <div key={i} className="aspect-square bg-slate-50 rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:border-indigo-600 transition-colors">
                                    <img src={img} alt="" className="w-full h-full object-contain p-2" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm text-indigo-600 font-semibold mb-2 uppercase tracking-wide">{product.category}</p>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{product.title}</h1>

                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            className={`w-5 h-5 ${s <= Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-slate-500">{product.rating} (128 reviews)</span>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">${Number(product.price).toFixed(2)}</span>
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <p>{product.description}</p>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-800 py-6 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <Truck className="w-5 h-5 text-indigo-600" />
                                <span>Free delivery on orders over $50</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                <span>2 Year Extended Warranty</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                <RefreshCcw className="w-5 h-5 text-indigo-600" />
                                <span>30 Day Return Policy</span>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <AddToCartButton
                                product={{
                                    id: product.id,
                                    title: product.title,
                                    price: Number(product.price),
                                    image: images[0] || "https://dummyjson.com/image/400"
                                }}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                                size="lg"
                                showIcon={true}
                            />
                            <Button size="lg" variant="outline" className="flex-1">
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
