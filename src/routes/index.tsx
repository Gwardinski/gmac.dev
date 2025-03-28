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
  PL,
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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PLAYGROUNDS, type Playground } from "@/data/playgrounds";
import { PROJECTS, type Project } from "@/data/projects";
import { TECH_TAGS, type TECH_TAG } from "@/data/types";
import {
  IconBrandGithub,
  IconCrane,
  IconExternalLink,
  IconLego,
  IconLock,
} from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<TECH_TAG[]>([]);

  function handleTagClick(tag: TECH_TAG) {
    if (selectedTags.includes(tag)) {
      return setSelectedTags((prev) => prev.filter((t) => t !== tag));
    }
    setSelectedTags((prev) => [...prev, tag]);
  }

  return (
    <Page>
      <PageHeader>
        <PageHeading>
          <H1>gmac.dev</H1>
          <H1Description>Portfolio | Playground | Scratch Pad</H1Description>
          <p>Gordon Macintyre | Developer | Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿</p>
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
          <H2>Buzzwords</H2>
          <div className="mt-2 flex flex-wrap gap-2">
            {TECH_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                onClick={() => handleTagClick(tag)}
                className="cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </PageSectionHeader>
      </PageSection>

      <PageSection>
        <PageSectionHeader>
          <H2>Projects</H2>
          <H2Description>
            A collection of projects I've worked on.
          </H2Description>
        </PageSectionHeader>

        <div className="grid grid-cols-1 gap-2 px-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4 lg:px-16">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              selectedTags={selectedTags}
              onClick={() => setIsDialogOpen(true)}
              onTagClick={handleTagClick}
            />
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

        <div className="grid grid-cols-2 gap-2 px-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4 lg:px-16">
          {PLAYGROUNDS.map((playground) => (
            <PlaygroundCard
              key={playground.title}
              playground={playground}
              onClick={() => setIsDialogOpen(true)}
              selectedTags={selectedTags}
              onTagClick={handleTagClick}
            />
          ))}
        </div>
      </PageSection>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-0">
          <img
            src="/src/assets/word.gif"
            className="h-full w-full object-contain"
          />
        </DialogContent>
      </Dialog>
    </Page>
  );
}

const ProjectCard: React.FC<{
  project: Project;
  selectedTags: string[];
  onClick: () => void;
  onTagClick: (tag: TECH_TAG) => void;
}> = ({ project, selectedTags, onClick, onTagClick }) => {
  return (
    <Card
      key={project.title}
      className={`relative glass dark:dark-glass ${project.inProgress ? "group" : ""}`}
      style={{ "--card-opacity": "1" } as React.CSSProperties}
    >
      {project.inProgress && (
        <div className="invisible absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg opacity-0 backdrop-blur-2xl backdrop-opacity-100 transition-all duration-300 group-hover:visible group-hover:opacity-100">
          <PL>Work in Progress</PL>
          <IconCrane className="size-12" />
        </div>
      )}
      <CardHeader
        className={`transition-opacity duration-300 ${project.inProgress ? "group-hover:opacity-0" : ""}`}
      >
        <CardTitle>{project.title}</CardTitle>
        {project.inProgress && (
          <IconCrane className="absolute top-4 right-4 ml-auto" />
        )}
        <CardDescription>{project.subTitle}</CardDescription>
      </CardHeader>
      <CardContent
        className={`flex flex-wrap gap-2 transition-opacity duration-300 ${project.inProgress ? "group-hover:opacity-0" : ""}`}
      >
        {project.tags?.sort().map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            onClick={() => onTagClick(tag)}
            className="cursor-pointer"
          >
            {tag}
          </Badge>
        ))}
      </CardContent>
      <CardContent
        className={`transition-opacity duration-300 ${project.inProgress ? "group-hover:opacity-0" : ""}`}
      >
        <p>{project.description}</p>
      </CardContent>
      <CardFooter
        className={`mt-auto transition-opacity duration-300 ${project.inProgress ? "group-hover:opacity-0" : ""}`}
      >
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 ${project.inProgress ? "pointer-events-none group-hover:pointer-events-none" : ""}`}
        >
          <Button variant="outline" className="w-full">
            <IconExternalLink />
            View
          </Button>
        </a>
        {project.codeLocked ? (
          <Button
            variant="outline"
            onClick={onClick}
            className={`flex-1 ${project.inProgress ? "pointer-events-none group-hover:pointer-events-none" : ""}`}
          >
            <IconLock />
            Code
          </Button>
        ) : (
          <a
            href={project.code}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 ${project.inProgress ? "pointer-events-none group-hover:pointer-events-none" : ""}`}
          >
            <Button variant="outline" className="w-full">
              <IconBrandGithub />
              Code
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

const PlaygroundCard: React.FC<{
  playground: Playground;
  onClick: () => void;
  selectedTags: string[];
  onTagClick: (tag: TECH_TAG) => void;
}> = ({ playground, selectedTags, onTagClick }) => {
  return (
    <Card className="glass dark:dark-glass">
      <CardHeader>
        <CardTitle>{playground.title}</CardTitle>
        <CardDescription>{playground.subTitle}</CardDescription>
      </CardHeader>
      <CardContent
        className={`flex flex-wrap gap-2 transition-opacity duration-300`}
      >
        {playground.tags?.sort().map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            onClick={() => onTagClick(tag)}
            className="cursor-pointer"
          >
            {tag}
          </Badge>
        ))}
      </CardContent>
      <CardContent>
        <p>{playground.description}</p>
      </CardContent>
      <CardFooter>
        <Link to={playground.link} className="flex-1">
          <Button variant="outline" className="w-full">
            <IconLego />
            View
          </Button>
        </Link>
        <Button variant="outline" className="flex-1">
          <IconBrandGithub />
          Code
        </Button>
      </CardFooter>
    </Card>
  );
};
