import fs from 'fs';

import { db } from './db/db';
import * as schema from "./db/schema";

type ProjectSeed = {
  name: string
  slug: string
  twitter?: string
  discord?: string
  site?: string
  is_primary?: boolean
  added?: boolean
}

type EventSeed = {
  projectId: number
  title: string
  status?: string
  relatedProjectId?: number
  bannerPic?: string
  categories?: string[]
  types?: string[]
  newsLink?: string
  rating?: number
  date?: string // we will convert to Date
  description?: string
}

type SeedData = {
  projects: ProjectSeed[]
  events: EventSeed[]
}

function markdownToHtml(md: string | undefined): string {
  if (!md) return ""

  // bold: **text**
  let html = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // links: [text](url)
  html = html.replace(/\[(.+?)\]\((https?:\/\/[^\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  return html
}

async function main() {
  const rawProjects = fs.readFileSync('../seed_data/seed_projects.json', 'utf-8')
  const rawEvents = fs.readFileSync('../seed_data/seed_events.json', 'utf-8')
  const seedData: SeedData = {
    projects: JSON.parse(rawProjects),
    events: JSON.parse(rawEvents),
  }
//   console.log(seedData)

  await db.delete(schema.events);
  await db.delete(schema.projects);

  // insert projects
  const insertedProjects = await db.insert(schema.projects).values(
    seedData.projects.map(p => ({
      name: p.name,
      slug: p.slug,
      twitter: p.twitter,
      discord: p.discord,
      site: p.site,
      isPrimary: p.is_primary || false,
      added: p.added || false,
    }))
  ).returning();

  // map slugs to ids
  const projectMap: Record<string, number> = {};
  insertedProjects.forEach(p => { projectMap[p.slug] = p.id });

  // insert events
  await db.insert(schema.events).values(
    seedData.events.filter(e => e.date).map(e => ({
      projectId: projectMap[e.projectId],
      title: e.title,
      status: (e.status?.toLowerCase() || 'inactive'),
      relatedProjectId: e.relatedProjectId ? projectMap[e.relatedProjectId] : null,
      bannerPic: e.bannerPic,
      categories: e.categories,
      types: e.types,
      newsLink: e.newsLink,
      rating: e.rating,
      date: e.date ? new Date(e.date) : new Date(0),
      description: markdownToHtml(e.description),
    }))
  );

  console.log('Seed completed');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
