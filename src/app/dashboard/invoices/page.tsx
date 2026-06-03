import { getInvoices } from '@/app/actions/invoices';
import { getProjects } from '@/app/actions/projects';
import InvoicesClient from '@/components/invoices/invoices-client';

export default async function InvoicesPage() {
  const { data: invoices = [] } = await getInvoices();
  const { data: projects = [] } = await getProjects();
  
  return <InvoicesClient invoices={invoices} projects={projects} />;
}
