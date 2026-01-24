import { DocumentationLink, GithubLink } from '@/components/DocText';
import { Page, PageBanner, PageBannerHeader, PageHeader, PageHeaderAccordion, PageHeading, PageSection, PageSectionHeader } from '@/components/layout';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { H1, H1Description, H2, H2Description, P, PL } from '@/components/ui/typography';
import { PLAYGROUNDS, type Playground } from '@/data/playgrounds';
import { PROJECTS, type Project } from '@/data/projects';
import { TECH_TAGS, type TECH_TAG } from '@/data/types';
import {
  IconBrandCloudflare,
  IconBrandGithub,
  IconBrandReact,
  IconBrandTailwind,
  IconBrandVite,
  IconCrane,
  IconExternalLink,
  IconGhost,
  IconLego,
  IconLock,
  IconPalette,
  IconTrain
} from '@tabler/icons-react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: App
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
          <H1Description className="font-mono">Portfolio | Playground | Scratch Pad</H1Description>
          <P className="font-mono">Gordon Macintyre | Developer | Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿</P>
        </PageHeading>

        <PageHeaderAccordion>
          <Accordion type="single" collapsible defaultValue="description">
            <AccordionItem value="description">
              <AccordionTrigger>Site TechStack</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 pb-6">
                <GithubLink href="https://github.com/Gwardinski/gmac.dev" text="Source Code" />
                <DocumentationLink href="https://vitejs.dev/" text="Vite / React" icon={IconBrandVite} />
                <DocumentationLink href="https://tanstack.com/router" text="Tanstack Router" icon={IconBrandReact} />
                <DocumentationLink href="https://railway.app/" text="Railway" icon={IconTrain} />
                <DocumentationLink href="https://www.cloudflare.com/en-gb/" text="Cloudflare" icon={IconBrandCloudflare} />
                <DocumentationLink href="https://tailwindcss.com" text="Tailwind" icon={IconBrandTailwind} />
                <DocumentationLink href="https://ui.shadcn.com/" text="shadcn/ui" icon={IconPalette} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </PageHeaderAccordion>
      </PageHeader>

      <PageBanner>
        <PageBannerHeader>
          <H2>Buzzwords</H2>
        </PageBannerHeader>
        <ul className="flex flex-wrap gap-2">
          {TECH_TAG_SORTED.map((tag) => (
            <li key={tag}>
              <Button key={tag} variant={selectedTags.includes(tag) ? 'default' : 'glass'} onClick={() => handleTagClick(tag)}>
                {tag}
              </Button>
            </li>
          ))}
        </ul>
      </PageBanner>

      <PageSection>
        <PageSectionHeader>
          <H2>Projects</H2>
          <H2Description>A collection of projects I've worked on.</H2Description>
        </PageSectionHeader>

        <div className="grid grid-cols-1 gap-2 px-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4 lg:px-16">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} project={project} selectedTags={selectedTags} onClick={() => setIsDialogOpen(true)} onTagClick={handleTagClick} />
          ))}
        </div>
      </PageSection>

      <PageSection>
        <PageSectionHeader>
          <H2>Playgrounds</H2>
          <H2Description>Various bits & bobs I've been playing with.</H2Description>
        </PageSectionHeader>

        <div className="grid grid-cols-1 gap-2 px-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-4 lg:px-16">
          {PLAYGROUNDS.map((playground) => (
            <PlaygroundCard key={playground.title} playground={playground} onClick={() => setIsDialogOpen(true)} selectedTags={selectedTags} onTagClick={handleTagClick} />
          ))}
        </div>
      </PageSection>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-0">
          <img src="/src/assets/word.gif" className="h-full w-full object-contain" />
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
  const locked = project.inProgress || project.offline;
  return (
    <Card
      key={project.title}
      className={`relative glass dark:dark-glass ${project.inProgress || project.offline ? 'group' : ''}`}
      style={{ '--card-opacity': '1' } as React.CSSProperties}>
      {project.inProgress && (
        <div className="invisible absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg opacity-0 backdrop-blur-2xl backdrop-opacity-100 transition-all duration-300 group-hover:visible group-hover:opacity-100">
          <PL>Work in Progress</PL>
          <IconCrane className="size-12" />
        </div>
      )}
      {project.offline && (
        <div className="invisible absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg opacity-0 backdrop-blur-2xl backdrop-opacity-100 transition-all duration-300 group-hover:visible group-hover:opacity-100">
          <PL>Currently Offline</PL>
          <IconGhost className="size-12" />
        </div>
      )}
      <CardHeader className={`transition-opacity duration-300 ${locked ? 'group-hover:opacity-0' : ''}`}>
        <CardTitle>{project.title}</CardTitle>
        {project.inProgress && <IconCrane className="absolute top-5 right-5 ml-auto size-8" />}
        {project.offline && <IconGhost className="absolute top-5 right-5 ml-auto size-8" />}
        <CardDescription>{project.subTitle}</CardDescription>
      </CardHeader>
      <CardContent className={`flex flex-wrap gap-2 transition-opacity duration-300 ${locked ? 'group-hover:opacity-0' : ''}`}>
        {project.tags
          ?.sort((a, b) => a.localeCompare(b))
          .map((tag) => (
            <Button key={tag} variant={selectedTags.includes(tag) ? 'default' : 'glass'} onClick={() => onTagClick(tag)} size="sm">
              {tag}
            </Button>
          ))}
        {project.deprecated_tags
          ?.sort((a, b) => a.localeCompare(b))
          .map((tag) => (
            <Button key={tag} variant={selectedTags.includes(tag) ? 'default' : 'glass'} onClick={() => onTagClick(tag)} size="sm" disabled>
              <s>{tag}</s>
            </Button>
          ))}
      </CardContent>
      <CardContent className={`mt-auto transition-opacity duration-300 ${locked ? 'group-hover:opacity-0' : ''}`}>
        <P className="italic">{project.description}</P>
      </CardContent>
      <CardFooter className={`mt-auto transition-opacity duration-300 ${locked ? 'group-hover:opacity-0' : ''}`}>
        <a href={project.link} target="_blank" rel="noopener noreferrer" className={`flex-1 ${locked ? 'pointer-events-none group-hover:pointer-events-none' : ''}`}>
          <Button className="w-full">
            <IconExternalLink />
            View
          </Button>
        </a>
        {project.codeLocked ? (
          <Button onClick={onClick} className={`flex-1 ${locked ? 'pointer-events-none group-hover:pointer-events-none' : ''}`}>
            <IconLock />
            Code
          </Button>
        ) : (
          <a href={project.code} target="_blank" rel="noopener noreferrer" className={`flex-1 ${locked ? 'pointer-events-none group-hover:pointer-events-none' : ''}`}>
            <Button className="w-full">
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
    <Card>
      <CardHeader>
        <CardTitle>{playground.title}</CardTitle>
        <CardDescription>{playground.subTitle}</CardDescription>
      </CardHeader>
      <CardContent className={`flex flex-wrap gap-2 transition-opacity duration-300`}>
        {playground.tags
          ?.sort((a, b) => a.localeCompare(b))
          .map((tag) => (
            <Button key={tag} size="sm" variant={selectedTags.includes(tag) ? 'default' : 'glass'} onClick={() => onTagClick(tag)}>
              {tag}
            </Button>
          ))}
      </CardContent>
      <CardContent>
        <p>{playground.description}</p>
      </CardContent>
      <CardFooter>
        <Link to={playground.link} className="flex-1">
          <Button className="w-full">
            <IconLego />
            View
          </Button>
        </Link>
        <Button className="flex-1">
          <IconBrandGithub />
          Code
        </Button>
      </CardFooter>
    </Card>
  );
};

const TECH_TAG_SORTED = [...TECH_TAGS].sort((a, b) => a.localeCompare(b));
