'use server';

import { createClient } from '@/lib/supabase/server';
import { projectSchema, projectUpdateSchema, ProjectInput, ProjectUpdateInput } from '@/lib/validations/projects';
import { revalidatePath } from 'next/cache';

export async function createProject(data: ProjectInput) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const parsedData = projectSchema.parse(data);

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        ...parsedData,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard/projects');
    return { success: true, data: project };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create project';
    return { success: false, error: message };
  }
}

export async function getProjects() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { success: true, data: projects };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch projects';
    return { success: false, error: message };
  }
}

export async function updateProject(id: string, data: ProjectUpdateInput) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const parsedData = projectUpdateSchema.parse(data);

    const { data: project, error } = await supabase
      .from('projects')
      .update({ ...parsedData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard/projects');
    return { success: true, data: project };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update project';
    return { success: false, error: message };
  }
}

export async function deleteProject(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/dashboard/projects');
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete project';
    return { success: false, error: message };
  }
}
