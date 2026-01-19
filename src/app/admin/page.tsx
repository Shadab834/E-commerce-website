import { StatsCard } from "@/components/admin/StatsCard";
import { SalesChart } from "@/components/admin/SalesChart";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats } from "@/lib/actions";

// Dummy data for charts (In real app, this would come from an action too)
const data = [
    { name: "Jan", total: 4500 },
    { name: "Feb", total: 5200 },
    { name: "Mar", total: 4800 },
    { name: "Apr", total: 6100 },
    { name: "May", total: 5900 },
    { name: "Jun", total: 7200 },
];

export default async function AdminDashboard() {
    const stats = await getAdminStats();

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Overview</h1>
                <p className="text-slate-500">Welcome back. Here's what's happening with your store today.</p>
            </div>

            {/* Stats Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value={`$${stats.totalRevenue.toFixed(2)}`}
                    description="Total earnings to date"
                    icon={DollarSign}
                    trend="+12% from last month"
                />
                <StatsCard
                    title="Total Users"
                    value={stats.totalUsers.toString()}
                    description="Registered customers"
                    icon={Users}
                    trend="+5 new today"
                />
                <StatsCard
                    title="Total Sales"
                    value={stats.totalSales.toString()}
                    description="Completed orders"
                    icon={ShoppingCart}
                    trend="+18% growth"
                />
                <StatsCard
                    title="Active Products"
                    value={stats.activeProducts.toString()}
                    description="Products in catalog"
                    icon={Package}
                />
            </div>

            {/* Content Row */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Visual Chart (Client Component) */}
                <div className="lg:col-span-4">
                    <SalesChart data={data} />
                </div>

                {/* Recent Activity Card */}
                <Card className="lg:col-span-3 border-slate-200 dark:border-slate-800">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {[
                                { name: "Olivia Martin", email: "olivia@example.com", amount: "+$1,999.00", initial: "OM" },
                                { name: "Jackson Lee", email: "jackson@example.com", amount: "+$39.00", initial: "JL" },
                                { name: "Isabella Nguyen", email: "isabella@example.com", amount: "+$299.00", initial: "IN" },
                                { name: "William Kim", email: "will@example.com", amount: "+$99.00", initial: "WK" },
                            ].map((user, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                                        {user.initial}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                    <div className="text-sm font-semibold text-emerald-600">{user.amount}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
