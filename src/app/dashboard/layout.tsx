import DashboardLayoutUI from '@/components/layout/dashboard-layout';
import { AuthProvider } from '@/components/providers/auth-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayoutUI>{children}</DashboardLayoutUI>
    </AuthProvider>
  );
}
