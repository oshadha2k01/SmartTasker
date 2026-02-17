'use client';
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/register';

    return (
        <AuthProvider>
            {!isAuthPage && <Navbar />}
            {children}
        </AuthProvider>
    );
}
