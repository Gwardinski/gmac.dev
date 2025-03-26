import { GithubLink, DocumentationLink } from "@/components/DocText";
import {
  Page,
  PageHeader,
  PageHeaderAccordion,
  PageHeading,
  PageSection,
  PageSectionHeader,
} from "@/components/layout";
import {
  H1,
  H1Description,
  H2,
  H2Description,
} from "@/components/layout/typography";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { IconBrandGithub, IconExternalLink } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const tags = [...new Set(projects.flatMap((project) => project.tags))].sort();

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <H1>gmac.dev</H1>
          <H1Description>Portfolio | Playground | Scratch Pad</H1Description>
          <p>Gordon Macintyre | Software Developer | Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿</p>
        </PageHeading>

        <PageHeaderAccordion>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger>Base TechStack</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6">
                <GithubLink
                  href="https://github.com/Gwardinski/PDP-Remix"
                  text="Source Code"
                />
                <DocumentationLink
                  href="https://vitejs.dev/"
                  text="Framework - Vite"
                />
                <DocumentationLink
                  href="https://tanstack.com/router"
                  text="Framework - Tanstack Router"
                />
                <DocumentationLink
                  href="https://railway.app/"
                  text="Deployment - Railway"
                />
                <DocumentationLink
                  href="https://tailwindcss.com"
                  text="Styling - Tailwind"
                />
                <DocumentationLink
                  href="https://ui.shadcn.com/"
                  text="Components - shadcn/ui"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageHeaderAccordion>
      </PageHeader>

      <PageSection>
        <PageSectionHeader>
          <H2>Projects</H2>
          <H2Description>
            A collection of projects I've worked on.
          </H2Description>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </PageSectionHeader>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 lg:px-16 px-4 lg:gap-4">
          {projects.map((project) => (
            <Card key={project.title}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.subTitle}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {project.tags?.sort().map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </CardContent>
              <CardContent>
                <p>{project.description}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button>
                  <IconExternalLink />
                  View
                </Button>
                <Button>
                  <IconBrandGithub />
                  Code
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </PageSection>

      <PageSection>
        <PageSectionHeader>
          <H2>Playgrounds</H2>
          <H2Description>
            Various bits & bobs I've been playing with.
          </H2Description>
        </PageSectionHeader>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-3 lg:px-16 px-4 lg:gap-4">
          {playgrounds.map((playground) => (
            <Card key={playground.title}>
              <CardHeader>
                <CardTitle>{playground.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{playground.description}</p>
              </CardContent>
              <CardFooter>
                <Button>View</Button>
                <Button>Code</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </PageSection>
    </Page>
  );
}

type TECH_TAGS =
  | "NextJS"
  | "React"
  | "TypeScript"
  | "TailwindCSS"
  | "Shadcn/UI"
  | "NodeJS"
  | "Express"
  | "PostgreSQL"
  | "Hono"
  | "Vite"
  | "TanStack Router"
  | "TanStack Form"
  | "TanStack Table"
  | "TanStack Query"
  | "Zustand";

type Project = {
  title: string;
  subTitle: string;
  tags: TECH_TAGS[];
  description: string;
  link: string;
  code: string;
};

const projects: Project[] = [
  {
    title: "GMAC.DEV",
    subTitle: "Your looking at it.",
    tags: [
      "React",
      "Vite",
      "TanStack Router",
      "TanStack Query",
      "TypeScript",
      "TailwindCSS",
      "Shadcn/UI",
      "Zustand",
    ],
    description: "My portfolio website. Come click around.",
    link: "/projects/project-2",
    code: "/projects/project-2",
  },
  {
    title: "BitzOfCoinz - Dashboard",
    subTitle: "Crypto App: Buy Low, Sell High.",
    tags: [
      "NextJS",
      "React",
      "TypeScript",
      "TailwindCSS",
      "Shadcn/UI",
      "TanStack Query",
    ],
    description:
      "A NextJS App for tracking the price of Bitcoin and automatically buying / selling on price fluctuations",
    link: "/projects/project-1",
    code: "/projects/project-1",
  },
  {
    title: "BitzOfCoinz - API",
    subTitle: "The API for BitzOfCoinz",
    tags: ["NodeJS", "Express", "PostgreSQL", "TypeScript"],
    description:
      "A NodeJS backend for the BitzOfCoinz Dashboard. Express REST API and Cron job for tracking prices",
    link: "/projects/project-2",
    code: "/projects/project-2",
  },
  {
    title: "Auth Starter",
    subTitle: "A starter project for building a REST API",
    tags: ["NodeJS", "Hono", "PostgreSQL", "TypeScript"],
    description:
      "A starter project bootstrapping a REST API. Includes custom built authentication & authorization, and a CRUD API.",
    link: "/projects/project-2",
    code: "/projects/project-2",
  },
  {
    title: "Community Cook",
    subTitle: "A recipe sharing platform",
    tags: [
      "React",
      "Vite",
      "TanStack Router",
      "TanStack Query",
      "TypeScript",
      "TailwindCSS",
      "Shadcn/UI",
      "Zustand",
    ],
    description: "WORK IN PROGRESS",
    link: "/projects/project-2",
    code: "/projects/project-2",
  },
  {
    title: "ArtWeek",
    subTitle: "Work In Progress",
    tags: [
      "React",
      "Vite",
      "TanStack Router",
      "TanStack Query",
      "TypeScript",
      "TailwindCSS",
      "Shadcn/UI",
      "Zustand",
    ],
    description: "WORK IN PROGRESS",
    link: "/projects/project-2",
    code: "/projects/project-2",
  },
];

const playgrounds = [
  {
    title: "Maze",
    description: "Maze description",
  },
  {
    title: "Gallery",
    description: "Gallery description",
  },
  {
    title: "Metronome",
    description: "Metronome description",
  },
  {
    title: "Anagram Solver",
    description: "Anagram Solver description",
  },
];
