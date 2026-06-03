import { DashboardNav } from './dashboard-nav';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <DashboardNav />
      <div className="flex flex-col flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/20 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            {/* Additional header controls can go here, like breadcrumbs or a search bar */}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
