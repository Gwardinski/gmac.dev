import z from "zod";
import { generateItemId } from "../util.pew";
import { PhysicalModel } from "./physical.model.pew";

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
export class ItemClass extends PhysicalModel {
  constructor(initialX: number, initialY: number, public itemName: string) {
    super(generateItemId(), initialX, initialY, ITEM_SIZE);
    this.itemName = itemName;
  }

  public toJSON() {
    const { x, y } = this.getPositions();
    return {
      itemId: this.id,
      itemName: this.itemName,
      x: x,
      y: y,
    };
  }
}
