import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Package, User } from "lucide-react";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    // Fetch user details and orders
    const user = await prisma.user.findUnique({
        where: { id: session.id },
        include: {
            orders: {
                orderBy: { createdAt: 'desc' },
                include: { items: { include: { product: true } } }
            }
        }
    });

    if (!user) {
        // Handle edge case where session is valid but user deleted
        return <div>User not found</div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Account</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="md:col-span-1">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-lg">{user.fullName}</h2>
                                    <p className="text-sm text-slate-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <span className="inline-block px-2 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 rounded-full">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-slate-500" />
                            Recent Orders
                        </h2>

                        <div className="space-y-4">
                            {user.orders.map((order) => (
                                <div key={order.id} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                                    <div className="flex flex-wrap justify-between items-start mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Order Placed</p>
                                            <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Total</p>
                                            <p className="text-sm font-medium">${Number(order.totalAmount).toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Order #</p>
                                            <p className="text-sm font-mono">{order.id.slice(0, 8)}</p>
                                        </div>
                                        <div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                                ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                                'bg-gray-100 text-gray-800'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex gap-4 items-center">
                                                <div className="w-16 h-16 bg-slate-50 rounded border border-slate-100 overflow-hidden flex-shrink-0">
                                                    {/* In a real app we'd parse the images JSON, but for simplicity we rely on product data if available */}
                                                    <img src={item.product?.images ? JSON.parse(item.product.images)[0] : "https://dummyjson.com/image/150"} className="w-full h-full object-contain p-2" alt="" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm line-clamp-1">{item.product?.title || "Product"}</p>
                                                    <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-medium">${Number(item.priceAtPurchase).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {user.orders.length === 0 && (
                                <div className="text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                                    <p className="text-slate-500">No orders yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
