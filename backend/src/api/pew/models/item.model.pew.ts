import z from "zod";
import { generateItemId } from "../util.pew";

const ITEM_SIZE = 16;

// External Game State - Serialised
export const itemSerialisedSchema = z.object({
  itemId: z.string(),
  itemName: z.string(),
  x: z.number(),
  y: z.number(),
});
export type ItemSerialised = z.infer<typeof itemSerialisedSchema>;

// Internal Game State - Class based
export class ItemClass {
  constructor(public x: number, public y: number, public itemName: string) {
    this.x = x;
    this.y = y;
    this.itemName = itemName;
  }
  public itemId: string = generateItemId();

  public toJSON() {
    return {
      itemId: this.itemId,
      itemName: this.itemName,
      x: this.x,
      y: this.y,
    };
  }

  public getBounds() {
    return {
      x: this.x,
      y: this.y,
      size: ITEM_SIZE,
    };
  }
}
