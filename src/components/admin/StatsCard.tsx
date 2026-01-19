import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
    trend?: string;
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
    return (
        <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                    {title}
                </CardTitle>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
                <div className="flex items-center gap-2 mt-1">
                    {trend && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                            {trend.split(' ')[0]}
                        </span>
                    )}
                    <p className="text-xs text-slate-400 line-clamp-1">
                        {trend ? trend.split(' ').slice(1).join(' ') : description}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

