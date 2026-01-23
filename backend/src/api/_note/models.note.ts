import z from "zod";

export const noteSchema = z.object({
  code: z.string(),
});
export type NoteRequest = z.infer<typeof noteSchema>;

export type NoteResponse = {
  title: string;
  content: string;
};
