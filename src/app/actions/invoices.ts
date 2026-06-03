'use server';

import { createClient } from '@/lib/supabase/server';
import { invoiceSchema, invoiceUpdateSchema, InvoiceInput, InvoiceUpdateInput } from '@/lib/validations/invoices';
import { revalidatePath } from 'next/cache';

export async function createInvoice(data: InvoiceInput) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const parsedData = invoiceSchema.parse(data);

    // Verify the user owns the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', parsedData.project_id)
      .eq('user_id', user.id)
      .single();

    if (projectError || !project) {
        return { success: false, error: 'Project not found or unauthorized' };
    }

    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        ...parsedData,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard/invoices');
    return { success: true, data: invoice };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create invoice';
    return { success: false, error: message };
  }
}

export async function getInvoices() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*, projects(title)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: invoices };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch invoices';
    return { success: false, error: message };
  }
}

export async function updateInvoice(id: string, data: InvoiceUpdateInput) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const parsedData = invoiceUpdateSchema.parse(data);

    const { data: invoice, error } = await supabase
      .from('invoices')
      .update({ ...parsedData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard/invoices');
    return { success: true, data: invoice };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update invoice';
    return { success: false, error: message };
  }
}

export async function deleteInvoice(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/dashboard/invoices');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete invoice';
    return { success: false, error: message };
  }
}
