"use client";

import { useCart } from "@/lib/cart-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
                        <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <Link href="/">
                            <Button size="lg" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-6 items-center"
                                >
                                    <div className="w-24 h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-contain p-2" />
                                    </div>

                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                                        <p className="text-indigo-600 font-bold mt-1">${item.price.toFixed(2)}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <Button variant="danger" size="sm" onClick={() => removeItem(item.id)} className="h-10 w-10 p-0 text-white bg-rose-500 hover:bg-rose-600">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-4 flex justify-end">
                                <Button variant="ghost" onClick={clearCart} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                                    Clear Cart
                                </Button>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24">
                                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Subtotal</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link href="/checkout" className="block w-full">
                                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white transition-colors" size="lg">
                                        Proceed to Checkout
                                    </Button>
                                </Link>

                                <p className="text-xs text-center text-slate-400 mt-4">
                                    Secure Checkout powered by PayStack
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
