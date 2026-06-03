import { getProjects } from '@/app/actions/projects';
import ProjectsClient from '@/components/projects/projects-client';

export default async function ProjectsPage() {
  const { data: projects = [] } = await getProjects();
  
  return <ProjectsClient projects={projects} />;
}
