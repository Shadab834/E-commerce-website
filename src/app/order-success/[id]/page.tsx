import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function OrderSuccessPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: { include: { product: true } } }
    });

    if (!order) return notFound();

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>

                <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                    Thank you for your purchase. Your order #{order.id.slice(0, 8)} has been confirmed and will be shipped shortly.
                </p>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 w-full max-w-md mb-8 text-left">
                    <h3 className="font-semibold mb-4 border-b pb-2">Order Details</h3>
                    {order.items.map(item => (
                        <div key={item.id} className="flex justify-between py-2 text-sm">
                            <span className="truncate pr-4 flex-1">{item.product.title} x {item.quantity}</span>
                            <span>${Number(item.priceAtPurchase).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                        <span>Total Paid</span>
                        <span>${Number(order.totalAmount).toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Link href="/dashboard">
                        <Button variant="outline">View Order History</Button>
                    </Link>
                    <Link href="/">
                        <Button>Continue Shopping</Button>
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
