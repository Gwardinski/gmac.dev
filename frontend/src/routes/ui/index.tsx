import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertActions,
  AlertDescription,
  AlertHeader,
  AlertTitle,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  H1,
  H1Description,
  H2,
  H2Description,
  H3,
  H4,
  Kbd,
  KbdGroup,
  Notification,
  P1,
  P2,
  P3,
  PS,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  tabsVariantOptions,
  TextButton,
  textVariants
} from '@/components/gmac.ui';
import { alertThemeOptions, alertVariantOptions } from '@/components/gmac.ui/alert';
import { AvatarButton, avatarSizeOptions, avatarThemeOptions, avatarVariantOptions } from '@/components/gmac.ui/avatar';
import { badgeThemeOptions, badgeVariantOptions } from '@/components/gmac.ui/badge';
import { buttonSizeOptions, buttonThemeOptions, buttonVariantOptions } from '@/components/gmac.ui/button';
import { cardThemeOptions, cardVariantOptions } from '@/components/gmac.ui/card';
import { IconButton, iconButtonSizeOptions, iconButtonThemeOptions, iconButtonVariantOptions } from '@/components/gmac.ui/icon-button';
import { DialogMock, SheetMock } from '@/components/gmac.ui/mocks';
import { FormMockExample } from '@/components/gmac.ui/mocks/FormExample';
import { textButtonThemeOptions } from '@/components/gmac.ui/text-button';
import { PL } from '@/components/gmac.ui/typography';
import { Page } from '@/components/layout';
import { useTheme } from '@/components/theme-provider';
import { useVariantState } from '@/components/VariantToggle';
import { IconInfoCircle, IconPlus } from '@tabler/icons-react';
import { createFileRoute } from '@tanstack/react-router';
import { create } from 'zustand';

export const Route = createFileRoute('/ui/')({
  component: UIRoute
});

function UIRoute() {
  const { variant } = useVariantState();

  return (
    <Page>
      <Controls />
      <Card as="header" variant={variant} theme="gray">
        <CardHeader column>
          <H1>gmac.ui (work in progress)</H1>
          <H1Description>Reference page for components: all available variants, themes, and sizes.</H1Description>
        </CardHeader>
      </Card>

      <DemoCard title="Headings">
        <div className="flex flex-col gap-3">
          <H1 as="p">H1 — page title</H1>
          <H2 as="p">H2 — section</H2>
          <H3 as="p">H3 — subsection</H3>
          <H4 as="p">H4 — small heading</H4>
        </div>
      </DemoCard>

      <DemoCard title="Descriptions">
        <H1Description>H1Description — wider tracking for page intros.</H1Description>
        <H2Description>H2Description — section blurbs.</H2Description>
      </DemoCard>

      <DemoCard title="Text">
        <P1>P1 — primary body</P1>
        <P2>P2 — secondary</P2>
        <P3>P3 — small secondary</P3>
        <PS>PS — strong primary</PS>
        <PL>PL — large primary</PL>
      </DemoCard>

      <DemoCard title="textVariants">
        <p className={textVariants({ size: 'sm', weight: 400, theme: 'primary' })}>textVariants sm:400:primary</p>
        <p className={textVariants({ size: 'md', weight: 400, theme: 'primary' })}>textVariants md:400:primary</p>
        <p className={textVariants({ size: 'lg', weight: 400, theme: 'primary' })}>textVariants lg:400:primary</p>
        <p className={textVariants({ size: 'sm', weight: 400, theme: 'secondary' })}>textVariants sm:400:secondary</p>
        <p className={textVariants({ size: 'md', weight: 400, theme: 'secondary' })}>textVariants md:400:secondary</p>
        <p className={textVariants({ size: 'lg', weight: 400, theme: 'secondary' })}>textVariants lg:400:secondary</p>
        <p className={textVariants({ size: 'sm', weight: 400, theme: 'tertiary' })}>textVariants sm:400:tertiary</p>
        <p className={textVariants({ size: 'md', weight: 400, theme: 'tertiary' })}>textVariants md:400:tertiary</p>
        <p className={textVariants({ size: 'lg', weight: 400, theme: 'tertiary' })}>textVariants lg:400:tertiary</p>
      </DemoCard>

      <DemoCard title="Button">
        {buttonVariantOptions.map((variant) => {
          return (
            <div key={variant} className="flex flex-col gap-2">
              <H4>{variant}</H4>
              {buttonSizeOptions.map((size) => (
                <div key={size} className="flex flex-col gap-2">
                  <P3>{size}</P3>
                  <div className="flex flex-wrap items-center gap-2">
                    {buttonThemeOptions.map((theme) => (
                      <Button key={theme} variant={variant} theme={theme} size={size}>
                        {theme}
                      </Button>
                    ))}
                    <Button variant={variant} theme="gray" size={size} type="button" disabled>
                      disabled
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </DemoCard>

      <DemoCard title="TextButton">
        {textButtonThemeOptions.map((theme) => (
          <TextButton key={theme} theme={theme} type="button">
            {theme}
          </TextButton>
        ))}
        <TextButton theme="gray" type="button" disabled>
          disabled
        </TextButton>
      </DemoCard>

      <DemoCard title="IconButton">
        {iconButtonVariantOptions.map((variant) => {
          return (
            <div key={variant} className="flex flex-col gap-2">
              <H4>{variant}</H4>
              {iconButtonSizeOptions.map((size) => (
                <div key={size} className="flex flex-col gap-2">
                  <P3>{size}</P3>
                  <div className="flex flex-wrap items-center gap-2">
                    {iconButtonThemeOptions.map((theme) => (
                      <IconButton key={theme} variant={variant} theme={theme} size={size} type="button" aria-label={theme}>
                        <IconPlus />
                      </IconButton>
                    ))}
                    <IconButton variant={variant} theme="gray" size={size} type="button" disabled aria-label="disabled">
                      <IconPlus />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </DemoCard>

      <DemoCard title="Avatar (AvatarButton / AvatarLink)">
        {avatarVariantOptions.map((variant) => {
          return (
            <div key={variant} className="flex flex-col gap-2">
              <H4>{variant}</H4>
              {avatarSizeOptions.map((size) => (
                <div key={size} className="flex flex-col gap-2">
                  <P3>{size}</P3>
                  <div className="flex flex-wrap items-end gap-2">
                    {avatarThemeOptions.map((theme) => (
                      <AvatarButton key={theme} variant={variant} theme={theme} size={size}>
                        <AvatarFallback>{theme.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </AvatarButton>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </DemoCard>

      <DemoCard title="Badge">
        {badgeVariantOptions.map((variant) => {
          return (
            <div key={variant} className="flex flex-col gap-2">
              <H4>{variant}</H4>
              <div className="flex flex-wrap items-center gap-2">
                {badgeThemeOptions.map((theme) => (
                  <Badge key={theme} variant={variant} theme={theme}>
                    {theme}
                  </Badge>
                ))}
                <Badge variant={variant} theme="gray" className="pointer-events-none opacity-50" aria-disabled>
                  disabled
                </Badge>
              </div>
            </div>
          );
        })}
      </DemoCard>

      <DemoCard title="Card">
        {cardVariantOptions.map((variant) => (
          <div key={variant} className="flex flex-col gap-2">
            <H4>{variant}</H4>
            <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
              {cardThemeOptions.map((theme) => (
                <Card key={theme} variant={variant} theme={theme} className="w-full max-w-sm">
                  <CardHeader>
                    <CardTitle>
                      Card Title - {variant} - {theme}
                    </CardTitle>
                    <CardDescription>Card Description</CardDescription>
                  </CardHeader>
                  <CardBody>Card Body - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</CardBody>
                  <CardFooter>Card Footer - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</CardFooter>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </DemoCard>

      <DemoCard title="Alert">
        {alertVariantOptions.map((variant) => (
          <div key={variant} className="flex flex-col gap-2">
            <H4>{variant}</H4>
            <div className="flex flex-wrap gap-4">
              {alertThemeOptions.map((theme) => (
                <Alert key={theme} variant={variant} theme={theme} onDismiss={theme === 'red' ? () => {} : undefined}>
                  <AlertHeader>
                    <IconInfoCircle />
                    <AlertTitle>
                      {variant} · {theme}
                    </AlertTitle>
                  </AlertHeader>
                  <AlertDescription>
                    Sample description for {variant} / {theme}.
                  </AlertDescription>
                  {theme === 'yellow' && (
                    <AlertActions>
                      <Button size="sm" type="button" theme={theme} variant={variant === 'glass' ? 'outline' : variant === 'primary' ? 'ghost' : 'primary'}>
                        Action
                      </Button>
                    </AlertActions>
                  )}
                </Alert>
              ))}
            </div>
          </div>
        ))}
      </DemoCard>

      {tabsVariantOptions.map((variant) => (
        <DemoCard key={variant} title={variant}>
          <div className="flex flex-wrap items-start gap-6">
            {buttonThemeOptions.map((theme) => (
              <div key={theme} className="flex min-w-32 flex-col gap-1">
                <P3 className="capitalize">{theme}</P3>
                <Tabs defaultValue="one" className="w-full max-w-xs">
                  <TabsList variant={variant} theme={theme}>
                    <TabsTrigger value="one">One</TabsTrigger>
                    <TabsTrigger value="two">Two</TabsTrigger>
                  </TabsList>
                  <TabsContent value="one">First panel ({theme})</TabsContent>
                  <TabsContent value="two">Second panel ({theme})</TabsContent>
                </Tabs>
              </div>
            ))}
          </div>
        </DemoCard>
      ))}

      <DemoCard title="Notification">
        <Notification value={1} />
        <Notification value={42} />
        <Notification value={100} />
      </DemoCard>
      <DemoCard title="KBD">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
        <KbdGroup className="gap-1">
          <Kbd>⌘</Kbd>
          <span>+</span>
          <Kbd>⇧</Kbd>
          <span>+</span>
          <Kbd>P</Kbd>
        </KbdGroup>
      </DemoCard>

      <DemoCard title="Accordion">
        <Accordion className="max-w-xl">
          <AccordionItem value="one">
            <AccordionTrigger>First item</AccordionTrigger>
            <AccordionContent>Content for the first panel.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger>Second item</AccordionTrigger>
            <AccordionContent>Content for the second panel.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </DemoCard>

      <DemoCard title="Dialog">
        <DialogMock />
      </DemoCard>
      <DemoCard title="Sheet">
        <SheetMock />
      </DemoCard>

      <DemoCard title="Form">
        <FormMockExample />
      </DemoCard>
    </Page>
  );
}

function DemoCard({ title, children }: { title: string; children: React.ReactNode }) {
  const { card } = useBackgroundState();
  return (
    <Card variant={card}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}

function Controls() {
  const { theme, setTheme } = useTheme();
  const { variant, setVariant } = useVariantState();
  const { card, setCard } = useBackgroundState();
  return (
    <Card className="fixed right-4 bottom-4 z-30 w-fit max-w-lg">
      <CardBody>
        <P1>Switching "Variant" will not affect cards in this page.</P1>
        <P1>Instead set manually, which allows switching to "Outline" to better see a components "Glass" variant directly on a video background</P1>
        <div className="flex flex-col items-start gap-2">
          Site Theme:
          <span className="flex flex-wrap items-center gap-4">
            <Button variant={theme === 'light' ? 'primary' : 'outline'} onClick={() => setTheme('light')}>
              Light
            </Button>
            <Button variant={theme === 'dark' ? 'primary' : 'outline'} onClick={() => setTheme('dark')}>
              Dark
            </Button>
          </span>
        </div>
        <div className="flex flex-col items-start gap-2">
          Site Variant:
          <span className="flex flex-wrap items-center gap-4">
            <Button variant={variant === 'solid' ? 'primary' : 'outline'} onClick={() => setVariant('solid')}>
              Solid
            </Button>
            <Button variant={variant === 'glass' ? 'primary' : 'outline'} onClick={() => setVariant('glass')}>
              Glass
            </Button>
          </span>
        </div>
        <div className="flex flex-col items-start gap-2">
          Page Cards:
          <span className="flex flex-wrap items-center gap-4">
            <Button variant={card === 'solid' ? 'primary' : 'outline'} onClick={() => setCard('solid')}>
              Solid
            </Button>
            <Button variant={card === 'glass' ? 'primary' : 'outline'} onClick={() => setCard('glass')}>
              Glass
            </Button>
            <Button variant={card === 'outline' ? 'primary' : 'outline'} onClick={() => setCard('outline')}>
              Outline
            </Button>
          </span>
        </div>
      </CardBody>
    </Card>
  );
}

interface BackgroundState {
  card: 'solid' | 'glass' | 'outline';
  setCard: (bg: 'solid' | 'glass' | 'outline') => void;
}

const useBackgroundState = create<BackgroundState>((set) => ({
  card: 'solid',
  setCard: (card: 'solid' | 'glass' | 'outline') => set(() => ({ card }))
}));
