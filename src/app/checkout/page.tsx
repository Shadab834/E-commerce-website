"use client";

import { useCart } from "@/lib/cart-context";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // We need to check if we have this or need standard inputs
import { createOrderAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CreditCard, Landmark, Smartphone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// Assuming Input component exists, otherwise use standard input

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
    const [showUpiPortal, setShowUpiPortal] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);
    const [upiBankDetails, setUpiBankDetails] = useState({
        accountNumber: "",
        ifscCode: "",
        bankName: ""
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 flex items-center justify-center">
                    <p>Your cart is empty. Please add items to checkout.</p>
                </main>
                <Footer />
            </div>
        )
    }

    async function handleSubmit(formData: FormData) {
        if (paymentMethod === "upi" && !showUpiPortal) {
            setShowUpiPortal(true);
            return;
        }

        setLoading(true);
        setError("");

        const res = await createOrderAction(items, totalPrice);

        if (res?.error) {
            setError(res.error);
            setLoading(false);
            setShowUpiPortal(false);
        } else if (res?.success) {
            clearCart();
            router.push(`/order-success/${res.orderId}`);
        }
    }

    const handleUpiPayment = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(); // We don't really need the form data here for the simulation
        handleSubmit(formData);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Shipping Form */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                        <form action={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">First Name</label>
                                    <Input name="firstName" required placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Last Name</label>
                                    <Input name="lastName" required placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Address</label>
                                <Input name="address" required placeholder="123 Main St" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">City</label>
                                    <Input name="city" required placeholder="New York" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Postal Code</label>
                                    <Input name="zip" required placeholder="10001" />
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-6">
                                <h3 className="font-semibold text-lg">Payment Method</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setPaymentMethod("card")}
                                        className={`cursor-pointer p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${paymentMethod === "card" ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-100 dark:border-slate-800"}`}
                                    >
                                        <CreditCard className={`w-5 h-5 ${paymentMethod === "card" ? "text-indigo-600" : "text-slate-400"}`} />
                                        <span className="font-medium text-sm">Credit Card</span>
                                    </div>
                                    <div
                                        onClick={() => setPaymentMethod("upi")}
                                        className={`cursor-pointer p-4 border-2 rounded-xl flex items-center gap-3 transition-all ${paymentMethod === "upi" ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-100 dark:border-slate-800"}`}
                                    >
                                        <Smartphone className={`w-5 h-5 ${paymentMethod === "upi" ? "text-indigo-600" : "text-slate-400"}`} />
                                        <span className="font-medium text-sm">UPI Payment</span>
                                    </div>
                                </div>
                            </div>

                            {paymentMethod === "card" && (
                                <div className="space-y-2 pt-4">
                                    <label className="text-sm font-medium">Card Number (Simulation)</label>
                                    <Input name="card" placeholder="4242 4242 4242 4242" disabled />
                                    <p className="text-xs text-slate-500">Card payment is simulated for this demo.</p>
                                </div>
                            )}

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <Button type="submit" className="w-full mt-4" size="lg" isLoading={loading}>
                                {paymentMethod === "upi" ? "Pay via UPI" : `Place Order ($${totalPrice.toFixed(2)})`}
                            </Button>
                        </form>
                    </div>

                    <AnimatePresence>
                        {showUpiPortal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                                >
                                    <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Smartphone className="w-6 h-6" />
                                            <h3 className="text-xl font-bold">UPI Payment Portal</h3>
                                        </div>
                                        <button onClick={() => setShowUpiPortal(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleUpiPayment} className="p-6 space-y-6">
                                        <div className="text-center mb-6">
                                            <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Amount to Pay</p>
                                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">${totalPrice.toFixed(2)}</h2>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium flex items-center gap-2">
                                                    <Landmark className="w-4 h-4 text-indigo-600" />
                                                    Bank Name
                                                </label>
                                                <Input
                                                    required
                                                    placeholder="e.g. HDFC Bank"
                                                    value={upiBankDetails.bankName}
                                                    onChange={(e) => setUpiBankDetails({ ...upiBankDetails, bankName: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Account Number</label>
                                                <Input
                                                    required
                                                    placeholder="XXXX XXXX XXXX XXXX"
                                                    value={upiBankDetails.accountNumber}
                                                    onChange={(e) => setUpiBankDetails({ ...upiBankDetails, accountNumber: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">IFSC Code</label>
                                                <Input
                                                    required
                                                    placeholder="HDFC0001234"
                                                    className="uppercase"
                                                    value={upiBankDetails.ifscCode}
                                                    onChange={(e) => setUpiBankDetails({ ...upiBankDetails, ifscCode: e.target.value.toUpperCase() })}
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Button type="submit" className="w-full" size="lg" isLoading={loading}>
                                                Verify & Pay Now
                                            </Button>
                                            <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-2">
                                                <Smartphone className="w-3 h-3" />
                                                Secure UPI-2.0 Encryption
                                            </p>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Order Summary */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-fit">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">{item.title} (x{item.quantity})</span>
                                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t pt-4 flex justify-between font-bold text-lg mt-4">
                                <span>Total</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
