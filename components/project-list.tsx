import type { ProjectRow } from "@/types/db";

export function ProjectList({ projects }: { projects: ProjectRow[] }) {
  if (projects.length === 0) return null;
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <li
          key={project.slug}
          className="rounded-[--radius-card] border border-[color:var(--color-border-subtle)] p-6"
        >
          <h3 className="text-headline-sm">{project.name}</h3>
          {project.authors_raw ? (
            <p className="text-body-sm mt-1 font-mono">{project.authors_raw}</p>
          ) : null}
          {project.description ? (
            <p className="text-body-md mt-3">{project.description}</p>
          ) : null}
          {project.github ? (
            <p className="mt-4">
              <a
                className="text-label font-mono uppercase"
                href={project.github}
                rel="noreferrer"
              >
                Code
              </a>
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
