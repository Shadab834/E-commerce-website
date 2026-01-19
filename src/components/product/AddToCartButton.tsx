"use client";

import { useCart, CartItem } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

export function AddToCartButton({ product, variant = "primary", size = "md", className, showIcon = true }: {
    product: { id: string, title: string, price: number, image: string },
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger",
    size?: "sm" | "md" | "lg",
    className?: string,
    showIcon?: boolean
}) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation if inside a card
        e.stopPropagation();

        addItem({
            id: product.id,
            title: product.title,
            price: Number(product.price),
            image: product.image,
            quantity: 1
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={handleAdd}
        >
            <AnimatePresence mode="wait">
                {added ? (
                    <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        Added!
                    </motion.span>
                ) : (
                    <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center"
                    >
                        {showIcon && <ShoppingCart className="mr-2 h-5 w-5" />}
                        Add to Cart
                    </motion.span>
                )}
            </AnimatePresence>
        </Button>
    );
}
