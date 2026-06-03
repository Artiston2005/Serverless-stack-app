import { getProjects } from '@/app/actions/projects';
import { getInvoices } from '@/app/actions/invoices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, FileText, BanknoteIcon } from 'lucide-react';

export default async function DashboardOverview() {
  const projectsRes = await getProjects();
  const invoicesRes = await getInvoices();

  const projects = projectsRes.success ? projectsRes.data : [];
  const invoices = invoicesRes.success ? invoicesRes.data : [];

  const activeProjects = projects?.filter((p: { status: string }) => p.status === 'active')?.length || 0;
  
  const unpaidInvoices = invoices?.filter((i: { status: string; amount: number }) => i.status === 'unpaid') || [];
  const totalUnpaid = unpaidInvoices.reduce((acc: number, cur: { amount: number }) => acc + Number(cur.amount), 0);
  const paidInvoices = invoices?.filter((i: { status: string; amount: number }) => i.status === 'paid') || [];
  const totalPaid = paidInvoices.reduce((acc: number, cur: { amount: number }) => acc + Number(cur.amount), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">Out of {projects?.length || 0} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
            <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalUnpaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{unpaidInvoices.length} invoices pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earned (Paid)</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From {paidInvoices.length} invoices</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
