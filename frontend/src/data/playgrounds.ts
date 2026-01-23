import type { TECH_TAG } from './types';

export type Playground = {
  title: string;
  subTitle: string;
  tags: TECH_TAG[];
  description: string;
  link: string;
  code: string;
};

export const PLAYGROUNDS: Playground[] = [
  {
    title: 'Pew',
    subTitle: 'Work-in-Progress.',
    tags: ['React', 'TypeScript', 'TailwindCSS', 'Bun', 'WebSocket', 'Elysia', 'Socket.io'],
    description: 'Work-in-Progress. Fun with web sockets',
    link: '/pew',
    code: ''
  },
  {
    title: 'Maze',
    subTitle: 'Work-in-Progress.',
    tags: ['React', 'TypeScript', 'TailwindCSS', 'Bun', 'WebSocket', 'Elysia', 'Redis'],
    description: 'Work-in-Progress. A simple mouse dexterity game with scoreboard',
    link: '/maze',
    code: ''
  }
  // {
  //   title: "Gallery",
  //   subTitle: "Gallery description",
  //   tags: ["React", "TypeScript", "TailwindCSS"],
  //   description: "Gallery description",
  //   link: "",
  //   code: "",
  // },
  // {
  //   title: "Metronome",
  //   subTitle: "Metronome description",
  //   tags: ["React", "TypeScript", "TailwindCSS"],
  //   description: "Metronome description",
  //   link: "",
  //   code: "",
  // },
  // {
  //   title: "Anagram Solver",
  //   subTitle: "Anagram Solver description",
  //   tags: ["React", "TypeScript", "TailwindCSS"],
  //   description: "Anagram Solver description",
  //   link: "",
  //   code: "",
  // },
];
