"use client"

import * as React from "react"
import Link from "next/link"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { ShoppingCart, Search, Menu, User, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false)
    const { scrollY } = useScroll()
    const { totalItems } = useCart()

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 20)
    })

    return (
        <motion.header
            className={cn(
                "sticky top-0 z-50 w-full border-b transition-all duration-200",
                isScrolled
                    ? "border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/80"
                    : "border-transparent bg-transparent"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                            ShopZone
                        </span>
                    </Link>
                </div>

                {/* Search Bar - Desktop */}
                <div className="hidden flex-1 max-w-xl mx-8 md:block">
                    <form action="/search">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                            <Input
                                name="q"
                                type="search"
                                placeholder="Search for products, brands and more..."
                                className="pl-10 bg-slate-100 border-none focus-visible:ring-indigo-500 dark:bg-slate-900"
                            />
                        </div>
                    </form>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                        <Heart className="h-5 w-5 mr-2" />
                        <span className="hidden lg:inline">Wishlist</span>
                    </Button>

                    <Link href="/login">
                        <Button variant="ghost" size="sm">
                            <User className="h-5 w-5 mr-2" />
                            <span className="hidden lg:inline">Sign In</span>
                        </Button>
                    </Link>


                    <Link href="/cart">
                        <Button variant="primary" size="sm" className="relative ml-2">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="ml-2 hidden lg:inline">Cart</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] text-white">
                                    {totalItems}
                                </span>
                            )}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden px-4 pb-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-10 h-9 bg-slate-100 border-none dark:bg-slate-900"
                    />
                </div>
            </div>
        </motion.header>
    )
}
