import { PaginationProvider } from "@/lib/PaginationContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <PaginationProvider>{children}</PaginationProvider>;
}
