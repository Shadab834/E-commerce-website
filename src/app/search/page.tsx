import { AddToCartButton } from "@/components/product/AddToCartButton";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Product } from "@prisma/client";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { q: string };
}) {
    const query = searchParams.q || "";

    const products = await prisma.product.findMany({
        where: {
            OR: [
                { title: { contains: query } },
                { description: { contains: query } },
                { category: { contains: query } }
            ]
        }
    });

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Results for "{query}"</h1>
                <p className="text-slate-500 mb-8">{products.length} products found</p>

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-slate-400">No products found matching your criteria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product: Product) => {
                            let images: string[] = [];
                            try {
                                images = JSON.parse(product.images);
                            } catch (e) {
                                images = [product.images];
                            }
                            const mainImage = images[0] || "https://dummyjson.com/image/150";

                            return (
                                <Link key={product.id} href={`/product/${product.id}`} className="block">
                                    <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800">
                                        <CardHeader className="p-0">
                                            <div className="aspect-square bg-slate-100 rounded-t-xl relative overflow-hidden">
                                                <img
                                                    src={mainImage}
                                                    alt={product.title}
                                                    className="object-contain w-full h-full p-4 group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <CardTitle className="text-lg bg-none text-slate-900 bg-clip-text-none dark:text-slate-50 line-clamp-1" title={product.title}>
                                                    {product.title}
                                                </CardTitle>
                                            </div>
                                            <div className="flex items-center mt-2 space-x-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm font-medium text-slate-900">{product.rating}</span>
                                                <span className="text-xs text-slate-500 ml-1">(42)</span>
                                            </div>
                                            <CardDescription className="mt-2 text-slate-900 font-bold text-lg">${Number(product.price).toFixed(2)}</CardDescription>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0">
                                            <AddToCartButton
                                                product={{
                                                    id: product.id,
                                                    title: product.title,
                                                    price: Number(product.price),
                                                    image: mainImage
                                                }}
                                                className="w-full bg-slate-900 hover:bg-indigo-600 text-white transition-colors"
                                                variant="primary"
                                                showIcon={false}
                                            />
                                        </CardFooter>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
