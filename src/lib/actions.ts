"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { encrypt } from "./auth";
import { cookies } from "next/headers";

export async function registerAction(prevState: any, formData: FormData) {
    const name = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || !name) {
        return { error: "Please fill in all fields" };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "User already exists with this email" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: hashedPassword,
            fullName: name,
            role: "CUSTOMER",
        },
    });

    // Create Session
    const session = await encrypt({ id: user.id, email: user.email, role: user.role });

    // Save session in a cookie
    const cookieStore = await cookies();
    cookieStore.set("session", session, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });

    redirect("/dashboard");
}

export async function loginAction(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Please provide email and password" };
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return { error: "Invalid credentials" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        return { error: "Invalid credentials" };
    }

    // Create Session
    const session = await encrypt({ id: user.id, email: user.email, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set("session", session, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });

    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        redirect("/admin");
    } else {
        redirect("/");
    }
}
// ... existing imports
import { getSession } from "@/lib/auth";

// ... existing code

export async function createOrderAction(cartItems: any[], totalAmount: number) {
    const session = await getSession();
    if (!session || !session.id) {
        return { error: "You must be logged in to place an order." };
    }

    try {
        const order = await prisma.order.create({
            data: {
                userId: session.id,
                totalAmount,
                status: "PENDING",
                items: {
                    create: cartItems.map((item) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        priceAtPurchase: item.price,
                    })),
                },
            },
        });

        return { success: true, orderId: order.id };
    } catch (error) {
        console.error("Order creation failed:", error);
        return { error: "Failed to create order. Please try again." };
    }
}
// ... existing imports

export async function getAdminStats() {
    // 1. Total Revenue
    const revenueResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: 'CANCELLED' } } // Assuming you don't count cancelled orders
    });
    const totalRevenue = revenueResult._sum.totalAmount || 0;

    // 2. Total Users
    const totalUsers = await prisma.user.count({
        where: { role: 'CUSTOMER' }
    });

    // 3. Total Sales (Count of orders)
    const totalSales = await prisma.order.count({
        where: { status: { not: 'CANCELLED' } }
    });

    // 4. Active Products
    const activeProducts = await prisma.product.count();

    return {
        totalRevenue: Number(totalRevenue),
        totalUsers,
        totalSales,
        activeProducts
    };
}

export async function deleteProductAction(productId: string) {
    const session = await getSession();
    // Simplified role check for now, can be stricter
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.product.delete({
            where: { id: productId }
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to delete product:", error);
        return { error: "Failed to delete product" };
    }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to update order status:", error);
        return { error: "Failed to update order status" };
    }
}

export async function createProductAction(formData: FormData) {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
        return { error: "Unauthorized" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stockQuantity = parseInt(formData.get("stockQuantity") as string);
    const category = formData.get("category") as string;
    const image = formData.get("image") as string;

    // Basic validation
    if (!title || !description || !price || !stockQuantity || !category) {
        return { error: "Please fill in all required fields" };
    }

    try {
        await prisma.product.create({
            data: {
                title,
                description,
                price,
                stockQuantity,
                category,
                images: JSON.stringify([image]), // Storing as JSON array string as per schema
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to create product:", error);
        return { error: "Failed to create product" };
    }
}

export async function updateProductAction(formData: FormData) {
    const session = await getSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
        return { error: "Unauthorized" };
    }

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const stockQuantity = parseInt(formData.get("stockQuantity") as string);
    const category = formData.get("category") as string;
    const image = formData.get("image") as string;

    if (!id) return { error: "Product ID is missing" };

    try {
        await prisma.product.update({
            where: { id },
            data: {
                title,
                description,
                price,
                stockQuantity,
                category,
                images: JSON.stringify([image]),
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to update product:", error);
        return { error: "Failed to update product" };
    }
}
