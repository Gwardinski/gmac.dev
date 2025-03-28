import type { TECH_TAG } from "./types";

export type Project = {
  title: string;
  subTitle: string;
  tags: TECH_TAG[];
  description: string;
  link: string;
  code: string;
  codeLocked?: boolean;
  inProgress?: boolean;
};

export const PROJECTS: Project[] = [
  {
    title: "gmac.dev",
    subTitle: "You're looking at it.",
    tags: [
      "React",
      "Vite",
      "TanStack Router",
      "TanStack Query",
      "TypeScript",
      "Railway",
      "Cloudflare",
      "TailwindCSS",
      "Shadcn/UI",
      "Zustand",
    ],
    description: "My portfolio website. Come click around.",
    link: "https://gmac.dev",
    code: "https://github.com/Gwardinski/gmac.dev",
  },
  {
    title: "BitzOfCoinz - Dashboard",
    subTitle: "Crypto App: Buy Low, Sell High.",
    tags: [
      "NextJS",
      "React",
      "Railway",
      "TypeScript",
      "TailwindCSS",
      "Shadcn/UI",
      "TanStack Query",
      "Zod",
    ],
    description:
      "A NextJS App for tracking the price of Bitcoin and automatically buying / selling on price fluctuations",
    link: "https://bitzofcoinznext-production.up.railway.app/wave-rider",
    code: "https://github.com/Gwardinski/bitzofcoinz_next",
    codeLocked: true,
  },
  {
    title: "BitzOfCoinz - API",
    subTitle: "The API for BitzOfCoinz",
    tags: [
      "NodeJS",
      "Express",
      "PostgreSQL",
      "TypeScript",
      "DrizzleORM",
      "Zod",
      "Railway",
    ],
    description:
      "A NodeJS backend for the BitzOfCoinz Dashboard. Express REST API and Cron job for tracking prices",
    link: "/projects/project-2",
    code: "https://github.com/Gwardinski/bitzofcoinz_node",
    codeLocked: true,
  },
  {
    title: "Pixel Board",
    subTitle: "Collaborative Pixel Art",
    tags: [
      "Remix",
      "Supabase",
      "TypeScript",
      "TailwindCSS",
      "Shadcn/UI",
      "Railway",
    ],
    description:
      "Bootstrapped this with Supabase. At some point I'll migrate it to self hosted using web sockets.",
    link: "https://pixelboard-production.up.railway.app/",
    code: "https://github.com/Gwardinski/pixelboard",
  },
  {
    title: "Pantie Packer",
    subTitle: "The Essential Travel App",
    tags: ["Remix", "TypeScript", "TailwindCSS", "Shadcn/UI", "Railway"],
    description: "A travel app that helps you pack enough underwear.",
    link: "https://pantie-packer-production.up.railway.app",
    code: "https://github.com/Gwardinski/pantie-packer",
  },
  {
    title: "Auth Starter",
    subTitle: "A starter project for building a REST API",
    tags: [
      "NodeJS",
      "Hono",
      "PostgreSQL",
      "TypeScript",
      "DrizzleORM",
      "Zod",
      "OpenAPI",
    ],
    description:
      "A starter project bootstrapping a REST API. Includes custom built Authentication & Authorization, rather than using an Auth library (Clerk, AuthJS etc).",
    link: "/projects/project-2",
    code: "/projects/project-2",
    inProgress: true,
  },
];
