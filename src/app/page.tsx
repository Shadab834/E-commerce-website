import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Product } from "@prisma/client";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    take: 8,
    where: { isFeatured: true }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-50 py-20 dark:bg-slate-950 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-fuchsia-600">
                  Shopping Reimagined for Everyone
                </h1>
                <p className="max-w-[600px] text-slate-500 md:text-xl dark:text-slate-400">
                  Experience the most user-friendly marketplace. Curated collections, lightning-fast delivery, and premium support.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Shop Now
                  </Button>
                  <Button variant="outline" size="lg">
                    View Deals
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full opacity-20 blur-3xl" />
                <img
                  src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2670&auto=format&fit=crop"
                  alt="Shopping Experience"
                  className="relative rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
                <p className="text-slate-500 mt-2">Handpicked for you based on the latest trends.</p>
              </div>
              <Button variant="ghost">View All</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: Product) => {
                let images: string[] = [];
                try {
                  images = JSON.parse(product.images);
                } catch (e) {
                  images = [product.images]; // Fallback
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
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
