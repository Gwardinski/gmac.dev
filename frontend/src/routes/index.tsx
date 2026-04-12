import { DocumentationLink, GithubLink } from '@/components/DocText';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  ButtonAnchor,
  ButtonLink,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  H1,
  H1Description,
  H2,
  H2Description,
  P1,
  PL
} from '@/components/gmac.ui';
import { Page } from '@/components/layout';
import { useVariantState } from '@/components/VariantToggle';
import { PLAYGROUNDS, type Playground } from '@/data/playgrounds';
import { PROJECTS, type Project } from '@/data/projects';
import { TECH_TAGS, type TECH_TAG } from '@/data/types';
import {
  IconApi,
  IconBrandCloudflare,
  IconBrandGithub,
  IconBrandReact,
  IconBrandTailwind,
  IconBrandVite,
  IconBurger,
  IconCrane,
  IconExternalLink,
  IconGhost,
  IconLego,
  IconLock,
  IconPalette,
  IconPlugConnected,
  IconTrain
} from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: App
});

function App() {
  const { variant } = useVariantState();
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
      <Card as="header" variant={variant}>
        <CardHeader column>
          <H1>gmac.dev</H1>
          <H1Description className="font-mono">Portfolio | Playground | Scratch Pad</H1Description>
          <P1 className="font-mono">Gordon Macintyre | Developer | Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿</P1>
        </CardHeader>

        <CardBody>
          <Accordion>
            <AccordionItem value="description">
              <AccordionTrigger>Site TechStack</AccordionTrigger>
              <AccordionContent className="flex flex-col py-2">
                <GithubLink href="https://github.com/Gwardinski/gmac.dev" text="Source Code" />
                <div className="grid grid-cols-1 gap-2 pt-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <P1 className="font-mono">Frontend:</P1>
                    <DocumentationLink href="https://vitejs.dev/" text="Vite / React" icon={IconBrandVite} />
                    <DocumentationLink href="https://tanstack.com/router" text="Tanstack Router" icon={IconBrandReact} />
                    <DocumentationLink href="https://tailwindcss.com" text="Tailwind" icon={IconBrandTailwind} />
                    <DocumentationLink href="https://ui.shadcn.com/" text="shadcn/ui" icon={IconPalette} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <P1 className="font-mono">Backend:</P1>
                    <DocumentationLink href="https://bun.sh/" text="Bun" icon={IconBurger} />
                    <DocumentationLink href="https://elysiajs.com/" text="Elysia" icon={IconApi} />
                    <DocumentationLink href="https://elysiajs.com/patterns/websocket.html#websocket" text="WebSocket" icon={IconPlugConnected} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <P1 className="font-mono">Infra:</P1>
                    <DocumentationLink href="https://railway.app/" text="Railway" icon={IconTrain} />
                    <DocumentationLink href="https://www.cloudflare.com/en-gb/" text="Cloudflare" icon={IconBrandCloudflare} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardBody>
      </Card>

      <Card variant={variant} theme="gray">
        <CardHeader>
          <H2>Buzzwords</H2>
        </CardHeader>
        <CardBody>
          <ul className="flex flex-wrap gap-2">
            {TECH_TAG_SORTED.map((tag) => (
              <li key={tag}>
                <Button key={tag} variant={selectedTags.includes(tag) ? 'solid' : variant === 'glass' ? 'glass' : 'outline'} onClick={() => handleTagClick(tag)}>
                  {tag}
                </Button>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <section className="flex w-full flex-col gap-4">
        <Card as="header" variant={variant} theme="gray">
          <CardHeader column>
            <H2>Projects</H2>
            <H2Description>A collection of projects I've worked on.</H2Description>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} project={project} selectedTags={selectedTags} onClick={() => setIsDialogOpen(true)} onTagClick={handleTagClick} />
          ))}
        </div>
      </section>

      <section className="flex w-full flex-col gap-4">
        <Card as="header" variant={variant} theme="gray">
          <CardHeader column>
            <H2>Playgrounds</H2>
            <H2Description>Various bits & bobs I've been playing with.</H2Description>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {PLAYGROUNDS.map((playground) => (
            <PlaygroundCard key={playground.title} playground={playground} onClick={() => setIsDialogOpen(true)} selectedTags={selectedTags} onTagClick={handleTagClick} />
          ))}
        </div>
      </section>

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
  const { variant } = useVariantState();
  const locked = project.inProgress || project.offline;
  return (
    <Card key={project.title} variant={variant} className={`relative ${locked ? 'group/project-card' : ''}`} style={{ '--card-opacity': '1' } as React.CSSProperties}>
      {project.inProgress && (
        <div className="invisible absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg opacity-0 backdrop-blur-2xl backdrop-opacity-100 transition-all duration-300 group-hover/project-card:visible group-hover/project-card:opacity-100">
          <PL>Work in Progress</PL>
          <IconCrane className="size-12" />
        </div>
      )}
      {project.offline && (
        <div className="invisible absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg opacity-0 backdrop-blur-2xl backdrop-opacity-100 transition-all duration-300 group-hover/project-card:visible group-hover/project-card:opacity-100">
          <PL>Currently Offline</PL>
          <IconGhost className="size-12" />
        </div>
      )}
      <CardHeader className={`transition-opacity duration-300 ${locked ? 'group-hover/project-card:opacity-0' : ''}`}>
        <CardTitle className="pr-8">{project.title}</CardTitle>
        <CardDescription>{project.subTitle}</CardDescription>
      </CardHeader>
      <CardBody className={`transition-opacity duration-300 ${locked ? 'group-hover/project-card:opacity-0' : ''}`}>
        <P1>{project.description}</P1>
        <span className="flex flex-wrap gap-2">
          {project.tags
            ?.sort((a, b) => a.localeCompare(b))
            .map((tag) => (
              <Badge key={tag} variant={selectedTags.includes(tag) ? 'solid' : 'outline'} onClick={() => onTagClick(tag)}>
                {tag}
              </Badge>
            ))}
          {project.deprecated_tags
            ?.sort((a, b) => a.localeCompare(b))
            .map((tag) => (
              <Badge key={tag} variant={selectedTags.includes(tag) ? 'solid' : 'outline'} theme="red" onClick={() => onTagClick(tag)}>
                <s>{tag}</s>
              </Badge>
            ))}
        </span>
      </CardBody>
      <CardFooter className={`transition-opacity duration-300 ${locked ? 'group-hover/project-card:opacity-0' : ''}`}>
        {project.codeLocked ? (
          <Button onClick={onClick} variant="ghost" className={`${locked ? 'pointer-events-none group-hover/project-card:pointer-events-none' : ''}`}>
            <IconLock />
            Code
          </Button>
        ) : (
          <ButtonAnchor variant="ghost" href={project.code} target="_blank" className={`${locked ? 'pointer-events-none group-hover/project-card:pointer-events-none' : ''}`}>
            <IconBrandGithub />
            Code
          </ButtonAnchor>
        )}
        {project.link.includes('http') && (
          <ButtonAnchor variant="outline" href={project.link} target="_blank" className={`${locked ? 'pointer-events-none group-hover/project-card:pointer-events-none' : ''}`}>
            <IconExternalLink />
            View
          </ButtonAnchor>
        )}
        {!project.link.includes('http') && (
          <ButtonLink variant="outline" href={project.link} className={`${locked ? 'pointer-events-none group-hover/project-card:pointer-events-none' : ''}`}>
            <IconExternalLink />
            View
          </ButtonLink>
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
  const { variant } = useVariantState();
  return (
    <Card variant={variant}>
      <CardHeader>
        <CardTitle>{playground.title}</CardTitle>
        <CardDescription>{playground.subTitle}</CardDescription>
      </CardHeader>
      <CardBody className={`flex flex-wrap gap-2 transition-opacity duration-300`}>
        <p>{playground.description}</p>
        <span className="flex flex-wrap gap-2">
          {playground.tags
            ?.sort((a, b) => a.localeCompare(b))
            .map((tag) => (
              <Badge key={tag} variant={selectedTags.includes(tag) ? 'solid' : 'outline'} onClick={() => onTagClick(tag)}>
                {tag}
              </Badge>
            ))}
          {playground.deprecated_tags
            ?.sort((a, b) => a.localeCompare(b))
            .map((tag) => (
              <Badge key={tag} variant={selectedTags.includes(tag) ? 'solid' : 'outline'} theme="red" onClick={() => onTagClick(tag)}>
                <s>{tag}</s>
              </Badge>
            ))}
        </span>
      </CardBody>
      <CardFooter>
        <Button variant="ghost">
          <IconBrandGithub />
          Code
        </Button>
        <ButtonLink to={playground.link} variant="outline">
          <IconLego />
          View
        </ButtonLink>
      </CardFooter>
    </Card>
  );
};

const TECH_TAG_SORTED = [...TECH_TAGS].sort((a, b) => a.localeCompare(b));
