"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-slate-50 pt-16 pb-8 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
                            ShopZone
                        </span>
                        <p className="mt-4 text-sm text-slate-500 max-w-xs">
                            The next generation of e-commerce. Experience shopping like never before with our curated collection of premium products.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-50">Shop</h3>
                        <ul className="mt-4 space-y-2 text-sm text-slate-500">
                            <li><Link href="#" className="hover:text-indigo-600">New Arrivals</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600">Best Sellers</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600">Categories</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600">Deals</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-50">Support</h3>
                        <ul className="mt-4 space-y-2 text-sm text-slate-500">
                            <li><Link href="#" className="hover:text-indigo-600">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600">Returns</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600">Shipping Info</Link></li>
                            <li><Link href="#" className="hover:text-indigo-600">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-50">Newsletter</h3>
                        <p className="mt-4 text-sm text-slate-500 mb-4">
                            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                        </p>
                        <div className="flex gap-2">
                            <Input placeholder="Enter your email" className="bg-white dark:bg-slate-900" />
                            <Button size="sm">Subscribe</Button>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-slate-200 pt-8 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-400">
                        © 2026 ShopZone Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4 text-slate-400">
                        <Facebook className="h-5 w-5 hover:text-indigo-600 cursor-pointer" />
                        <Twitter className="h-5 w-5 hover:text-indigo-600 cursor-pointer" />
                        <Instagram className="h-5 w-5 hover:text-indigo-600 cursor-pointer" />
                        <Youtube className="h-5 w-5 hover:text-indigo-600 cursor-pointer" />
                    </div>
                </div>
            </div>
        </footer>
    )
}
