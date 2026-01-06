import type { TECH_TAG } from "./types";

export type Project = {
  title: string;
  subTitle: string;
  tags: TECH_TAG[];
  deprecated_tags?: TECH_TAG[];
  description: string;
  link: string;
  code: string;
  codeLocked?: boolean;
  inProgress?: boolean;
  offline?: boolean;
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
    title: "Pantie Packer",
    subTitle: "Travel with Confidence",
    tags: [
      "Vite",
      "Cloudflare",
      "React",
      "TypeScript",
      "TailwindCSS",
      "Shadcn/UI",
      "Railway",
      "TanStack Router",
      "TanStack Form",
      "Zod",
    ],
    deprecated_tags: ["Remix", "React Hook Form"],
    description: "The essential travel app for packing enough underwear.",
    link: "https://www.pantiepacker.com",
    code: "https://github.com/Gwardinski/pantie-packer",
  },
  {
    title: "Pixel Board",
    subTitle: "Collaborative Pixel Art",
    tags: [
      "NextJS",
      "Cloudflare",
      "DrizzleORM",
      "React",
      "TypeScript",
      "TailwindCSS",
      "Shadcn/UI",
      "Railway",
      "WebSocket",
      "TanStack Query",
      "Zustand",
    ],
    deprecated_tags: ["Remix", "Supabase"],
    description:
      "WIP. Bootstrapped with Remix + Supabase, then moved to using websockets via NextJS",
    link: "https://pixelboard-production-4cea.up.railway.app/",
    code: "https://github.com/Gwardinski/pixelboard",
  },
  {
    title: "BitzOfCoinz - Frontend",
    subTitle: "Buy High. Sell Low.",
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
    offline: true,
  },
  {
    title: "BitzOfCoinz - Backend",
    subTitle: "REST API for BitzOfCoinz",
    tags: [
      "NodeJS",
      "Express",
      "PostgreSQL",
      "TypeScript",
      "DrizzleORM",
      "Zod",
      "Coinbase API",
      "Railway",
    ],
    description:
      "A NodeJS backend for the BitzOfCoinz Dashboard. Express REST API and Cron job for tracking prices",
    link: "/projects/project-2",
    code: "https://github.com/Gwardinski/bitzofcoinz_node",
    codeLocked: true,
    offline: true,
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
