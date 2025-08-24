import { h } from "preact";
import Card from "../ui/Card";
import ProjectLogo from "../ui/ProjectLogo";

interface Project {
  id: number;
  name: string;
  slug: string;
  isPrimary: boolean;
  added: boolean;
  twitter?: string;
  discord?: string;
  site?: string;
}

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const logoUrl = `/projects/logo/${project.slug}_logo.png`;

  return (
    <Card onClick={onClick}>
      <div class="card-body d-flex align-items-center gap-2">
        <ProjectLogo projectSlug={project.slug}/>
        <div class="flex-grow-1 d-flex flex-column">
          <div class="d-flex align-items-center gap-2">
            <div class="fw-bold">{project.name}</div>
            {project.isPrimary && <span class="badge bg-success text-white">Primary</span>}
            {project.added && !project.isPrimary && <span class="badge bg-info text-white">Added</span>}
          </div>
          <small class="text-muted">{project.slug}</small>
        </div>
      </div>
    </Card>
  );
}
