import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <AdminSidebar />
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    )
}
