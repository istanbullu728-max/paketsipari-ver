import { ReactNode } from "react";
import AdminSidebar from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col md:flex-row transition-colors duration-300">
            <AdminSidebar />

            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
